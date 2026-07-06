import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../configs/prisma-client.config';
import { ResponseError } from '../../utils/response-error.util';

interface TransactionServiceProps {
  userId: string;
  reservationDate: Date;
  items: any[];
}

export class TransactionService {
  static async createReservation({
    reservationDate,
    userId,
    items,
  }: TransactionServiceProps) {
    for (const item of items) {
      const book = await prisma.book.findFirst({
        where: { id: item.bookId },
      });

      if (!book) {
        throw new ResponseError(StatusCodes.NOT_FOUND, 'Book not found');
      }

      const availability = book.stocks - book.borrowed;

      if (item.quantity > availability) {
        throw new ResponseError(
          StatusCodes.NOT_ACCEPTABLE,
          'Book not available',
        );
      }

      await prisma.book.update({
        where: { id: item.bookId },
        data: {
          borrowed: {
            increment: item.quantity,
          },
        },
      });
    }

    const createdTransaction = await prisma.transaction.create({
      data: {
        reservationDate: new Date(reservationDate),
        userId: userId,
        status: 'RESERVED',
      },
    });

    const createdTransactionItems = items.map((item) => ({
      bookId: item?.bookId,
      quantity: parseInt(item?.quantity),
      transactionId: createdTransaction?.id,
    }));

    /*
      [
        {
          bookId, 
          quantity, 
          transactionId: createdTransaction.id
        }
      ]
    */
    await prisma.transactionItem.createMany({
      data: createdTransactionItems,
    });

    return createdTransaction;
  }
}
