-- AlterTable
ALTER TABLE `dapem` ADD COLUMN `salary` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `DataSimulasi` (
    `int` VARCHAR(191) NOT NULL,
    `nopen` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `birtdate` DATETIME(3) NOT NULL,
    `salary` INTEGER NOT NULL,
    `tenor` INTEGER NOT NULL,
    `plafond` INTEGER NOT NULL,
    `margin_sumdan` INTEGER NOT NULL,
    `margin` INTEGER NOT NULL,
    `c_adm_sumdan` INTEGER NOT NULL,
    `c_adm` INTEGER NOT NULL,
    `c_account` INTEGER NOT NULL,
    `c_provisi` INTEGER NOT NULL,
    `c_insurance` INTEGER NOT NULL,
    `c_flagging` INTEGER NOT NULL,
    `c_gov` INTEGER NOT NULL,
    `c_information` INTEGER NOT NULL,
    `c_mutasi` INTEGER NOT NULL,
    `c_ned` INTEGER NOT NULL,
    `c_fee_banpot` INTEGER NOT NULL,
    `c_blokir` INTEGER NOT NULL,
    `c_takeover` INTEGER NOT NULL,
    `note` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `produkPembiayaanId` VARCHAR(191) NOT NULL,
    `jenisPembiayaanId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`int`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DataSimulasi` ADD CONSTRAINT `DataSimulasi_produkPembiayaanId_fkey` FOREIGN KEY (`produkPembiayaanId`) REFERENCES `ProdukPembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataSimulasi` ADD CONSTRAINT `DataSimulasi_jenisPembiayaanId_fkey` FOREIGN KEY (`jenisPembiayaanId`) REFERENCES `JenisPembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
