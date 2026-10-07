import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";

export const FormCIFABS = (record?: IDapem) => {
  return `
  <div style="font-size:11px;">
    <!-- Section Header Logo & No Rekening -->
    <div class="flex gap-8">
      <div class="flex-1">
        <img src="/images/logo-abs.bmp" alt="Logo ABS" />
      </div>
      <div class="flex-1">
        <div class="flex gap-4">
          <div class="flex-1">
            <div class="flex gap-2">
              <p class="w-28">Nomor CIF</p>
              <div class="flex-1 border-b border-gray-700"></div>
            </div>
            <div class="flex gap-2">
              <p class="w-28">Nomor Tabungan</p>
              <div class="flex-1 border-b border-gray-700"></div>
            </div>
          </div>
          <div class="flex-2">
            <div class="flex justify-end">
              <img src="/images/logo-bpr.bmp" width="30px" alt="Logo BPR" />
            </div>
            <div>
              <div class="flex gap-2">
                <p class="w-6">No.</p>
                <div class="flex-1 border-b border-gray-700"></div>
              </div>
              <div class="flex gap-2 justify-between mt-1">
                <div class="flex gap-2 items-center">
                  <p>Baru</p>
                  <div class="border w-4 h-4 border-gray-700 flex justify-center items-center">✓</div>
                </div>
                <div class="flex gap-2 items-center">
                  <p>Pengkinian</p>
                  <div class="border w-4 h-4 border-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Body Formulir -->
    <div class="border border-gray-700 mt-2">
      <!-- Title & Kantor/Tanggal -->
      <div class="border-b border-gray-700 p-2">
        <p class="text-center font-bold">FORMULIR PEMBUKAAN REKENING/PENGKINIAN DATA UNTUK ORANG PERSEORANGAN</p>
        <div class="flex gap-4 justify-between mt-3">
          <div class="flex gap-2 flex-1">
            <p class="w-20">Kantor</p>
            <div class="flex-1 border-b border-gray-700"></div>
          </div>
          <div class="flex gap-2 flex-1">
            <p class="w-20">Tanggal:</p>
            <div class="flex-1 border-b border-gray-700">
              ${record ? moment(record.created_at).format("DD-MM-YYYY") : ""}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Option Bertindak Untuk -->
      <div class="p-2 flex gap-2">
        <p class="w-28">Bertindak Untuk</p>
        <div class="flex-1 flex flex-col gap-1">
          <div class="flex gap-2 items-center">
            <div class="border border-gray-700 h-4 w-4 flex justify-center items-center">✓</div>
            <p>Diri Sendiri</p>
          </div>
          <div class="flex gap-2">
            <div class="flex gap-2 items-center">
              <div class="border border-gray-700 h-4 w-4 flex justify-center items-center"></div>
              <p>Beneficial Owner dengan melampirkan:</p>
            </div>
            <div class="flex gap-2 items-center">
              <div class="border border-gray-700 h-4 w-4 flex justify-center items-center"></div>
              <p>Surat Penugasan</p>
            </div>
            <div class="flex gap-2 items-center">
              <div class="border border-gray-700 h-4 w-4 flex justify-center items-center"></div>
              <p>Surat Kuasa</p>
            </div>
            <div class="flex gap-2 items-center">
              <div class="border border-gray-700 h-4 w-4 flex justify-center items-center"></div>
              <p>Surat Perjanjian</p>
            </div>
            <div class="flex gap-2 items-center">
              <div class="border border-gray-700 h-4 w-4 flex justify-center items-center"></div>
              <p>Lainnya</p>
              <p>_______________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
};
