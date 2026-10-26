-- CreateTable
CREATE TABLE `role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `data_status` ENUM('USER', 'CABANG', 'AREA', 'SEMUA') NOT NULL DEFAULT 'SEMUA',
    `permission` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `role_name_key`(`name`),
    INDEX `role_status_data_status_name_idx`(`status`, `data_status`, `name`),
    INDEX `role_status_name_data_status_idx`(`status`, `name`, `data_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sumdan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `logo` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `tbo` INTEGER NOT NULL DEFAULT 3,
    `limit` BIGINT NOT NULL DEFAULT 0,
    `c_margin` DOUBLE NOT NULL,
    `c_adm_sumdan` DOUBLE NOT NULL,
    `c_account_sumdan` INTEGER NOT NULL,
    `c_provisi_sumdan` DOUBLE NOT NULL DEFAULT 0,
    `c_adm` DOUBLE NOT NULL,
    `c_provisi` DOUBLE NOT NULL DEFAULT 0,
    `c_gov` INTEGER NOT NULL,
    `c_stamps` INTEGER NOT NULL,
    `c_flagging` INTEGER NOT NULL,
    `c_information` INTEGER NOT NULL,
    `c_ned` INTEGER NOT NULL DEFAULT 0,
    `fee_banpot` DOUBLE NOT NULL DEFAULT 0,
    `max_bpp` INTEGER NOT NULL,
    `rounded` INTEGER NOT NULL DEFAULT 1,
    `dsr` DOUBLE NOT NULL,
    `contract_no` VARCHAR(191) NULL,
    `contract_no2` VARCHAR(191) NULL,
    `contract_date` DATETIME(3) NULL,
    `sk_no` VARCHAR(191) NULL,
    `sk_date` DATETIME(3) NULL,
    `pic` VARCHAR(191) NULL,
    `file` TEXT NULL,
    `sk_akad` TEXT NULL,
    `fronting` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `sumdan_status_fronting_code_name_idx`(`status`, `fronting`, `code`, `name`),
    INDEX `sumdan_status_code_name_idx`(`status`, `code`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `area` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `area_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cabang` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `areaId` VARCHAR(191) NOT NULL,

    INDEX `cabang_status_name_idx`(`status`, `name`),
    INDEX `cabang_status_areaId_name_idx`(`status`, `areaId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `target` INTEGER NOT NULL DEFAULT 0,
    `position` VARCHAR(191) NULL,
    `pkwt_status` VARCHAR(191) NULL,
    `start_pkwt` DATETIME(3) NULL,
    `end_pkwt` DATETIME(3) NULL,
    `nik` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `roleId` VARCHAR(191) NOT NULL,
    `cabangId` VARCHAR(191) NOT NULL,
    `sumdanId` VARCHAR(191) NULL,
    `agentFrontingId` VARCHAR(191) NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    INDEX `user_status_fullname_idx`(`status`, `fullname`),
    INDEX `user_status_cabangId_fullname_idx`(`status`, `cabangId`, `fullname`),
    INDEX `user_status_sumdanId_fullname_idx`(`status`, `sumdanId`, `fullname`),
    INDEX `user_status_end_pkwt_idx`(`status`, `end_pkwt`),
    INDEX `user_status_pkwt_status_idx`(`status`, `pkwt_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produkpembiayaan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `c_margin` DOUBLE NOT NULL,
    `c_margin_sumdan` DOUBLE NOT NULL DEFAULT 0,
    `c_insurance` DOUBLE NOT NULL,
    `max_tenor` INTEGER NOT NULL,
    `max_plafond` INTEGER NOT NULL,
    `min_age` INTEGER NOT NULL,
    `max_age` INTEGER NOT NULL,
    `max_paid` INTEGER NOT NULL,
    `margin_type` ENUM('FLAT', 'ANUITAS') NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sumdanId` VARCHAR(191) NOT NULL,

    INDEX `produkpembiayaan_status_name_idx`(`status`, `name`),
    INDEX `produkpembiayaan_status_sumdanId_name_idx`(`status`, `sumdanId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jenispembiayaan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `c_blokir` INTEGER NOT NULL,
    `c_mutasi` INTEGER NOT NULL DEFAULT 0,
    `status_takeover` BOOLEAN NOT NULL DEFAULT false,
    `status_mutasi` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `jenispembiayaan_status_name_idx`(`status`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `debitur` (
    `nopen` VARCHAR(191) NOT NULL,
    `salary` INTEGER NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NULL,
    `birthdate` DATETIME(3) NOT NULL,
    `birthplace` VARCHAR(191) NULL,
    `religion` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `ward` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `pos_code` VARCHAR(191) NULL,
    `npwp` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `education` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `no_skep` VARCHAR(191) NULL,
    `name_skep` VARCHAR(191) NULL,
    `date_skep` DATETIME(3) NULL,
    `tmt_skep` DATETIME(3) NULL,
    `rank_skep` VARCHAR(191) NULL,
    `publisher_skep` VARCHAR(191) NULL,
    `group_skep` VARCHAR(191) NULL,
    `soul_code` INTEGER NULL,
    `job_year` INTEGER NULL,
    `id_publisher` VARCHAR(191) NULL,
    `id_end` DATETIME(3) NULL,
    `number_kk` VARCHAR(191) NULL,
    `mother_name` VARCHAR(191) NULL,
    `account_name` VARCHAR(191) NULL,
    `account_number` VARCHAR(191) NULL,
    `payOfficeId` VARCHAR(191) NULL,

    UNIQUE INDEX `debitur_nopen_key`(`nopen`),
    INDEX `debitur_group_skep_idx`(`group_skep`),
    INDEX `debitur_payOfficeId_idx`(`payOfficeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dapem` (
    `id` VARCHAR(191) NOT NULL,
    `tenor` INTEGER NOT NULL,
    `plafond` INTEGER NOT NULL,
    `salary` INTEGER NOT NULL DEFAULT 0,
    `c_margin_sumdan` DOUBLE NOT NULL,
    `c_account_sumdan` INTEGER NOT NULL,
    `c_adm_sumdan` DOUBLE NOT NULL,
    `c_provisi_sumdan` DOUBLE NOT NULL DEFAULT 0,
    `c_margin` DOUBLE NOT NULL,
    `c_adm` DOUBLE NOT NULL,
    `c_insurance` DOUBLE NOT NULL,
    `c_provisi` DOUBLE NOT NULL,
    `c_gov` INTEGER NOT NULL,
    `c_stamp` INTEGER NOT NULL,
    `c_flagging` INTEGER NOT NULL,
    `c_infomation` INTEGER NOT NULL,
    `c_mutasi` INTEGER NOT NULL,
    `c_blokir` INTEGER NOT NULL,
    `c_fee_bpp` INTEGER NOT NULL DEFAULT 0,
    `c_fee_fronting` DOUBLE NOT NULL DEFAULT 0,
    `c_ned` INTEGER NOT NULL DEFAULT 0,
    `fee_banpot` DOUBLE NOT NULL DEFAULT 0,
    `c_takeover` INTEGER NOT NULL,
    `tbo` INTEGER NOT NULL,
    `rounded` INTEGER NOT NULL,
    `margin_type` ENUM('FLAT', 'ANUITAS') NOT NULL,
    `cost_month` INTEGER NOT NULL DEFAULT 0,
    `max_tenor` INTEGER NOT NULL DEFAULT 120,
    `max_plafond` INTEGER NOT NULL DEFAULT 250000000,
    `takeover_from` VARCHAR(191) NULL,
    `takeover_date` DATETIME(3) NULL,
    `dom_status` BOOLEAN NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `ward` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NULL,
    `pos_code` VARCHAR(191) NULL,
    `geolocation` VARCHAR(191) NULL,
    `house_status` VARCHAR(191) NULL,
    `house_year` VARCHAR(191) NULL,
    `job` VARCHAR(191) NULL,
    `job_address` VARCHAR(191) NULL,
    `business` VARCHAR(191) NULL,
    `marriage_status` ENUM('KAWIN', 'BELUM_KAWIN', 'JANDA', 'DUDA') NOT NULL DEFAULT 'BELUM_KAWIN',
    `aw_name` VARCHAR(191) NULL,
    `aw_nik` VARCHAR(191) NULL,
    `aw_birthdate` DATETIME(3) NULL,
    `aw_birthplace` VARCHAR(191) NULL,
    `aw_job` VARCHAR(191) NULL,
    `aw_address` VARCHAR(191) NULL,
    `aw_relate` VARCHAR(191) NULL,
    `aw_phone` VARCHAR(191) NULL,
    `aw_rt` VARCHAR(191) NULL,
    `aw_rw` VARCHAR(191) NULL,
    `aw_ward` VARCHAR(191) NULL,
    `aw_district` VARCHAR(191) NULL,
    `aw_city` VARCHAR(191) NULL,
    `aw_province` VARCHAR(191) NULL,
    `aw_pos_code` VARCHAR(191) NULL,
    `aw_education` VARCHAR(191) NULL,
    `f_name` VARCHAR(191) NULL,
    `f_relate` VARCHAR(191) NULL,
    `f_phone` VARCHAR(191) NULL,
    `f_address` VARCHAR(191) NULL,
    `f_rt` VARCHAR(191) NULL,
    `f_rw` VARCHAR(191) NULL,
    `f_ward` VARCHAR(191) NULL,
    `f_district` VARCHAR(191) NULL,
    `f_city` VARCHAR(191) NULL,
    `f_province` VARCHAR(191) NULL,
    `f_pos_code` VARCHAR(191) NULL,
    `dropping_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'DRAFT',
    `verif_status` ENUM('PENDING', 'DISETUJUI', 'DITOLAK') NULL,
    `verif_desc` TEXT NULL,
    `slik_status` ENUM('PENDING', 'DISETUJUI', 'DITOLAK') NULL,
    `slik_desc` TEXT NULL,
    `approv_status` ENUM('PENDING', 'DISETUJUI', 'DITOLAK') NULL,
    `approv_desc` TEXT NULL,
    `takeover_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'DRAFT',
    `takeover_desc` TEXT NULL,
    `takeover_date_exc` DATETIME(3) NULL,
    `mutasi_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'DRAFT',
    `mutasi_desc` TEXT NULL,
    `mutasi_date_exc` DATETIME(3) NULL,
    `flagging_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'DRAFT',
    `flagging_desc` TEXT NULL,
    `flagging_date_exc` DATETIME(3) NULL,
    `cash_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'DRAFT',
    `cash_desc` TEXT NULL,
    `document_status` ENUM('UNIT', 'DELIVERY', 'PUSAT', 'MITRA') NOT NULL DEFAULT 'UNIT',
    `document_desc` TEXT NULL,
    `guarantee_status` ENUM('UNIT', 'DELIVERY', 'PUSAT', 'MITRA') NOT NULL DEFAULT 'UNIT',
    `guarantee_desc` TEXT NULL,
    `ao_fee_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'DRAFT',
    `ao_fee_desc` TEXT NULL,
    `dev_status` BOOLEAN NOT NULL DEFAULT false,
    `deviasi_note` TEXT NULL,
    `note` TEXT NULL,
    `audit_status` ENUM('DRAFT', 'BATAL', 'PENDING', 'PROSES', 'DISETUJUI', 'DITOLAK', 'LUNAS') NOT NULL DEFAULT 'PENDING',
    `audit_desc` VARCHAR(191) NULL,
    `audit_name` VARCHAR(191) NULL,
    `audit_date` DATETIME(3) NULL,
    `kc_pay_office` VARCHAR(191) NULL,
    `used_for` VARCHAR(191) NOT NULL,
    `no_contract` VARCHAR(191) NOT NULL,
    `date_contract` DATETIME(3) NULL,
    `date_end` DATETIME(3) NULL,
    `tbo_date` DATETIME(3) NULL,
    `file_slik` VARCHAR(191) NULL,
    `file_proses` VARCHAR(191) NULL,
    `file_submission` VARCHAR(191) NULL,
    `video_interview` VARCHAR(191) NULL,
    `video_insurance` VARCHAR(191) NULL,
    `video_contract` VARCHAR(191) NULL,
    `file_contract` VARCHAR(191) NULL,
    `file_takeover` VARCHAR(191) NULL,
    `file_mutasi` VARCHAR(191) NULL,
    `file_flagging` VARCHAR(191) NULL,
    `file_skep` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `prevPayOfficeId` VARCHAR(191) NULL,
    `nopen` VARCHAR(191) NOT NULL,
    `produkPembiayaanId` VARCHAR(191) NOT NULL,
    `jenisPembiayaanId` VARCHAR(191) NOT NULL,
    `aoId` VARCHAR(191) NULL,
    `aoCabangId` VARCHAR(191) NULL,
    `aoAreaId` VARCHAR(191) NULL,
    `droppingId` VARCHAR(191) NULL,
    `berkasId` VARCHAR(191) NULL,
    `jaminanId` VARCHAR(191) NULL,
    `agentFrontingId` VARCHAR(191) NULL,
    `payOfficeId` VARCHAR(191) NULL,
    `insuranceId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `dPKStatusId` VARCHAR(191) NULL,

    INDEX `dapem_status_dropping_status_idx`(`status`, `dropping_status`),
    INDEX `dapem_status_document_status_idx`(`status`, `document_status`),
    INDEX `dapem_status_guarantee_status_idx`(`status`, `guarantee_status`),
    INDEX `dapem_status_document_status_guarantee_status_idx`(`status`, `document_status`, `guarantee_status`),
    INDEX `dapem_status_slik_status_idx`(`status`, `slik_status`),
    INDEX `dapem_status_verif_status_idx`(`status`, `verif_status`),
    INDEX `dapem_status_approv_status_idx`(`status`, `approv_status`),
    INDEX `dapem_status_created_at_idx`(`status`, `created_at`),
    INDEX `dapem_status_date_contract_idx`(`status`, `date_contract`),
    INDEX `dapem_status_takeover_status_idx`(`status`, `takeover_status`),
    INDEX `dapem_status_mutasi_status_idx`(`status`, `mutasi_status`),
    INDEX `dapem_status_flagging_status_idx`(`status`, `flagging_status`),
    INDEX `dapem_status_cash_status_idx`(`status`, `cash_status`),
    INDEX `dapem_status_payOfficeId_idx`(`status`, `payOfficeId`),
    INDEX `dapem_status_prevPayOfficeId_idx`(`status`, `prevPayOfficeId`),
    INDEX `dapem_status_agentFrontingId_idx`(`status`, `agentFrontingId`),
    INDEX `dapem_status_userId_idx`(`status`, `userId`),
    INDEX `dapem_status_aoId_idx`(`status`, `aoId`),
    INDEX `dapem_status_aoCabangId_idx`(`status`, `aoCabangId`),
    INDEX `dapem_status_aoAreaId_idx`(`status`, `aoAreaId`),
    INDEX `dapem_status_jenisPembiayaanId_idx`(`status`, `jenisPembiayaanId`),
    INDEX `dapem_status_takeover_status_mutasi_status_flagging_status_idx`(`status`, `takeover_status`, `mutasi_status`, `flagging_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aianalysis` (
    `id` VARCHAR(191) NOT NULL,
    `submission_data` TEXT NOT NULL,
    `slik_data` TEXT NOT NULL,
    `verif_summary` TEXT NOT NULL,
    `slik_summary` TEXT NOT NULL,
    `interview_summary` TEXT NOT NULL,
    `insurance_summary` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `dapemId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payoffice` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `no_contract` VARCHAR(191) NULL,
    `date_contract` DATETIME(3) NULL,
    `file` TEXT NULL,
    `pic` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,
    `mitra` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `payoffice_status_name_code_idx`(`status`, `name`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `insurance` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `no_contract` VARCHAR(191) NULL,
    `date_contract` DATETIME(3) NULL,
    `file` TEXT NULL,
    `pic` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `insurance_status_name_code_idx`(`status`, `name`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dropping` (
    `id` VARCHAR(191) NOT NULL,
    `file_sub` VARCHAR(191) NULL,
    `file_proof` TEXT NULL,
    `status` BOOLEAN NOT NULL,
    `process_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `sumdanId` VARCHAR(191) NOT NULL,

    INDEX `dropping_status_process_at_idx`(`status`, `process_at`),
    INDEX `dropping_status_created_at_idx`(`status`, `created_at`),
    INDEX `dropping_status_sumdanId_process_at_idx`(`status`, `sumdanId`, `process_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `berkas` (
    `id` VARCHAR(191) NOT NULL,
    `file_sub` VARCHAR(191) NULL,
    `file_proof` VARCHAR(191) NULL,
    `status` ENUM('UNIT', 'DELIVERY', 'PUSAT', 'MITRA') NOT NULL,
    `process_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `sumdanId` VARCHAR(191) NOT NULL,

    INDEX `berkas_status_process_at_idx`(`status`, `process_at`),
    INDEX `berkas_status_created_at_idx`(`status`, `created_at`),
    INDEX `berkas_status_sumdanId_process_at_idx`(`status`, `sumdanId`, `process_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jaminan` (
    `id` VARCHAR(191) NOT NULL,
    `file_sub` VARCHAR(191) NULL,
    `file_proof` VARCHAR(191) NULL,
    `status` ENUM('UNIT', 'DELIVERY', 'PUSAT', 'MITRA') NOT NULL,
    `process_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `sumdanId` VARCHAR(191) NOT NULL,

    INDEX `jaminan_status_process_at_idx`(`status`, `process_at`),
    INDEX `jaminan_status_created_at_idx`(`status`, `created_at`),
    INDEX `jaminan_status_sumdanId_process_at_idx`(`status`, `sumdanId`, `process_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pelunasan` (
    `id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `amount_sumdan` INTEGER NOT NULL,
    `desc_sumdan` TEXT NULL,
    `penalty` INTEGER NOT NULL,
    `desc` TEXT NULL,
    `file_sub` VARCHAR(191) NULL,
    `guarantee_status` ENUM('UNIT', 'DELIVERY', 'PUSAT', 'MITRA') NOT NULL DEFAULT 'MITRA',
    `type` ENUM('MENINGGAL', 'TOPUP', 'LEPAS', 'JATUHTEMPO') NOT NULL,
    `status_paid` ENUM('PENDING', 'DISETUJUI', 'DITOLAK') NOT NULL DEFAULT 'PENDING',
    `process_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `dapemId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `pelunasan_dapemId_key`(`dapemId`),
    INDEX `pelunasan_type_idx`(`type`),
    INDEX `pelunasan_guarantee_status_idx`(`guarantee_status`),
    INDEX `pelunasan_status_paid_idx`(`status_paid`),
    INDEX `pelunasan_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `angsuran` (
    `id` VARCHAR(191) NOT NULL,
    `counter` INTEGER NOT NULL,
    `principal` INTEGER NOT NULL,
    `margin` INTEGER NOT NULL,
    `date_pay` DATETIME(3) NOT NULL,
    `date_paid` DATETIME(3) NULL,
    `remaining` INTEGER NOT NULL,
    `inst_sumdan` INTEGER NOT NULL DEFAULT 0,
    `fee_banpot` INTEGER NOT NULL DEFAULT 0,
    `c_ned` INTEGER NOT NULL DEFAULT 0,
    `dapemId` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,

    INDEX `angsuran_date_pay_idx`(`date_pay`),
    INDEX `angsuran_dapemId_date_paid_idx`(`dapemId`, `date_paid`),
    INDEX `angsuran_date_paid_dapemId_idx`(`date_paid`, `dapemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoryofaccount` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('ASSET', 'KEWAJIBAN', 'MODAL', 'PENDAPATAN', 'BEBAN') NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `parentId` VARCHAR(191) NULL,

    INDEX `categoryofaccount_type_name_idx`(`type`, `name`),
    INDEX `categoryofaccount_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journalentry` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,

    INDEX `journalentry_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journaldetail` (
    `id` VARCHAR(191) NOT NULL,
    `debit` INTEGER NOT NULL DEFAULT 0,
    `credit` INTEGER NOT NULL DEFAULT 0,
    `desciption` VARCHAR(191) NULL,
    `journalEntryId` VARCHAR(191) NOT NULL,
    `categoryOfAccountId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,

    INDEX `journaldetail_categoryOfAccountId_idx`(`categoryOfAccountId`),
    INDEX `journaldetail_journalEntryId_idx`(`journalEntryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agentfronting` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `file` TEXT NULL,
    `contract_no` VARCHAR(191) NULL,
    `contract_date` DATETIME(3) NULL,
    `pic` VARCHAR(191) NULL,
    `target` INTEGER NOT NULL DEFAULT 0,
    `c_fee` DOUBLE NOT NULL DEFAULT 0,
    `c_gov` DOUBLE NOT NULL DEFAULT 0,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `agentfronting_status_name_code_idx`(`status`, `name`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sumdanagentfronting` (
    `id` VARCHAR(191) NOT NULL,
    `sumdanId` VARCHAR(191) NOT NULL,
    `agentFrontingId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `datasimulasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nopen` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `birtdate` DATETIME(3) NOT NULL,
    `salary` INTEGER NOT NULL,
    `tenor` INTEGER NOT NULL,
    `plafond` INTEGER NOT NULL,
    `c_margin_sumdan` INTEGER NOT NULL,
    `c_margin` INTEGER NOT NULL,
    `c_adm_sumdan` INTEGER NOT NULL,
    `c_adm` INTEGER NOT NULL,
    `c_account` INTEGER NOT NULL,
    `c_provisi` INTEGER NOT NULL,
    `c_provisi_sumdan` INTEGER NOT NULL,
    `c_insurance` INTEGER NOT NULL,
    `c_flagging` INTEGER NOT NULL,
    `c_stamp` INTEGER NOT NULL,
    `c_gov` INTEGER NOT NULL,
    `c_information` INTEGER NOT NULL,
    `c_mutasi` INTEGER NOT NULL,
    `c_ned` INTEGER NOT NULL,
    `c_fee_banpot` INTEGER NOT NULL,
    `c_blokir` INTEGER NOT NULL,
    `c_takeover` INTEGER NOT NULL,
    `margin_type` ENUM('FLAT', 'ANUITAS') NOT NULL DEFAULT 'ANUITAS',
    `note` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `produkPembiayaanId` VARCHAR(191) NOT NULL,
    `jenisPembiayaanId` VARCHAR(191) NOT NULL,
    `payOfficeId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dpkstatus` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cabang` ADD CONSTRAINT `cabang_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `area`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `cabang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `sumdan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_agentFrontingId_fkey` FOREIGN KEY (`agentFrontingId`) REFERENCES `agentfronting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produkpembiayaan` ADD CONSTRAINT `produkpembiayaan_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `debitur` ADD CONSTRAINT `debitur_payOfficeId_fkey` FOREIGN KEY (`payOfficeId`) REFERENCES `payoffice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_nopen_fkey` FOREIGN KEY (`nopen`) REFERENCES `debitur`(`nopen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_produkPembiayaanId_fkey` FOREIGN KEY (`produkPembiayaanId`) REFERENCES `produkpembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_jenisPembiayaanId_fkey` FOREIGN KEY (`jenisPembiayaanId`) REFERENCES `jenispembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_aoId_fkey` FOREIGN KEY (`aoId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_aoCabangId_fkey` FOREIGN KEY (`aoCabangId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_aoAreaId_fkey` FOREIGN KEY (`aoAreaId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_droppingId_fkey` FOREIGN KEY (`droppingId`) REFERENCES `dropping`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_berkasId_fkey` FOREIGN KEY (`berkasId`) REFERENCES `berkas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_jaminanId_fkey` FOREIGN KEY (`jaminanId`) REFERENCES `jaminan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_agentFrontingId_fkey` FOREIGN KEY (`agentFrontingId`) REFERENCES `agentfronting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_prevPayOfficeId_fkey` FOREIGN KEY (`prevPayOfficeId`) REFERENCES `payoffice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_dPKStatusId_fkey` FOREIGN KEY (`dPKStatusId`) REFERENCES `dpkstatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_payOfficeId_fkey` FOREIGN KEY (`payOfficeId`) REFERENCES `payoffice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapem` ADD CONSTRAINT `dapem_insuranceId_fkey` FOREIGN KEY (`insuranceId`) REFERENCES `insurance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aianalysis` ADD CONSTRAINT `aianalysis_dapemId_fkey` FOREIGN KEY (`dapemId`) REFERENCES `dapem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dropping` ADD CONSTRAINT `dropping_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `berkas` ADD CONSTRAINT `berkas_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jaminan` ADD CONSTRAINT `jaminan_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pelunasan` ADD CONSTRAINT `pelunasan_dapemId_fkey` FOREIGN KEY (`dapemId`) REFERENCES `dapem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `angsuran` ADD CONSTRAINT `angsuran_dapemId_fkey` FOREIGN KEY (`dapemId`) REFERENCES `dapem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categoryofaccount` ADD CONSTRAINT `categoryofaccount_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `categoryofaccount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journaldetail` ADD CONSTRAINT `journaldetail_journalEntryId_fkey` FOREIGN KEY (`journalEntryId`) REFERENCES `journalentry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journaldetail` ADD CONSTRAINT `journaldetail_categoryOfAccountId_fkey` FOREIGN KEY (`categoryOfAccountId`) REFERENCES `categoryofaccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journaldetail` ADD CONSTRAINT `journaldetail_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sumdanagentfronting` ADD CONSTRAINT `sumdanagentfronting_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sumdanagentfronting` ADD CONSTRAINT `sumdanagentfronting_agentFrontingId_fkey` FOREIGN KEY (`agentFrontingId`) REFERENCES `agentfronting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datasimulasi` ADD CONSTRAINT `datasimulasi_produkPembiayaanId_fkey` FOREIGN KEY (`produkPembiayaanId`) REFERENCES `produkpembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datasimulasi` ADD CONSTRAINT `datasimulasi_jenisPembiayaanId_fkey` FOREIGN KEY (`jenisPembiayaanId`) REFERENCES `jenispembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datasimulasi` ADD CONSTRAINT `datasimulasi_payOfficeId_fkey` FOREIGN KEY (`payOfficeId`) REFERENCES `payoffice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datasimulasi` ADD CONSTRAINT `datasimulasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
