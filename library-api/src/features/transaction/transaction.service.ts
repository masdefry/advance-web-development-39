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
    const updateBookBorrowed = items?.map(async (item: any) => {
      const book = await prisma.book.findFirst({
        where: {
          id: item?.bookId,
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
            increment: parseInt(item.quantity),
          },
        },
        where: {
          id: item.bookId,
        },
      });
    });

    const res = await Promise.all([updateBookBorrowed]);
    console.log('???')
    console.log(res)
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
