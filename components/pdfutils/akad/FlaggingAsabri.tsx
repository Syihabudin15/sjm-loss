import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { ListNonStyle, ListStyle } from "../utils";
// import { GetDetailDapem } from "@/components/utils/PembiayaanUtil";
moment.locale("id");

export const FLaggingAsabri = (record: IDapem) => {
  // const angsuran = GetDetailDapem(record).angsuran;

  return `
  
  <img src="/images/asabri.png" alt="Asabri Logo" width="100" style="filter: grayscale(100%);" />

  <p class="font-semibold text-center mt-2">SURAT PERNYATAAN PEMBAYARAN PENSIUN MELALUI REKENING (SP3R)</p>
  <p class="font-semibold text-center mb-2">DAN KUASA PENGELOLAAN REKENING PEMBAYARAN PENSIUN</p>
  
  <div class="my-2">
    <p>Data Peserta:</p>
  ${ListStyle(
    [
      `${ListNonStyle([{ key: "Nama Peserta", value: "", valuStyle: "border-b border-dashed border-gray-700" }])}`,
      `${ListNonStyle([
        {
          key: "NRP/NIP",
          value: "",
          valuStyle: "border-b border-dashed border-gray-700",
        },
      ])}`,
      `${ListNonStyle([{ key: "Pangkat", value: record.Debitur.rank_skep, valuStyle: "border-b border-dashed border-gray-700" }])}`,
      `${ListNonStyle([{ key: "NIK", value: "", valuStyle: "border-b border-dashed border-gray-700" }])}`,
      `${ListNonStyle([{ key: "Nomor Pensiun", value: record.Debitur.nopen, valuStyle: "border-b border-dashed border-gray-700" }])}`,
    ],
    "number",
  )}
  </div>
  <div class="my-2">
    <p>Yang bertanda tangan di bawah ini:</p>
  ${ListStyle(
    [
      `${ListNonStyle([{ key: "Nama Penerima Pensiun", value: record.Debitur.fullname, valuStyle: "border-b border-dashed border-gray-700" }])}`,
      `${ListNonStyle([
        {
          key: "NIK",
          value: record.Debitur.nik,
          valuStyle: "border-b border-dashed border-gray-700",
        },
      ])}`,
      `${ListNonStyle([{ key: "Hubungan dengan Peserta", value: "Sebagai Yang Bersangkutan / istri/suami / orang tua / anak / wali *) pilih salah satu" }])}`,
      `${ListNonStyle([{ key: "Nomor Pensiun", value: record.Debitur.nopen, valuStyle: "border-b border-dashed border-gray-700" }])}`,
      `${ListNonStyle([
        {
          key: "Alamat lengkap",
          value: "",
          valuStyle: "border-b border-dashed border-gray-700",
        },
        {
          key: "Jalan",
          value: record.Debitur.address.split("RT")[0],
          valuStyle: "border-b border-dashed border-gray-700",
        },
        {
          key: "RT/RW",
          value: record.Debitur.address
            .split("RT")[1]
            .replace("RW", "")
            .split(" ")
            .map((item) => item.trim())
            .join("/"),
          valuStyle: "border-b border-dashed border-gray-700",
        },
        {
          key: "Kelurahan",
          value: record.Debitur.ward,
          valuStyle: "border-b border-dashed border-gray-700",
        },
        {
          key: "Kecamatan",
          value: record.Debitur.district,
          valuStyle: "border-b border-dashed border-gray-700",
        },
        {
          key: "Kabupaten/Kodya",
          value: `
            <div class="flex gap-2">
              <div class="w-56 border-b border-dashed border-gray-700">${record.Debitur.city}</div>
              <div class="flex-1 flex gap-2">
                <div class="w-32">Kode Pos</div>
                <div class="w-2">:</div>
                <div class="flex-1 border-b border-dashed border-gray-700">${record.Debitur.pos_code || ""}</div>
              </div>
            </div>
          `,
        },
        {
          key: "Provinsi",
          value: `
          <div class="flex gap-2">
              <div class="w-56 border-b border-dashed border-gray-700">${record.Debitur.province}</div>
              <div class="flex-1 flex gap-2">
                <div class="w-32">Nomor Telepon/HP</div>
                <div class="w-2">:</div>
                <div class="flex-1 border-b border-dashed border-gray-700">${record.Debitur.phone || ""}</div>
              </div>
            </div>`,
        },
      ])}`,
      `${ListNonStyle([
        {
          key: "Bank/Giro",
          value: `
            <div class="flex gap-2">
              <div class="w-56 border-b border-dashed border-gray-700"></div>
              <div class="flex-1 flex gap-2">
                <div class="w-32">Nomor Rekening</div>
                <div class="w-2">:</div>
                <div class="flex-1 border-b border-dashed border-gray-700"></div>
              </div>
            </div>`,
        },
      ])}`,
    ],
    "number",
  )}
  </div>

  <div class="my-2" style="font-size: 10px; line-height: 1.2">
    <p>Sehubungan dengan pembayaran pensiun melalui rekening tersebut di atas, dengan ini saya menyatakan:</p>
    ${ListStyle(
      [
        `Memberi persetujuan kepada PT ASABRI (Persero) maupun kepada BANK/GIRO ................................. untuk melakukan pemrosesan data pribadi saya termasuk namun tidak terbatas pada penyerahan data pribadi saya untuk proses penegakan hukum kepada aparat penegak hukum maupun untuk dipertunjukkan di dalam pengadilan baik untuk perkara pidana maupun perdata.`,
        `Memberi kuasa dengan hak substitusi kepada Mitra Kerja Pembayaran Pensiun PT ASABRI (Persero) untuk mendebet rekening saya dan untuk mengembalikan seluruh kelebihan pembayaran uang pensiun yang bukan merupakan hak saya atau ahli waris menurut ketentuan PT ASABRI (Persero)`,
        `Memberi kuasa dengan hak substitusi kepada BANK/GIRO ................................. khusus untuk memberi keterangan/informasi/data mengenai simpanan saya dan data diri saya sebagai nasabah penyimpanan termasuk namun tidak terbatas pada NIK, status perkawinan, status pekerjaan, dan status rekening kepada PT ASABRI (Persero)`,
        `Kuasa sebagaimana tersebut pada butir 2 di atas , tidak akan berakhir selama kewajiban saya atau ahli waris saya untuk mengembalikan kelebihan pembayaran pensiun yang bukan merupakan hak saya atau ahli waris saya menurut ketentuan PT ASABRI (Persero) belum dilakukan sepenuhnya maupun oleh sebab - sebab yang tercantum pada Pasal 1813 Kitab Undang - Undang Hukum Perdata.`,
        `Akan melaporkan ke Kantor Cabang PT ASABRI (Persero) terdekat apabila terjadi perubahan data susunan keluarga, status perkawinan, alamat, ataupun perubahan data lainnya.`,
        `Segala kelebihan/keterlanjuran bayar pensiun yang saya terima sepenuhnya menjadi tanggung jawab saya dan/atau ahli waris, unt uk dikembalikan kepada PT ASABRI (Persero), yang disebabkan oleh namun tidak terbatas pada :
        <div class="flex justify-between gap-4">
          <div class="flex-1 flex gap-4">
            <div class="w-4">a. </div>
            <div class="flex-1">
              <p>Keterlanjuran gaji pensiun karena keterlambatan pelaporan:</p>
              <ol class="list-decimal">
                <li class="[counter-increment:item] before:content-[counter(item)')_'] ">
                  penerima pensiun meninggal dunia,
                </li>
                <li class="[counter-increment:item] before:content-[counter(item)')_'] ">
                  penerima pensiun diangkat kembali menjadi ASN,
                </li>
                <li class="[counter-increment:item] before:content-[counter(item)')_'] ">
                  penerima pensiun menjalani hukuman 3 (tiga) bulan atau lebih,
                </li>
                <li class="[counter-increment:item] before:content-[counter(item)')_'] ">
                  penerima pensiun wari/janda/duda menikah kembali,
                </li>
                <li class="[counter-increment:item] before:content-[counter(item)')_'] ">
                  penerima tunjangan yatim piatu menikah atau bekerja dalam lingkungan Pemerintah atau mendapatkan tunjangan ikatan dinas atau bea-siswa yang menjadi beban Anggaran Negara.
                </li>
              </ol>
            </div>
          </div>
          <div class="flex-1 flex gap-4">
            <div class="w-4">b. </div>
            <div class="flex-1">
              <p>Keterlanjuran tunjangan karena keterlambatan pelaporan:</p>
              <ol class="list-decimal">
                <li class="[counter-increment:item] before:content-[counter(item)')_'] ">
                  istri/suami/anak yang masuk dalam tunjangan meninggal dunia,
                </li>
                <li class="[counter-increment:item] before:content-[counter(item)')_'] ">
                  istri/suami bercerai,
                </li>
                <li class="[counter-increment:item] before:content-[counter(item)')_'] ">
                  anak menikah atau bekerja dalam lingkungan Pemerintah atau mendapatkan tunjangan ikatan dinas atau bea-siswa yang menjadi beban Anggaran Negara.
                </li>
              </ol>
            </div>
          </div>
        </div>`,
        `Pembayaran pensiun saya melalui rekening bank/giro sebagaimana yang tercantum dalam Surat Pernyataan ini tidak memiliki permasalahan kredit dengan Mitra Kerja Pembayaran Pensiun PT ASABRI (Persero) lainnya.`,
        `Pernyataan ini saya buat dengan sebenar - benarnya dan saya akan bertanggung jawab penuh secara hukum atas segala ketidaksesuaian dengan pernyataan ini.`,
      ],
      "number",
    )}
  </div>
  <p class="mt-2">Dengan surat pernyataan ini dibuat, untuk dapat dipergunakan sebagaimana mestinya.</p>

  <div class="my-2 flex justify-between items-start mx-4 gap-8">
    <div class="flex-1 border border-gray-700 p-2 font-bold">
      <p class="text-center">PERHATIAN!!!</p>
      <p>Barang Siapa yang memberikan keterangan tidak benar atau memalsukan keterangan ini akan dituntut sesuai peraturan perundang-undangan yang berlaku</p>
    </div>
    <div class="flex-1 px-10 text-center">
      <p>${"......................,....................................."}</p>
      <p>Yang Menyatakan</p>
      <div class="h-14 flex flex-col items-center justify-center text-xs opacity-70"></div>
      <div class="border-b border-dashed border-gray-700 font-bold flex justify-between">
        <p>(</p>
        <p class="flex-1 text-center">${record.Debitur.fullname}</p>
        <p>)</p>
      </div>
      <p>Nama Jelas & Tanda Tangan</p>
    </div>
  </div>

  <div class="text-xs">
    <p class="font-bold">Disampaikan : </p>
    <ul class="list-item list-none list-inside">
      <li>Lembar I untuk Bank / Giro</li>
      <li>Lembar II untuk Kantor C abang PT ASABRI (Persero )</li>
      <li>Lembar III untuk penerima Pensiun</li>
    </ul>
  </div>

`;
};
