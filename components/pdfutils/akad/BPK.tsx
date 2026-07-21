import {
  GetDapem,
  GetDetailDapem,
  IDRFormat,
} from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { Header, ListNonStyle, NumberToWordsID } from "../utils";
moment.locale("id");

export const BPK = (record: IDapem) => {
  const detail = GetDetailDapem(record);
  const dapem = GetDapem(record);
  const ao = record.AO || record.AOCabang || record.AOArea;

  return `
  ${Header("BUKTI PENCAIRAN KREDIT (BPK)", record.no_contract, undefined, record.ProdukPembiayaan.Sumdan.logo, undefined)}
  
  <div class="my-4">
  ${ListNonStyle([
    {
      key: "Nama Lengkap",
      value: record.Debitur.fullname,
    },
    {
      key: "Nomor Pensiun",
      value: record.nopen,
    },
    {
      key: "Kantor Bayar",
      value: record.PayOffice.name,
    },
    {
      key: "Instansi",
      value: record.Debitur.group_skep,
    },
    {
      key: "Kantor Pelayanan",
      value: `${ao?.Cabang.name} - ${ao?.Cabang.Area.name}`,
    },
  ])}
  </div>

  <div class="my-8">
    <p class="mb-2">Menyatakan telah menerima dana atas Fasilitas Kredit dari ${record.ProdukPembiayaan.Sumdan.name} dengan rincian sebagai berikut :</p>
    ${ListNonStyle([
      {
        key: "Plafond Kredit",
        value: IDRFormat(record.plafond),
        currency: true,
      },
      {
        key: "Jangka Waktu",
        value: `${record.tenor} Bulan`,
      },
      {
        key: "Suku Bunga",
        value: `${record.c_margin + record.c_margin_sumdan}% Efektif p.a`,
      },
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
        key: "Biaya Provisi",
        value: IDRFormat(
          detail.detail.adm_sumdan + detail.detail.provisi_sumdan,
        ),
        currency: true,
      },
      {
        key: "Biaya Tatalaksana",
        value: IDRFormat(record.c_gov),
        currency: true,
      },
      {
        key: "Biaya Asuransi",
        value: IDRFormat(detail.asuransi),
        currency: true,
      },
      {
        key: `Total Potongan`,
        value: IDRFormat(dapem.biaya),
        currency: true,
        classStyle: "border-t font-bold",
      },
    ])}
    <div class="mt-4"></div>
    ${ListNonStyle([
      {
        key: "Biaya Pelunasan",
        value: IDRFormat(record.c_takeover),
        currency: true,
      },
      {
        key: `Angsuran Dimuka (${record.c_blokir}x)`,
        value: IDRFormat(record.c_blokir * detail.angsuran),
        currency: true,
      },
      {
        key: `Penerimaan Bersih`,
        value: IDRFormat(dapem.tb),
        currency: true,
        classStyle: "border-t font-bold",
      },
      {
        key: ``,
        value: `(${NumberToWordsID(dapem.tb)} Rupiah )`,
        classStyle: "font-bold",
      },
    ])}
    <div class="mt-4"></div>
    ${ListNonStyle([
      {
        key: "Jatuh Tempo",
        value: moment(record.date_contract || record.created_at)
          .add(record.tenor, "month")
          .format("DD-MM-YYYY"),
      },
      {
        key: `Angsuran`,
        value: IDRFormat(detail.detail.angsuran_sumdan),
        currency: true,
      },
      {
        key: `Biaya Adm Angsuran`,
        value: IDRFormat(detail.angsuran - detail.detail.angsuran_sumdan),
        currency: true,
      },
      {
        key: `Total Angsuran`,
        value: IDRFormat(detail.angsuran),
        currency: true,
        classStyle: "border-t font-bold",
      },
      {
        key: ``,
        value: `(${NumberToWordsID(detail.angsuran)} Rupiah)`,
        classStyle: " font-bold",
      },
    ])}
    <div class="mt-4"></div>
    ${ListNonStyle([
      {
        key: "Jaminan",
        value: `Nomor SKEP : ${record.Debitur.no_skep}, Tanggal SKEP : ${moment(record.Debitur.date_skep).format("DD-MM/YYYY")}, A.n : ${record.Debitur.name_skep}`,
        classStyle: "font-bold",
      },
    ])}
  </div>

  <div class="my-5 flex justify-around gap-10 items-end text-center">
    <div class="flex-1"></div>
    <div class="flex-1">
      <p>${record.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.date_contract).format("DD-MM-YYYY")}</p>
      <p>Diterima Oleh</p>
      <div class="h-28"></div>
      <p class="border-b">${record.Debitur.fullname}</p>
      <p class="h-4">DEBITUR</p>
    </div>
  </div>
  <div class="my-5 flex justify-around gap-10 items-end text-center">
    <div class="flex-1">
      <p>Diproses oleh</p>
      <div class="h-28"></div>
      <p class="border-b font-bold">${ao?.fullname}</p>
      <p class="h-4">${ao?.position}</p>
    </div>
    <div class="flex-1">
      <p>Diperiksa oleh</p>
      <div class="h-28"></div>
      <p class="border-b font-bold">${process.env.NEXT_PUBLIC_APP_SI_NAME}</p>
      <p class="h-4">${process.env.NEXT_PUBLIC_APP_SI_POSITION}</p>
    </div>
    <div class="flex-1">
      <p>Diotorisasi oleh</p>
      <div class="h-28"></div>
      <p class="border-b font-bold">${process.env.NEXT_PUBLIC_APP_OPS_NAME || ""}</p>
      <p class="h-4">${process.env.NEXT_PUBLIC_APP_OPS_NAME || ""}</p>
    </div>
  </div>

`;
};
