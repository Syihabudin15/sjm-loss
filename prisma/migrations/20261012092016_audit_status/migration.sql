-- AlterTable
ALTER TABLE `dapem` ADD COLUMN `audit_date` DATETIME(3) NULL,
    ADD COLUMN `audit_desc` VARCHAR(191) NULL,
    ADD COLUMN `audit_name` VARCHAR(191) NULL,
    ADD COLUMN `audit_status` BOOLEAN NOT NULL DEFAULT false;
