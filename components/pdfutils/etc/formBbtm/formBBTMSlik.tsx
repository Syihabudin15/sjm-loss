import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";

export const FormBBTMSlik = (record?: IDapem) => {
  return `
  <div class="pt-36" style="line-height: 1.5;">

    <div class="text-center underline text-lg font-bold">
      <p>SURAT PERSETUJUAN</p>
      <p>BERSEDIA MELAKUKAN PENGECEKAN SLIK</p>
    </div>

    <div class="my-10">
      <p>Yang bertanda tangan di bawah ini :</p>
      <div class="mt-5 pl-3 flex gap-2">
        <p class="w-48">Nama</p>
        <p class="w-4">:</p>
        <p class="flex-1 border-b border-dashed border-gray-800">${record?.Debitur.fullname || ""}</p>
      </div>
      <div class="my-1 pl-3 flex gap-2">
        <p class="w-48">Pekerjaan</p>
        <p class="w-4">:</p>
        <p class="flex-1 border-b border-dashed border-gray-800">${record?.job || ""}</p>
      </div>
      <div class="my-1 pl-3 flex gap-2">
        <p class="w-48">Alamat</p>
        <p class="w-4">:</p>
        <p class="flex-1 border-b border-dashed border-gray-800">${record?.Debitur.address || ""},  ${record?.Debitur.ward ? `KELURAHAN ${record?.Debitur.ward}, ` : ""}  ${record?.Debitur.district ? `KECAMATAN ${record?.Debitur.district}, ` : ""} ${record?.Debitur.city ? `${record?.Debitur.city}, ` : ""} ${record?.Debitur.province ? `${record?.Debitur.province}, ` : ""} ${record?.Debitur.pos_code ? ` ${record?.Debitur.pos_code}` : ""}</p>
      </div>
      <div class="my-1 pl-3 flex gap-2">
        <p class="w-48">NIK</p>
        <p class="w-4">:</p>
        <p class="flex-1 border-b border-dashed border-gray-800">${record?.Debitur.nik || ""}</p>
      </div>
      <div class="my-1 pl-3 flex gap-2">
        <p class="w-48">No. Kartu Keluarga</p>
        <p class="w-4">:</p>
        <p class="flex-1 border-b border-dashed border-gray-800">${record?.Debitur.number_kk || ""}</p>
      </div>
    </div>

    <p class="mt-10">Dengan ini menyatakan bersedia melakukan Pengecekan Slik (Sistem Layanan Informasi Keuangan) dengan referensi NIK (Nomor Induk Kependudukan) beserta dengan pasangan/keluarga kandung atau non kandung yang berhubungan dengan Pengajuan Kredit sebagai kelengkapan administrasi Pengajuan Kredit/Perpanjangan Kredit di PT. BPR BEKASI BINATANJUNG MAKMUR. </p>
    <p class="mt-3">Apabila dalam proses pengajuan kredit ditolak atautidak diterima, maka hasil slik tidak akan disebarluaskan dan menjadi seutuhnya milik Bank.</p>
    <p class="mt-3">Demikian Surat Pernyataan ini saya buat untuk dapat dipergunakan sebagaimana mestinya. </p>

    <div class="mt-10 flex justify-end px-20">
      <div class="w-64 text-center">
      <p class="min-h-5">${record ? (record.city || record?.Debitur.city)?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase() : "............................."}, ${record ? moment(record?.created_at).format("DD-MM-YYYY") : "........................................."}</p>
      <p>Yang Menyatakan</p>
      <div class="border-b border-dashed border-gray-800 w-full mt-28">${record ? record.Debitur.fullname : ""}</div>
      </div>
    </div>

  </div>
  `;
};
