/*
  Warnings:

  - The values [sole] on the enum `Serial_numbers_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Serial_numbers` MODIFY `status` ENUM('sold', 'unsold') NOT NULL DEFAULT 'unsold';
