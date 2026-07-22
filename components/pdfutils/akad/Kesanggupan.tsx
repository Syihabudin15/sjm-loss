import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { Header, ListStyle } from "../utils";
import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";
moment.locale("id");

export const Kesanggupan = (record: IDapem, isFor: string) => {
  const angsuran = GetDetailDapem(record).angsuran;

  return `
  ${Header("SURAT PERNYATAAN DAN KESANGGUPAN", isFor, undefined, undefined, undefined)}
  
  <p>Yang bertanda tangan dibawah ini :</p>

  <div class="ml-4">
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
      <p class="flex-1">${record.Debitur.address}, KELURAHAN ${record.Debitur.ward} KECAMATAN ${record.Debitur.district}, ${record.Debitur.city} ${record.Debitur.province} ${record.Debitur.pos_code}</p>
    </div>
  </div>

  <p>Dengan ini menyatakan hal-hal berikut :</p>
  <div>
    ${ListStyle(
      [
        `Telah menerima fasilitas pembiayaan dari ${record.ProdukPembiayaan.Sumdan.name} melalui ${process.env.NEXT_PUBLIC_APP_FULLNAME} sebesar Rp. ${IDRFormat(record.plafond)} dengan besar angsuran Rp. ${IDRFormat(angsuran)} per bulan, selama ${record.tenor} bulan, terhitung mulai bulan ${moment(record.date_contract).format("MMMM YYYY")} sampai dengan bulan ${moment(record.date_contract).add(record.tenor, "month").format("MMMM YYYY")}.`,
        `Telah memperoleh penjelasan mengenai karakteristik kredit pensiun serta telah mengerti dan memahami segala konsekuensinya, termasuk manfaat, resiko dan biaya–biaya yang timbul terkait dengan kredit pensiun.`,
        `<div>
          <p>Bersedia mematuhi dan menyetujui ketentuan pembatalan Kredit sebagai berikut :</p>
          <div>
            ${ListStyle(
              [
                `Untuk pengajuan kredit yang telah disetujui tetapi belum dilakukan transfer dana, maka dikenakan penalti biaya administrasi pembatalan sebesar 1% dari plafon kredit.`,
                `Untuk pengajuan yang telah disetujui dan telah dilakukan transfer dana dikenakan penalti biaya administrasi sebesar 5% dari plafond kredit.`,
              ],
              "lower-alpha",
            )}
          </div>
        </div>`,
        `<div>
            <p>Bersedia mematuhi dan menyetujui ketentuan dan persyaratan pelunasan dipercepat sebagai berikut :</p>
            <div>
              ${ListStyle(
                [
                  `Pelunasan lanjut/topup dapat dilakukan setelah angsuran dimuka atau blokir angsuran terproses autodebet.`,
                  `Pelunasan lepas dapat dilakukan setelah angsuran ke 6 terproses autodebet dengan biaya administrasi sebesar 4x (empat kali) angsuran`,
                ],
                "lower-alpha",
              )}
            </div>
        </div>`,
        `Mekasinme pelunasan wajib menghubungi kantor pusat ${process.env.NEXT_PUBLIC_APP_FULLNAME} atau cabang terdekat, dan tidak diperkenankan melakukan penyetoran sejumlah uang pelunasan kepada petugas dilapangan. Apabila hal tersebut terjadi, kantor pusat ${process.env.NEXT_PUBLIC_APP_FULLNAME} tidak bertanggung jawab jika terjadi hal yang tidak diinginkan.`,
        `Apabila diperlukan bersedia untuk dilakukan pemindahan Kantor Bayar Gaji Pensiun ke Kantor Bayar Gaji Pensiun yang ditunjuk ${process.env.NEXT_PUBLIC_APP_FULLNAME}.`,
      ],
      "number",
    )}
  </div>

  <p class="my-5">Demikian surat pernyataan ini dibuat dengan sebenarnya dengan dilandasi itikad baik tanpa paksaan dari siapapun dan pihak manapun.</p>

  <div class="flex gap-10 justify-around mt-5 items-end text-center">
    <div class="flex-1"></div>
    <div class="flex-1">
      <p>${record.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.date_contract).format("DD-MM-YYYY")}</p>
      <p>Yang membuat pernyataan</p>
      <div class="h-28">
        <p class="mt-10 text-xs opacity-60">Materai</p>
      </div>
      <p class="border-b">${record.Debitur.fullname}</p>
      <p>DEBITUR</p>
    </div>
  </div>

`;
};
