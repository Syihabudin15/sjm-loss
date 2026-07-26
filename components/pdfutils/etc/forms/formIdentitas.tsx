import { IDapem } from "@/libs/IInterfaces";
import { Header, ListNonStyle } from "../../utils";
import moment from "moment";
import dayjs from "dayjs";

export const FormIdentitas = (record?: IDapem) => {
  return `
    <div>
      ${Header("SURAT KETERANGAN", "PERBEDAAN IDENTITAS", undefined, process.env.NEXT_PUBLIC_APP_LOGO, undefined)}
      <p class="mt-3">Yang bertanda tangan dibawah ini :</p>
      <div class="my-5">
        ${ListNonStyle([
          { key: "Nama Lengkap", value: record?.Debitur.fullname || "" },
          { key: "Nomor Pensiun", value: record?.Debitur.nopen || "" },
          { key: "Nomor NIK", value: record?.Debitur.nik || "" },
          {
            key: "Tempat Tanggal Lahir",
            value: record
              ? `${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}`
              : "",
          },
          {
            key: "Alamat",
            value: record
              ? `${record?.Debitur.address}, KELURAHAN ${record?.Debitur.ward} KECAMATAN ${record?.Debitur.district}, ${record?.Debitur.city} ${record?.Debitur.province} ${record?.Debitur.pos_code}`
              : "",
          },
        ])}
      </div>
      
      <div class="mt-10">
        <table class="w-full border-collapse border border-gray-400 text-sm mb-4">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-400 border-dashed p-1">Berkas</th>
              <th class="border border-gray-400 border-dashed p-1">Nama Pemohon</th>
              <th class="border border-gray-400 border-dashed p-1">Tempat, Tanggal Lahir</th>
              <th class="border border-gray-400 border-dashed p-1">Status Pernikahan</th>
              <th class="border border-gray-400 border-dashed p-1">Nama Pasangan</th>
              <th class="border border-gray-400 border-dashed p-1">NIK</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-400 border-dashed p-1 text-left">KTP</td>
              <td class="border border-gray-400 border-dashed p-1 text-center">${record?.Debitur.fullname}</td>
              <td class="border border-gray-400 border-dashed p-1 text-center">${record?.Debitur.birthplace}, ${dayjs(record?.Debitur.birthdate).format("DD-MM-YYYY")}</td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center">${record?.Debitur.nik}</td>
            </tr>
            <tr>
              <td class="border border-gray-400 border-dashed p-1 text-left">SK Pensiun</td>
              <td class="border border-gray-400 border-dashed p-1 text-center">${record?.Debitur.name_skep}</td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
            </tr>
            <tr>
              <td class="border border-gray-400 border-dashed p-1 text-left">Kartu Keluarga</td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
            </tr>
            <tr>
              <td class="border border-gray-400 border-dashed p-1 text-left">KARIP/Buku ASABRI</td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
            </tr>
            <tr>
              <td class="border border-gray-400 border-dashed p-1 text-left">Buku Tabungan/Struk Gaji</td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
              <td class="border border-gray-400 border-dashed p-1 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <p>Melalui surat keterangan ini, saya menyatakan sekaligus menegaskan bahwa apabila terdapat perbedaan, ketidaksesuaian, maupun variasi penulisan data identitas diri saya pada dokumen-dokumen yang telah disebutkan di atas, maka seluruh data pada dokumen tersebut tetap merujuk pada satu individu yang sama, yaitu saya sendiri.</p>
        <p>Demikian Surat Keterangan ini saya buat dengan sebenar-benarnya untuk digunakan sebagai dokumen pendukung dalam permohonan pembiayaan saya ke ${process.env.NEXT_PUBLIC_APP_COMPANY_NAME}.</p>
      </div>

      <div class="flex gap-4 justify-end font-bold text-center mt-10">
        <div class="w-52">
          <p>${record ? record?.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase() : ".................."}, ${record ? moment(record?.created_at).format("DD-MM-YYYY") : "............................."}</p>
          <p>Yang membuat pernyataan</p>
          <div class="h-36 flex justify-center items-center">
          </div>
          <p class="border-b h-5">${record?.Debitur.fullname || ""}</p>
          <p class="h-32">DEBITUR</p>
        </div>
        
      </div>
    </div>
  `;
};
