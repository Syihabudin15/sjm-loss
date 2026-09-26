import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { ListNonStyle, ListStyle } from "../utils";
moment.locale("id");

export const FLagging = (record: IDapem) => {
  return `
  
  <div class="flex justify-between gap-8 items-center -mt-10" >
    <div class="flex-1">
      <img src="${record.PayOffice.logo}" alt="${record.PayOffice.name + ` Logo`}" class="h-16 mr-4"/>
    </div>
  </div>

  <p class="font-bold text-lg text-center mt-2">SURAT PERNYATAAN DEBITUR</p>
  
  <div class="my-2">
    <p>Yang bertandatangan di bawah ini  :</p>
  ${ListStyle(
    [
      `${ListNonStyle([{ key: "Nama PNS / Pensiunan", value: record.Debitur.fullname, valuStyle: "border-b border-dashed border-gray-700" }])}`,
      `${ListNonStyle([
        {
          key: "Nomor Induk Kependudukan",
          value: `
        <div class="flex gap-2">
          <div class="w-56 border-b border-dashed border-gray-700">${record.Debitur.nik}</div>
          <div class="flex-1 flex gap-2">
            <div class="w-28">NIP/Notas</div>
            <div class="w-2">:</div>
            <div class="flex-1 border-b border-dashed border-gray-700">${record.Debitur.nopen}</div>
          </div>
        </div>
        `,
        },
      ])}`,
      `${ListNonStyle([{ key: "Tempat & Tanggal Lahir", value: `${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}`, valuStyle: "border-b border-dashed border-gray-700" }])}`,
      `${ListNonStyle([
        {
          key: "Alamat Lengkap",
          value: record.Debitur.address,
          valuStyle: "border-b border-dashed border-gray-700",
        },
        {
          key: "Kelurahan",
          value: `
        <div class="flex gap-2">
          <div class="w-56 border-b border-dashed border-gray-700">${record.Debitur.ward}</div>
          <div class="flex-1 flex gap-2">
            <div class="w-28">Kecamatan</div>
            <div class="w-2">:</div>
            <div class="flex-1 border-b border-dashed border-gray-700">${record.Debitur.district}</div>
          </div>
        </div>
        `,
        },
        {
          key: "Kabupaten/Kodya",
          value: `
        <div class="flex gap-2">
          <div class="w-56 border-b border-dashed border-gray-700">${record.Debitur.city}</div>
          <div class="flex-1 flex gap-2">
            <div class="w-28">Provinsi</div>
            <div class="w-2">:</div>
            <div class="flex-1 border-b border-dashed border-gray-700">${record.Debitur.province}</div>
          </div>
        </div>
        `,
        },
        {
          key: "Kode Pos",
          value: `
        <div class="flex gap-2">
          <div class="w-56 border-b border-dashed border-gray-700">${record.Debitur.pos_code || ""}</div>
          <div class="flex-1 flex gap-2">
            <div class="w-28">No. Handphone</div>
            <div class="w-2">:</div>
            <div class="flex-1 border-b border-dashed border-gray-700">${record.Debitur.phone || ""}</div>
          </div>
        </div>
        `,
        },
      ])}
      
      `,
    ],
    "lower",
  )}
  </div>

  <div class="my-2">
    <p>Sehubungan dengan saya mengajukan fasilitas Kredit/Pembiayaan pensiun pada MITRA PT.BANK MANDIRI TASPEN, Kantor Cabang ............................................... dengan perjanjian Kredit/Pembiayaan nomor <span class="font-bold border-b border-dashed border-gray-700">${record.no_contract}</span> maka dengan ini Saya menyatakan:</p>
    ${ListStyle(
      [
        `Bahwa manfaat THT dan/atau Pensiun saya tidak sedang dijaminkan kepada lembaga pemberi kredit manapun.`,
        `Saya dalam keadaan sadar telah mengajukan Kredit/Pembiayaan dan setuju menerima pencairan kredit dari MITRA  PT.BANK MANDIRI TASPEN sesuai perjanjian kredit yang sudah saya tandatangani`,
        `Memberi kuasa kepada PT.BANK MANDIRI TASPEN Kantor Cabang ............................................... untuk dapat melakukan pengecekan Manfaat THT dan Pensiun saya pada PT TASPEN (Persero) selama saya menjadi Nasabah pada PT.BANK MANDIRI TASPEN.`,
        `Dengan mengisi dan menandatangani surat pernyataan ini, saya menyatakan telah membaca, memahami, dan menyutujui data pribadi saya diproses oleh PT TASPEN (Persero) untuk keperluan verifikasi manfaat THT dan/atau Pensiun serta administrasi yang berkaitan dengan status saya sebagai Debitur, termasuk akses terbatas oleh PT.BANK MANDIRI TASPEN  sebagai mitra Kredit/Pembiayaan, sepanjang diperlukan dan sesuai dengan ketentuan peraturan perundang-undangan yang berlaku. Saya juga memahami bahwa saya memiliki hak atas data pribadi saya sesuai ketentuan yang berlaku, termasuk hak untuk mengakses, memperbaiki, dan/atau menarik persetujuan sepanjang tidak bertentangan dengan kewajiban hukum.`,
        `Saya mengetahui bahwa manfaat THT dan/atau Pensiun akan dibayarkan melalui BANK MANDIRI TASPEN dan tidak akan mengajukan permohonan pemindahan ke lembaga pemberi kredit lainnya kecuali saya melakukan pelunasan sebelum berakhirnya jangka waktu kredit atau sampai dengan kewajiban kredit lunas.`,
        `Dalam hal pengajuan fasilitas Kredit/Pembiayaan saya diterima, maka pembayaran manfaat:
        <div class="flex gap-8">
          <div class="flex gap-2 items-center">
            <div class="w-5 h-5 border border-gray-700"></div>
            Tabungan Hari Tua (THT)
          </div>
          <div class="flex gap-2 items-center">
            <div class="w-5 h-5 border border-gray-700"></div>
            Pensiun
          </div>
        </div>
        yang saya terima dari PT TASPEN (Persero), agar dibayarkan melalui rekening saya Nomor <span class="border-b border-dashed border-gray-700">${record.Debitur.account_number || "..................................................."}</span> atas Nama <span class="border-b border-dashed border-gray-700">${record.Debitur.account_name || "................................................................."}</span> pada PT.BANK MANDIRI TASPEN,  Kantor Cabang ........................................................... <span class="font-bold">sampai dengan Pembiayaan saya lunas/pada saat saya memasuki masa pensiun</span> (*) yaitu Tanggal <span class="border-b border-dashed border-gray-700">${moment(record.date_contract).format("DD")}</span> Bulan <span class="border-b  border-dashed border-gray-700">${moment(record.date_contract).format("MM")}</span> Tahun <span class="border-b  border-dashed border-gray-700">${moment(record.date_contract).format("YYYY")}</span> sampai dengan Tanggal <span class="border-b  border-dashed border-gray-700">${moment(record.date_contract).add(record.tenor, "month").format("DD")}</span> Bulan <span class="border-b  border-dashed border-gray-700">${moment(record.date_contract).add(record.tenor, "month").format("MM")}</span> Tahun <span class="border-b  border-dashed border-gray-700">${moment(record.date_contract).add(record.tenor, "month").format("YYYY")}</span>
        `,
      ],
      "number",
    )}
    <p class="mt-2">Demikian surat pernyataan dan kuasa ini saya buat, untuk dipergunakan sebagaimana mestinya.</p>

  <div class="my-2 flex  border border-gray-700 p-2">
    <div class="flex-1 border-r border-gray-700 px-10">
      <p>Mengetahui Mitra Flagging</p>
      <p>Jabatan: .........................................................</p>
      <div class="h-28 flex flex-col items-center justify-center text-xs opacity-70">
        <p></p>
        <p></p>
      </div>
      <div class="border-b border-dashed text-center border-gray-700 font-bold flex justify-between">
        <p>(</p>
        <p class="flex-1 "></p>
        <p>)</p>
      </div>
      <p class="text-center">Nama Terang & Tanda Tangan</p>
    </div>
    <div class="flex-1 px-10">
      <p>${".................................................,.............................................."}</p>
      <p>Yang menyatakan</p>
      <div class="h-28 flex text-center flex-col items-center justify-center text-xs opacity-70">
        <p>Materai</p>
        <p>(Sesuai Ketentuan)</p>
      </div>
      <div class="border-b border-dashed text-center border-gray-700 font-bold flex justify-between">
        <p>(</p>
        <p class="flex-1 text-center">${record.Debitur.fullname}</p>
        <p>)</p>
      </div>
      <p class="text-center">Nama Terang & Tanda Tangan</p>
    </div>
  </div>

  <div class="text-xs">
    <p class="font-bold">Catatan : </p>
    <ul class="list-item list-none list-inside">
      <li>Lembar 1 untuk ${record.Debitur.group_skep} (PERSERO)</li>
      <li>Lembar 2 untuk ${record.PayOffice.name}</li>
      <li>Lembar 3 untuk Debitur</li>
      <li>Lembar 4 untuk Arsip </li>
    </ul>
    <p>(*) coret yang tidak perlu (sesuai jenis Flagging</p>
  </div>

`;
};
