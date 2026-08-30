import { IDapem } from "@/libs/IInterfaces";
import { FormList } from "../../utils";
import moment from "moment";
import { IDRFormat } from "@/components/utils/PembiayaanUtil";

export const FormIdeb = (record?: IDapem) => {
  return `
  <div class="page-header"></div>
    <div class="border rounded border-gray-800">
      <div class="border border-b border-gray-800 p-4 font-bold text-center text-lg">FORM PERMOHONAN IDEB SLIK OJК</div>
      <div class="p-4">
        ${FormList(
          [
            {
              key: "Nama Calon Debitur",
              value: record?.Debitur.fullname || "",
            },
            {
              key: "No. KTP",
              value: record?.Debitur.nik || "",
            },
            {
              key: "Tempat & Tgl Lahir",
              value: record
                ? `${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}`
                : "",
            },
            {
              key: "No. NPWP",
              value: record?.Debitur.npwp || "",
            },
            {
              key: "Nama Ibu Kandung",
              value: record?.Debitur.mother_name || "",
            },
            {
              key: "Alamat KTP",
              value: record
                ? `${record.Debitur.address}, Kel. ${record.Debitur.ward}, Kec. ${record.Debitur.district}, ${record.Debitur.city}, ${record.Debitur.province} ${record.Debitur.pos_code}`
                : "",
            },
            {
              key: "Gaji",
              value: record ? `Rp. ${IDRFormat(record.Debitur.salary)}` : "",
            },
            {
              key: "Pengajuan",
              value: record ? `Rp. ${IDRFormat(record.plafond)}` : "",
            },
            {
              key: "Penggunaan",
              value: record?.used_for || "",
            },
            {
              key: "Tanggal",
              value: record
                ? moment(record.created_at).format("DD-MM-YYYY")
                : "",
            },
          ],
          true,
          "w-48",
        )}
        <div class="my-10 italic opacity-70">
          <p>Terlampir copy KTP, KK, NPWP</p>
        </div>
        <div class="my-5 flex gap-4 justify-evenly">
          <div class="flex flex-col gap-4 justify-between items-center h-32">
            <p>Pemohon</p>
            <div class="flex justify-between gap-2 w-40">
              <p>(</p>
              <p>${record?.Debitur.fullname || ""}</p>
              <p>)</p>
            </div>
          </div>
          <div class="flex flex-col gap-4 justify-between items-center h-32">
            <p>Petugas SLIK</p>
            <div class="flex justify-between gap-2 w-40">
              <p>(</p>
              <p></p>
              <p>)</p>
            </div>
          </div>
          <div class="flex flex-col gap-4 justify-between items-center h-32">
            <p>Pengawas SLIK</p>
            <div class="flex justify-between gap-2 w-40">
              <p>(</p>
              <p></p>
              <p>)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};
