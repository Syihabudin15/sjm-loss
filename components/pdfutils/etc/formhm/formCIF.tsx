import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";

export const FormCIF = (record: IDapem) => {
  return `
  <div class="border border-gray-800">

    <div class="border-b border-gray-800 bg-blue-700 text-white flex items-center px-32">
      <img src="${record.ProdukPembiayaan.Sumdan.logo}" width="50"/>
      <div class="flex-1 flex flex-col items-center justify-center font-bold text-base">
        <div>FORMULIR PEMBUKAAN CIF</div>
        <div>PT BPR HARTA MULIA</div>
      </div>
    </div>

    <div class="text-center font-bold border-b border-gray-800">
      Ditulis dengan huruf cetak dan beri tanda [✓] pada kolom pilihan | Keterangan (*) tidak wajib dilengkapi
    </div>

    <p class="px-2">Diisi Oleh Petugas Bank</p>
    <div class="flex justify-between gap-10 px-8 border-b border-gray-800 pb-0">
      <div class="flex-1 flex flex-col gap-0">
        <div class="flex gap-2">
          <p class="w-36">Jenis Nasabah</p>
          <p class="w-2">:</p>
          <div class="flex gap-2">
            ${FormCheck(true)} Baru
          </div>
        </div>
        <div class="flex gap-2">
          <p class="w-36">Kantor</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2">
          <p class="w-36">Sumber</p>
          <p class="w-2">:</p>
          <div class="flex gap-2">
            <div class="flex gap-1">${FormCheck(false)} Walk-In Customer</div>
            <div class="flex gap-1">${FormCheck(false)} Petugas</div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-0" style="width:280px">
        <div class="flex gap-2">
          <p class="w-20">CIF</p>
          <div class="flex">
            ${[1, 2, 3, 4, 5, 6, 7, 8].map((p) => FormCheck(false)).join("")}
          </div>
        </div>
        <div class="flex gap-2">
          <p class="w-20">No Rekening Baru</p>
          <div class="flex">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => FormCheck(false)).join("")}
          </div>
        </div>
        <div class="flex gap-2">
          <p class="w-20">Nama Petugas</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2">
          <p class="w-20">Kode Petugas</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
      </div>
    </div>

    <div class="px-2 border-b border-gray-800 font-bold text-white mt-1 bg-blue-700">
      I. DATA NASABAH (CIF) PERORANGAN
    </div>
    <div class="px-6 font-bold text-white bg-blue-700 mt-1">
      A. DATA PRIBADI
    </div>
    <div class="px-8 py-2 flex flex-col gap-0 border-b border-gray-800">
      <div class="flex gap-2">
        <p class="w-36">Nama Sesuai ID</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full", record.Debitur.fullname, "pl-3 flex items-center")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36"></p>
        <p class="w-2"></p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nama Alias <span class="italic">(bila ada)</span></p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nama Gadis Ibu Kandung</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full", record.Debitur.mother_name, "pl-3 flex items-center")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Jenis Kelamin</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-4">
          ${["Laki - laki", "Perempuan"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(record.Debitur.gender?.toLowerCase() === p.toLowerCase())} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Tempat Lahir</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.Debitur.birthplace, "pl-3 flex items-center")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Tanggal Lahir</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2" >
            <div class="flex">
              ${moment(record.Debitur.birthdate)
                .format("DD")
                .split("")
                .map((p) =>
                  FormCheck(
                    false,
                    undefined,
                    p,
                    "flex items-center justify-center",
                  ),
                )
                .join("")}
            </div>
            <p>/</p>
            <div class="flex">
              ${moment(record.Debitur.birthdate)
                .format("MM")
                .split("")
                .map((p) =>
                  FormCheck(
                    false,
                    undefined,
                    p,
                    "flex items-center justify-center",
                  ),
                )
                .join("")}
            </div>
            <p>/</p>
            <div class="flex">
              ${moment(record.Debitur.birthdate)
                .format("YYYY")
                .split("")
                .map((p) =>
                  FormCheck(
                    false,
                    undefined,
                    p,
                    "flex items-center justify-center",
                  ),
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Kewarganegaraan</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          <div class="w-28 flex gap-1">${FormCheck(true)} WNI</div>
          <div class="w-28 flex gap-1">${FormCheck(false)} WNA .........</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Jenis Kartu Identitas</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          ${["KTP", "PASPOR", "SIM", "KIMS/KITAS", "........."].map((p, i) => `<div class="${i !== 4 ? "w-28" : ""} flex gap-2 items-center">${FormCheck(p === "KTP")} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">No. Identitas</p>
        <p class="w-2">:</p>
        <div class="flex">
          ${(record.Debitur.nik
            ? record.Debitur.nik.split("")
            : ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
          )
            .map((p) =>
              FormCheck(
                false,
                undefined,
                p,
                "flex items-center justify-center",
              ),
            )
            .join("")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Tempat Dikeluarkan Kartu ID</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.Debitur.id_publisher, "pl-3 flex items-center")}
          </div>
        </div>
        <div class=" flex gap-2" style="width:280px;">
          <p class="w-20">Berlaku</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
              <div class="flex gap-2">${FormCheck(
                !record.Debitur.id_end,
                undefined,
                undefined,
                "flex items-center justify-center",
              )} Seumur Hidup</div>
              <div class="flex gap-2">${FormCheck(
                record.Debitur.id_end ? true : false,
                undefined,
                undefined,
                "flex items-center justify-center",
              )} s/d <span class="underline">${record.Debitur.id_end ? moment(record.Debitur.id_end).format("DD-MM-YYYY") : "_______________"}</span></div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nomor NPWP <span class="italic">(bila ada)</span></p>
        <p class="w-2">:</p>
        <div class="flex">
          ${(record.Debitur.npwp ? record.Debitur.npwp.replaceAll(".", "").replaceAll("-", "").split("") : ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]).map((p) => FormCheck(false, undefined, String(p), "flex items-center justify-center")).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Alamat Sesuai Identitas</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full", `${record.Debitur.address}`, "pl-3 flex items-center")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36"></p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Kode Pos</p>
          <div class="flex-1 flex">
              ${(record.Debitur.pos_code && record.Debitur.pos_code.length > 4
                ? record.Debitur.pos_code.split("")
                : ["", "", "", "", ""]
              )
                .map((p) =>
                  FormCheck(
                    false,
                    undefined,
                    p,
                    "flex items-center justify-center",
                  ),
                )
                .join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-8" style="margin-left: 150px;">
        <div class="flex-1 flex gap-2">
          <p class="w-20">Kelurahan/Desa</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.Debitur.ward, "pl-3 flex items-center")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Kota/Kabupaten</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.Debitur.city, "pl-3 flex items-center")}
          </div>
        </div>
      </div>
      <div class="flex gap-8" style="margin-left: 150px;">
        <div class="flex-1 flex gap-2">
          <p class="w-20">Kecamatan</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.Debitur.district, "pl-3 flex items-center")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Provinsi</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.Debitur.province, "pl-3 flex items-center")}
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <p class="w-36">Alamat Domisili</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full", `${record.address || record.Debitur.address}`, "pl-3 flex items-center")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36"></p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Kode Pos</p>
          <div class="flex-1 flex gap-2">
            <div class="flex">
              ${((record.pos_code || record.Debitur.pos_code) &&
              (record.pos_code || record.Debitur.pos_code || "")?.length > 4
                ? (record.pos_code || record.Debitur.pos_code || "").split("")
                : ["", "", "", "", ""]
              )
                .map((p) =>
                  FormCheck(
                    false,
                    undefined,
                    p,
                    "flex items-center justify-center",
                  ),
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-8" style="margin-left: 150px;">
        <div class="flex-1 flex gap-2">
          <p class="w-20">Kelurahan/Desa</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.ward || record.Debitur.ward, "pl-3 flex items-center")}
          </div>
        </div>
        <div class=" flex gap-2" style="width:280px;">
          <p class="w-20">Kota/Kabupaten</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.city || record.Debitur.city, "pl-3 flex items-center")}
          </div>
        </div>
      </div>
      <div class="flex gap-8" style="margin-left: 150px;">
        <div class="flex-1 flex gap-2">
          <p class="w-20">Kecamatan</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.district || record.Debitur.district, "pl-3 flex items-center")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Provinsi</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.province || record.Debitur.province, "pl-3 flex items-center")}
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <p class="w-36">Status Tempat Tinggal</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          ${["Milik Sendiri", "Keluarga", "Sewa", "......................."].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(p === "Milik Sendiri")} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Lama menempati</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          ${[`Tahun`, "Bulan"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false, "w-16", p === "Tahun" ? String(record.house_year) : "", "pl-3 flex items-center")} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Agama</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          ${[`Hindu`, "Budha", "Islam", "Kristen", "Katolik"].map((p) => `<div class="${p !== "Katolik" ? "w-28" : ""} flex gap-2 items-center">${FormCheck(p.toLowerCase() === record.Debitur.religion?.toLowerCase())} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Status Perkawinan</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          <div class="w-28 flex gap-1">${FormCheck(record.marriage_status === "BELUM_KAWIN")} Belum Menikah</div>
          <div class="w-28 flex gap-1">${FormCheck(record.marriage_status === "KAWIN")} Sudah Menikah</div>
          <div class="flex gap-1">${FormCheck(record.marriage_status === "DUDA" || record.marriage_status === "JANDA")} Pernah Menikah/Cerai</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Jumlah Tanggungan</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          ${[`Anak`, "Orang Tua", "Keluarga Lainnya"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Pendidikan Terakhir</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          <div class="w-28 flex gap-1">${FormCheck(record.Debitur.education === "SD")} SD</div>
          <div class="w-28 flex gap-1">${FormCheck(record.Debitur.education === "SMP")} SMP</div>
          <div class="w-28 flex gap-1">${FormCheck(record.Debitur.education === "SMA")} SMA</div>
          <div class="flex gap-1">${FormCheck(["D1", "D2", "D3"].includes(record.Debitur.education || "-"))} Diploma</div>
          <div class="flex gap-1">${FormCheck(record.Debitur.education === "S1")} S1</div>
          <div class="flex gap-1">${FormCheck(record.Debitur.education === "S2")} S2</div>
          <div class="flex gap-1">${FormCheck(record.Debitur.education === "S3")} S3</div>
          <div class="flex gap-1">${FormCheck(false)} .........</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Email <span class="italic">(Optional)</span></p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full", undefined, "pl-3 flex items-center")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Handphone</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.Debitur.phone, "pl-3 flex items-center flex items-center")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">No Telp Rumah</p>
          <div class="flex-1 flex gap-2">
             ${FormCheck(false, "w-full", undefined, "pl-3 flex items-center")}
          </div>
        </div>
      </div>

    </div>

    <div class="px-6 font-bold text-white my-0 bg-blue-700">
      B. INFORMASI KONTAK DALAM KEADAAN DARURAT
    </div>
    <div class="px-8 py-2 flex flex-col gap-0 border-b border-gray-800">
      <div class="flex gap-2 ">
        <p class="w-36">Nama</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full", record.f_name, "pl-3 flex items-center")}
        </div>
      </div>
      <div class="flex gap-2 ">
        <p class="w-36">Hubungan Dengan Nasabah</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full", record.f_relate, "pl-3 flex items-center")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Handphone</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.f_phone, "pl-3 flex items-center flex items-center")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">No Telp Rumah</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", undefined, "pl-3 flex items-center")}
          </div>
        </div>
      </div>
      <div class="flex gap-2 ">
        <p class="w-36">Alamat</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full", record.f_address, "pl-3 flex items-center")}
        </div>
      </div>
       <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36"></p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Kode Pos</p>
          <div class="flex-1 flex gap-2">
            <div class="flex">
              ${(record.f_pos_code && record.f_pos_code.length > 4
                ? record.f_pos_code.split("")
                : ["", "", "", "", ""]
              )
                .map((p) =>
                  FormCheck(
                    false,
                    undefined,
                    p,
                    "flex items-center justify-center",
                  ),
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-8" style="margin-left: 150px;">
        <div class="flex-1 flex gap-2">
          <p class="w-20">Kelurahan/Desa</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.f_ward, "pl-3 flex items-center")}
          </div>
        </div>
        <div class=" flex gap-2" style="width:280px;">
          <p class="w-20">Kota/Kabupaten</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.f_city, "pl-3 flex items-center")}
          </div>
        </div>
      </div>
      <div class="flex gap-8" style="margin-left: 150px;">
        <div class="flex-1 flex gap-2">
          <p class="w-20">Kecamatan</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.f_district, "pl-3 flex items-center")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Provinsi</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", record.f_province, "pl-3 flex items-center")}
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 font-bold text-white my-0 bg-blue-700">
      C. DATA PEKERJAAN
    </div>
    <div class="px-8 pt-2 flex gap-0 ">
      <div class="flex-1 flex gap-2 ">
        <p class="w-36">Data Pekerjaan di ID</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false)} Pelajar/Mahasiswa
        </div>
      </div>
      <div class="flex-1 flex-col gap-0" style="width:280px;">
        <div class="w-full flex gap-2 ">
          <p class="w-36">Nama Sekolah/Kampus</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="w-full flex gap-2 ">
          <p class="w-36">Alamat Sekolah/Kampus</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
      </div>
    </div>
    <div class="my-1 text-center border-t border-b border-gray-800">Apabila pekerjaan adalah Pelajar/Mahasiswa : Isian Form (Data Pekerjnan) Dapat Dikosongkan Pengisian Data Orang Tua di isian Form V (Pemilik Dana)</div>
    <div class="px-8 flex flex-col gap-0 ">
      <div class="flex gap-2">
        <p class="w-36"></p>
        <p class="w-2">:</p>
        <div class="flex-1">
          <div class="flex gap-2">
          ${[
            "Ibu Rumah Tangga",
            "Pedagang",
            "Pejab. Negara/Daerah",
            "Pensiunan",
            "Seniman",
          ]
            .map(
              (p, i) => `
            <div class="flex gap-1 items-center"${i !== 4 ? 'style="width:110px"' : ""}>${FormCheck(false)} ${p}</div>
            `,
            )
            .join("")}
        </div>
          <div class="flex gap-2">
            ${[
              "Karyawan Swasta",
              "Dokter",
              "Pengusaha Pabrikan",
              "Pegawai Negeri",
              "Akuntan",
            ]
              .map(
                (p, i) => `
              <div class="flex gap-1 items-center" ${i !== 4 ? 'style="width:110px"' : ""}>${FormCheck(false)} ${p}</div>
              `,
              )
              .join("")}
          </div>
          <div class="flex gap-2">
            ${[
              "Karyawan BUMN/BUMD",
              "TNI/Polri",
              "Pengusaha Jasa",
              "Pengacara",
              "..............",
            ]
              .map(
                (p, i) => `
              <div class="flex gap-1 items-center" ${i !== 4 ? 'style="width:110px"' : ""}>${FormCheck(false)} ${p}</div>
              `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2 ">
        <p class="w-36">Data Pekerjaan Sebenarnya</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Status Pekerjaan</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          ${[`Tetap`, "Kontak", "Honorer", "Paruh Waktu", ".........."].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-2 ">
        <p class="w-36">Nama Usaha / Tempat Bekerja</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Jabatan/Pangkat</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex " style="width:280px;">
          <p class="w-20">Lama Bekerja</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4">
            <div class="flex-1 flex">
              ${FormCheck(false)}
              ${FormCheck(false)} Tahun
            </div>
            <div class="flex-1 flex">
              ${FormCheck(false)}
              ${FormCheck(false)} Bulan
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-2 ">
        <p class="w-36">Bidang Pekerjaan</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-2 ">
        <p class="w-36">Alamat Usaha / Tempat Bekerja</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
       <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36"></p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Kode Pos</p>
          <div class="flex-1 flex gap-2">
            <div class="flex">
              ${["", "", "", "", ""]
                .map((p) =>
                  FormCheck(
                    false,
                    undefined,
                    p,
                    "flex items-center justify-center",
                  ),
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-8" style="margin-left: 150px;">
        <div class="flex-1 flex gap-2">
          <p class="w-20">Kelurahan/Desa</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class=" flex gap-2" style="width:280px;">
          <p class="w-20">Kota/Kabupaten</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
      </div>
      <div class="flex gap-8" style="margin-left: 150px;">
        <div class="flex-1 flex gap-2">
          <p class="w-20">Kecamatan</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Provinsi</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
      </div>
      <div class="flex gap-2 ">
        <p class="w-36">No Telp Kantor</p>
        <p class="w-2">:</p>
        <div class="flex">
          ${["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
            .map((p) =>
              FormCheck(
                false,
                undefined,
                p,
                "flex items-center justify-center",
              ),
            )
            .join("")}
        </div>
      </div>
    </div>

    <div class="px-6 font-bold text-white my-0 bg-blue-700">
      D. DATA KEUANGAN
    </div>
    <div class="px-8 py-2 flex flex-col gap-2 border-b border-gray-800">
      <div class="flex gap-2">
        <p class="w-36">Sumber Dana / Penghasilan</p>
        <p class="w-2">:</p>
        <div class="flex-1">
          <div class="flex gap-2">
            ${["Gaji", "Hasil Usaha", "Lainnya ........"]
              .map(
                (p, i) => `
              <div class="flex gap-1 items-center" ${i !== 4 ? 'style="width:110px"' : ""}>${FormCheck(i === 0)} ${p}</div>
              `,
              )
              .join("")}
          </div>
          <div class="flex gap-2">
            ${["Hibah/Warisan", "Orang Tua"]
              .map(
                (p, i) => `
              <div class="flex gap-1 items-center" ${i !== 4 ? 'style="width:110px"' : ""}>${FormCheck(false)} ${p}</div>
              `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Penghasilan Pertahun</p>
        <p class="w-2">:</p>
        <div class="flex-1">
          <div class="flex gap-2">
            ${[
              "Rp 1 Juta - Rp 50 Juta",
              ">Rp 50 Juta - Rp 100 Juta",
              ">Rp 100 Juta - Rp 250 Juta",
            ]
              .map(
                (p, i) => `
              <div class="flex gap-1 items-center" ${i !== 4 ? 'style="width:110px"' : ""}>${FormCheck(i === 0)} ${p}</div>
              `,
              )
              .join("")}
          </div>
          <div class="flex gap-2">
            ${[
              ">Rp 250 Juta - Rp 500 Juta",
              ">Rp 500 Juta - Rp 1 Milyar",
              ">Rp 1 Milyar",
            ]
              .map(
                (p, i) => `
              <div class="flex gap-1 items-center" ${i !== 4 ? 'style="width:110px"' : ""}>${FormCheck(false)} ${p}</div>
              `,
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nilai Transaksi Rata Rata (Perbulan)</p>
        <p class="w-2">:</p>
        <div class="flex-1">
          <div class="flex gap-2">
            ${[
              "Rp I Juta- Rp 50 Juta",
              ">Rp 50 Juta- Rp 100 Juta",
              ">Rp 100 Juta - Rp 250 Juta",
            ]
              .map(
                (p, i) => `
              <div class="flex gap-1 items-center" ${i !== 4 ? 'style="width:110px"' : ""}>${FormCheck(i === 0)} ${p}</div>
              `,
              )
              .join("")}
          </div>
          <div class="flex gap-2">
            ${[
              ">Rp 250 Juta - Rp 500 Juta",
              ">Rp 500 Juta - Rp 1 Milyar",
              ">Rp 1 Milyar",
            ]
              .map(
                (p, i) => `
              <div class="flex gap-1 items-center" ${i !== 4 ? 'style="width:110px"' : ""}>${FormCheck(false)} ${p}</div>
              `,
              )
              .join("")}
          </div>
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
    <div class="${w ? w : "w-4"} h-4 text-xs border border-gray-800 ${check ? "flex items-center justify-center" : classstyle ? classstyle : ""}">
      ${check ? "✓" : val ? val : ""}
    </div>
  `;
};
