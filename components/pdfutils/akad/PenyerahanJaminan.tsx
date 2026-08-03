import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
moment.locale("id");

export const PenyerahanJaminan = (record: IDapem) => {
  return `
  <div class="flex items-center justify-between border-b pb-2">
    <img src="${process.env.NEXT_PUBLIC_APP_LOGO}" alt="Logo" class="h-16 mr-4" />
    <div class="text-center">
      <h2 class="text-center text-xl font-semibold mb-2 ">TANDA TERIMA PENYERAHAN JAMINAN</h2>
      <p class="text-center ">${record.no_contract}</p>
    </div>
    <img src="${record.ProdukPembiayaan.Sumdan.logo}" alt="Logo" class="h-16 mr-4" />
  </div>
  
  <div>
    <div class="flex gap-2">
      <p class="w-52">Nama Pensiunan</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.fullname}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Nomor NIK</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.nik}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Tempat/Tanggal Lahir</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">NIP / NRP / NOPEN</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.nopen}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Nomor SKEP</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.no_skep}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Tanggal SKEP</p>
      <p class="w-4">:</p>
      <p class="flex-1">${moment(record.Debitur.date_skep).format("DD-MM-YYYY")}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Alamat</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.address}, KELURAHAN ${record.Debitur.ward} KECAMATAN ${record.Debitur.district}, ${record.Debitur.city} ${record.Debitur.province} ${record.Debitur.pos_code}</p>
    </div>
  </div>

  <div class="my-4 text-center">
    <p class="my-3">Diserahkan Tanggal</p>
    <div class="flex gap-10 justify-around items-end">
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-b">${record.Debitur.fullname}</p>
        <p>DEBITUR</p>
      </div>
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-t">Kepala Unit Layanan</p>
      </div>
    </div>
  </div>
  <div class="text-center">
    <p class="my-3">Dikembalikan Tanggal</p>
    <div class="flex gap-10 justify-around my-8 items-end">
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-b">${record.Debitur.fullname}</p>
        <p>DEBITUR</p>
      </div>
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-t">Kepala Unit Layanan</p>
      </div>
    </div>
  </div>
  
  <div class="border-t border-dashed my-4"></div>
  
  <div class="flex items-center justify-between border-b pb-2 mt-4">
    <img src="${process.env.NEXT_PUBLIC_APP_LOGO}" alt="Logo" class="h-16 mr-4" />
    <div class="text-center">
      <h2 class="text-center text-xl font-semibold mb-2 ">TANDA TERIMA PENYERAHAN JAMINAN</h2>
      <p class="text-center ">${record.no_contract}</p>
    </div>
    <img src="${record.ProdukPembiayaan.Sumdan.logo}" alt="Logo" class="h-16 mr-4" />
  </div>
  
  <div>
    <div class="flex gap-2">
      <p class="w-52">Nama Pensiunan</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.fullname}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Nomor NIK</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.nik}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Tempat/Tanggal Lahir</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">NIP / NRP / NOPEN</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.nopen}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Nomor SKEP</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.no_skep}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Tanggal SKEP</p>
      <p class="w-4">:</p>
      <p class="flex-1">${moment(record.Debitur.date_skep).format("DD-MM-YYYY")}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Alamat</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.address}, KELURAHAN ${record.Debitur.ward} KECAMATAN ${record.Debitur.district}, ${record.Debitur.city} ${record.Debitur.province} ${record.Debitur.pos_code}</p>
    </div>
  </div>
  <div class="my-4 text-center">
    <p class="my-3">Diserahkan Tanggal</p>
    <div class="flex gap-10 justify-around items-end">
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-b">${record.Debitur.fullname}</p>
        <p>DEBITUR</p>
      </div>
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-t">Kepala Unit Layanan</p>
      </div>
    </div>
  </div>
  <div class="text-center">
    <p class="my-3">Dikembalikan Tanggal</p>
    <div class="flex gap-10 justify-around my-8 items-end">
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-b">${record.Debitur.fullname}</p>
        <p>DEBITUR</p>
      </div>
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-t">Kepala Unit Layanan</p>
      </div>
    </div>
  </div>
`;
};
