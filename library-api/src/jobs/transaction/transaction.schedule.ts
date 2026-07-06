import cron from 'node-cron';
import { TransactionJob } from './transaction.job';

export class TransactionSchedule {
  static async expiryReservation() {
    cron.schedule('* * * * *', async() => {
      const transactionsExpiry = await TransactionJob.expiryReservation();

      console.log(`Total: ${transactionsExpiry} has expired!`);
    });
  }
}
