import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import moment from "moment";
import type { ReportData } from "./report_service";

function sumPlafond(records: ReportData["draft"]) {
  return records.reduce((total, record) => total + record.plafond, 0);
}

function summaryLine(label: string, records: ReportData["draft"]) {
  return `• *${label}* \`${records.length} NOA\` | \`Rp. ${IDRFormat(sumPlafond(records))}\``;
}

export function formatCommandReport(
  report: ReportData,
  command: string | undefined,
) {
  switch (command) {
    case "@update_report":
      return `📊 *UPDATE REPORT BULAN ${moment().format("MMMM YYYY")}*

${summaryLine("Draft :", report.draft)}
${summaryLine("Batal :", report.batal)}
${summaryLine("Ditolak :", report.ditolak)}
${summaryLine("Pending Internal:", report.pendingInternal)}
${summaryLine("Pending Mitra:", report.pendingSumdan)}
${summaryLine("Approved :", report.proses)}
${summaryLine("Dropping :", report.dropping)}

> @SJM Notify`;
    case "@pending_report":
      return `⌛ *LIST PENDING ${moment().format("MMMM YYYY")}*

> *Intern*
${report.pendingInternal.map((record) => `• *${record.Debitur.fullname} :* \`Rp. ${IDRFormat(record.plafond)}\``).join("\n")}

> *Mitra*
${report.pendingSumdan.map((record) => `• *${record.Debitur.fullname} :* \`Rp. ${IDRFormat(record.plafond)}\``).join("\n")}

> *Approved*
${report.proses.map((record) => `• *${record.Debitur.fullname} :* \`Rp. ${IDRFormat(record.plafond)}\``).join("\n")}

> @SJM Notify`;
    default:
      return "";
  }
}

export function formatLegacyReport(report: ReportData) {
  const pendingLabel = report.internalGroup
    ? `${summaryLine("Pending Internal:", report.pendingInternal)}
${summaryLine("Pending Mitra:", report.pendingSumdan)}`
    : summaryLine("Pending :", report.pendingSumdan);

  return `
📊 *UPDATE REPORT BULAN ${moment().format("MMMM YYYY")}*

${summaryLine("Draft :", report.draft)}
${summaryLine("Batal :", report.batal)}
${summaryLine("Ditolak :", report.ditolak)}
${pendingLabel}
${summaryLine("Proses/Akad :", report.proses)}
${summaryLine("Dropping :", report.dropping)}

> @SJM Notify
`;
}
