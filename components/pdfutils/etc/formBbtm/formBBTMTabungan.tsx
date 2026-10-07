import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";

export const FormBBTMTabungan = (record?: IDapem) => {
  return `
  <div class="mt-5 border border-gray-700" style="line-height: 1.5;">

    <div class="flex gap-4 items-center p-4">
      <img src="/images/logo-bbtm.png" alt="Logo" width="100px" />
      <div class="text-blue-400">
        <p class="text-center font-bold text-lg">PT. BANK PEREKONMIAN RAKYAT</p>
        <p class="text-center font-bold text-lg">BEKASI BINATANJUNG MAKMUR</p>
        <div class="text-center text-xs">
          <p>Kantor Pusat: Jl. Ir. H. Juanda No 171 D-E Bekasi Timur, Tlp: (021) 8827958, Fax: (021) 88349389 Wa: 0895-3844-45794</p>
          <p>Kantor Cabang: JI. Aria Surialaga No 46 B Bogor Barat, Tlp: (0251) 8345373, Fax: (0251) 8314193, Wa: 0897-2597-900</p>
        </div>
      </div>
    </div>

    <div class="font-bold text-center p-2 bg-blue-400 border border-gray-800">
      <p >APLIKASI PERMOHONAN PEMBUKAAN REKENING</p>
      <p >TABUNGAN PERORANGAN</p>
    </div>

    <div class="p-2">
      <div class="flex gap-2">
        <p class="w-44">Produk Yang Diinginkan</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">${FormCheck(true, "w-4")} TABUNGAN</div>
      </div>
      <div class="flex gap-2">
        <p class="w-44" >Nama</p>
        <p class="w-4">:</p>
        <div class="flex-1  border-b border-gray-800">${record?.Debitur?.fullname || ""}</div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Alamat</p>
        <p class="w-4">:</p>
        <div class="flex-1 border-b border-gray-800">${record?.Debitur?.address ? `${record?.Debitur?.address},` : ""} ${record?.Debitur?.ward ? `KELURAHAN ${record.Debitur?.ward},` : ""} ${record?.Debitur?.district ? `KECAMATAN ${record.Debitur?.district}` : ""}</div>
      </div>
      <div class="flex gap-2">
        <p class="w-44"></p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-4 border-b border-gray-800">
          <div class="flex-1">Kabupaten/Kota: ${record?.Debitur?.city ? `${record?.Debitur?.city}, ${record?.Debitur?.province}` : ""}</div>
          <div class="flex-1">Kode Pos: ${record?.Debitur?.pos_code || ""}</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Identitas (Perorangan)</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class="w-24 flex gap-2">${FormCheck(true, "w-4")} KTP</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} SIM</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Paspor</div>
          <div class="flex-1 flex gap-2 ">
            <p>Nomor:</p>
            <div class="flex">
              ${
                record
                  ? record?.Debitur?.nik
                      ?.split("")
                      .map((v) => FormCheck(false, "w-4", v, "text-center"))
                      .join("")
                  : [
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                      "",
                    ]
                      .map((v) => FormCheck(false, "w-4"))
                      .join("")
              }
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44" >Tempat Tanggal Lahir</p>
        <p class="w-4">:</p>
        <div class="flex-1  border-b border-gray-800">${record?.Debitur?.birthplace ? `${record?.Debitur?.birthplace}, ${moment(record?.Debitur?.birthdate).format("DD-MM-YYYY")}` : ""}</div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Jenis Kelamin</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-4">
          <div class="w-24 flex gap-2">${FormCheck(record?.Debitur?.gender === "Laki - laki", "w-4")} Laki-laki</div>
          <div class="w-24 flex gap-2">${FormCheck(record?.Debitur?.gender === "Perempuan", "w-4")} Perempuan</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Agama</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class="w-24 flex gap-2">${FormCheck(record?.Debitur?.religion === "ISLAM", "w-4")} Islam</div>
          <div class="w-24 flex gap-2">${FormCheck(record?.Debitur?.religion === "KRISTEN", "w-4")} Kristen</div>
          <div class="w-24 flex gap-2">${FormCheck(record?.Debitur?.religion === "HINDU", "w-4")} Hindu</div>
          <div class="w-24 flex gap-2">${FormCheck(record?.Debitur?.religion === "BUDHA", "w-4")} Budha</div>
          <div class="w-24 flex gap-2">${FormCheck(record?.Debitur?.religion === "KONGHUCU", "w-4")} Konghucu</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Kewarganegaraan</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class="w-24 flex gap-2">${FormCheck(true, "w-4")} WNI</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} WNA</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Status Perkawinan</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class="w-24 flex gap-2">${FormCheck(record?.marriage_status === "BELUM_KAWIN", "w-4")} Lajang</div>
          <div class="w-24 flex gap-2">${FormCheck(record?.marriage_status === "KAWIN", "w-4")} Menikah</div>
          <div class="w-24 flex gap-2">${FormCheck(["JANDA", "DUDA"].includes(record?.marriage_status || ""), "w-4")} Duda/Janda</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44" >Nama Ibu Kandung</p>
        <p class="w-4">:</p>
        <div class="flex-1  border-b border-gray-800">${record?.Debitur?.mother_name || ""}</div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Pekerjaan</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class="w-24 flex gap-2">${FormCheck(true, "w-4")} Pensiunan</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Belaku Hingga</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class="w-24 flex gap-2"></div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Nomor Telp/HP</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class="w-24 flex gap-2">${record?.Debitur.phone || ""}</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Alamat E-mail</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class="w-24 flex gap-2"></div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Jumlah Tanggungan</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Orang</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Status Rumah</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class="w-24 flex gap-2">${FormCheck(true, "w-4")} Milik Sendiri</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Milik Keluarga</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Sewa/Kontrakan</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Lainnya</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Pendidikan Terakhir</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class=" flex gap-2">${FormCheck(record?.Debitur?.education === "SD", "w-4")} SD</div>
          <div class=" flex gap-2">${FormCheck(record?.Debitur?.education === "SMP", "w-4")} SMP</div>
          <div class=" flex gap-2">${FormCheck(record?.Debitur?.education === "SMA", "w-4")} SMA</div>
          <div class=" flex gap-2">${FormCheck(record?.Debitur?.education === "D3", "w-4")} D3</div>
          <div class=" flex gap-2">${FormCheck(record?.Debitur?.education === "D4", "w-4")} D4</div>
          <div class=" flex gap-2">${FormCheck(record?.Debitur?.education === "S1", "w-4")} S1</div>
          <div class=" flex gap-2">${FormCheck(record?.Debitur?.education === "S2", "w-4")} S2</div>
          <div class=" flex gap-2">${FormCheck(record?.Debitur?.education === "S3", "w-4")} S3</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Tujuan Simpanan</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Simpanan</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Investasi</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Transaksi</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Lainnya</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Sumber Dana</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2">
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Gaji</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Hasil Usaha</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Hibah/Warisan</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Hasil Investasi</div>
          <div class="w-24 flex gap-2">${FormCheck(false, "w-4")} Lainnya</div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-44">Penghasilan Kotor</p>
        <p class="w-4">:</p>
        <div class="flex-1 flex gap-2 justify-between">
          <div class=" flex gap-2">${FormCheck(false, "w-4")} Rp.0 s/d Rp. 5.000.000</div>
          <div class=" flex gap-2">${FormCheck(false, "w-4")} Rp.5.000.001 s/d Rp. 15.000.000</div>
          <div class=" flex gap-2">${FormCheck(false, "w-4")} Rp.15.000.001 s/d Rp. 25.000.000</div>
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
