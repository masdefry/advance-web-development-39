import { Request, Response } from 'express';
import { TransactionService } from './transaction.service';
import { StatusCodes } from 'http-status-codes';

export class TransactionController {
  static async createReservation(req: Request, res: Response) {
    const body = req.body;
    const payload = res.locals.payload;

    const createdTransaction = await TransactionService.createReservation({
      userId: payload.sub,
      reservationDate: body.reservationDate,
      items: body.items,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: `Book reserved successfully`,
      data: createdTransaction,
    });
  }
}
