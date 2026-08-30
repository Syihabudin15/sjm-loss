"use client";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";

export const FormCIF3 = (record: IDapem) => {
  return `
  <div class="border border-gray-800">
    <div class="px-2 font-bold text-white mt-1 bg-blue-700 flex">
      <div class="w-44">
        IV. PEMILIK DANA
      </div>
      <p>:</p>
      <div class="ml-4 flex gap-4">
        <div class="w-28 flex gap-1">${FormCheck(false, undefined, undefined, "border-gray-50")} Mewakili diri sendiri</div>
        <div class="flex gap-1">${FormCheck(false)} Mewakili orang lain <span class="italic">Beneficial Owner</span> atau QQ atau Data Orangtua Tabungan SIMPEL</div>
        <div class="flex gap-1">${FormCheck(false)} <span class="italic">Joint Account</span></div>
      </div>
    </div>
    <div class="px-8 py-2 flex flex-col gap-0 ">
      <p>Khusus Rekening QQ, Tabungan SIMPEL, atau Joint Account</p>
      
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Hubungan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-28">Khusus untuk <span class="italic">Joint Account</span></p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            <div class="w-28 flex gap-1 items-center">${FormCheck(false)} OR</div>
            <div class="flex gap-1 items-center">${FormCheck(false)} AND</div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nama</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Alamat</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">No ID</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex">
            ${["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""].map((p) => FormCheck(false))}
          </div>
        </div>
        <div class="flex gap-2" style="width: 280px;">
          <p class="w-28">Pekerjaan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Nama Usaha / Tempat Bekerja</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width: 280px;">
          <p class="w-28">Penghasilan Pertahun</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Alamat Usaha / Tempat Bekerja</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${["PT/Persero", "Instansi", "Koperasi", "Yayasan", "CV", "Perkumpulan", "............"].map((p, i) => `<div class="w-20 flex gap-1">${FormCheck(false)} ${p}</div>`).join("")}
        </div>
      </div>
    </div>

    <div class="px-2  font-bold text-white mt-1 bg-blue-700">
      V. INFORMASI AHLI WARIS *
    </div>
    <div class="px-8 py-2 flex flex-col gap-0 ">      
      <div class="flex gap-2">
        <p class="w-36">Nama</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full", record.aw_name, "pl-3 flex items-center")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Hubungan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.aw_relate, "pl-3 flex items-center")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-28">Tempat/Tgl. Lahir</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", `${record.aw_birthplace}, ${moment(record.aw_birthdate).format("DD-MM-YYYY")}`, "pl-3 flex items-center")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Alamat</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full", `${record.aw_address}, KELURAHAN ${record.aw_ward}, KECAMATAN ${record.aw_district}, ${record.aw_city}, ${record.aw_province} ${record.aw_pos_code}`, "pl-3 flex items-center")}
        </div>
      </div>
    </div>
    
    <div class="px-2 font-bold text-white mt-1 bg-blue-700">
      VI. HUBUNGAN DENGAN BANK
    </div>
    <div class="px-8 py-2 flex flex-col gap-0 ">      
      <div class="flex gap-8">
        <div class="flex-1 flex gap-4">
          <div class="flex gap-1">${FormCheck(false)} Tidak Ada</div>
          <div class="flex gap-1">${FormCheck(false)} Ada</div>
        </div>
        <div class="flex gap-2" style="width: 400px;">
          <p class="w-28">Keterangan Hubungan</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full")}</div>
        </div>
      </div>
    </div>
    <div class="px-2  font-bold text-white mt-1 bg-blue-700">
      VI. HUBUNGAN DENGAN BANK
    </div>
    <div class="px-8 py-2 flex flex-col gap-0">      
      <div class="flex gap-8">
        <div class="flex-1 flex gap-4">
          <div class="flex gap-1">${FormCheck(false)} Tidak Ada</div>
          <div class="flex gap-1">${FormCheck(false)} Ada</div>
        </div>
        <div class="flex gap-2" style="width: 400px;">
          <p class="w-28">Keterangan Hubungan</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full")}</div>
        </div>
      </div>
    </div>

    <div class="px-2 font-bold text-white mt-1 bg-blue-700">
      VIII. CHECKLIST KELENGKAPAN DOKUMEN
    </div>
    <div class="px-8 py-2 flex flex-col gap-0">      
      <div class="flex gap-8">
        <div class="flex-1 flex flex-col gap-1">
          <div class="flex gap-1">${FormCheck(true)} Fotocopy Kartu Identitas</div>
          <div class="flex gap-1">${FormCheck(true)} Fotocopy Paspor/KITAS/Lainnya</div>
          <div class="flex gap-1">${FormCheck(true)} Fotocopy Kartu Keluarga</div>
          <div class="flex gap-1">${FormCheck(record.plafond > 50000000 ? true : false)} Fotocopy NPWP</div>
        </div>
        <div class="flex gap-2" style="width: 400px;">
          <p class="w-28">Informasi Lain Terkait</p>
          <p class="w-2"></p>
          <div class="flex-1">${FormCheck(false, "w-full h-full")}</div>
        </div>
      </div>
    </div>

    <div class="px-2 font-bold text-white mt-1 bg-blue-700">
      IX. CONTOH TANDA TANGAN NASABAH
    </div>
    <div class="px-8 py-2 flex flex-col gap-0">      
      <div class="flex gap-8">
        <div class="flex-1 flex flex-wrap">
          ${FormCheck(false, "w-1/2 h-16", "1.", "pl-3")}
          ${FormCheck(false, "w-1/2 h-16", undefined, "pl-3")}
          ${FormCheck(false, "w-1/2 h-16", "2.", "pl-3")}
          ${FormCheck(false, "w-1/2 h-16", undefined, "pl-3")}
        </div>
        <div class="flex flex-col gap-1" style="width: 250px;">
          <p>Keterangan Berlaku Tandatangan :</p>
          <div class="flex gap-1">${FormCheck(false)} Satu</div>
          <div class="flex gap-1">${FormCheck(true)} Dua</div>
          <div class="flex gap-1">${FormCheck(false)} Salah Satu</div>
          <div class="flex gap-1">${FormCheck(false)} .........................</div>
        </div>
      </div>
    </div>

    <div class="px-2 font-bold text-white mt-1 bg-blue-700">
      X. PERSETUJUAN NASABAH
    </div>
    <div class="px-8 py-2 flex flex-col gap-0">      
      <p>Dengan ini saya/kami sebagai pemohon, selanjutnya disebut "Nasabah" Menyatakan</p>
      <div class="flex gap-2">
        <p>1.</p>
        <p>Bahwa seluruh data pada Formulir Pembukaan Tabungan ini adalah benar.</p>
      </div>
      <div class="flex gap-2">
        <p>2.</p>
        <p>PT BPR Harta Mulia berhak melakukan pemeriksaan terhadap kebenaran data yang Nasabah berikan.</p>
      </div>
      <div class="flex gap-2">
        <p>3.</p>
        <p>PT BPR Harta Mulia selanjutnya disebutkan "Bank" telah memberikan penjelasan yang cukup mengenai karakteristik produk yang dimaksud terman karakteristik produk yang dimaksud termasuk manfaat, risiko dan blaya-biaya yang melekat dan Nasabah telah membaca,mengerti, dan menyetujui isi ketentuan-ketentuan dan klausula-klausula yang terkait dengan produk yang Nasabah ajukan seperti tertuang dalam Ketentuan Umum dan Persyaratan Pembukaan Rekening. Ketentuan yang berlaku namun tidak terbatas pada pembatasan transakai, pemblokiran maupun penutupan terhadap rekening tersebut.</p>
      </div>
      <div class="flex gap-2">
        <p>4.</p>
        <p>Memberikan kuasa kepada Bank yang tidak dapat dibatalkan secara sepihak oleh Nasabah seauat dengan pasal 1813 Kitab Undang-Undang Hukum Perdata, untuk :</p>
      </div>
      <div class="flex gap-2 ml-4">
        <p>a.</p>
        <p>mendebet rekening Nasabah dalam rangka pembayaran maupun beban yang timbul dari produk maupun konsekuensinya.</p>
      </div>
      <div class="flex gap-2 ml-4">
        <p>b.</p>
        <p>melakukan pemblokiran rekening jika diindikasikan telah terjadi penyalahgunaan rekening dan/atau oleh sebab-sebab lainnya.</p>
      </div>
      <div class="flex gap-2">
        <p>5.</p>
        <p>Tunduk pada syarat dan ketentuan yang berlaku pada PT BPR Harta Mulia sebagaimana yeng tertuang pada butir 3, yang merupakan bagian dan menjadi satu kesatuan yang tidak terpisahkan dari formulir ini. Apabila terdapat perubahan dan penambahan terkait syarat den ketentuen, Bank akan memberikan informasi kepada Nasabah sesuai dengan ketentuan yang berlaku.</p>
      </div>
      <div class="flex gap-2">
        <p>6.</p>
        <p>Apabila Nasabah memberikan data, informasi, dan/atau dokumen yang tidak sesuai dengan kondisi yang sebenarnya atau palsu atau Bank menduga adanya tindak penipuan atau pelanggaran terhadap undang-undang maka PT BPR Harta Mulia berhak melakukan tindakan yang dianggap perlu sesuai dengan ketentuan yang berlaku namun tidak terbatas pada pembatasan transaksi, pemblokiran maupun penutupan terhadap rekening tersebut.</p>
      </div>
      <div class="flex gap-2">
        <p>7.</p>
        <p>Apabila terdapat terdapat keberatan dari Nasabah atas penyelesaian pengaduan eleh pihak Bank maka penyelesaiannya dapat dilakukan melalui Aplikasi Portal Perlindungan Konsumen.</p>
      </div>
      <div class="flex gap-2">
        <p>8.</p>
        <p>PT BPR Harta Mulia mempunyai hak untuk menerima atau menolak permohonan Nasabah tanpa menyebutkan alasan-alasannya.</p>
      </div>
      <div class="flex gap-2">
        <p>9.</p>
        <p>Dalam rangka memenuhi ketentuan peraturan Lembaga Penjamin Simpanan (LPS) tentang simpanan yang dijamin LPS. Nasabah bersedia menerima risiko bahwa klaim penjaminan atas simpanan tidak akan dibayarkan apabila simpanan tidak memenuhi ketentuan yang ditetapkan eleh LPS. Nasabah menyatakan mengetahui bahwa nilai simpanan paling tinggi milik saya/kami yang dijamin ditentukan dalam ketentuan LRS yang berlaku (Maksimal  2 Miliar) dan apabila saya/kami memperoleh bunga simpanan yang melebihi suku bunga wajar yang ditetapkan oleh LPS, maka simpanan tersebut tidak dijamin pleh LPS secara keseluruhan (baik pokok maupun bunga).</p>
      </div>
      <div class="flex gap-2">
        <p>10.</p>
        <p>Bahwa tujuan pembukaan rekening atau seluruh simpanan bukan berasal dari tindak pidana pencucian uang (money laundering). Apabila dikemudian hari ternyata terbukti bahwa dana simpanan hasil dari tindakan pidana korupsi/pencucian uang. Nasabah/Pemilik Rekening simpanan bersedia untuk tunduk pada peraturan perundang-undangan yang berlaku yaitu Undang Undang Perbankan dan Undang Undang Tindak Pidana Pencucian Uang UU TPPU.</p>
      </div>
    </div>

    <div class="flex justify-end mr-32">
      <div class="w-40 flex flex-col gap-14 items-center justify-center text-center">
        <div class="w-full border-b border-gray-800 border-dashed">${record.Debitur.city?.toLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.created_at).format("DD-MM-YYYY")}</div>
        <div class="w-full">
          <div class="border-b border-gray-800">${record.Debitur.fullname}</div>
          <div>Tanda Tangan Nasabah dan Nama</div>
        </div>
      </div>
    </div>

    <div class="px-2 font-bold text-white mt-1 bg-blue-700 text-center">
      VALIDASI BANK
    </div>
    <div class="px-32 py-2 flex justify-center text-center">
      <div class="flex-1 flex flex-col gap-16 border border-gray-800 ">
        <p>Petugas Pelaksana</p>
        <div>
          <p></p>
          <p class="border-t border-gray-800">Tanda Tangan dan Nama Lengkap</p>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-16 border border-gray-800">
        <p>Diperiksa</p>
        <div>
          <p></p>
          <p class="border-t border-gray-800">Tanda Tangan dan Nama Lengkap</p>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-16 border border-gray-800">
        <p>Disetujui</p>
        <div>
          <p></p>
          <p class="border-t border-gray-800">Tanda Tangan dan Nama Lengkap</p>
        </div>
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
) => {
  return `
    <div class="${w ? w : "w-4"} ${val ? "" : "h-4"} text-xs border border-gray-800 ${check ? "flex items-center justify-center" : classstyle ? classstyle : ""}">
      ${check ? "✓" : val ? val : ""}
    </div>
  `;
};
