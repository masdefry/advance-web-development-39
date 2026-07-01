import { Router } from 'express';
import { BookController } from './book.controller';
import { MulterMiddleware } from '../../middlewares/multer.middleware';
import { AuthMiddleware } from '../../middlewares/auth.middleware';

export const BookRoute = Router();
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const multerUpload = new MulterMiddleware(
  ['image/jpeg', 'image/png', 'image/webp'],
  'memoryStorage',
).upload(MAX_FILE_SIZE);

BookRoute.post(
  '/',
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized(['SUPER_ADMIN', 'ADMIN']),
  multerUpload.array('BOOK_IMAGES', 3),
  BookController.create,
);
