import { IDapem, IDropping } from "@/libs/IInterfaces";
import { GetDetailDapem, IDRFormat } from "./PembiayaanUtil";

export const ProsesMessage = (dapem: IDapem, isfor: "SLIK" | "APPROVAL") => {
  const lines = [
    `🔔 *PENGAJUAN BARU UNTUK ${isfor === "SLIK" ? "ANALISA SLIK" : "APPROVAL KOMITE"}*`,
    "",
    `• *No. Pengajuan:* \`${dapem.id}\``,
    `• *Nama Debitur:* \`${dapem.Debitur.fullname}\``,
    `• *Produk:* \`${dapem.JenisPembiayaan.name}\` | \`${dapem.ProdukPembiayaan.name}\``,
    `• *Plafond:* \`Rp. ${IDRFormat(dapem.plafond)}\` | \`${dapem.tenor} Bulan\``,
    "",
    "_Mohon dibantu untuk diproses, terimakasih._",
    "> @SJM Notify",
  ];

  return lines.join("\n");
};

export const DroppingMessage = (record: IDropping) => {
  const totalplafond = record.Dapems.reduce(
    (acc, curr) => acc + curr.plafond,
    0,
  );
  const totalprovisi = record.Dapems.reduce(
    (acc, curr) => acc + GetDetailDapem(curr).detail.provisi_sumdan,
    0,
  );
  const totalaccount = record.Dapems.reduce(
    (acc, curr) => acc + curr.c_account_sumdan,
    0,
  );
  const totaladministrasi = record.Dapems.reduce(
    (acc, curr) => acc + GetDetailDapem(curr).detail.adm_sumdan,
    0,
  );
  const totaldropping =
    totalplafond - (totalprovisi + totaladministrasi + totalaccount);

  const lines = [
    `💸 *PENGAJUAN PENCAIRAN \`${record.id}\`*`,
    "",
    `• *Total Debitur:* \`${record.Dapems.length}\``,
    `• *Total Plafond:* Rp. \`${IDRFormat(totalplafond)}\``,
    `• *Adm+Provisi+Tabunga:* \`${IDRFormat(totaladministrasi)}\`+\`${IDRFormat(totalprovisi)}\`+\`${IDRFormat(totalaccount)}\` = Rp. \`${IDRFormat(totaladministrasi + totalprovisi + totalaccount)}\``,
    `• *Dropping:* Rp. \`${IDRFormat(totaldropping)}\``,
    "",
    `• *List:* \`${record.Dapems.map((d) => `${d.Debitur.fullname} (Rp. ${IDRFormat(d.plafond)})`).join(" / ")}\``,
    "",
    "Mohon dibantu untuk proses, terimakasih.",
    "> @SJM Notify",
  ];

  return lines.join("\n");
};
