/*
  Warnings:

  - You are about to alter the column `companyId` on the `Serial_numbers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- DropIndex
DROP INDEX `Warehouse_companyId_fkey` ON `Warehouse`;

-- AlterTable
ALTER TABLE `Serial_numbers` MODIFY `serialNumber` BIGINT NOT NULL,
    MODIFY `companyId` VARCHAR(50) NOT NULL;
