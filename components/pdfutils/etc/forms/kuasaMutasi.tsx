import { IDapem } from "@/libs/IInterfaces";
import { Header, ListNonStyle } from "../../utils";
import moment from "moment";

export const KuasaMutasi = (record?: IDapem) => {
  return `
    <div class="p-8">
      ${Header("SURAT KUASA", "MUTASI KANTOR BAYAR", undefined, undefined, undefined)}
      <p class="mt-8">Yang bertanda tangan dibawah ini :</p>
      <div class="my-5">
        ${ListNonStyle([
          {
            key: "Nama",
            value: record?.Debitur.fullname || "",
            valuStyle: "border-b border-dashed border-gray-600",
          },
          {
            key: "Nopen",
            value: record?.Debitur.nopen || "",
            valuStyle: "border-b border-dashed border-gray-600",
          },
          {
            key: "Alamat",
            value: record
              ? `${record?.Debitur.address}, KELURAHAN ${record?.Debitur.ward} KECAMATAN ${record?.Debitur.district}, ${record?.Debitur.city} ${record?.Debitur.province} ${record?.Debitur.pos_code}`
              : "",
            valuStyle: "border-b border-dashed border-gray-600",
          },
          {
            key: "Kantor Bayar",
            value: "",
            valuStyle: "border-b border-dashed border-gray-600",
          },
        ])}
      </div>
      <p class="mt-10">Dengan ini memberi kuasa pengurusan mutasi atau pindah kantor bayar saya kepada pihak:</p>
      <div class="my-2">
        ${ListNonStyle([
          {
            key: "Bank",
            value: "",
            valuStyle: "border-b border-dashed border-gray-600",
          },
          {
            key: "Kantor Bayar",
            value: "",
            valuStyle: "border-b border-dashed border-gray-600",
          },
        ])}
      </div>
      <p class="my-8">
        Demikian surat kuasa ini dibuat dengan sesungguhnya, untuk dipergunakan sebagaimana mestinya.
      </p>

      <div class="flex gap-4 justify-around font-bold text-center mt-20">
        <div class="w-52">
          <p class="h-5"></p>
          <p>Yang Menerima Kuasa</p>
          <div class="h-36"></div>
          <p class="border-b h-5"></p>
          <p class="h-5"></p>
        </div>
        <div class="w-52">
          <p>${record ? record?.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase() : ".................."}, ${record ? moment(record?.created_at).format("DD / MM / YYYY") : "............................."}</p>
          <p>Yang Memberi Kuasa</p>
          <div class="h-36 flex justify-center items-center">
            <p class="text-xs opacity-70">Materai</p>
          </div>
          <p class="border-b h-5">${record?.Debitur.fullname || ""}</p>
          <p class="h-32"></p>
        </div>
      </div>
    </div>
  `;
};
