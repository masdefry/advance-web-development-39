import { prisma } from '../../configs/prisma-client.config';

export class TransactionJob {
  static async expiryReservation() {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: 'RESERVED',
        reservationDate: {
          lte: new Date(),
        },
      },
      include: {
        transaction_items: {
          select: {
            bookId: true,
            quantity: true,
          },
        },
      },
    });
    for (const transaction of transactions) {
      await prisma.transaction.update({
        data: {
          status: 'EXPIRY',
        },
        where: {
          id: transaction.id,
        },
      });
      for (const item of transaction.transaction_items) {
        await prisma.book.update({
          data: {
            borrowed: {
              decrement: item.quantity,
            },
          },
          where: {
            id: item.bookId,
          },
        });
      }
    }

    return transactions.length; 
  }
}
