import {
  GetDapem,
  GetDetailDapem,
  IDRFormat,
} from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { ListNonStyle, NumberToWordsID } from "../utils";
moment.locale("id");

export const PersetujuanPencairan = (record: IDapem) => {
  const detail = GetDetailDapem(record);

  return `
  <div class="mb-4">
    <img src="${record.ProdukPembiayaan.Sumdan.logo}" alt="${record.ProdukPembiayaan.Sumdan.name + ` Logo`}" class="h-16 mr-4"/>
  </div>

  <ul class="mb-6">
    <li class="flex gap-4">
      <p class="w-32">Tanggal</p>
      <p class="w-4">:</p>
      <p class="flex-1">${moment(record.date_contract).format("DD-MM-YYYY")}</p>
    </li>
    <li class="flex gap-4">
      <p class="w-32">Nomor</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.no_contract}</p>
    </li>
    <li class="flex gap-4">
      <p class="w-32">Perihal</p>
      <p class="w-4">:</p>
      <p class="flex-1">Persetujuan Pemberian Kredit</p>
    </li>
  </ul>

  <div class="my-4">
    <p>Kepada Yth,</p>
    <p>Bapak/Ibu</p>
  </div>

  <div class="my-8">
    <p class="mb-2">Menunjuk Surat Saudara/Saudari tanggal ${moment(record.date_contract).format("DD-MM-YYYY")} perihal permohonan kredit, dengan ini kami beritahukan sebagai berikut :</p>
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
        key: "Biaya Asuransi",
        value: IDRFormat(detail.asuransi),
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
        key: `Total Potongan`,
        value: IDRFormat(detail.biaya),
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
        value: IDRFormat(detail.tb),
        currency: true,
        classStyle: "border-t font-bold",
      },
      {
        key: ``,
        value: `( ${NumberToWordsID(detail.tb)} Rupiah )`,
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
        value: `( ${NumberToWordsID(detail.angsuran)} Rupiah )`,
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
      <p class="border-b font-bold">${record.Debitur.fullname}</p>
      <p>DEBITUR</p>
    </div>
  </div>

`;
};
