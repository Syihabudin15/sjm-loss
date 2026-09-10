import {
  GetDetailDapem,
  GetRoman,
  IDRFormat,
} from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { Header, ListStyle, NumberToWordsID } from "../utils";

export const SPKDR = (record: IDapem) => {
  const angsuran = GetDetailDapem(record).angsuran;

  return `
  ${Header("SURAT PERNYATAAN DAN KUASA DEBET REKENING (SPKDR)", `No. ${record.id}/SPKDR/${(process.env.NEXT_PUBLIC_APP_SHORTNAME || "").replace("KOPJAS", "").replace(" ", "")}/${GetRoman(moment(record.date_contract).get("month") + 1)}/${moment(record.date_contract).format("YYYY")}`, undefined, undefined, undefined)}
  
  <p>Yang bertanda tangan dibawah ini :</p>

  <div class="ml-4">
    <div class="flex gap-2">
      <p class="w-52">Nama Penerima Manfaat Pensiun</p>
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
      <p class="w-52">Pekerjaan</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.job}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">No Telepon</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.phone}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">NIP / NRP / NOPEN</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.nopen}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Alamat</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.address || record.Debitur.address}, KELURAHAN ${record.ward || record.Debitur.ward} KECAMATAN ${record.district || record.Debitur.district}, ${record.city || record.Debitur.city} ${record.province || record.Debitur.province} ${record.pos_code || record.Debitur.pos_code}</p>
    </div>
  </div>
  <p class="mt-2">Yang untuk melakukan tindakan hukum ini telah mendapat persetujuan dari suami/istri/ahli warisnya :</p>
  <div class="ml-4">
    <div class="flex gap-2">
      <p class="w-52">Nama Ahli waris</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.aw_name}</p>
    </div>
    <div class="flex gap-2">
        <p class="w-52">Nomor NIK</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.aw_nik}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Tempat/Tanggal Lahir</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.aw_birthplace}, ${moment(record.aw_birthdate).format("DD-MM-YYYY")}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Pekerjaan</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.aw_job}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Alamat</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.aw_address}</p>
    </div>
  </div>

  <p class="mt-6">Sehubungan dengan ini saya menyatakan telah mendapat pembiayaan dari ${record.ProdukPembiayaan.Sumdan.name} melalui ${process.env.NEXT_PUBLIC_APP_FULLNAME} Sebesar Rp. ${IDRFormat(record.plafond)};- (${NumberToWordsID(record.plafond)} Rupiah). atau sejumlah yang disetujui, serta sesuai dengan surat Perjanjian Pembiayaan nomor ${record.no_contract} yang saya tanda tangani kemudian, yang pembayaran gaji pensiunnya dibayarkan di ${record.PayOffice.name}, maka dengan ini saya menyatakan :</p>

  <div class="ml-1">
  ${ListStyle(
    [
      `Pada saat dana pensiun saya sudah masuk ke rekening ${record.PayOffice.name}, dengan ini saya memberi kuasa kepada ${record.PayOffice.name}, untuk melakukan pemotongan dana pensiun saya untuk membayar angsuran sebesar Rp. ${IDRFormat(angsuran)} sampai dengan pinjaman/kewajiban saya lunas dan hasil potongan tersebut disetorkan ke rekening ${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_BANK} a.n ${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_NAME} dengan nomor rekening ${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_NUMBER};`,
      `Bahwa sisa gaji saya sendiri pada saat ini dan seterusnya (sampai pembiayan saya lunas) benar-benar cukup untuk dipotong sejumhlah tersebut diatas, dan jika ternyata dikemudian hari gaji saya tidak cukup jumlahnya untuk dipotong karena sebab apapun, maka berarti saya telah melakukan tindakan pidana pemalsuan data/keterangan;`,
      `Bahwa sepenuhnya dari pembiayaan yang saya ambil/terima tersebut benar-benar saya pergunakan untuk keperluan saya sendiri dan saya tidak akan mengalihkan tempat pengambilan gaji pensiun saya ketempat lain sampai dengan pembiayaan saya lunas sepenuhnya;`,
      `Bahwa saya sanggup melunasi pembiayaan saya kepada ${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_NAME}, apabila saya melakukan pernikahan yang menyebabkan tunjangan pensiun (Janda/Duda**) hilang;`,
    ],
    "number",
  )}
  </div>
  <p class="mt-2">
    Pemberian kuasa ini tidak otomatis melepaskan tanggungjawab saya terhadap kelancaran pembayaran angsuran pembiayaan tersebut sampai dengan lunas tepat waktunya, sehingga saya sebagai pihak pemberi kuasa bertanggung jawab penuh terhadap segala macam tindakan penerima kuasa yang berkaitan dengan Surat Kuasa ini. Dan saya memberikan wewenang kepada pihak ${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_NAME}, untuk membantu melakukan penagihan apabilaada keterlambatan dalam penyerahan uang hasil pemotongan gaji pensiun saya tersebut.
  </p>
  <p>Demikian Surat Pernyataan dan Kuasa ini dibuat dalam keadaan sadar dan tanpa paksaan dari pihak manapun, untuk dapat dipergunakan sebagaimana mestinya.</p>

  <div class="flex gap-10 justify-around mt-5 items-end">
    <div class="flex-1 text-center">
      <p>${(record.city || record.Debitur.city || "KOTA BANDUNG").toLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.date_contract).format("DD-MM-YYYY")}</p>
      <p>Megetahui</p>
      <div class="h-28"></div>
      <p class="border-b">${process.env.NEXT_PUBLIC_APP_AKAD_NAME}</p>
      <p>${process.env.NEXT_PUBLIC_APP_AKAD_POSITION}</p>
    </div>
    <div class="flex-1 text-center">
      <p>Pemberi Kuasa</p>
      <div class="h-28"></div>
      <p class="border-b">${record.Debitur.fullname}</p>
      <p>DEBITUR</p>
    </div>
  </div>

`;
};
