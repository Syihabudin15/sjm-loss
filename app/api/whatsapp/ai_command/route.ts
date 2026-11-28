import { NextRequest, NextResponse } from "next/server";
import {
  formatCommandReport,
  formatLegacyReport,
} from "./report_formatter";
import { loadReportData } from "./report_service";
import type { ReportData } from "./report_service";

type ReportFormatter = (
  report: ReportData,
  command: string | undefined,
) => string;

async function handleReportRequest(
  req: NextRequest,
  formatter: ReportFormatter,
) {
  const { groupid, internalgroup, command } = Object.fromEntries(
    req.nextUrl.searchParams,
  );

  try {
    const result = await loadReportData(groupid, internalgroup);
    if (!result.ok) {
      return NextResponse.json(
        { msg: result.msg, status: result.status },
        { status: result.status },
      );
    }

    return NextResponse.json(
      { status: 200, msg: formatter(result, command) },
      { status: 200 },
    );
  } catch (error) {
    console.error("[WA AI Command] Gagal membuat laporan:", error);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 },
    );
  }
}

export const GET = (req: NextRequest) =>
  handleReportRequest(req, formatCommandReport);

export const POST = (req: NextRequest) =>
  handleReportRequest(req, (report) => formatLegacyReport(report));
