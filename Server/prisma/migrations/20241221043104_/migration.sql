/*
  Warnings:

  - You are about to drop the column `productsId` on the `Serial_numbers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Serial_numbers` DROP FOREIGN KEY `Serial_numbers_productsId_fkey`;

-- AlterTable
ALTER TABLE `Serial_numbers` DROP COLUMN `productsId`;

-- AddForeignKey
ALTER TABLE `Serial_numbers` ADD CONSTRAINT `Serial_numbers_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
