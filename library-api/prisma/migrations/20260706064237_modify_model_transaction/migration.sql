/*
  Warnings:

  - Added the required column `transactionId` to the `transaction_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TransactionStatus" ADD VALUE 'OVERDUE';

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_adminId_fkey";

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "borrowed" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "transaction_items" ADD COLUMN     "transactionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "adminId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
