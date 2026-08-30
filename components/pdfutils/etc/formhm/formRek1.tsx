import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";

export const FormRek1 = (record: IDapem) => {
  return `
  <div class="border border-gray-800">

    <div class="border-b border-gray-800 bg-blue-700 text-white flex items-center px-32">
      <img src="${record.ProdukPembiayaan.Sumdan.logo}" width="50"/>
      <div class="flex-1 flex flex-col items-center justify-center font-bold text-base">
        <div>FORMULIR PEMBUKAAN REKENING</div>
        <div>PT BPR HARTA MULIA</div>
      </div>
    </div>

    <div class="text-center font-bold border-b border-gray-800">
      Keterangan (*) diisi saat penutupan rekening
    </div>

    <div class="px-2 border-b border-gray-800 font-bold text-white mt-1 bg-blue-700">
      I. TABUNGAN
    </div>
    <div class="px-6 font-bold text-white bg-blue-700 mt-1">
      A. TABUNGAN UMUM
    </div>
    <div class="px-8 py-2 flex flex-col gap-0 border-b border-gray-800">
      <div class="flex gap-2">
        <p class="w-36">Nomor CIF</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex">
          ${["", "", "", "", "", "", ""].map(() => FormCheck(false)).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nomor Rekening</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex">
          ${["", "", "", "", "", "", "", "", ""].map((p) => FormCheck(false)).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Setoran Awal (Rp)</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Tujuan Pembukaan Rekening</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex flex-col gap-0">
          <div class="flex gap-4">
            ${["Transaksi", "Keperluan Pribadi", "...................."].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
          <div class="flex gap-4">
            ${["Investasi", "Pinjaman Kredit"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
      </div>

      <div class="flex justify-end px-40 text-center">
        <div class="w-52 flex flex-col gap-14">
          <div>
            <p>Pemohon Tabungan Umum PT BPR Harta Mulia</p>
            <div class="flex-1 border-b border-gray-800 border-dashed">${record.Debitur.city?.toLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.created_at).format("DD-MM-YYYY")}</div>
          </div>
          <div>
            <p>${record.Debitur.fullname}</p>
            <p class="border-t border-gray-800">Tanda Tangan Nasabah dan Nama</p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 font-bold text-white my-0 bg-blue-700">
      B. TABUNGANKU/ TABUNGAN SIMPEL
    </div>
    <div class="px-8 py-2 flex flex-col gap-0 border-b border-gray-800">
      <div class="flex gap-2">
        <p class="w-36">Nomor CIF</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex">
          ${["", "", "", "", "", "", ""].map(() => FormCheck(false)).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nomor Rekening</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex">
          ${["", "", "", "", "", "", "", "", ""].map((p) => FormCheck(false)).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Setoran Awal (Rp)</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Tujuan Pembukaan Rekening</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex flex-col gap-0">
          <div class="flex gap-4">
          ${["Transaksi", "Keperluan Pribadi", "...................."].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
          <div class="flex gap-4">
            ${["Investasi", "Pinjaman Kredit"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
      </div>

      <div class="flex justify-end px-40 text-center">
        <div class="w-52 flex flex-col gap-14">
          <div>
            <p>Pemohon TabunganKu/ Tabungan SIMPEL PT BPR Harta Mulia</p>
            <div class="">............................,......................... 20 ............</div>
          </div>
          <div>
            <p></p>
            <p class="border-t border-gray-800">Tanda Tangan Nasabah dan Nama</p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 font-bold text-white my-0 bg-blue-700">
      C. TABUNGAN BERENCANA GENTAMAS
    </div>
    <div class="px-8 pt-2 flex flex-col gap-0">
      <div class="flex gap-2">
        <p class="w-36">Nomor CIF</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex">
          ${["", "", "", "", "", "", ""].map(() => FormCheck(false)).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nomor Rekening</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex">
          ${["", "", "", "", "", "", "", "", ""].map((p) => FormCheck(false)).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Jangka Waktu</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex items-center gap-4">
          <div class="flex">${["", ""].map((p) => FormCheck(false)).join("")}</div>
          <p>Bulan</p>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Tanggal Penempatan</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex items-center gap-4">
          <div class="flex">
            ${["", ""].map((p) => FormCheck(false)).join("")}
          </div>
          <p>/</p>
          <div class="flex">
          ${["", ""].map((p) => FormCheck(false)).join("")}
          </div>
          <p>/</p>
          <div class="flex">
            ${["", "", "", ""].map((p) => FormCheck(false)).join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Tanggal Jatuh Tempo</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex items-cente gap-4">
          <div class="flex">
            ${["", ""].map((p) => FormCheck(false)).join("")}
          </div>
          <p>/</p>
          <div class="flex">
            ${["", ""].map((p) => FormCheck(false)).join("")}
          </div>
          <p>/</p>
          <div class="flex">
            ${["", "", "", ""].map((p) => FormCheck(false)).join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Setoran Per/Bulan (Rp)</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Pembayaran Per/Bulan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4">
            ${["Tunai", "Transfer", "Debet Tabungan"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-28">Nomor Rekening</p>
          <p class="w-2">:</p>
          <div class="flex-1 border-b border-dashed border-gray-800"></div>
        </div>
      </div>
      <div class="flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Pembayaran Jatuh Tempo*</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4">
            ${["Tunai", "Transfer", "Kredit Tabungan"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-28">Nomor Rekening</p>
          <p class="w-2">:</p>
          <div class="flex-1"></div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Tujuan Pembukaan Rekening</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex flex-col gap-0">
          <div class="flex gap-4">
            ${["Transaksi", "Keperluan Pribadi", "...................."].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
          <div class="flex gap-4">
          ${["Investasi", "Pinjaman Kredit"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
      </div>

      <div class="flex justify-end px-40 text-center">
        <div class="w-52 flex flex-col gap-14">
          <div>
            <p>Pemohon Tabungan Berencana Gentamas PT BPR Harta Mulia</p>
            <div class="">............................,......................... 20 ............</div>
          </div>
          <div>
            <p></p>
            <p class="border-t border-gray-800">Tanda Tangan Nasabah dan Nama</p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 font-bold text-white my-0 bg-blue-700">
      D. DATA KEUANGAN
    </div>
    <div class="px-8 py-2 flex flex-col gap-0 border-b border-gray-800">
      <div class="flex gap-2">
        <p class="w-36">Nomor CIF</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex">
          ${["", "", "", "", "", "", ""].map(() => FormCheck(false)).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nomor Rekening</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex">
          ${["", "", "", "", "", "", "", "", ""].map((p) => FormCheck(false)).join("")}
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Jangka Waktu</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex items-center gap-4">
          <div class="flex">${["", ""].map((p) => FormCheck(false)).join("")}</div>
          <p>Bulan</p>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Tanggal Penempatan</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex items-center gap-4">
          <div class="flex">
            ${["", ""].map((p) => FormCheck(false)).join("")}
          </div>
          <p>/</p>
          <div class="flex">
          ${["", ""].map((p) => FormCheck(false)).join("")}
          </div>
          <p>/</p>
          <div class="flex">
            ${["", "", "", ""].map((p) => FormCheck(false)).join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Tanggal Jatuh Tempo</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex items-cente gap-4">
          <div class="flex">
            ${["", ""].map((p) => FormCheck(false)).join("")}
          </div>
          <p>/</p>
          <div class="flex">
            ${["", ""].map((p) => FormCheck(false)).join("")}
          </div>
          <p>/</p>
          <div class="flex">
            ${["", "", "", ""].map((p) => FormCheck(false)).join("")}
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Nominal Penempatan (Rp)</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-2">
          ${FormCheck(false, "w-full")}
        </div>
      </div>
      <div class="flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Pembayaran Bunga/Bulan</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4">
            ${["Tunai", "Transfer", "Kredit Tabungan"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-28">Nomor Rekening</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4">
            <div class="flex-1"></div>
            <div class="flex gap-2">${FormCheck(false)} OB Ke Bank</div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-36">Saat Jatuh Tempo</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex gap-4">
          ${["ARO", "Tutup Rekening/Cair"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
        </div>
      </div>
      <div class="flex gap-4">
        <div class="flex-1 flex gap-2">
          <p class="w-36">Pembayaran Jatuh Tempo*</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4">
            ${["Tunai", "Transfer", "Kredit Tabungan"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
        <div class="flex gap-2" style="width:280px;">
          <p class="w-28">Nomor Rekening</p>
          <p class="w-2">:</p>
          <div class="flex-1 flex gap-4">
          </div>
        </div>
      </div>

    <div class="flex gap-2">
        <p class="w-36">Tujuan Pembukaan Rekening</p>
        <p class="w-2">:</p>
        <div class="flex-1 flex flex-col gap-0">
          <div class="flex  gap-4">
            ${["Transaksi", "Keperluan Pribadi", "...................."].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
          <div class="flex gap-4">
            ${["Investasi", "Pinjaman Kredit"].map((p) => `<div class="w-28 flex gap-2 items-center">${FormCheck(false)} ${p}</div>`).join("")}
          </div>
        </div>
      </div>

      <div class="flex justify-end px-40 text-center">
        <div class="w-52 flex flex-col gap-14">
          <div>
            <p>Pemohon Deposito PT BPR Harta Mulia</p>
            <div class="">............................,......................... 20 ............</div>
          </div>
          <div>
            <p></p>
            <p class="border-t border-gray-800">Tanda Tangan Nasabah dan Nama</p>
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
