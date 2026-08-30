import { IDapem } from "@/libs/IInterfaces";
import { Header, ListNonStyle } from "../../utils";
import moment from "moment";

export const PersetujuanAW = (record?: IDapem) => {
  return `
    <div class="p-8">
      ${Header("PERSETUJUAN", "", undefined, undefined, undefined)}
      <p class="mt-8">Yang bertanda tangan dibawah ini :</p>
      <div class="my-5">
        ${ListNonStyle([
          {
            key: "Nama",
            value: record?.aw_name || "",
            ...(!record && {
              valuStyle: "border-b border-dashed border-gray-600",
            }),
          },
          {
            key: "No. KTP",
            value: record?.aw_nik || "",
            ...(!record && {
              valuStyle: "border-b border-dashed border-gray-600",
            }),
          },
          {
            key: "Umur",
            value: record
              ? `${moment().diff(record?.aw_birthdate, "years")} Tahun`
              : "",
            ...(!record && {
              valuStyle: "border-b border-dashed border-gray-600",
            }),
          },
          {
            key: "Pekerjaan",
            value: record?.aw_job || "",
            ...(!record && {
              valuStyle: "border-b border-dashed border-gray-600",
            }),
          },
          {
            key: "Alamat",
            value: `${record?.aw_address}, KELURAHAN ${record?.aw_ward}, KECAMATAN ${record?.aw_district}, ${record?.aw_city}, ${record?.aw_province} ${record?.aw_pos_code}`,
            ...(!record && {
              valuStyle: "border-b border-dashed border-gray-600",
            }),
          },
        ])}
      </div>
      <p class="mt-10">Dengan ini menerangkan bahwa sehubungan dengan fasilitas kredit yang diberikan oleh PT. BPR Dian Faraqo Gemilang, saya memberikan persetujuan sepenuhnya kepada suami/istri saya yang sah:</p>
      <div class="my-2">
        ${ListNonStyle([
          {
            key: "Nama",
            value: record?.Debitur.fullname || "",
            ...(!record && {
              valuStyle: "border-b border-dashed border-gray-600",
            }),
          },
          {
            key: "No. KTP",
            value: record?.Debitur.nik || "",
            ...(!record && {
              valuStyle: "border-b border-dashed border-gray-600",
            }),
          },
          {
            key: "Umur",
            value: record
              ? `${moment().diff(record?.Debitur.birthdate, "years")} Tahun`
              : "",
            ...(!record && {
              valuStyle: "border-b border-dashed border-gray-600",
            }),
          },
          {
            key: "Pekerjaan",
            value: record?.job || "",
            ...(!record && {
              valuStyle: "border-b border-dashed border-gray-600",
            }),
          },
          {
            key: "Alamat",
            value: record
              ? `${record?.Debitur.address}, KELURAHAN ${record?.Debitur.ward} KECAMATAN ${record?.Debitur.district}, ${record?.Debitur.city} ${record?.Debitur.province} ${record?.Debitur.pos_code}`
              : "",
            ...(!record && {
              valuStyle: "border-b border-dashed border-gray-600",
            }),
          },
          {
            key: "Dalam Hal",
            value: "PENGAJUAN KREDIT PENSIUN",
          },
        ])}
      </div>
      <div class="my-8">
        <p>Untuk segala akibat yang timbul dari jaminan kredit tersebut yang diberikan oleh suami/istri saya menjadi tanggung jawab saya juga.</p>
        <p>Demikian persetujuan ini dibuat dengan sesungguhnya tanpa ada paksaan sebagaimana mestinya dan berlaku sebagai bukti yang sah.</p>
      </div>

      <div class="flex gap-4 justify-end font-bold text-center mt-20">
        
      <div class="w-52">
          <p>Yang menyetujui,</p>
          <p>${record ? record?.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase() : ".................."}, ${record ? moment(record?.created_at).format("DD / MM / YYYY") : "............................."}</p>
          <div class="h-36 flex justify-center items-center">
          </div>
          <p class="border-b h-5">${record?.aw_name || ""}</p>
          <p class="h-32"></p>
        </div>
      </div>
    </div>
  `;
};
