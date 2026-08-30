import {
  GetDetailDapem,
  GetFullAge,
  IDRFormat,
} from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { Header, ListNonStyle } from "../utils";
moment.locale("id");

export const AnalisaPerhitungan = (record: IDapem) => {
  const age = GetFullAge(
    record.Debitur.birthdate,
    record.date_contract || record.created_at,
  );
  const ageLunas = GetFullAge(
    record.Debitur.birthdate,
    moment(record.date_contract || record.created_at)
      .add(record.tenor, "month")
      .toDate(),
  );
  const detail = GetDetailDapem(record);

  const ao = record.AO || record.AOCabang || record.AOArea;

  return `
  ${Header("ANALISA PERHITUNGAN PEMBIAYAAN", record.no_contract, undefined, process.env.NEXT_PUBLIC_APP_LOGO || record.ProdukPembiayaan.Sumdan.logo, undefined)}
  
  <div class="mt-4 flex gap-4">
    <div class="flex-1">
      ${ListNonStyle([
        { key: "Nama Pemohon", value: record.Debitur.fullname },
        { key: "Nomor Pensiun", value: record.nopen },
        {
          key: "Tempat Tangal Lahir",
          value: `${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}`,
        },
        { key: "Jenis Pembiayaan", value: record.JenisPembiayaan.name },
        { key: "Produk Pembiayaan", value: record.ProdukPembiayaan.name },
        {
          key: "Gaji Pensiun",
          value: IDRFormat(record.salary || record.Debitur.salary),
          currency: true,
        },
      ])}
      
    </div>
    <div class="flex-1">
    ${ListNonStyle([
      {
        key: "Tanggal Akad",
        value: moment(record.date_contract).format("DD-MM-YYYY"),
      },
      {
        key: "Usia Pemohon",
        value: `${age.year} Thn ${age.month} Bln ${age.day} Hr`,
      },
      {
        key: "Est Tanggal Lunas",
        value: moment(record.date_contract)
          .add(record.tenor, "month")
          .format("DD/MM/YYYY"),
      },
      {
        key: "Est Usia Lunas",
        value: `${ageLunas.year} Thn ${ageLunas.month} Bln ${ageLunas.day} Hr`,
      },
      { key: "Plafond", value: IDRFormat(record.plafond), currency: true },
      {
        key: "Jangka Waktu",
        value: `${record.tenor} Bulan`,
      },
    ])}
    </div>
  </div>

  <div class="my-4 flex gap-4 border-t border-dashed">
    <div class="flex-1">
      ${ListNonStyle([
        {
          key: "Suku Bunga",
          value: `${(record.c_margin + record.c_margin_sumdan).toFixed(2)}% /Tahun`,
        },
        {
          key: "Angsuran",
          value: IDRFormat(detail.detail.angsuranrounded),
          currency: true,
        },
        {
          key: "NED + Fee",
          value: IDRFormat(record.c_ned + detail.detail.fee_banpot),
          currency: true,
        },
        {
          key: "Jumlah Angsuran Perbulan",
          value: IDRFormat(detail.angsuran),
          currency: true,
        },
        {
          key: "Sisa Gaji",
          value: IDRFormat(record.salary - detail.angsuran),
          currency: true,
        },
        {
          key: "DBR (%)",
          value: `${((detail.detail.angsuranrounded / record.salary) * 100).toFixed(2)}% / ${record.ProdukPembiayaan.Sumdan.dsr.toFixed(2)}%`,
        },
      ])}
    </div>
    <div class="flex-1">
    ${ListNonStyle([
      {
        key: "Kantor Bayar Asal",
        value: record.PrevPayOffice.name,
      },
      {
        key: "Kantor Bayar Tujuan",
        value: record.PayOffice.name,
      },
      {
        key: "Instansi Takeover",
        value: record.takeover_from || "",
      },
      {
        key: "Rencana Tgl Takeover",
        value: record.takeover_date
          ? moment(record.takeover_date).format("DD/MM/YYYY")
          : "",
      },
    ])}
    </div>
  </div>

  <div class="my-4 border-t border-dashed">
  <p class="font-bold text-lg mb-2">Petugas dan Unit Pelayanan</p>
  ${ListNonStyle([
    {
      key: "AO/SPV",
      value: `${ao?.fullname} (${ao?.nip})`,
    },
    {
      key: "Unit Pelayanan",
      value: `${ao?.Cabang.name} - ${ao?.Cabang.Area.name}`,
    },
    { key: "Admin", value: record.User.fullname },
  ])}
  </div>
  

  <div class="my-10">
    <p class="font-bold text-lg mb-2">Rincian Pembiayaan :</p>
    <div class="flex gap-4 items-end">
      <div class="flex-1">
        ${ListNonStyle([
          {
            key: "Biaya Administrasi",
            value: IDRFormat(detail.administrasi),
            currency: true,
          },
          {
            key: "Biaya Buka Rekening",
            value: IDRFormat(record.c_account_sumdan),
            currency: true,
          },
          {
            key: "Biaya Asuransi",
            value: IDRFormat(detail.asuransi),
            currency: true,
          },
          // {
          //   key: "Biaya Provisi",
          //   value: IDRFormat(
          //     detail.detail.provisi_sumdan + detail.detail.adm_sumdan,
          //   ),
          //   currency: true,
          // },
          {
            key: "Biaya Tatalaksana",
            value: IDRFormat(record.c_gov),
            currency: true,
          },
          // {
          //   key: "Biaya Flagging",
          //   value: IDRFormat(record.c_flagging),
          //   currency: true,
          // },
          {
            key: "Biaya Data Informasi",
            value: IDRFormat(record.c_infomation),
            currency: true,
          },
          // {
          //   key: "Biaya Materai",
          //   value: IDRFormat(record.c_stamp),
          //   currency: true,
          // },
          {
            key: "Biaya Mutasi & Flagging",
            value: IDRFormat(record.c_mutasi),
            currency: true,
          },
          // {
          //   key: "Biaya Bpp",
          //   value: IDRFormat(record.c_fee_bpp),
          //   currency: true,
          // },
          {
            key: "Total Biaya",
            value: IDRFormat(detail.biaya),
            currency: true,
            classStyle: "border-t border-dashed font-bold",
          },
        ])}
      </div>

      <div class="flex-1 ">
      ${ListNonStyle([
        {
          key: "Terima Kotor",
          value: IDRFormat(detail.tk),
          currency: true,
        },
        {
          key: "Nominal Takeover",
          value: IDRFormat(record.c_takeover),
          currency: true,
        },
        {
          key: `Blokir Angsuran (${record.c_blokir}x)`,
          value: IDRFormat(record.c_blokir * detail.angsuran),
          currency: true,
        },
        {
          key: "Terima Bersih",
          value: IDRFormat(detail.tb),
          currency: true,
          classStyle: "border-t border-dashed font-bold",
        },
      ])}
      </div>
    </div>
  </div>

  <div class="my-6">
    <p class="font-bold">Keterangan</p>
      <ul class="list-inside list-decimal">
        <li>Memberikan Kuasa kepada KREDITUR untuk mentransfer dana realisasi pembiayaan ke rekening Nasabah</li>
        <li>Menyatakan telah menerima fasilitas Pembiayaan KREDITUR sebesar Pokok Pembiayaan tersebut di atas dengan cara pembayaran: Transfer ke Rekening / Tunai.</li>
      </ul>
  </div>

  <div class="flex gap-10 justify-around mt-5 items-end">
    <div class="flex-1 text-center">
      <p>${(record.Debitur.city || "KOTA BANDUNG").toLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.date_contract).format("DD-MM-YYYY")}</p>
      <p>DEBITUR</p>
      <div class="h-28"></div>
      <p class="border-b font-bold">${record.Debitur.fullname}</p>
      <p>Penerima Pembiayaan</p>
    </div>
    <div class="flex-1 text-center">
      <p>AO/SPV</p>
      <div class="h-28"></div>
      <p class="border-b font-bold">${ao?.fullname}</p>
      <p>AO/SPV</p>
    </div>
  </div>
    `;
};
