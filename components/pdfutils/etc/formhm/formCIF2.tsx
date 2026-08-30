"use client";

export const FormCIF2 = () => {
  return `
  <div class="border border-gray-800">
    <div class="px-2 border-b border-gray-800 font-bold text-white mt-1 bg-blue-700">
      II. DATA NASABAH (CIF) NONPERORANGAN/ BADAN
    </div>
    <div class="px-6 font-bold text-white bg-blue-700 mt-1">
      A. DATA BADAN
    </div>
    <div class="px-8 py-2 flex flex-col gap-0 border-b border-gray-800">
      <div class="flex gap-2">
        <p class="w-36">Nama Badan</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36 font-bold">Akta Awal Pendirian</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", "No.", "pl-3 flex items-center")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-28">Nama Notaris</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Tempat Akta Diterbitkan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width: 280px;">
          <p class="w-28">Tanggal Akta Diterbitkan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2 items-center">
            <div class="flex">
              ${FormCheck(false)}
              ${FormCheck(false)}
            </div>
            /
            <div class="flex">
              ${FormCheck(false)}
              ${FormCheck(false)}
            </div>
            /
            <div class="flex">
              ${FormCheck(false)}
              ${FormCheck(false)}
              ${FormCheck(false)}
              ${FormCheck(false)}
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36 font-bold">Akta Perubahan Terakhir</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", "No.", "pl-3 flex items-center")}
          </div>
        </div>
        <div class="flex gap-2" style="width: 280px;">
          <p class="w-28">Nama Notaris</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Tempat Akta Diterbitkan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width: 280px;">
          <p class="w-36">Tanggal Akta Diterbitkan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2 items-center">
            <div class="flex">
              ${FormCheck(false)}
              ${FormCheck(false)}
            </div>
            /
            <div class="flex">
              ${FormCheck(false)}
              ${FormCheck(false)}
            </div>
            /
            <div class="flex">
              ${FormCheck(false)}
              ${FormCheck(false)}
              ${FormCheck(false)}
              ${FormCheck(false)}
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Jenis Badan</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${["PT/Persero", "Instansi", "Koperasi", "Yayasan", "CV", "Perkumpulan", "............"].map((p, i) => `<div class="w-20 flex gap-1">${FormCheck(false)} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Bidang Usaha</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${["Perdagangan", "Pendidikan", "Manufaktur", "Keuangan", "Transportasi", "............"].map((p, i) => `<div class="w-20 flex gap-1">${FormCheck(false)} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">NPWP</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${["Tidak Ada", "Ada"].map((p) => `<div class="w-20 flex gap-1">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px">
          <p class="w-36">Nomor NPWP</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex">
            ${["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""].map(() => FormCheck(false)).join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Izin Usaha</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${["Tidak Ada", "Ada"].map((p) => `<div class="w-20 flex gap-1">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px">
          <p class="w-36">No. Izin Usaha</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex">
            ${["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""].map(() => FormCheck(false)).join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">NIB</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${["Tidak Ada", "Ada"].map((p) => `<div class="w-20 flex gap-1">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
        <div class="flex gap-2" style="width:320px">
          <p class="w-36">NIB</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex">
            ${["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""].map(() => FormCheck(false)).join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Alamat Badan Usaha <span class="italic">(sesuai akta)</span></p>
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
          <div class="flex-1 flex">
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
      <div class="flex gap-8" style="margin-left: 150px;">
        <div class="flex-1 flex gap-2">
          <p class="w-20">Kelurahan/Desa</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
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
      <div class="flex gap-2">
        <p class="w-36">Alamat Korespodensi</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36 italic">(jika berbeda dengan alamat</p>
          <p class="w-2"></p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Kode Pos</p>
          <div class="flex-1 flex">
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
      <div class="flex gap-8">
        <p class="italic" style="width: 122px;">terdaftar)</p>
        <div class="flex-1 flex gap-2">
          <p class="w-20">Kelurahan/Desa</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
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
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Alamat Email</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full", "No.", "pl-3 flex items-center")}
          </div>
        </div>
        <div class="flex" style="width: 280px;">
          <p class="w-20">Website Badan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
      </div>
    </div>
    <div class="px-6 font-bold text-white bg-blue-700 mt-1">
      B. DATA PENANGGUNGJAWAB
    </div>
    <div class="px-8 py-2 flex flex-col gap-0 border-b border-gray-800">
      <p>Data Penanggungjawab 1</p>
      <div class="flex gap-2">
        <p class="w-36">Nama Lengkap</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nama Alias</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex-1 flex gap-2">
        <p class="w-36">Jabatan di Badan</p>
        <p class="w-2">:</p>
        <div class="flex-1">
          <div class="flex gap-2">
            ${["Pemegang Saham.......%", "Pemilik Usaha", "Komisaris Utama", "Komisaris", "................."].map((p) => `<div class="w-28 flex gap-1">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
          <div class="flex gap-2">
            ${["Direktur Utama", "Direktur", "Ketua", "Wakil Ketua", "Bendahara"].map((p) => `<div class="w-28 flex gap-1">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Lama Bekerja</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          ${[`Tahun`, "Bulan"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false, "w-16")} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Kewarganegaraan</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          <div class="w-28 flex gap-1">${FormCheck(false)} WNI</div>
          <div class="w-28 flex gap-1">${FormCheck(false)} WNA .........</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Jenis Kartu Identitas</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          ${["KTP", "PASPOR", "SIM", "KIMS/KITAS"].map((p, i) => `<div class="${i !== 4 ? "w-28" : ""} flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">No. Identitas</p>
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
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Tempat Dikeluarkan Kartu ID</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class=" flex gap-2" style="width:280px;">
          <p class="w-20">Berlaku</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${["Seumur Hidup", "s/d ........."]
              .map(
                (p) =>
                  `<div class="flex gap-2">${FormCheck(
                    false,
                    undefined,
                    undefined,
                    "flex items-center justify-center",
                  )} ${p}</div>`,
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Jenis Kelamin</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-4">
          ${["Laki - laki", "Perempuan"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Tempat Lahir</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Tanggal Lahir</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2" >
            <div class="flex">
              ${["", ""]
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
              ${["", ""]
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
              ${["", "", "", ""]
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
        <p class="w-36">Alamat Badan <span class="italic">(sesuai akta)</span></p>
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
          <div class="flex-1 flex">
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
      <div class="flex gap-8" style="margin-left: 150px;">
        <div class="flex-1 flex gap-2">
          <p class="w-20">Kelurahan/Desa</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
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
      <p>Data Penanggungjawab 2</p>
<div class="flex gap-2">
        <p class="w-36">Nama Lengkap</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nama Alias</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex-1 flex gap-2">
        <p class="w-36">Jabatan di Badan</p>
        <p class="w-2">:</p>
        <div class="flex-1">
          <div class="flex gap-2">
            ${["Pemegang Saham.......%", "Pemilik Usaha", "Komisaris Utama", "Komisaris", "................."].map((p) => `<div class="w-28 flex gap-1">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
          <div class="flex gap-2">
            ${["Direktur Utama", "Direktur", "Ketua", "Wakil Ketua", "Bendahara"].map((p) => `<div class="w-28 flex gap-1">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Lama Bekerja</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          ${[`Tahun`, "Bulan"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false, "w-16")} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Kewarganegaraan</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          <div class="w-28 flex gap-1">${FormCheck(false)} WNI</div>
          <div class="w-28 flex gap-1">${FormCheck(false)} WNA .........</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Jenis Kartu Identitas</p>
        <p class="w-2">:</p>
        <div class="flex gap-4">
          ${["KTP", "PASPOR", "SIM", "KIMS/KITAS"].map((p, i) => `<div class="${i !== 4 ? "w-28" : ""} flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">No. Identitas</p>
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
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Tempat Dikeluarkan Kartu ID</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class=" flex gap-2" style="width:280px;">
          <p class="w-20">Berlaku</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${["Seumur Hidup", "s/d ........."]
              .map(
                (p) =>
                  `<div class="flex gap-2">${FormCheck(
                    false,
                    undefined,
                    undefined,
                    "flex items-center justify-center",
                  )} ${p}</div>`,
              )
              .join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Jenis Kelamin</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-4">
          ${["Laki - laki", "Perempuan"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-8">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Tempat Lahir</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-20">Tanggal Lahir</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-2" >
            <div class="flex">
              ${["", ""]
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
              ${["", ""]
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
              ${["", "", "", ""]
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
        <p class="w-36">Alamat Badan <span class="italic">(sesuai akta)</span></p>
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
          <div class="flex-1 flex">
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
      <div class="flex gap-8" style="margin-left: 150px;">
        <div class="flex-1 flex gap-2">
          <p class="w-20">Kelurahan/Desa</p>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-full")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
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

    </div>

    <div class="px-6 font-bold text-white bg-blue-700 mt-1">
      C. DATA KEUANGAN
    </div>
    <div class="px-8 py-2 flex flex-col gap-0 border-b border-gray-800">
      <div class="flex gap-2">
        <p class="w-36">Sumber Dana / Penghasilan</p>
        <p class="w-2">:</p>
        <div class="flex-1">
          <div class="flex gap-2">
            ${["Hasil Usaha", "Operasional", "Sumbangan/Hibah"].map((p, i) => `<div class="${i !== 4 ? "w-28" : ""} flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
          <div class="flex gap-2">
            ${["Dana Pinjaman", "Dana Pihak Lain", ".................."].map((p, i) => `<div class="${i !== 4 ? "w-28" : ""} flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Pendapatan Per Tahun</p>
        <p class="w-2">:</p>
        <div class="flex-1">
          <div class="flex gap-2">
            ${["s/d Rp 300 Juta", ">Rp 500 Juta - Rp 1 Miliar", ">Rp 2,5 Miliar - Rp 5 Miliar"].map((p, i) => `<div class="${i !== 4 ? "w-32" : ""} flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
          <div class="flex gap-2">
            ${[">Rp 300 Juta - Rp 500 Juta", ">Rp 1 Miliar - Rp 2,5 Milyar", ">Rp 5 Milyar"].map((p, i) => `<div class="${i !== 4 ? "w-32" : ""} flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nilai Transaksi Rata Rata (Perbulan)</p>
        <p class="w-2">:</p>
        <div class="flex-1">
          <div class="flex gap-2">
            ${["Rp 1 Juta - Rp 50 Juta", ">Rp 50 Juta - Rp 100 Juta", ">Rp 100 Juta - Rp 250 Juta"].map((p, i) => `<div class="${i !== 4 ? "w-32" : ""} flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
          <div class="flex gap-2">
            ${["Rp 250 Juta - Rp 500 Jata", ">Rp 500 Juta - Rp 1 Milyar", ">Rp 1 Milyar"].map((p, i) => `<div class="${i !== 4 ? "w-32" : ""} flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Frekuensi Transaksi Rata Rata Perbulan</p>
        <p class="w-2">:</p>
        <div class="flex-1">
          <div class="flex gap-2">
            ${["0-50 Kali", "51-100 Kali", ">100 Kali"].map((p, i) => `<div class="${i !== 4 ? "w-32" : ""} flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
      </div>
    </div>

    <div class="px-2 border-b border-gray-800 font-bold text-white mt-1 bg-blue-700">
      III. ALAMAT SURAT MENYURAT
    </div>
    <div class="px-8 py-2 flex flex-col gap-0 border-b border-gray-800">
      <div class="flex gap-2">
        <p class="w-36"></p>
        <p class="w-2"></p>
        <div class="flex-1 flex gap-4">
          ${["Sesuai ID", "Susuai Domisili", "Alamat Usaha / Tempat Bekerja", "Via Email"].map((p) => `<div class="w-32 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
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
