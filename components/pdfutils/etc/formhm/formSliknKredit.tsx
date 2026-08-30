import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";

export const FormSliknKredit = (record: IDapem) => {
  return `
  <div class="px-8 py-5">
    <div class="flex items-center gap-4">
      <img src="${record.ProdukPembiayaan.Sumdan.logo}" width="50"/>
      <p class="font-bold text-base">PT. BPR HARTA MULIA</p>
    </div>
    <div class="text-center font-bold text-base">
      <div>FORMULIR PERMOHONAN KREDIT & SLIK</div>
    </div>

    <div class="border-t border-b border-gray-800 py-1 my-2 font-bold">
      <p>DATA PEMOHON</p>
    </div>
    <div class="flex flex-col gap-1">
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Nama Lengkap</p>
          <p class="w-2">:</p>
          <div class="flex-1">
            ${FormCheck(false, "w-full", record.Debitur.fullname, "flex items-center pl-3", true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px;">
          <p class="w-28">Nama Panggilan</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">KTP No</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", record.Debitur.nik, "flex items-center pl-3", true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px;">
          <p class="w-28">Nama Ibu Kandung</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", record.Debitur.mother_name, " flex items-center pl-3", true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Alamat KTP</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", `${record.Debitur.address}, KELURAHAN ${record.Debitur.ward}, KECAMATAN, ${record.Debitur.district}, ${record.Debitur.city}, ${record.Debitur.province}`, "flex items-center pl-3", true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Alamat Tinggal</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", `${record.address || record.Debitur.address}, KELURAHAN ${record.ward || record.Debitur.ward}, KECAMATAN, ${record.district || record.Debitur.district}, ${record.city || record.Debitur.city}, ${record.province || record.Debitur.province}`, "flex items-center pl-3", true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Kode Pos</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", record.pos_code || record.Debitur.pos_code, "flex items-center pl-3", true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px;">
          <p class="w-28">Telepon</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", record.Debitur.phone, " flex items-center pl-3", true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Tempat Tgl Lahir</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", `${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD / MM / YYYY")}`, "flex items-center pl-3", true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px;">
          <p class="w-28">Jenis Kelamin</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4">
            <div class="flex gap-1">${FormCheck(record.Debitur.gender?.toLowerCase() === "laki - laki")} Pria</div>
            <div class="flex gap-1">${FormCheck(record.Debitur.gender?.toLowerCase() === "perempuan")} Wanita</div>
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Status Rumah</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4 items-center">
            <div class="w-28 flex gap-2 items-center">${FormCheck(true)} Milik Sendiri</div>
            <div class="w-28 flex gap-2 items-center">${FormCheck(false)} Milik Keluarga</div>
            <div class="w-28 flex gap-2 items-center">${FormCheck(false)} Sewa Kontrak</div>
          </div>
        </div>
        <div class="flex gap-2" style="width:320px;">
          <p class="w-24">Lama Menempati</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4">
            ${FormCheck(false, "w-full", record.house_year, "pl-3 flex items-center", true)} Thn
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Pendidikan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4 items-center">
            <div class="w-28 flex gap-2 items-center">${FormCheck(record.Debitur.education === "SD")} SD</div>
            <div class="w-28 flex gap-2 items-center">${FormCheck(record.Debitur.education === "SMP")} SMP</div>
            <div class="w-28 flex gap-2 items-center">${FormCheck(record.Debitur.education === "SMA")} SMA</div>
            <div class="w-20 flex gap-2 items-center">${FormCheck(["D1", "D2", "D3"].includes(record.Debitur.education || ""))} D1-D3</div>
            <div class="w-20 flex gap-2 items-center">${FormCheck(["S1", "S2", "S3"].includes(record.Debitur.education || ""))} S1-S3</div>
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Status</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4 items-center">
            <div class="w-28 flex gap-2 items-center">${FormCheck(record.marriage_status === "KAWIN")} Menikah</div>
            <div class="w-28 flex gap-2 items-center">${FormCheck(record.marriage_status === "BELUM_KAWIN")} Belum Menikah</div>
            <div class="w-28 flex gap-2 items-center">${FormCheck(["JANDA", "DUDA"].includes(record.marriage_status || ""))} Janda/Duda</div>
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">NPWP Pribadi</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4 items-center">
            <div class="w-28 flex gap-2 items-center">${FormCheck(record.Debitur.npwp !== null && record.Debitur.npwp !== " " && record.Debitur.npwp !== "-")} Ada</div>
            <div class="w-28 flex gap-2 items-center">${FormCheck(!record.Debitur.npwp || record.Debitur.npwp === " " || record.Debitur.npwp === "-")} Tidak Ada</div>
          </div>
        </div>
        <div class="flex gap-2" style="width: 320px;">
          <p class="w-28"></p>
          <p class="w-2">:</p>
          <div class="flex-1">
            ${FormCheck(false, "w-full", record.Debitur.npwp, "pl-3 flex items-center", true)}
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-b border-gray-800 py-1 my-2 font-bold">
      <p>DATA PEKERJAAN</p>
    </div>
    <div class="flex flex-col gap-1">
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Pekerjaan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex flex-col gap-1">
            <div class="flex gap-6 items-center">
              ${[
                "Wiraswasta",
                "Pegawai Negeri Sipil",
                "Pegawai BUMN",
                "TNI/POLRI",
              ]
                .map(
                  (p, i) =>
                    `<div class=" flex gap-1">${FormCheck(
                      p
                        .toLowerCase()
                        .replaceAll("ibu", "")
                        .replaceAll(" ", "")
                        .includes(
                          record.job
                            ?.toLowerCase()
                            .replaceAll(" ", "")
                            .replace("ibu", "")
                            .replace("mengurus", "")
                            .replaceAll("(", "")
                            .replaceAll(")", "")
                            .replaceAll("pns", "") || "",
                        ),
                    )} ${p}</div>`,
                )
                .join("")}
            </div>
            <div class="flex gap-6 items-center">
              ${["Pegawai Swasta", "Ibu Rumah Tangga"]
                .map(
                  (p, i) =>
                    `<div class=" flex gap-1">${FormCheck(
                      p
                        .toLowerCase()
                        .replaceAll(" ", "")
                        .replace("ibu", "")
                        .includes(
                          record.job
                            ?.toLowerCase()
                            .replaceAll("(", "")
                            .replaceAll(")", "")
                            .replace("pns", "")
                            .replace("mengurus", "")
                            .replace("ibu", "") || "",
                        ),
                    )} ${p}</div>`,
                )
                .join("")}
              <div class=" flex gap-1">${FormCheck(!["pegawaiswasta", "rumahtangga", "wiraswasta", "pegawainegerisipil", "pegawaibumn", "tnipolri"].map((p) => p.replace("ibu", "")).includes(record.job?.toLowerCase().replaceAll("(", "").replaceAll(")", "").replace("pns", "").replace("ibu", "").replace("mengurus", "").replaceAll(" ", "") || ""))} Lainnya, <span class="border-b border-gray-800">${!["pegawaiswasta", "rumahtangga", "wiraswasta", "pegawainegerisipil", "pegawaibumn", "tnipolri"].map((p) => p.replace("ibu", "")).includes(record.job?.toLowerCase().replaceAll("(", "").replaceAll(")", "").replace("pns", "").replace("ibu", "").replace("mengurus", "").replaceAll(" ", "") || "") ? record.job : ""}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Nama Perusahaan</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px">
          <p class="w-24">Bidang Usaha</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Alamat Perusahaan</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px">
          <p class="w-24">Kode Pos</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36"></p>
          <p class="w-2"></p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px">
          <p class="w-24">Telepon</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Status Pekerjaan/Usaha</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px">
          <p class="w-24">Lama Bekerja/usaha</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", undefined, undefined, true)} Bln/Thn
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-b border-gray-800 py-1 my-2 font-bold">
      <p>DATA ISTRI/ SUAMI PEMOHON</p>
    </div>
    <div class="flex flex-col gap-1">
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Nama Lengkap</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", record.marriage_status === "KAWIN" ? record.aw_name : "", record.marriage_status === "KAWIN" ? "pl-3 flex items-center" : undefined, true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">KTP No</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", record.marriage_status === "KAWIN" ? record.aw_nik : "", record.marriage_status === "KAWIN" ? "pl-3 flex items-center" : undefined, true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px">
          <p class="w-24">Handphone</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.marriage_status === "KAWIN" ? record.aw_phone : "", record.marriage_status === "KAWIN" ? "pl-3 flex items-center" : undefined, true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Pendidikan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4 items-center">
            <div class="w-28 flex gap-2 items-center">${FormCheck(false)} SD</div>
            <div class="w-28 flex gap-2 items-center">${FormCheck(false)} SMP</div>
            <div class="w-28 flex gap-2 items-center">${FormCheck(false)} SMA</div>
            <div class="flex gap-2 items-center">${FormCheck(false)} D1-D3</div>
            <div class="flex gap-2 items-center">${FormCheck(false)} S1-S3</div>
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Pekerjaan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex flex-col gap-1">
            <div class="flex gap-6 items-center">
              ${["Wiraswasta", "Pegawai Negeri Sipil", "Pegawai BUMN", "TNI/POLRI"].map((p, i) => `<div class="flex gap-1">${FormCheck(p.toLowerCase().includes(record.job?.toLowerCase() || ""))} ${p}</div>`).join("")}
            </div>
            <div class="flex gap-6 items-center">
              ${["Pegawai Swasta", "Ibu Rumah Tangga", "Lainnya __________"].map((p, i) => `<div class="flex gap-1">${FormCheck(p.toLowerCase().includes(record.job?.toLowerCase() || ""))} ${p}</div>`).join("")}
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Nama Perusahaan</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px">
          <p class="w-24">Bidang Usaha</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Alamat Perusahaan</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px">
          <p class="w-24">Kode Pos</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
      </div>
      <div class="w-full flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36"></p>
          <p class="w-2"></p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px">
          <p class="w-24">Telepon</p>
          <p class="w-2">:</p>
          <div class="flex-1 ">
            ${FormCheck(false, "w-full", undefined, undefined, true)}
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-b border-gray-800 py-1 my-2 font-bold">
      <p>DATA PENGHASILAN PEMOHON</p>
    </div>
    <div class="flex flex-col gap-1">
      <div class="w-full flex gap-2">
        <p class="w-1/2">Sumber Penghasilan / Gaji</p>
        <p class="w-2">:</p>
        <div class="flex-1 ">
          ${FormCheck(false, "w-full", `Rp. ${IDRFormat(record.salary || record.Debitur.salary)}`, "flex items-center pl-3", true)}
        </div>
      </div>
      <div class="w-full flex gap-2">
        <p class="w-1/2">Sumber Penghasilan Tambahan Pendamping</p>
        <p class="w-2">:</p>
        <div class="flex-1 ">
          ${FormCheck(false, "w-full", "Rp. ", "flex items-center pl-3", true)}
        </div>
      </div>
      <div class="w-full flex gap-2 mb-2 font-bold">
        <p class="w-1/2">Jumlah Penghasilan	</p>
        <p class="w-2">:</p>
        <div class="flex-1 ">
          ${FormCheck(false, "w-full", `Rp. ${IDRFormat(record.salary || record.Debitur.salary)}`, "flex items-center pl-3", true)}
        </div>
      </div>
      <div class="w-full flex gap-2">
        <p class="w-1/2">Pengeluaran</p>
        <p class="w-2">:</p>
        <div class="flex-1 ">
          ${FormCheck(false, "w-full", "Rp. ", "flex items-center pl-3", true)}
        </div>
      </div>
      <div class="w-full flex gap-2">
        <p class="w-1/2">Biaya Rumah Tangga</p>
        <p class="w-2">:</p>
        <div class="flex-1 ">
          ${FormCheck(false, "w-full", "Rp. ", "flex items-center pl-3", true)}
        </div>
      </div>
      <div class="w-full flex gap-2">
        <p class="w-1/2">Biaya Sewa/ Pemeliharaan/ Transportasi</p>
        <p class="w-2">:</p>
        <div class="flex-1 ">
          ${FormCheck(false, "w-full", "Rp. ", "flex items-center pl-3", true)}
        </div>
      </div>
      <div class="w-full flex gap-2">
        <p class="w-1/2">Biaya Anak dan Iuran Lainnya</p>
        <p class="w-2">:</p>
        <div class="flex-1 ">
          ${FormCheck(false, "w-full", "Rp. ", "flex items-center pl-3", true)}
        </div>
      </div>
      <div class="w-full flex gap-2">
        <p class="w-1/2">Biaya Lain-lain</p>
        <p class="w-2">:</p>
        <div class="flex-1 ">
          ${FormCheck(false, "w-full", "Rp. ", "flex items-center pl-3", true)}
        </div>
      </div>
      <div class="w-full flex gap-2">
        <p class="w-1/2">Angsuran/Pinjaman yang sedang berjalan</p>
        <p class="w-2">:</p>
        <div class="flex-1 ">
          ${FormCheck(false, "w-full", "Rp. ", "flex items-center pl-3", true)}
        </div>
      </div>
      <div class="w-full flex gap-2 font-bold">
        <p class="w-1/2">Jumlah Pengeluaran</p>
        <p class="w-2">:</p>
        <div class="flex-1 ">
          ${FormCheck(false, "w-full", "Rp. ", "flex items-center pl-3", true)}
        </div>
      </div>
      <div class="w-full flex gap-2 mt-2 font-bold">
        <p class="w-1/2">Sisa Penghasilan</p>
        <p class="w-2">:</p>
        <div class="flex-1 ">
          ${FormCheck(false, "w-full", "Rp. ", "flex items-center pl-3", true)}
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
  dev?: boolean,
) => {
  return `
    <div class="${w ? w : "w-4"} ${val ? "" : "h-4"} text-xs ${dev ? "border-b border-gray-800" : "border border-gray-800"} ${check ? "flex items-center justify-center" : classstyle ? classstyle : ""}">
      ${check ? "✓" : val ? val : ""}
    </div>
  `;
};
