import { Router } from 'express';
import { TransactionController } from './transaction.controller';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { JWT_SECRET_KEY } from '../../configs/env.config';

export const TransactionRoute = Router();

TransactionRoute.post(
  '/reservation',
  AuthMiddleware.authenticated(JWT_SECRET_KEY!),
  TransactionController.createReservation,
);
