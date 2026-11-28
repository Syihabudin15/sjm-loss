import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { GetFullAge } from "@/components/utils/PembiayaanUtil";
import type { IOutputDapemDetail } from "@/libs/IInterfaces";
import sharp from "sharp";
import moment from "moment";
import type {
  JenisPembiayaan,
  ProdukPembiayaan,
  Sumdan,
} from "@/generated/prisma/client";

type SimulationImageData = {
  birthdate: Date;
  simulationDate: Date;
  salary: number;
  age: { year: number; month: number; day: number };
  sumdan: Pick<
    Sumdan,
    | "code"
    | "name"
    | "c_account_sumdan"
    | "c_gov"
    | "c_information"
    | "c_ned"
    | "dsr"
  >;
  jenis: Pick<JenisPembiayaan, "name" | "c_mutasi" | "c_blokir">;
  product: Pick<ProdukPembiayaan, "name">;
  maxTenor: number;
  plafond: number;
  calculation: IOutputDapemDetail;
};

const WIDTH = 1200;
const HEIGHT = 1480;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function displayText(value: string, maxLength = 38) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function text(
  x: number,
  y: number,
  value: string,
  options: {
    size?: number;
    color?: string;
    weight?: number;
    anchor?: string;
  } = {},
) {
  const {
    size = 18,
    color = "#263238",
    weight = 400,
    anchor = "start",
  } = options;
  return `<text x="${x}" y="${y}" fill="${color}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${escapeXml(value)}</text>`;
}

function card(
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="16" fill="#ffffff" stroke="#dce2e8"/>
    ${text(x + 24, y + 42, title, { size: 23, weight: 700, color: "#b42332" })}`;
}

function row(
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  options: { bold?: boolean; color?: string } = {},
) {
  const { bold = false, color = "#263238" } = options;
  return `<line x1="${x}" y1="${y + 13}" x2="${x + width}" y2="${y + 13}" stroke="#e9edf1" stroke-dasharray="5 5"/>
    ${text(x, y, label, { size: 17, color })}
    ${text(x + width, y, displayText(value), { size: 17, weight: bold ? 700 : 500, color, anchor: "end" })}`;
}

export async function renderSimulationImage(data: SimulationImageData) {
  const {
    age,
    birthdate,
    calculation,
    jenis,
    maxTenor,
    plafond,
    product,
    salary,
    simulationDate,
    sumdan,
  } = data;
  const payoffDate = moment(simulationDate).add(maxTenor, "month");
  const payoffAge = GetFullAge(birthdate, payoffDate.toDate());
  const detail = calculation.detail;
  const currency = (amount: number) => IDRFormat(amount);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#f3f5f8"/>
  <rect x="48" y="40" width="1104" height="132" rx="18" fill="#b42332"/>
  ${text(80, 98, "PERHITUNGAN PEMBIAYAAN", { size: 34, color: "#ffffff", weight: 700 })}
  ${text(80, 139, `SIMULASI WHATSAPP  •  ${moment(simulationDate).format("DD/MM/YYYY")}`, { size: 18, color: "#ffe8ea" })}

  ${card(48, 198, 540, 350, "DATA PEMOHON")}
  ${row(76, 268, 484, "Tanggal Simulasi", moment(simulationDate).format("DD/MM/YYYY"))}
  ${row(76, 312, 484, "Nomor Pensiun", "-")}
  ${row(76, 356, 484, "Nama Lengkap", "Simulasi WhatsApp")}
  ${row(76, 400, 484, "Gaji Pensiun", currency(salary))}
  ${row(76, 444, 484, "Tanggal Lahir", moment(birthdate).format("DD/MM/YYYY"))}
  ${row(76, 488, 484, "Usia Pemohon", `${age.year} Thn ${age.month} Bln ${age.day} Hr`)}

  ${card(612, 198, 540, 350, "DATA PEMBIAYAAN")}
  ${row(640, 268, 484, "Jenis Pembiayaan", jenis.name)}
  ${row(640, 312, 484, "Produk Pembiayaan", `${product.name} (${sumdan.code})`)}
  ${row(640, 356, 484, "Sumdan", sumdan.name)}
  ${row(640, 400, 484, "Plafond", currency(plafond))}
  ${row(640, 444, 484, "Tenor", `${maxTenor} Bulan`)}
  ${row(640, 488, 484, "Usia/Tanggal Lunas", `${payoffAge.year} Thn ${payoffAge.month} Bln ${payoffAge.day} Hr (${payoffDate.format("DD/MM/YYYY")})`)}

  ${card(48, 574, 1104, 366, "RINCIAN BIAYA")}
  ${row(78, 646, 1044, "Administrasi", currency(calculation.administrasi + detail.provisi_sumdan))}
  ${row(78, 686, 1044, "Asuransi", currency(calculation.asuransi))}
  ${row(78, 726, 1044, "Buka Rekening", currency(sumdan.c_account_sumdan))}
  ${row(78, 766, 1044, "Tatalaksana", currency(sumdan.c_gov))}
  ${row(78, 806, 1044, "Data Informasi", currency(sumdan.c_information))}
  ${row(78, 846, 1044, "Mutasi & Flagging", currency(jenis.c_mutasi))}
  ${row(78, 896, 1044, "TOTAL BIAYA", currency(calculation.biaya), { bold: true, color: "#b42332" })}

  ${card(48, 966, 1104, 444, "ANALISA AKHIR")}
  ${row(78, 1040, 494, "Angsuran", currency(detail.angsuranrounded))}
  ${row(78, 1084, 494, "NED + Fee", currency(detail.fee_banpot + sumdan.c_ned))}
  ${row(78, 1128, 494, "Total Angsuran", currency(calculation.angsuran))}
  ${row(78, 1172, 494, "Sisa Gaji", currency(salary - calculation.angsuran))}
  ${row(78, 1216, 494, "DBR", `${((detail.angsuranrounded / salary) * 100 || 0).toFixed(2)}% / ${sumdan.dsr}%`)}
  ${row(626, 1040, 494, "Terima Kotor", currency(calculation.tk))}
  ${row(626, 1084, 494, "Nominal Takeover", currency(0))}
  ${row(626, 1128, 494, `Blokir Angsuran ${jenis.c_blokir}X`, currency(jenis.c_blokir * calculation.angsuran))}
  ${row(626, 1184, 494, "Terima Bersih", currency(calculation.tb), { bold: true, color: "#16803c" })}

  ${text(600, 1450, "SJM Notify  •  Analisa Perhitungan Pembiayaan", { size: 15, color: "#667085", anchor: "middle" })}
  </svg>`;

  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
