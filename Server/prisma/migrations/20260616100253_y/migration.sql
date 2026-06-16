/*
  Warnings:

  - You are about to alter the column `totalAmount` on the `sales` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `dueAmount` on the `sales` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the `serial_numbers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `paymentSlip` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `serial_numbers` DROP FOREIGN KEY `Serial_numbers_productId_fkey`;

-- AlterTable
ALTER TABLE `payments` ADD COLUMN `paymentSlip` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `sales` MODIFY `totalAmount` DOUBLE NOT NULL,
    MODIFY `dueAmount` DOUBLE NOT NULL;

-- DropTable
DROP TABLE `serial_numbers`;

-- CreateTable
CREATE TABLE `SerialNumbers` (
    `id` VARCHAR(191) NOT NULL,
    `serialNumber` VARCHAR(191) NOT NULL,
    `status` ENUM('sold', 'unsold') NOT NULL DEFAULT 'unsold',
    `companyId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `warehouseId` VARCHAR(191) NOT NULL,
    `salesId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleItems` (
    `id` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `salesId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `SerialId` VARCHAR(191) NULL,
    `quantity` DOUBLE NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL DEFAULT 0,
    `discountPercent` DOUBLE NOT NULL DEFAULT 0,
    `taxPercent` DOUBLE NOT NULL DEFAULT 0,
    `taxAmount` DOUBLE NOT NULL DEFAULT 0,
    `totalPrice` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SerialNumbers` ADD CONSTRAINT `SerialNumbers_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItems` ADD CONSTRAINT `SaleItems_salesId_fkey` FOREIGN KEY (`salesId`) REFERENCES `Sales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItems` ADD CONSTRAINT `SaleItems_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItems` ADD CONSTRAINT `SaleItems_SerialId_fkey` FOREIGN KEY (`SerialId`) REFERENCES `SerialNumbers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
