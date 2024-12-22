-- DropForeignKey
ALTER TABLE `Serial_numbers` DROP FOREIGN KEY `Serial_numbers_productId_fkey`;

-- AlterTable
ALTER TABLE `Serial_numbers` MODIFY `productId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Serial_numbers` ADD CONSTRAINT `Serial_numbers_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
