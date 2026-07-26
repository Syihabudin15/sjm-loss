import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";

export const FormMutasiTaspen = (record?: IDapem) => {
  return `
    <div>
      <div class="flex gap-5 items-center">
        <div width="100">
          <img width="100" src="/images/taspen.png" />
        </div>
        <div class="flex-1 text-center font-bold text-lg">
          <p >PERMOHONAN MUTASI FINANSIAL DAN NON FINANSIAL</p>
        </div>
      </div>

      <div class="my-5 flex gap-4">
        <p>A.</p>
        <div>
          <div class="flex gap-4">
            <div width="120 font-bold">JENIS MUTASI:</div>
            <div class="flex-1 border-b"></div>
          </div>
          <div class="flex">
            <p width="120">MUTASI FINANSIAL</p>
            <div class="flex-1 flex gap-5 item-center border-b">
              <div class="flex gap-2 items-center">
                <div class="border p-3"></div>
                <p>Tunjangan Keluarga</p>
              </div>
              <div class="flex gap-2 items-center">
                <div class="border p-3"></div>
                <p>Lainnya</p>
              </div>
            </div>
          </div>
          <div class="flex">
            <p width="120">MUTASI NON FINANSIAL</p>
            <div class="flex-1 flex gap-4 item-center flex-wrap">
              <div class="flex gap-2 items-center">
                <div class="border p-3"></div>
                <p>Mutasi Keluar Kantor Cabang</p>
              </div>
              <div class="flex gap-2 items-center">
                <div class="border p-3 flex items-center justify-center">✓</div>
                <p>Mutasi Kantor Bayar</p>
              </div>
              <div class="flex gap-2 items-center">
                <div class="border p-3"></div>
                <p>Mutasi Alamat</p>
              </div>
              <div class="flex gap-2 items-center">
                <div class="border p-3"></div>
                <p>Ganti Nomor Rekening</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="my-5 flex gap-4">
        <p>B.</p>
        <div>
          <div><span class="font-bold">IDENTITAS PEMOHON/PESERTA</span> <span class="italic">(Semua Item di bawah ini wajib diisi)</span></div>
          <div>
            <p>Nama</p>
            <p class="border p-3">${record?.Debitur.fullname}</p>
          </div>
          
        </div>
      </div>
      
      <div class="flex gap-4 justify-end font-bold text-center mt-10">
        <div class="w-52">
          <p class="border-b border-dashed">${record ? record?.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase() : ".................."}, ${record ? moment(record?.created_at).format("DD-MM-YYYY") : "............................."}</p>
          <p>PEMOHON</p>
          <div class="h-36 flex justify-center items-center">
            <p class="text-xs opacity-70">Materai</p>
          </div>
          <p class="border-b h-5 border-dashed">( ${record?.Debitur.fullname || ""} )</p>
          <p class="h-32 text-xs opacity-80">Nama Jelas, Tanda tangan, cap tiga jari tengah kiri</p>
        </div>
      </div>
    </div>
  `;
};
