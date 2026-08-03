import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";

export const FormMutasiTaspen = (record?: IDapem) => {
  return `
    <div class="p-6">
      <div class="flex gap-5 items-center mb-8">
        <div width="100">
          <img width="100" src="/images/taspen.png" />
        </div>
        <div class="flex-1 text-center font-bold text-lg">
          <p >PERMOHONAN MUTASI FINANSIAL DAN NON FINANSIAL</p>
        </div>
      </div>

      <div class="my-2 flex gap-4 font-bold">
        <p class="w-4">A. </p>
        <div class="w-52">JENIS MUTASI :</div>
        <div class="flex-1 border-b border-gray-700"></div>
      </div>
      <div class="my-2 flex gap-4 ">
        <p class="w-4"></p>
        <div class="w-52">MUTASI FINANSIAL</div>
        <div class="flex-1 flex gap-4">
          <div class="w-48 flex gap-2 items-center">
            <div class="border border-gray-700 w-8 h-8 flex items-center justify-center"></div>
            <p>Tunjangan Keluarga</p>
          </div>
          <div class="w-48 flex gap-2 items-center">
            <div class="border border-gray-700 w-8 h-8 flex items-center justify-center">✓</div>
            <p>Lainnya</p>
          </div>
        </div>
      </div>
      <div class="my-2 flex gap-4 ">
        <p class="w-4"></p>
        <div class="w-52"></div>
        <div class="flex-1 border-b border-gray-700"></div>
      </div>
      <div class="my-2 flex gap-4 ">
        <p class="w-4"></p>
        <div class="w-52">MUTASI NON FINANSIAL</div>
        <div class="flex-1 flex gap-4 flex-wrap">
          <div class="w-48 flex gap-2 items-center">
            <div class="border border-gray-700 w-8 h-8 flex items-center justify-center"></div>
            <p>Mutasi Keluar kantor cabang</p>
          </div>
          <div class="w-48 flex gap-2 items-center">
            <div class="border border-gray-700 w-8 h-8 flex items-center justify-center">✓</div>
            <p>Mutasi Kantor Bayar</p>
          </div>
          <div class="w-48 flex gap-2 items-center">
            <div class="border border-gray-700 w-8 h-8 flex items-center justify-center"></div>
            <p>Mutasi Alamat</p>
          </div>
          <div class="w-48 flex gap-2 items-center">
            <div class="border border-gray-700 w-8 h-8 flex items-center justify-center"></div>
            <p>Ganti Nomor Rekening</p>
          </div>
        </div>
      </div>
      <div class="my-2 flex gap-4 ">
        <p class="w-4"></p>
        <div class="w-52"></div>
        <div class="flex-1 border-b border-gray-700"></div>
      </div>


      <div class="my-2 flex gap-4 mt-8">
        <p class="w-4">B. </p>
        <div><span class="font-bold">IDENTITAS PEMOHON / PESERTA</span> <span class="italic">(Semua Item dibawah ini wajib diisi)</span></div>
      </div>
      <div class="my-2 flex gap-4 ">
        <p class="w-4"></p>
        <div class="w-52">Nama</div>
        <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
          ${record ? record.Debitur.fullname : ""}
        </div>
      </div>
      <div class="my-2 flex gap-4 ">
        <p class="w-4"></p>
        <div class="w-52">NIP / NO.KPE / NOTAS</div>
        <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
          ${record ? record.Debitur.nopen : ""}
        </div>
      </div>
      <div class="my-2 flex gap-4 ">
        <p class="w-4"></p>
        <div class="w-52">NOMOR KTP</div>
        <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
          ${record ? record.Debitur.nik : ""}
        </div>
      </div>
      <div class="my-2 flex gap-4 ">
        <p class="w-4"></p>
        <div class="w-52">NOMOR HANDPHONE</div>
        <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
          ${record ? record.Debitur.phone : ""}
        </div>
      </div>

      <div class="my-2 flex gap-4 mt-8">
        <p class="w-4">C. </p>
        <div><span class="font-bold">MUTASI FINANSIAL</span> <span class="italic">(Wajib diisi jika Pilihan Mutasi Finansial pada huruf A diatas)</span></div>
      </div>
      <div class="my-2 flex gap-4 mt-4">
        <p class="w-4 "></p>
        <p class="w-4 text-right">C1. </p>
        <div >TUNJANGAN ANAK USIA DIATAS 21 TAHUN MASIH SEKOLAH/KULIAH</div>
      </div>
      <div class="my-2 flex gap-4 ">
        <p class="w-4"></p>
        <p class="w-4"></p>
        <div class="w-44">Nama</div>
        <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
          
        </div>
      </div>
      <div class="my-2 flex gap-4 ">
        <p class="w-4"></p>
        <p class="w-4"></p>
        <div class="w-44">Tanggal Lahir</div>
        <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
          
        </div>
      </div>
      <div class="my-2 flex gap-4 ">
        <p class="w-4"></p>
        <p class="w-4"></p>
        <div class="w-44">Tanggal Ajaran</div>
        <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
          
        </div>
      </div>
      <div class="my-2 flex gap-4 mt-4">
        <p class="w-4 "></p>
        <p class="w-4 text-right">C2. </p>
        <div >LAINNYA</div>
      </div>
      <div class="my-2 flex gap-4 ">
        <p class="w-4"></p>
        <p class="w-4"></p>
        <div class="w-44"></div>
        <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-28">
          
        </div>
      </div>
      
      <div class="page-break">

        <div class="my-2 flex gap-4 mt-20">
          <p class="w-4">D. </p>
          <div><span class="font-bold">MUTASI NON FINANSIAL</span> <span class="italic">(Wajib diisi jika Pilihan Mutasi Non Finansial pada huruf A diatas)</span></div>
        </div>
        <div class="my-2 flex gap-4 mt-4">
          <p class="w-4 "></p>
          <p class="w-4 text-right">D1. </p>
          <div >DATA LAMA</div>
        </div>
        <div class="my-2 flex gap-4 ">
          <p class="w-4"></p>
          <p class="w-4"></p>
          <div class="w-44">Kantor Cabang Lama</div>
          <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
            
          </div>
        </div>
        <div class="my-2 flex gap-4 ">
          <p class="w-4"></p>
          <p class="w-4"></p>
          <div class="w-44">Kantor Bayar Lama</div>
          <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
            ${record ? record.PrevPayOffice.name || "" : ""}
          </div>
        </div>
        <div class="my-2 flex gap-4 ">
          <p class="w-4"></p>
          <p class="w-4"></p>
          <div class="w-44">Alamat Lama</div>
          <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
            
          </div>
        </div>
        <div class="my-2 flex gap-4 ">
          <p class="w-4"></p>
          <p class="w-4"></p>
          <div class="w-44">No Rekening Lama</div>
          <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
            
          </div>
        </div>
        <div class="my-2 flex gap-4 mt-4">
          <p class="w-4 "></p>
          <p class="w-4 text-right">D2. </p>
          <div >DATA BARU</div>
        </div>
        <div class="my-2 flex gap-4 ">
          <p class="w-4"></p>
          <p class="w-4"></p>
          <div class="w-44">Kantor Cabang Baru</div>
          <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
            
          </div>
        </div>
        <div class="my-2 flex gap-4 ">
          <p class="w-4"></p>
          <p class="w-4"></p>
          <div class="w-44">Kantor Bayar Baru</div>
          <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
            ${record ? record.PayOffice.name || "" : ""}
          </div>
        </div>
        <div class="my-2 flex gap-4 ">
          <p class="w-4"></p>
          <p class="w-4"></p>
          <div class="w-44">Alamat Baru</div>
          <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
            
          </div>
        </div>
        <div class="my-2 flex gap-4 ">
          <p class="w-4"></p>
          <p class="w-4"></p>
          <div class="w-44">No Rekening Baru</div>
          <div class="flex-1 flex gap-4 border border-gray-700 pl-2 items-center h-8">
            
          </div>
        </div>

        <div class="text-justify my-10">Demikian permohonan ini dan keterangan diatas saya buat dengan sebenar-benarnya dan penuh kesadaran, apabila keterangan yang saya berikan tidak benar, saya bersedia mengganti semua kerugian kepada negara / PT TASPEN (PERSERO) dan bersedia dituntut sesuai dengan perundang-undangan yang berlaku.</div>

        <div class="flex gap-4 justify-end font-bold text-center mt-20">
          <div class="w-62">
            <p class="border-b border-dashed">${record ? record?.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase() : ".................."}, ${record ? moment(record?.created_at).format("DD-MM-YYYY") : "............................."}</p>
            <p>PEMOHON</p>
            <div class="h-36 flex justify-center items-center">
            </div>
            <p class="border-b h-5 border-dashed">( ${record?.Debitur.fullname || ""} )</p>
            <p class="h-32 text-xs opacity-80">Nama Jelas, Tanda tangan, cap tiga jari tengah kiri</p>
          </div>
        </div>
      </div>
    </div>
  `;
};
