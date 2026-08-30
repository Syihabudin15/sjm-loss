-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `data_status` ENUM('USER', 'CABANG', 'AREA', 'SEMUA') NOT NULL DEFAULT 'SEMUA',
    `permission` TEXT NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Role_name_key`(`name`),
    INDEX `Role_name_idx`(`name`),
    INDEX `Role_data_status_idx`(`data_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sumdan` (
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

    INDEX `Sumdan_name_idx`(`name`),
    INDEX `Sumdan_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Area` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Area_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cabang` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` TEXT NULL,
    `phone` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `areaId` VARCHAR(191) NOT NULL,

    INDEX `Cabang_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
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

    UNIQUE INDEX `User_username_key`(`username`),
    INDEX `User_nip_idx`(`nip`),
    INDEX `User_fullname_idx`(`fullname`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_phone_idx`(`phone`),
    INDEX `User_end_pkwt_idx`(`end_pkwt`),
    INDEX `User_pkwt_status_idx`(`pkwt_status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProdukPembiayaan` (
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

    INDEX `ProdukPembiayaan_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JenisPembiayaan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `c_blokir` INTEGER NOT NULL,
    `c_mutasi` INTEGER NOT NULL DEFAULT 0,
    `status_takeover` BOOLEAN NOT NULL DEFAULT false,
    `status_mutasi` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `JenisPembiayaan_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Debitur` (
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
    `mother_name` VARCHAR(191) NULL,
    `account_name` VARCHAR(191) NULL,
    `account_number` VARCHAR(191) NULL,
    `payOfficeId` VARCHAR(191) NULL,

    UNIQUE INDEX `Debitur_nopen_key`(`nopen`),
    INDEX `Debitur_fullname_idx`(`fullname`),
    INDEX `Debitur_nik_idx`(`nik`),
    INDEX `Debitur_name_skep_idx`(`name_skep`),
    INDEX `Debitur_no_skep_idx`(`no_skep`),
    INDEX `Debitur_account_number_idx`(`account_number`),
    INDEX `Debitur_province_idx`(`province`),
    INDEX `Debitur_city_idx`(`city`),
    INDEX `Debitur_district_idx`(`district`),
    INDEX `Debitur_ward_idx`(`ward`),
    INDEX `Debitur_pos_code_idx`(`pos_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dapem` (
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

    INDEX `Dapem_dropping_status_idx`(`dropping_status`),
    INDEX `Dapem_document_status_idx`(`document_status`),
    INDEX `Dapem_guarantee_status_idx`(`guarantee_status`),
    INDEX `Dapem_slik_status_idx`(`slik_status`),
    INDEX `Dapem_verif_status_idx`(`verif_status`),
    INDEX `Dapem_approv_status_idx`(`approv_status`),
    INDEX `Dapem_created_at_idx`(`created_at`),
    INDEX `Dapem_takeover_date_idx`(`takeover_date`),
    INDEX `Dapem_takeover_status_idx`(`takeover_status`),
    INDEX `Dapem_mutasi_status_idx`(`mutasi_status`),
    INDEX `Dapem_flagging_status_idx`(`flagging_status`),
    INDEX `Dapem_cash_status_idx`(`cash_status`),
    INDEX `Dapem_tbo_date_idx`(`tbo_date`),
    INDEX `Dapem_no_contract_idx`(`no_contract`),
    INDEX `Dapem_date_contract_idx`(`date_contract`),
    INDEX `Dapem_date_end_idx`(`date_end`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AIAnalysis` (
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
CREATE TABLE `PayOffice` (
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

    INDEX `PayOffice_name_idx`(`name`),
    INDEX `PayOffice_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Insurance` (
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

    INDEX `Insurance_name_idx`(`name`),
    INDEX `Insurance_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dropping` (
    `id` VARCHAR(191) NOT NULL,
    `file_sub` VARCHAR(191) NULL,
    `file_proof` TEXT NULL,
    `status` BOOLEAN NOT NULL,
    `process_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `sumdanId` VARCHAR(191) NOT NULL,

    INDEX `Dropping_process_at_idx`(`process_at`),
    INDEX `Dropping_created_at_idx`(`created_at`),
    INDEX `Dropping_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Berkas` (
    `id` VARCHAR(191) NOT NULL,
    `file_sub` VARCHAR(191) NULL,
    `file_proof` VARCHAR(191) NULL,
    `status` ENUM('UNIT', 'DELIVERY', 'PUSAT', 'MITRA') NOT NULL,
    `process_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `sumdanId` VARCHAR(191) NOT NULL,

    INDEX `Berkas_process_at_idx`(`process_at`),
    INDEX `Berkas_created_at_idx`(`created_at`),
    INDEX `Berkas_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jaminan` (
    `id` VARCHAR(191) NOT NULL,
    `file_sub` VARCHAR(191) NULL,
    `file_proof` VARCHAR(191) NULL,
    `status` ENUM('UNIT', 'DELIVERY', 'PUSAT', 'MITRA') NOT NULL,
    `process_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `sumdanId` VARCHAR(191) NOT NULL,

    INDEX `Jaminan_process_at_idx`(`process_at`),
    INDEX `Jaminan_created_at_idx`(`created_at`),
    INDEX `Jaminan_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pelunasan` (
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

    UNIQUE INDEX `Pelunasan_dapemId_key`(`dapemId`),
    INDEX `Pelunasan_type_idx`(`type`),
    INDEX `Pelunasan_guarantee_status_idx`(`guarantee_status`),
    INDEX `Pelunasan_status_paid_idx`(`status_paid`),
    INDEX `Pelunasan_process_at_idx`(`process_at`),
    INDEX `Pelunasan_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Angsuran` (
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

    INDEX `Angsuran_date_pay_idx`(`date_pay`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoryOfAccount` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('ASSET', 'KEWAJIBAN', 'MODAL', 'PENDAPATAN', 'BEBAN') NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `parentId` VARCHAR(191) NULL,

    INDEX `CategoryOfAccount_name_idx`(`name`),
    INDEX `CategoryOfAccount_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JournalEntry` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,

    INDEX `JournalEntry_date_idx`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JournalDetail` (
    `id` VARCHAR(191) NOT NULL,
    `debit` INTEGER NOT NULL DEFAULT 0,
    `credit` INTEGER NOT NULL DEFAULT 0,
    `desciption` VARCHAR(191) NULL,
    `journalEntryId` VARCHAR(191) NOT NULL,
    `categoryOfAccountId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AgentFronting` (
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

    INDEX `AgentFronting_name_idx`(`name`),
    INDEX `AgentFronting_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SumdanAgentFronting` (
    `id` VARCHAR(191) NOT NULL,
    `sumdanId` VARCHAR(191) NOT NULL,
    `agentFrontingId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DataSimulasi` (
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
ALTER TABLE `Cabang` ADD CONSTRAINT `Cabang_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_cabangId_fkey` FOREIGN KEY (`cabangId`) REFERENCES `Cabang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_agentFrontingId_fkey` FOREIGN KEY (`agentFrontingId`) REFERENCES `AgentFronting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProdukPembiayaan` ADD CONSTRAINT `ProdukPembiayaan_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Debitur` ADD CONSTRAINT `Debitur_payOfficeId_fkey` FOREIGN KEY (`payOfficeId`) REFERENCES `PayOffice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_nopen_fkey` FOREIGN KEY (`nopen`) REFERENCES `Debitur`(`nopen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_produkPembiayaanId_fkey` FOREIGN KEY (`produkPembiayaanId`) REFERENCES `ProdukPembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_jenisPembiayaanId_fkey` FOREIGN KEY (`jenisPembiayaanId`) REFERENCES `JenisPembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_aoId_fkey` FOREIGN KEY (`aoId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_aoCabangId_fkey` FOREIGN KEY (`aoCabangId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_aoAreaId_fkey` FOREIGN KEY (`aoAreaId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_droppingId_fkey` FOREIGN KEY (`droppingId`) REFERENCES `Dropping`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_berkasId_fkey` FOREIGN KEY (`berkasId`) REFERENCES `Berkas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_jaminanId_fkey` FOREIGN KEY (`jaminanId`) REFERENCES `Jaminan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_agentFrontingId_fkey` FOREIGN KEY (`agentFrontingId`) REFERENCES `AgentFronting`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_prevPayOfficeId_fkey` FOREIGN KEY (`prevPayOfficeId`) REFERENCES `PayOffice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_dPKStatusId_fkey` FOREIGN KEY (`dPKStatusId`) REFERENCES `DPKStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_payOfficeId_fkey` FOREIGN KEY (`payOfficeId`) REFERENCES `PayOffice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapem` ADD CONSTRAINT `Dapem_insuranceId_fkey` FOREIGN KEY (`insuranceId`) REFERENCES `Insurance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AIAnalysis` ADD CONSTRAINT `AIAnalysis_dapemId_fkey` FOREIGN KEY (`dapemId`) REFERENCES `Dapem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dropping` ADD CONSTRAINT `Dropping_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Berkas` ADD CONSTRAINT `Berkas_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jaminan` ADD CONSTRAINT `Jaminan_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pelunasan` ADD CONSTRAINT `Pelunasan_dapemId_fkey` FOREIGN KEY (`dapemId`) REFERENCES `Dapem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Angsuran` ADD CONSTRAINT `Angsuran_dapemId_fkey` FOREIGN KEY (`dapemId`) REFERENCES `Dapem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOfAccount` ADD CONSTRAINT `CategoryOfAccount_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `CategoryOfAccount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalDetail` ADD CONSTRAINT `JournalDetail_journalEntryId_fkey` FOREIGN KEY (`journalEntryId`) REFERENCES `JournalEntry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalDetail` ADD CONSTRAINT `JournalDetail_categoryOfAccountId_fkey` FOREIGN KEY (`categoryOfAccountId`) REFERENCES `CategoryOfAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalDetail` ADD CONSTRAINT `JournalDetail_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SumdanAgentFronting` ADD CONSTRAINT `SumdanAgentFronting_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SumdanAgentFronting` ADD CONSTRAINT `SumdanAgentFronting_agentFrontingId_fkey` FOREIGN KEY (`agentFrontingId`) REFERENCES `AgentFronting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataSimulasi` ADD CONSTRAINT `DataSimulasi_produkPembiayaanId_fkey` FOREIGN KEY (`produkPembiayaanId`) REFERENCES `ProdukPembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataSimulasi` ADD CONSTRAINT `DataSimulasi_jenisPembiayaanId_fkey` FOREIGN KEY (`jenisPembiayaanId`) REFERENCES `JenisPembiayaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataSimulasi` ADD CONSTRAINT `DataSimulasi_payOfficeId_fkey` FOREIGN KEY (`payOfficeId`) REFERENCES `PayOffice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataSimulasi` ADD CONSTRAINT `DataSimulasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
