import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import { NumberToWordsID } from "../../utils";
import moment from "moment";

export const FormKreditABS = (record?: IDapem) => {
  return `
  <div class="pt-5" style="line-height: 1.45;">

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

    <p class="mt-6 text-xl font-bold">Perihal : <span class="undeline">Permohonan Kredit</span>  </p>
    <p>Yang bertanda tangan dibawah ini: </p>
    
    <div class="pl-3 flex gap-1">
      <p class="w-48">1. Nama Lengkap</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 border-b border-dashed border-gray-800">${record ? record.Debitur.fullname : ""}</div>
    </div>
    <div class="pl-3 flex gap-1">
      <p class="w-48">2. Nama Panggilan</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 border-b border-dashed border-gray-800"></div>
    </div>
    <div class="pl-3 flex gap-1">
      <p class="w-48">3. Alamat Lengkap</p>
      <p class="w-4">:</p>
      ${
        record
          ? `<div class="flex-1 flex border-b border-dashed border-gray-800">
        ${record?.Debitur.address || ""},  ${record?.Debitur.ward ? `KELURAHAN ${record?.Debitur.ward}, ` : ""}  ${record?.Debitur.district ? `KECAMATAN ${record?.Debitur.district}, ` : ""} ${record?.Debitur.city ? `${record?.Debitur.city}, ` : ""} ${record?.Debitur.province ? `${record?.Debitur.province}, ` : ""} ${record?.Debitur.pos_code ? ` ${record?.Debitur.pos_code}` : ""}
      </div>`
          : `
        <div class="flex-1  flex flex-col">
          <div class="border-b border-dashed border-gray-800 h-6"></div>
          <div class="border-b border-dashed border-gray-800 h-6"></div>
          <div class="border-b border-dashed border-gray-800 h-6"></div>
      </div>`
      }
    </div>
    <div class="pl-3 flex gap-1 mt-3">
      <p class="w-48">4. No. KTP</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 flex gap-4">
        <div class="border-b border-dashed border-gray-800 w-52">${record ? record.Debitur.nik : ""}</div>
        <p>Masa Berlaku s/d tgl</p>
        <div class="border-b border-dashed border-gray-800 flex-1">${record ? record.Debitur.id_end || "" : ""}</div>
      </div>
    </div>
    <div class="pl-3 flex gap-1">
      <p class="w-48">5. Telepon Rumah/HP</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 flex gap-4">
        <div class="border-b border-dashed border-gray-800 w-52"></div>
        <p>/</p>
        <div class="border-b border-dashed border-gray-800 flex-1 flex justify-between"><span>${record ? record.Debitur.phone || "" : ""}</span> <span class="text-end">(Wajib Diisi)</span></div>
      </div>
    </div>
    <div class="pl-3 flex gap-1">
      <p class="w-48">6. Pekerjaan</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 border-b border-dashed border-gray-800">${record ? record.job || "" : ""}</div>
    </div>
    <div class="pl-3 flex gap-1">
      <p class="w-48">7. Nama Kantor</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 border-b border-dashed border-gray-800"></div>
    </div>
    <div class="pl-3 flex gap-1">
      <p class="w-48">8. Alamat Kantor & Telp</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex flex-col">
        <div class="border-b border-dashed border-gray-800 h-6"></div>
        <div class="border-b border-dashed border-gray-800 h-6"></div>
        <div class="flex gap-2 justify-between h-6">
          <div class="">Telp</div>
          <div class="border-b border-dashed border-gray-800 flex-1"></div>
          <div class="border-b border-dashed border-gray-800">(Wajib diisi)</div>
        </div>
      </div>
    </div>

    <div class="pl-3 flex gap-1 mt-3">
      <p class="w-48">9. Nama Ibu Kandung</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 border-b border-dashed border-gray-800">${record ? record.Debitur.mother_name || "" : ""}</div>
    </div>
    <div class="pl-3 flex gap-1 mb-3">
      <p class="w-48">10. Nama Suami/Istri</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 border-b border-dashed border-gray-800">${record ? (record.marriage_status === "KAWIN" ? record.aw_name : "") : ""}</div>
    </div>

    <p>Dengan ini mengajukan permohonan  kredit kepada BPR Amal Bhakti Sejahtera sebesar</p>
    <p>Rp. ${record ? IDRFormat(record.plafond) : "....................................................................."},- Terbilang (${record ? NumberToWordsID(record.plafond) : "..............................................................................................................................................."})</p>
    <p>Untuk jangka waktu ${record ? Math.round(record.tenor / 12) || "" : "...................."} tahun/ ${record ? record.tenor || "" : "...................."} bulan, guna keperluan (lingkari yang diinginkan penggunaannya dibawah ini *): </p>
    <div class="flex gap-4 justify-between px-4 my-1">
      <div class="flex-1 flex flex-col">
      ${[
        { key: "a", value: "Perbaikan Rumah" },
        { key: "b", value: "Pembelian Tanah/Kavling " },
        { key: "c", value: "Pembelian Kendaraan " },
      ]
        .map((item) => {
          return `
          <div class="flex gap-2">
            <p class="w-4">${item.key}.</p>
            <p>${item.value}</p>
          </div>
        `;
        })
        .join("")}
      </div>
      <div class="flex-1 flex flex-col">
      ${[
        { key: "d", value: "Pembelian Barang Elektronik" },
        { key: "e", value: "Biaya Pendidikan" },
        {
          key: "f",
          value: "Biaya Lainnya .........................................",
        },
      ]
        .map((item) => {
          return `
          <div class="flex gap-2">
            <p class="w-4">${item.key}.</p>
            <p>${item.value}</p>
          </div>
        `;
        })
        .join("")}
      </div>
    </div>

    <div class=" flex gap-1">
      <p class="w-48">Besarnya Gaji</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 flex gap-2"><p class="w-44 border-b border-dashed border-gray-800">Rp. ${record ? IDRFormat(record.salary) : ""}</p>/bulan (perincian terlampir) </div>
    </div>
    <div class=" flex gap-1">
      <p class="w-48">Pendapatan Lain</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 flex gap-2"><p class="w-44 border-b border-dashed border-gray-800">Rp. </p>/bulan (perincian terlampir) </div>
    </div>
    <div class="  flex gap-1">
      <p class="w-48">Total Pendapatan</p>
      <p class="w-4">:</p>
      <div class="flex-1 pl-2 flex gap-2"><p class="w-44 border-b border-dashed border-gray-800">Rp. </p></div>
    </div>
    
    <div class="flex gap-4 justify-between">
      <div class="flex-1">
        <p>Rekening pada BPR Amal Bhakti Sejahtera</p>
        <p>Tabungan No: .................................................</p>
      </div>
      <div class="flex-1">
        <p>Rekening Pada Bank Lain: </p>
        <p>Tabungan No: ${record ? `<span class="border-b border-dashed border-gray-800">${record.Debitur.account_number}</span>` : "................................................."}</p>
      </div>
    </div>
    <div class="flex gap-4 justify-between mt-3 mb-2">
      <div class="flex-1">
        <p class="underline">Sisa Kewajiban/hutang pada BPR Amal Bhakti Sejahtera</p>
        <div class="flex gap-2">
          <p class="w-4">a.</p>
          <p>Sebesar Rp ${record && record.JenisPembiayaan.name.toLowerCase().includes("topup") ? `<span class="border-b border-dashed border-gray-800">${IDRFormat(record.c_takeover)}</span>` : "................................................."}</p>
        </div>
        <div class="flex gap-2">
          <p class="w-4">b.</p>
          <p>No. SPK : ............................................. </p>
        </div>
      </div>
      <div class="flex-1">
      <p class="underline">Sisa Kewajiban/hutang pada bank/pihak lain:</p>
        <div class="flex gap-2">
          <p class="w-4">a.</p>
          <p>Bank ${record?.JenisPembiayaan.name.toLocaleLowerCase().includes("takeover") && record.takeover_from?.toLowerCase().includes("bank") ? `<span class="border-b border-dashed border-gray-800">${record.takeover_from}</span> Rp. ${IDRFormat(record.c_takeover)}` : "................................................."}</p>
        </div>
        <div class="flex gap-2">
          <p class="w-4">b.</p>
          <p>Koperasi ${record?.JenisPembiayaan.name.toLocaleLowerCase().includes("takeover") && record.takeover_from?.toLowerCase().includes("koperasi") ? `<span class="border-b border-dashed border-gray-800">${record.takeover_from}</span> Rp. ${IDRFormat(record.c_takeover)}` : "................................................."}</p>
        </div>
        <div class="flex gap-2">
          <p class="w-4">c.</p>
          <p>Pihak Lain ${record && !["bank", "koperasi"].includes(record?.JenisPembiayaan.name.toLocaleLowerCase() || "") && record.takeover_from?.toLowerCase().includes("koperasi") ? `<span class="border-b border-dashed border-gray-800">${record.takeover_from}</span> Rp. ${IDRFormat(record.c_takeover)}` : "................................................."}</p>
        </div>
      </div>
    </div>
    
    <p>Selain kewajiban yang tersebut diatas, saya tidak memiliki kewajiban pada pihak lain.</p>
    <p>Saya akan tunduk/patuh terhadap segala ketentuan kredit yang berlaku di BPR Amal Bhakti Sejahtera, apabila permohonan Kredit ini disetujui.</p>
    <p>Demikian surat permohonan ini saya buat dengan sebenarnya, dan jika dikemudian hari data-data yang saya sampaikan ke BPR Amal Bhakti Sejahtera dikemudian hari tidak benar, maka segala akibat dan resiko menjadi tanggung jawab saya selaku pemohon.</p>

    <div class="flex flex-row gap-10 justify-center mt-5 text-center">
      <div class="w-64">
        <p class="h-5"> </p>
        <p class="h-5"> </p>
        <div class="border-b border-dashed border-gray-800 w-full mt-20"></div>
        <p>Suami/Istri</p>
      </div>
      <div class="w-64">
        <p class="min-h-5">${record ? (record.city || record?.Debitur.city)?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase() : "............................."}, ${record ? moment(record?.created_at).format("DD-MM-YYYY") : "........................................."}</p>
        <p class="h-5">Pemohon</p>
        <div class="border-b border-dashed border-gray-800 w-full mt-20">${record ? record.Debitur.fullname : ""}</div>
      </div>
    </div>
    <p class="mt-4">*) Lingkari yang diperlukan</p>

  </div>
  `;
};
