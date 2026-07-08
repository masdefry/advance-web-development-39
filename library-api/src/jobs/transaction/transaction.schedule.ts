import cron from 'node-cron';
import { TransactionJob } from './transaction.job';
import { logger } from '../../configs/logger.config';

export class TransactionSchedule {
  static async expiryReservation() {
    cron.schedule('* * * * *', async () => {
      const transactionsExpiry = await TransactionJob.expiryReservation();

      logger.info(
        `[⌚CRONN] Total: ${transactionsExpiry} transactions has expiry`,
      );
    });
  }
}
