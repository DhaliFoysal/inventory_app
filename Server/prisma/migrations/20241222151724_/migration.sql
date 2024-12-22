/*
  Warnings:

  - You are about to drop the column `wareHouseId` on the `Inventories` table. All the data in the column will be lost.
  - You are about to drop the column `wareHouseName` on the `Inventories` table. All the data in the column will be lost.
  - Added the required column `warehouseId` to the `Inventories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseName` to the `Inventories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Inventories` DROP FOREIGN KEY `Inventories_wareHouseId_fkey`;

-- AlterTable
ALTER TABLE `Inventories` DROP COLUMN `wareHouseId`,
    DROP COLUMN `wareHouseName`,
    ADD COLUMN `warehouseId` VARCHAR(191) NOT NULL,
    ADD COLUMN `warehouseName` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Inventories` ADD CONSTRAINT `Inventories_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `Warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
