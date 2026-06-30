import { Router } from 'express';
import { BookController } from './book.controller';
import { MulterMiddleware } from '../../middlewares/multer.middleware';

export const BookRoute = Router();
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const multerUpload = new MulterMiddleware([
  'image/jpeg',
  'image/png',
  'image/webp',
]).upload(MAX_FILE_SIZE);

BookRoute.post(
  '/',
  multerUpload.array('BOOK_IMAGES', 3),
  BookController.create,
);
