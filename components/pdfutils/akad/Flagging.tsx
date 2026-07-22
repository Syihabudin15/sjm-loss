import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { ListNonStyle, ListStyle } from "../utils";
moment.locale("id");

export const FLagging = (record: IDapem) => {
  return `
  
  <div class="flex justify-between gap-8 items-center">
    <div class="flex-1">
      <img src="${record.PayOffice.logo}" alt="${record.PayOffice.name + ` Logo`}" class="h-16 mr-4"/>
    </div>
    <ul class="flex-1 list-item list-none">
      <li>Lampiran I</li>
      <li>Perjanjian Kerja Sama antara PT TASPEN (PERSERO) dengan PT Bank Mandiri Taspen</li>
      <li>Nomor JAN-292/DIR/2021</li>
      <li>Nomor DIR.PKS/007/III/2021</li>
      <li>Tanggal 23 Maret 2021</li>
    </ul>
  </div>

  <p class="font-bold text-lg text-center my-8">SURAT PERNYATAAN DEBITUR</p>
  
  <div class="my-4">
    <p>Yang bertandatangan di bawah ini  :</p>
  ${ListStyle(
    [
      `${ListNonStyle([{ key: "Nama PNS / Pensiunan", value: record.Debitur.fullname }])}`,
      `${ListNonStyle([{ key: "Nomor Induk Kependudukan", value: record.Debitur.nik }])}`,
      `${ListNonStyle([{ key: "TUK/NRP/NIP/NPP/NOTAS", value: record.nopen }])}`,
      `${ListNonStyle([{ key: "Tempat & Tanggal Lahir", value: `${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}` }])}`,
      `${ListNonStyle([
        {
          key: "Alamat Lengkap",
          value: `
          <p>${record.Debitur.address}</p>
          <p>${record.Debitur.ward}</p>
          <p>${record.Debitur.district}</p>
          <p>${record.Debitur.city}</p>
          <p>${record.Debitur.province}</p>
          <p>${record.Debitur.pos_code}</p>
          `,
        },
      ])}`,
      `${ListNonStyle([{ key: "No. Handphone", value: record.Debitur.phone }])}`,
    ],
    "lower",
  )}
  </div>

  <div class="my-8">
    <p>Sehubungan dengan saya mengambil fasilitas kredit pensiun pada ${record.PayOffice.name}, Kantor Cabang ${"....................."} dengan perjanjian kredit nomor <span class="font-bold">${"..............................................."}</span> maka dengan ini Saya menyatakan:</p>
    ${ListStyle(
      [
        `Pada saat menerima pembayaran Manfaat Tabungan Hari Tua (THT) dan/atau Pensiun saya setiap bulan dari ${record.Debitur.group_skep} (PERSERO), agar dibayarkan melalui rekening saya Nomor : ${"........................................."} atas Nama ${".............................."} pada ${record.PayOffice.name}, Kantor Cabang ${"....................."}sampai dengan kredit saya lunas`,
        `Memberi kuasa kepada ${record.PayOffice.name}, Kantor Cabang ${"....................."} untuk melakukan Pengesahan Data kepesertaan Saya dan sekaligus untuk mendaftarkan Flagging Data Saya pada ${record.Debitur.group_skep} (PERSERO) selama jangka waktu kredit yang telah disetujui yaitu Tanggal ${"............"} Bulan ${"............"} Tahun ${".............."} sampai dengan Tanggal ${"............"} Bulan ${"............"} Tahun ${".............."}.`,
      ],
      "number",
    )}
    <p class="mt-2">Demikian surat pernyataan dan kuasa ini saya buat, untuk dipergunakan sebagaimana mestinya. </p>

  <div class="my-8 flex justify-around gap-10 items-end text-center">
    <div class="flex-1"></div>
    <div class="flex-1">
      <p>${"......................,....................................."}</p>
      <p>Yang menyatakan</p>
      <div class="h-28 flex flex-col items-center justify-center text-xs opacity-70">
        <p>Materai</p>
        <p>Rp. 10.000,-</p>
      </div>
      <p class="border-b font-bold">${record.Debitur.fullname}</p>
      <p>Nama Terang & Tanda Tangan</p>
    </div>
  </div>

  <div class="">
    <p class="font-bold">Catatan : </p>
    <ul class="list-item list-none list-inside">
      <li>Lembar 1 untuk ${record.Debitur.group_skep} (PERSERO)</li>
      <li>Lembar 2 untuk ${record.ProdukPembiayaan.Sumdan.name}</li>
      <li>Lembar 3 untuk Debitur</li>
      <li>Lembar 4 untuk Arsip </li>
    </ul>
  </div>

`;
};
