import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { Header } from "../utils";
moment.locale("id");

export const JadwalAngsuran = (record: IDapem, sub?: string) => {
  const detail = GetDetailDapem(record);
  const ao = record.AO || record.AOCabang || record.AOArea;

  return `
  ${Header("KARTU ANGSURAN", record.no_contract, sub, process.env.NEXT_PUBLIC_APP_LOGO || record.ProdukPembiayaan.Sumdan.logo, undefined)}
  
  <div class="mt-4 flex gap-4">
    <div class="flex-1">
      <div class="flex gap-2">
        <div class="w-32">Nama Pemohon</div>
        <div class="w-4">:</div>
        <div>${record.Debitur.fullname}</div>
      </div>
      <div class="flex gap-2">
        <div class="w-32">Nomor Pensiun</div>
        <div class="w-4">:</div>
        <div>${record.Debitur.nopen}</div>
      </div>
      <div class="flex gap-2">
        <div class="w-32">Jangka Waktu</div>
        <div class="w-4">:</div>
        <div>${record.tenor} Bulan</div>
      </div>
      <div class="flex gap-2">
        <div class="w-32">Plafond</div>
        <div class="w-4">:</div>
        <div>Rp. ${IDRFormat(record.plafond)}</div>
      </div>
      <div class="flex gap-2">
        <div class="w-32">Tanggal Akad</div>
        <div class="w-4">:</div>
        <div>${moment(record.date_contract).format("DD/MM/YYYY")}</div>
      </div>
    </div>
    <div class="flex-1">
      <div class="flex gap-2">
        <div class="w-32">Suku Bunga</div>
        <div class="w-4">:</div>
        <div>${(record.c_margin + record.c_margin_sumdan).toFixed(2)}% /tahun</div>
      </div>
      <div class="flex gap-2">
        <div class="w-32">Angsuran</div>
        <div class="w-4">:</div>
        <div>Rp. ${IDRFormat(detail.angsuran)}</div>
      </div>
      <div class="flex gap-2">
        <div class="w-32">Account Officer</div>
        <div class="w-4">:</div>
        <div>${ao?.fullname}</div>
      </div>
      <div class="flex gap-2">
        <div class="w-32">Unit Pelayanan</div>
        <div class="w-4">:</div>
        <div>${ao?.Cabang.name} - ${ao?.Cabang.Area.name}</div>
      </div>
      <div class="flex gap-2">
        <div class="w-32">Est Tanggal Lunas</div>
        <div class="w-4">:</div>
        <div>${moment(record.date_contract).add(record.tenor, "month").format("DD/MM/YYYY")}</div>
      </div>
    </div>
    <div class="w-32 border">
     
    </div>
  </div>

  <div class="mt-4">
    <table class="w-full border-collapse border border-gray-400 border-dashed text-xs mb-4">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-400 border-dashed p-1">Periode</th>
          <th class="border border-gray-400 border-dashed p-1">Jadwal Bayar</th>
          <th class="border border-gray-400 border-dashed p-1">Total Angsuran</th>
          <th class="border border-gray-400 border-dashed p-1">Pokok</th>
          <th class="border border-gray-400 border-dashed p-1">Magin</th>
          <th class="border border-gray-400 border-dashed p-1">NED+Fee</th>
          <th class="border border-gray-400 border-dashed p-1">Sisa Pokok</th>
        </tr>
      </thead>
      <tbody>
        ${record.Angsurans.map(
          (r, i) => `
          <tr>
            <td class="border border-gray-400 border-dashed p-1 text-center">${r.counter}</td>
            <td class="border border-gray-400 border-dashed p-1 text-center">${moment(r.date_pay).format("DD-MM-YYYY")}</td>
            <td class="border border-gray-400 border-dashed p-1 text-right">${r.counter === 0 ? "0" : IDRFormat(detail.angsuran)}</td>
            <td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.principal)}</td>
            <td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.margin)}</td>
            <td class="border border-gray-400 border-dashed p-1 text-right">${r.counter === 0 ? "0" : IDRFormat(r.fee_banpot + r.c_ned)}</td>
            <td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.remaining)}</td>
          </tr>
        `,
        ).join("")}
      </tbody>
    </table>
  </div>
`;
};
