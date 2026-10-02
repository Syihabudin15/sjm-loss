import { IDapem } from "@/libs/IInterfaces";

export const FormKreditABS = (record?: IDapem) => {
  return `
  <div class="pt-20 ">

    <div class="flex gap-8">
      <div class="flex-1 flex">
        <div class="w-48 border border-gray-800 flex flex-col gap-2 items-center justify-center">
          <p>Photo</p>
          <p>Pemohon</p>
        </div>
        <div class="w-48 border border-gray-800 flex flex-col gap-2 items-center justify-center">
          <p>Photo</p>
          <p>Suami/Istri</p>
        </div>
      </div>
      <div class="flex-1 font-bold">
        <p>Kepada Yth.</p>
        <p>PT. BPR Amal Bhakti Sejahtera</p>
        <p>Jalan Jendral Sudirman No. 80</p>
        <p class="underline">Labuan</p>
      </div>
    </div>

    <p class="mt-5 text-xl font-bold">Perihal : <span class="undeline">Permohonan Kredit</span>  </p>
    <p>Yang bertanda tangan dibawah ini: </p>
    
    <div class="pl-3 my-2 flex gap-1">
      <p class="w-48">1. Nama Lengkap</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 border-b border-dashed border-gray-800">${record ? record.Debitur.fullname : ""}</div>
    </div>
    <div class="pl-3 my-2 flex gap-1">
      <p class="w-48">2. Nama Panggilan</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 border-b border-dashed border-gray-800"></div>
    </div>
    <div class="pl-3 my-2 flex gap-1">
      <p class="w-48">3. Alamat Lengkap</p>
      <p class="w-4">:</p>
      ${
        record
          ? `<div class="flex-1 pl-2 flex border-b border-dashed border-gray-800">
        ${record.Debitur.address}
      </div>`
          : `
        <div class="flex-1 pl-2 flex flex-col justify-end">
          <div class="border-b border-dashed border-gray-800"></div>
          <div class="border-b border-dashed border-gray-800"></div>
          <div class="border-b border-dashed border-gray-800"></div>
      </div>`
      }
    </div>
    <div class="pl-3 my-2 flex gap-1 mt-5">
      <p class="w-48">4. No. KTP</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 flex gap-4">
        <div class="border-b border-dashed border-gray-800 w-32">${record ? record.Debitur.nik : ""}</div>
        <p>Masa Berlaku s/d tgl</p>
        <div class="border-b border-dashed border-gray-800 flex-1">${record ? record.Debitur.id_end || "" : ""}</div>
      </div>
    </div>
    <div class="pl-3 my-2 flex gap-1">
      <p class="w-48">5. Telepon Rumah/HP</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 flex gap-4">
        <div class="border-b border-dashed border-gray-800 w-32"></div>
        <p>/</p>
        <div class="border-b border-dashed border-gray-800 flex-1">${record ? record.Debitur.phone || "" : ""} (Wajib Diisi)</div>
      </div>
    </div>
    <div class="pl-3 my-2 flex gap-1">
      <p class="w-48">6. Pekerjaan</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 border-b border-dashed border-gray-800">${record ? record.job || "" : ""}</div>
    </div>
    <div class="pl-3 my-2 flex gap-1">
      <p class="w-48">7. Nama Kantor</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 border-b border-dashed border-gray-800"></div>
    </div>
    <div class="pl-3 my-2 flex gap-1">
      <p class="w-48">8. Alamat Kantor & Telp</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 flex flex-col justify-end">
        <div class="border-b border-dashed border-gray-800"></div>
        <div class="border-b border-dashed border-gray-800"></div>
        <div class="flex gap-2 justify-between">
          <div class="">Telp</div>
          <div class="border-b border-dashed border-gray-800 flex-1">Telp</div>
          <div class="border-b border-dashed border-gray-800">(Wajib diisi)</div>
        </div>
      </div>
    </div>

    <div class="pl-3 my-2 flex gap-1 mt-5">
      <p class="w-48">9. Nama Ibu Kandung</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 border-b border-dashed border-gray-800">${record ? record.Debitur.mother_name || "" : ""}</div>
    </div>
    <div class="pl-3 my-2 flex gap-1 mt-5">
      <p class="w-48">10. Nama Suami/Istri</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 border-b border-dashed border-gray-800">${record ? (record.marriage_status === "KAWIN" ? record.aw_name : "") : ""}</div>
    </div>

  </div>
  `;
};
