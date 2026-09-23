import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { ListStyle, NumberToWordsID } from "../utils";

export const SKPMantap = (record: IDapem) => {
  return `
  
  <p class="font-bold text-xl text-center underline mb-8 -mt-10">SURAT PERNYATAAN DAN KUASA</p>
  
  <p>Saya yang bertanda tangan dibawah ini :</p>

  <div class="ml-4 mt-2 ">
    <div class="flex gap-2">
      <p class="w-52">Nama</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.fullname}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Nomor Induk Kependudukan</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.nik}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">TUK/NRP/NIP/NOTAS</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.nopen}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Tempat & Tanggal Lahir</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Alamat Lengkap</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.address}, KELURAHAN ${record.Debitur.ward}, KECAMATAN ${record.Debitur.district}, ${record.Debitur.city}, ${record.Debitur.province} ${record.Debitur.pos_code}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">No. HP</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.phone}</p>
    </div>
  </div>
  <p class="mt-4">Dengan ini saya menyatakan hal-hal sebagai berikut :</p>

  <div class="ml-1">
  ${ListStyle(
    [
      `Bahwa saya telah menerima fasilitas kredit pensiun dari ${process.env.NEXT_PUBLIC_APP_COMPANY_NAME} (selanjutnya disebut “Pemberi Kredit”) sebesar Rp ${IDRFormat(record.plafond)} (${NumberToWordsID(record.plafond)} Rupiah) sebagaimana tersebut dalam Perjianjian Kredit No. ${record.no_contract};`,
      `Bahwa untuk menjamin kelancaran pembayaran angsuran kredit saya, saya menggunakan uang pensiun yang kantor bayarnya sudah dan/atau akan dilakukan melalui PT Bank Mandiri Taspen (Bank Mantap) sebagai jaminan kredit tersebut menunjuk pada butir 1 (satu) di atas;`,
      `Bahwa saya menjamin sisa uang pensiun saya saat ini dan seterusnya yang diterima sampai dengan kredit tersebut di atas lunas, benar-benar cukup jumlahnya untuk dipotong berdasarkan angsuran yang ditetapkan oleh Pemberi Kredit;`,
      `Bahwa fasilitas kredit yang saya terima tersebut di atas, sepenuhnya saya pergunakan untuk kepentingan saya sendiri.`,
    ],
    "number",
  )}
  </div>

  <p class="mt-3">Berdasarkan hal-hal tersebut di atas, dengan ini saya memberi kuasa dengan hak substitusi kepada: </p>
  <p class="my-2 font-bold">PT Bank Mandiri Taspen (Bank Mantap) selaku kantor bayar uang pensiun saya.</p>

  <div class="text-center font-bold my-4">--------------------------------------------------------------------------------- KHUSHS ---------------------------------------------------------------------------------</div>
  
  <p class="">Untuk dan atas nama Pemberi Kuasa melakukan tindakan-tindakan sebagai berikut:</p>
  <div class="ml-1 mb-2">
  ${ListStyle(
    [
      `Memotong uang pensiun (manfaat pensiun) saya setiap bulan sampai dengan kredit saya lunas sejumlah angsuran yang ditetapkan oleh Pemberi Kredit.`,
      `Menyetorkan hasil potongan uang pensiun tersebut ke rekening yang ditunjuk Pemberi Kredit untuk melakukan pembayaran angsuran kredit saya sebagaimana tersebut pada butir 1 (satu) di atas.`,
      `Melakukan tindakan-tindakan lainnya yang dianggap penting dan berguna untuk terlaksananya kuasa ini.`,
    ],
    "lower",
  )}
  </div>
  <p>Surat kuasa ini tidak dapat dicabut kembali baik oleh ketentuan Undang-Undang yang mengkhiri pemberian kuasa sebagaimana ditentukan dalam pasal 1813 Kitab Undan-Undang Hukum Perdata maupun oleh sebabsebab apapun juga, dan kuasa ini berlaku sampai dengan kredit tersebut di atas dinyatakan lunas oleh Pemberi kredit.</p>
  <p class="mt-2">Demikian surat kuasa ini dibuat dengan sebenarnya, untuk dapat dipergunakan sebagaimana mestinya.</p>

  <div class="flex gap-10 mt-5">
    <div class="flex-1">
      <p>${(record.city || record.Debitur.city || "KOTA BANDUNG").toLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.date_contract).format("DD MMMM YYYY")}</p>
      <p class="font-bold">Pemberi Kuasa,</p>
      <div class="h-28 flex flex-col justify-center text-xs opacity-60">
        <p>Materai 10.000</p>
      </div>
      <p class="underline font-bold">${record.Debitur.fullname}</p>
    </div>
  </div>

`;
};
