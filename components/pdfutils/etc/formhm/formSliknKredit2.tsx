import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";

export const FormSliknKredit2 = (record: IDapem) => {
  return `
  <div class="px-8 py-5">

    <div class="border-t border-b border-gray-800 py-1 my-2 font-bold">
      <p>DATA PERMOHONAN KREDIT</p>
    </div>
    <div class="flex flex-col gap-1">
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-48">Kebutuhan Dana</p>
          <p class="w-2">:</p>
          <div class="flex-1">
            ${FormCheck(false, "w-full", "Rp. ", "flex items-center pl-3", true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-48">Biaya Sendiri</p>
          <p class="w-2">:</p>
          <div class="flex-1">
            ${FormCheck(false, "w-full", "Rp. ", "flex items-center pl-3", true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-48">Jumlah pinjaman yang diajukan</p>
          <p class="w-2">:</p>
          <div class="flex-1">
            ${FormCheck(false, "w-full", `Rp. ${IDRFormat(record.plafond)}`, "flex items-center pl-3", true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px">
          <p class="w-40">Jangka waktu Peminjaman</p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-2 items-center">
            ${FormCheck(false, "w-full", record.tenor.toString(), "flex items-center pl-3", true)} Bulan
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-4">
          <p class="flex-1 ">Apakah anda pernah memiliki Pinjaman di BPR HARTA MULIA ?</p>
          <p class="w-4"></p>
          <div class="flex gap-8" style="width: 280px">
            <div class="flex gap-1">${FormCheck(record.JenisPembiayaan.name.replaceAll(" ", "").toLowerCase() !== "topup" ? true : false)} Tidak</div>
            <div class="flex gap-1">${FormCheck(record.JenisPembiayaan.name.replaceAll(" ", "").toLowerCase() === "topup" ? true : false)} Ya, Tahun ______</div>
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-4">
          <p class="flex-1">Apakah anda memiliki Pinjaman di Bank lain atau perusahaan keuangan lainya ?</p>
          <p class="w-4"></p>
          <div class=" flex gap-8" style="width: 280px">
            <div class="flex gap-1">${FormCheck(!["takeover", "mutasitakeover"].includes(record.JenisPembiayaan.name.replaceAll(" ", "").toLowerCase()) ? true : false)} Tidak</div>
            <div class="flex gap-1">${FormCheck(["takeover", "mutasitakeover"].includes(record.JenisPembiayaan.name.replaceAll(" ", "").toLowerCase()) ? true : false)} Ya,</div>
          </div>
        </div>
      </div>
      <div class=" flex gap-4 ml-6">
        <div class="flex-1 flex gap-4">
          <p class="w-48">Jika "Ya", dimana?</p>
          <p class="w-2"></p>
          <div class="flex-1">
            ${FormCheck(false, "w-full", record.takeover_from, undefined, true)}
          </div>
        </div>
      </div>
      <div class="flex gap-4 ml-10">
        <div class="flex-1 flex gap-4">
          <p class="w-44">Keperluan</p>
          <p class="w-2"></p>
          <div class="flex-1">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
      </div>
      <div class=" flex gap-4 ml-10">
        <div class="flex-1 flex gap-4">
          <p class="w-44">Besar Pinjaman</p>
          <p class="w-2"></p>
          <div class="flex-1">
            ${FormCheck(false, "w-full", `Rp. ${record.c_takeover ? IDRFormat(record.c_takeover) : ""}`, undefined, true)}
          </div>
        </div>
        <div class="flex gap-4" style="width:280px;">
          <p class="w-36">Besar Angsuran/Bln</p>
          <p class="w-2"></p>
          <div class="flex-1">
            ${FormCheck(false, "w-full", `Rp. `, undefined, true)}
          </div>
        </div>
      </div>
      <div class="flex gap-4 ml-10">
        <div class="flex-1 flex gap-4">
          <p class="w-44">Berapa Lama Sisa Angsuran</p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-4">
            ${FormCheck(false, "w-full", undefined, undefined, true)} Bulan
          </div>
        </div>
      </div>
      
    </div>

    <div class="border-t border-b border-gray-800 py-1 my-2 font-bold">
      <p>DATA AGUNAN/JAMINAN KREDIT</p>
    </div>
    <div class="flex flex-col gap-1">
      <p>A. TANAH & BANGUNAN</p>
      <div class="flex gap-2 ml-4">
        <p class="w-40">Alamat</p>
        <p class="w-2"></p>
        <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
      </div>
      <div class="flex gap-2 ml-4">
        <div class="flex-1 flex gap-2">
          <p class="w-40">Desa/Kelurahan</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
        <div class="flex gap-2" style="width:280px">
          <p class="w-28">Kecamatan</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
      </div>
      <div class="flex gap-4 ml-4">
        <div class="flex-1 flex gap-2">
          <p class="w-40">Kabupaten/Kotamadya</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
        <div class="flex gap-2" style="width:280px">
          <p class="w-28">Propinsi</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
      </div>
      <div class="flex gap-4 ml-4">
        <div class="flex-1 flex gap-2">
          <p class="w-40">Status Kepemilikan</p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-2">
            <div class="flex gap-1">${FormCheck(false)} Hak Milik</div>
            <div class="flex gap-1">${FormCheck(false)} Hak Guna Bangunan</div>
          </div>
        </div>
        <div class="flex gap-2" style="width:280px">
          <p class="w-28">Nomor</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
      </div>
      <div class="flex gap-4 ml-4">
        <div class="flex-1 flex gap-2">
          <p class="w-40">Luas Tanah</p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-2">${FormCheck(false, "w-full", undefined, undefined, true)} m</div>
        </div>
        <div class="flex gap-2" style="width:280px">
          <p class="w-28">Luas Bangunan</p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-2">${FormCheck(false, "w-full", undefined, undefined, true)} m</div>
        </div>
      </div>
      <div class="flex gap-2 ml-4">
        <p class="w-40">Atas nama</p>
        <p class="w-2"></p>
        <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
      </div>
      <div class="flex gap-2 ml-4">
        <p class="w-40">IMB No</p>
        <p class="w-2"></p>
        <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
      </div>
      <div class="flex gap-2 ml-4">
        <p class="w-48">Nilai Agunan menurut pemohon</p>
        <p class="w-2"></p>
        <div class="flex-1">${FormCheck(false, "w-full", "Rp. ", "pl-3 flex items-center", true)}</div>
      </div>
      <p class="mt-2">B. KENDARAAN BERMOTOR</p>
      <div class="flex gap-2 ml-4">
        <div class="flex-1 flex gap-2">
          <p class="w-40">Jenis Kendaraan</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
        <div class="flex gap-2" style="width:200px">
          <p class="w-20">Merk</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
        <div class="flex gap-2" style="width:200px">
          <p class="w-20">Type</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
      </div>
      <div class="flex gap-2 ml-4">
        <div class="flex-1 flex gap-2">
          <p class="w-40">Tahun Pembuatan</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
        <div class="flex gap-2" style="width:200px">
          <p class="w-20">No. Polisi</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
        <div class="flex gap-2" style="width:200px">
          <p class="w-20">Warna</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
      </div>
      <div class="flex gap-4 ml-4">
        <div class="flex-1 flex gap-2">
          <p class="w-40">Nomor Rangka</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
        <div class="flex gap-2" style="width:280px">
          <p class="w-28">Nomor Mesin</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
      </div>
      <div class="flex gap-4 ml-4">
        <div class="flex-1 flex gap-2">
          <p class="w-40">Atas Nama</p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-2">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
        <div class="flex gap-2" style="width:280px">
          <p class="w-28">No. BPKB</p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-2">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
      </div>
      <div class="flex gap-2 ml-4">
        <p class="w-48">Nilai Agunan menurut pemohon</p>
        <p class="w-2"></p>
        <div class="flex-1">${FormCheck(false, "w-full", "Rp. ", "pl-3 flex items-center", true)}</div>
      </div>

      <p class="mt-2">C. Lainnya</p>
      <div class="flex gap-2 ml-4">
        <div class="flex-1 flex gap-2">
          <p class="w-40">ATM No</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
        <div class="flex gap-2" style="width:280px">
          <p class="w-28">Jamsostek No</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
      </div>
      <div class="flex gap-2 ml-4">
        <div class="flex-1 flex gap-2">
          <p class="w-40">Bank Penerbit</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
        <div class="flex gap-2" style="width:280px">
          <p class="w-28">Atas Nama</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
      </div>
      <div class="flex gap-4 ml-4">
        <div class="flex-1 flex gap-2">
          <p class="w-40">No. Rekening</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
        <div class="flex gap-2" style="width:280px">
          <p class="w-28">Saldo Terakhir</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
      </div>
      <div class="flex gap-4 ml-4">
        <div class="flex-1 flex gap-2">
          <p class="w-40">Atas Nama</p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-2">${FormCheck(false, "w-full", undefined, undefined, true)}</div>
        </div>
      </div>
      <div class="ml-4">${FormCheck(false, "w-full", undefined, "flex pl-3 items-center", true)}</div>
      <div class="ml-4">${FormCheck(false, "w-full", undefined, "flex pl-3 items-center", true)}</div>
      <div class="ml-4">${FormCheck(false, "w-full", undefined, "flex pl-3 items-center", true)}</div>
      <div class="ml-4">${FormCheck(false, "w-full", undefined, "flex pl-3 items-center", true)}</div>
      <div class="ml-4">${FormCheck(false, "w-full", undefined, "flex pl-3 items-center", true)}</div>
    </div>
    <div class="border-t border-b border-gray-800 py-1 my-2 font-bold text-center">
      <p>PERNYATAAN PEMOHON</p>
    </div>
    <div class="my-2">
      <p>Semua informasi dalam formulir ini adalah lengkap dan benar. Dengan menandatangani formulir ini, Saya mengijinkan kepada PT. BPR HARTA MULIAuntuk melakukan verifikasi SLIK ataupun verifikasi kepada pihak pihak terkait yg dipandang perlu dan memeriksa semua data dengan cara bagaimanapun yang layak menurut PT. BPR HARTA MULIA. Saya terikat dengan syarat - syarat dan ketentuan PT. BPR HARTA MULIA dan bertanggung jawab sepenuhnya untuk membayar semua kewajiban yang muncul dengan disetujuinya pinjaman ini. Saya memahami bahwa PT. BPR HARTA MULIA berhak untuk menolak permohonan ini tanpa harus memberikan alasan apapun. Berkas yang diberikan tidak dapat ditarik kembali.</p>
    </div>

    
    <div class="flex justify-center items-center text-center gap-4">
      <p class="">Tanggal</p>
      <p class="">${moment(record.created_at).format("DD")}</p>
      <p class="">/</p>
      <p class="">${moment(record.created_at).format("MM")}</p>
      <p class="">/</p>
      <p class="">${moment(record.created_at).format("YYYY")}</p>
    </div>
    <div class="flex justify-center items-center text-center">
      <p class="">Pemohon</p>
    </div>
    <div class="mt-16 flex justify-evenly items-center text-center gap-4">
      <div class="w-36 flex flex-col justify-end">
        <p class="h-4"></p>
        <p class="w-full border-t border-gray-800">AO/MARKETING/LAINNYA</p>
      </div>
      <div class="w-36 flex flex-col justify-end">
        <p>${record.Debitur.fullname}</p>
        <p class="w-full border-t border-gray-800">Pemohon</p>
      </div>
      <div class="w-36 flex flex-col justify-end">
        <p>${record.marriage_status === "KAWIN" ? record.aw_name : ""}</p>
        <p class="w-full border-t border-gray-800">Istri/Suami Pemohon</p>
      </div>
    </div>


  </div>
  `;
};

const FormCheck = (
  check: boolean,
  w?: string,
  val?: string | undefined | null,
  classstyle?: string,
  dev?: boolean,
) => {
  return `
    <div class="${w ? w : "w-4"} h-4 text-xs ${dev ? "border-b border-gray-800" : "border border-gray-800"} ${check ? "flex items-center justify-center" : classstyle ? classstyle : ""}">
      ${check ? "✓" : val ? val : ""}
    </div>
  `;
};
