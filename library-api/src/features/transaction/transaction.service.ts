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
    const updateBookBorrowed = items?.forEach(async (item: any) => {
      const book = await prisma.book.findFirst({
        where: {
          id: item?.id,
        },
      });

      if (!book)
        throw new ResponseError(StatusCodes.NOT_FOUND, 'Book not found');

      const availability = book?.stocks - book?.borrowed;

      if (item?.quantity > availability)
        throw new ResponseError(
          StatusCodes.NOT_ACCEPTABLE,
          'Book not available',
        );

      await prisma.book.update({
        data: {
          borrowed: {
            increment: item.quantity,
          },
        },
        where: {
          id: item.id,
        },
      });
    });

    await Promise.all([updateBookBorrowed]);

    const createdTransaction = await prisma.transaction.create({
      data: {
        reservationDate: new Date(reservationDate),
        userId: userId,
        status: 'RESERVED',
      },
    });

    const createdTransactionItems = items.map((item) => ({
      bookId: item?.bookId,
      quantity: item?.quantity,
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
