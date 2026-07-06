import { Router } from 'express';
import { TransactionController } from './transaction.controller';

export const TransactionRoute = Router();

TransactionRoute.post('/reservation', TransactionController.createReservation);
