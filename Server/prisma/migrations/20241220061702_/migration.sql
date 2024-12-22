-- DropForeignKey
ALTER TABLE `Warehouse` DROP FOREIGN KEY `Warehouse_companyId_fkey`;

-- DropIndex
DROP INDEX `Measurement_Unit_companyId_fkey` ON `Measurement_Unit`;

-- AddForeignKey
ALTER TABLE `Warehouse` ADD CONSTRAINT `Warehouse_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
