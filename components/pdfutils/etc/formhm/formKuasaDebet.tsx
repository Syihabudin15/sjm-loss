import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";

export const FormKuasaDebet = (record: IDapem) => {
  return `
  <div class="text-justify">

    <p class="font-bold text-xl text-center underline mb-10">SURAT KUASA</p>

    <p>Yang bertanda tangan dibawah ini :</p>
    <div class="my-4 ml-4">
      <div class="flex gap-4">
        <p class="w-48">Nama</p>
        <p class="w-2">:</p>
        <p class="flex-1">${record.Debitur.fullname}</p>
      </div>
      <div class="flex gap-4">
        <p class="w-48">Tanggal Lahir</p>
        <p class="w-2">:</p>
        <p class="flex-1">${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}</p>
      </div>
      <div class="flex gap-4">
        <p class="w-48">No. Identitas</p>
        <p class="w-2">:</p>
        <p class="flex-1">${record.Debitur.nik}</p>
      </div>
      <div class="flex gap-4">
        <p class="w-48">Alamat Sesuai KTP</p>
        <p class="w-2">:</p>
        <p class="flex-1">${record.Debitur.address}, KELURAHAN ${record.Debitur.ward}, KECAMATAN ${record.Debitur.district}, ${record.Debitur.city}, ${record.Debitur.province} ${record.Debitur.pos_code}</p>
      </div>
      <div class="flex gap-4">
        <p class="w-48">Pekerjaan Sesuai KTP</p>
        <p class="w-2">:</p>
        <p class="flex-1">${record.job}</p>
      </div>
    </div>
    <p>Sehubungan dengan realisasi kredit/pinjaman di PT BPR HARTA MULIA, dengan ini memberikan kuasa kepada PT. BPR HARTA MULIA untuk mendebet rekening tabungan saya guna kepentingan transfer ke Pihak Koperasi Jasa Sena Jaya Mandiri terkait dengan realisasi kredit/pinjaman dan proses pendebetan untuk pembayaran angsuran selama jangka waktu kredit/pinjaman saya dengan data sebagai berikut :</p>
    <div class="my-4 font-bold ml-4">
      <div class="flex gap-4">
        <p class="w-48">No Perjanjian Kredit</p>
        <p class="w-2">:</p>
        <p class="flex-1">${record.no_contract}</p>
      </div>
      <div class="flex gap-4">
        <p class="w-48">Atas Nama</p>
        <p class="w-2">:</p>
        <p class="flex-1">${record.Debitur.fullname}</p>
      </div>
    </div>
    <p>Adapun data tabungan sebagai berikut :</p>
    <div class="my-4 font-bold ml-4">
      <div class="flex gap-4">
        <p class="w-48">Atas Nama</p>
        <p class="w-2">:</p>
        <p class="flex-1 border-b border-gray-800 border-dashed"></p>
      </div>
      <div class="flex gap-4">
        <p class="w-48">Rekening No	(diisi oleh Bank)</p>
        <p class="w-2">:</p>
        <p class="flex-1 border-b border-gray-800 border-dashed"></p>
      </div>
    </div>
    <p>Demikian surat kuasa ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>

    <div class="flex justify-evenly text-center mt-14">
      <div class="w-60 flex flex-col items-center justify-center gap-24">
        <div class="w-full">
          <p></p>
          <p>Yang menerima kuasa</p>
          <p>PT. BPR HARTA MULIA</p>
        </div>
        <div class="w-full">
          <p class="border-b border-gray-800">LILIWATI</p>
          <p>Direktur Utama</p>
        </div>
      </div>
      <div class="w-60 flex flex-col items-center justify-center gap-24">
        <div class="w-full">
          <p>${record.Debitur.city?.toLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.date_contract).format("DD-MM-YYYY")}</p>
          <p>Yang memberi kuasa</p>
        </div>
        <div class="w-full">
          <p class="border-b border-gray-800">${record.Debitur.fullname}</p>
          <p>Peminjam</p>
        </div>
      </div>
    </div>

  </div>
  `;
};
