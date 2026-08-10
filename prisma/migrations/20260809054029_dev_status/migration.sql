-- AlterTable
ALTER TABLE `dapem` ADD COLUMN `dPKStatusId` VARCHAR(191) NULL,
    ADD COLUMN `dev_status` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deviasi_note` TEXT NULL,
    ADD COLUMN `note` TEXT NULL;

-- AlterTable
ALTER TABLE `datasimulasi` ADD COLUMN `payOfficeId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `DPKStatus` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_dPKStatusId_fkey` FOREIGN KEY (`dPKStatusId`) REFERENCES `DPKStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataSimulasi` ADD CONSTRAINT `DataSimulasi_payOfficeId_fkey` FOREIGN KEY (`payOfficeId`) REFERENCES `PayOffice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
