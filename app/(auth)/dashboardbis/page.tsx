"use client";

import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import {
  IDapem,
  IArea,
  IPageProps,
  ISumdan,
  IUserDapem,
} from "@/libs/IInterfaces";

import {
  App,
  DatePicker,
  Spin,
  Table,
  TableProps,
  Progress,
  Tag,
  Card,
  Button,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
import * as XLSX from "xlsx";
import moment from "moment";

const { RangePicker } = DatePicker;

const getAchievementRatio = (achievement: number, target: number) =>
  target > 0 ? (achievement / target) * 100 : achievement > 0 ? 100 : 0;

type DashboardMocSummary = {
  id: string;
  name: string;
  noa: number;
  plafond: number;
  target: number;
  ratio: number;
};

type DashboardSpvSummary = {
  id: string;
  name: string;
  mocs: DashboardMocSummary[];
  totalNoa: number;
  totalPlafond: number;
  target: number;
  ratio: number;
};

type DashboardBranchSummary = {
  id: string;
  name: string;
  supervisors: DashboardSpvSummary[];
  totalNoa: number;
  totalPlafond: number;
  target: number;
  ratio: number;
};

type DashboardAreaSummary = {
  id: string;
  name: string;
  branches: DashboardBranchSummary[];
  totalNoa: number;
  totalPlafond: number;
  target: number;
  ratio: number;
};

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [pageProps, setPageProps] = useState<IPageProps<IArea>>({
    page: 1,
    limit: 1000,
    total: 0,
    data: [],
    search: "",
    backdate: "",
  });
  const [sumdan, setSumdan] = useState<ISumdan[]>([]);
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);
  const [expandedCabangs, setExpandedCabangs] = useState<string[]>([]);
  const [expandedAOs, setExpandedAOs] = useState<string[]>([]);
  const { message } = App.useApp();

  const toggleArea = (id: string) => {
    setExpandedAreas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };
  const toggleCabang = (id: string) => {
    setExpandedCabangs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };
  const toggleAO = (id: string) => {
    setExpandedAOs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const getActiveAOData = (user: IUserDapem) => {
    if (user?.AOs?.length) return user.AOs;
    const fallbackAOCabangs = user?.AOCabangs?.filter((dapem) => !dapem.AO);
    if (fallbackAOCabangs?.length) return fallbackAOCabangs;
    if (user?.AOAreas?.length) return user.AOAreas;

    return [];
  };

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      ...(pageProps.backdate && { backdate: pageProps.backdate }),
    });

    try {
      await fetch(`/api?${params.toString()}`, { method: "POST" })
        .then((res) => res.json())
        .then((res) => {
          setPageProps((prev) => ({ ...prev, data: res.area }));
          setSumdan(res.sumdan);
        });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => getData(), 200);
    return () => clearTimeout(timeout);
  }, [pageProps.backdate]);

  const reportData = useMemo<DashboardAreaSummary[]>(
    () =>
      pageProps.data.map((area) => {
        const branches = area.Cabangs.map((cabang) => {
          const supervisors = (() => {
            const supervisors = new Map<
              string,
              {
                id: string;
                name: string;
                mocs: Map<string, DashboardMocSummary>;
                target: number;
              }
            >();
            const seenDapems = new Set<string>();
            const branchSupervisorIds = new Set(
              cabang.Users.flatMap((user) => user.AOs)
                .map((dapem) => dapem.AOCabang?.id)
                .filter((id): id is string => Boolean(id)),
            );

            const addDapem = (
              dapem: IDapem,
              supervisorId: string,
              supervisorName: string,
              supervisorTarget: number,
              mocId: string,
              mocName: string,
              mocTarget: number,
            ) => {
              const supervisor = supervisors.get(supervisorId) ?? {
                id: supervisorId,
                name: supervisorName,
                mocs: new Map<string, DashboardMocSummary>(),
                target: supervisorTarget,
              };
              const moc = supervisor.mocs.get(mocId) ?? {
                id: mocId,
                name: mocName,
                noa: 0,
                plafond: 0,
                target: mocTarget,
                ratio: 0,
              };
              moc.noa += 1;
              moc.plafond += dapem.plafond;
              supervisor.mocs.set(mocId, moc);
              supervisors.set(supervisorId, supervisor);
            };

            cabang.Users.forEach((user) => {
              user.AOs.forEach((dapem) => {
                if (seenDapems.has(dapem.id)) return;
                seenDapems.add(dapem.id);
                const isSelfSupervised =
                  !dapem.AOCabang && branchSupervisorIds.has(user.id);
                addDapem(
                  dapem,
                  dapem.AOCabang?.id ??
                    (isSelfSupervised ? user.id : "unassigned"),
                  dapem.AOCabang?.fullname ??
                    (isSelfSupervised ? user.fullname : "-"),
                  dapem.AOCabang?.target ??
                    (isSelfSupervised ? (user.target ?? 0) : 0),
                  user.id,
                  user.fullname,
                  user.target ?? 0,
                );
              });
            });

            cabang.Users.forEach((user) => {
              user.AOCabangs.forEach((dapem) => {
                if (dapem.AO || seenDapems.has(dapem.id)) return;
                seenDapems.add(dapem.id);
                addDapem(
                  dapem,
                  user.id,
                  user.fullname,
                  user.target ?? 0,
                  user.id,
                  user.fullname,
                  user.target ?? 0,
                );
              });
            });

            cabang.Users.forEach((user) => {
              user.AOAreas.forEach((dapem) => {
                if (seenDapems.has(dapem.id)) return;
                seenDapems.add(dapem.id);
                addDapem(
                  dapem,
                  "unassigned",
                  "-",
                  0,
                  user.id,
                  user.fullname,
                  user.target ?? 0,
                );
              });
            });

            return Array.from(supervisors.values()).map((supervisor) => {
              const mocs = Array.from(supervisor.mocs.values())
                .map((moc) => ({
                  ...moc,
                  ratio: getAchievementRatio(moc.plafond, moc.target),
                }))
                .sort(
                  (a, b) =>
                    Number(b.id === supervisor.id) -
                    Number(a.id === supervisor.id),
                );
              const totalNoa = mocs.reduce((total, moc) => total + moc.noa, 0);
              const totalPlafond = mocs.reduce(
                (total, moc) => total + moc.plafond,
                0,
              );
              return {
                id: supervisor.id,
                name: supervisor.name,
                mocs,
                totalNoa,
                totalPlafond,
                target: supervisor.target,
                ratio: getAchievementRatio(totalPlafond, supervisor.target),
              };
            });
          })();
          const branchMocs = new Map<string, DashboardMocSummary>();
          supervisors.forEach((supervisor) =>
            supervisor.mocs.forEach((moc) => {
              if (moc.id !== "unassigned" && !branchMocs.has(moc.id)) {
                branchMocs.set(moc.id, moc);
              }
            }),
          );
          const totalNoa = supervisors.reduce(
            (total, supervisor) => total + supervisor.totalNoa,
            0,
          );
          const totalPlafond = supervisors.reduce(
            (total, supervisor) => total + supervisor.totalPlafond,
            0,
          );
          const target = Array.from(branchMocs.values()).reduce(
            (total, moc) => total + moc.target,
            0,
          );

          return {
            id: cabang.id,
            name: cabang.name,
            supervisors,
            totalNoa,
            totalPlafond,
            target,
            ratio: getAchievementRatio(totalPlafond, target),
          };
        });
        const areaMocs = new Map<string, DashboardMocSummary>();
        branches.forEach((branch) =>
          branch.supervisors.forEach((supervisor) =>
            supervisor.mocs.forEach((moc) => {
              if (moc.id !== "unassigned" && !areaMocs.has(moc.id)) {
                areaMocs.set(moc.id, moc);
              }
            }),
          ),
        );
        const totalNoa = branches.reduce(
          (total, branch) => total + branch.totalNoa,
          0,
        );
        const totalPlafond = branches.reduce(
          (total, branch) => total + branch.totalPlafond,
          0,
        );
        const target = Array.from(areaMocs.values()).reduce(
          (total, moc) => total + moc.target,
          0,
        );

        return {
          id: area.id,
          name: area.name,
          branches,
          totalNoa,
          totalPlafond,
          target,
          ratio: getAchievementRatio(totalPlafond, target),
        };
      }),
    [pageProps.data],
  );

  const hasReportData = reportData.some((area) =>
    area.branches.some((branch) => branch.supervisors.length > 0),
  );
  const sumdanReport = useMemo(
    () =>
      sumdan.map((mitra) => {
        const dapems = mitra.ProdukPembiayaans.flatMap(
          (produk) => produk.Dapems,
        );
        return {
          id: mitra.id,
          name: mitra.name,
          code: mitra.code ?? "-",
          noa: dapems.length,
          plafond: dapems.reduce((total, dapem) => total + dapem.plafond, 0),
        };
      }),
    [sumdan],
  );
  const reportTotals = useMemo(() => {
    const branches = reportData.flatMap((area) => area.branches);
    const supervisors = branches.flatMap((branch) => branch.supervisors);
    const mocs = new Map<string, DashboardMocSummary>();
    supervisors.forEach((supervisor) => {
      supervisor.mocs.forEach((moc) => {
        if (moc.id !== "unassigned" && !mocs.has(moc.id)) {
          mocs.set(moc.id, moc);
        }
      });
    });
    const sumdanNoa = sumdanReport.reduce(
      (total, mitra) => total + mitra.noa,
      0,
    );
    const sumdanPlafond = sumdanReport.reduce(
      (total, mitra) => total + mitra.plafond,
      0,
    );
    const totalTarget = branches.reduce(
      (total, branch) => total + branch.target,
      0,
    );
    const areaPlafond = supervisors.reduce(
      (total, supervisor) => total + supervisor.totalPlafond,
      0,
    );

    return {
      areaCount: reportData.filter((area) =>
        area.branches.some((branch) => branch.supervisors.length > 0),
      ).length,
      branchCount: branches.filter((branch) => branch.supervisors.length > 0)
        .length,
      supervisorCount: new Set(
        supervisors
          .filter((supervisor) => supervisor.id !== "unassigned")
          .map((supervisor) => supervisor.id),
      ).size,
      mocCount: mocs.size,
      areaNoa: supervisors.reduce((total, spv) => total + spv.totalNoa, 0),
      areaPlafond,
      totalTarget,
      achievementRatio: getAchievementRatio(areaPlafond, totalTarget),
      sumdanNoa,
      sumdanPlafond,
    };
  }, [reportData, sumdanReport]);
  const periodLabel = pageProps.backdate
    ? String(pageProps.backdate).replace(",", " s.d. ")
    : "Semua periode";
  const hasAnyReportData = hasReportData || sumdanReport.length > 0;

  const exportExcel = () => {
    if (!hasAnyReportData) {
      message.warning("Tidak ada data yang dapat dicetak sesuai filter.");
      return;
    }

    const areaTable: (string | number)[][] = [
      ["REKAPITULASI PEMBIAYAAN BERDASARKAN AREA"],
      [`Periode data: ${periodLabel}`],
      [],
      [
        "TOTAL AREA",
        reportTotals.areaCount,
        "TOTAL UNIT",
        reportTotals.branchCount,
        "TOTAL SPV",
        reportTotals.supervisorCount,
        "TOTAL MOC",
        reportTotals.mocCount,
        "TOTAL NOA",
        reportTotals.areaNoa,
        "TOTAL PLAFOND",
        reportTotals.areaPlafond,
      ],
      [
        "TOTAL TARGET",
        reportTotals.totalTarget,
        "RASIO AREA",
        reportTotals.achievementRatio / 100,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [],
      [
        "AREA PELAYANAN",
        "UNIT PELAYANAN",
        "SPV",
        "MOC",
        "NOA",
        "PLAFOND",
        "TARGET MOC",
        "RASIO MOC",
        "TOTAL NOA CABANG",
        "TOTAL PLAFOND CABANG",
        "TARGET CABANG",
        "RASIO CABANG",
      ],
    ];
    const areaMerges: XLSX.Range[] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 11 } },
      { s: { r: 4, c: 3 }, e: { r: 4, c: 11 } },
    ];
    let worksheetRow = 7;

    reportData.forEach((area) => {
      const areaStart = worksheetRow;
      area.branches.forEach((branch) => {
        const branchStart = worksheetRow;
        branch.supervisors.forEach((supervisor) => {
          const supervisorStart = worksheetRow;
          supervisor.mocs.forEach((moc, mocIndex) => {
            areaTable.push([
              worksheetRow === areaStart
                ? `${area.name} | Rasio ${area.ratio.toFixed(1)}%`
                : "",
              worksheetRow === branchStart
                ? `${branch.name} | Rasio ${branch.ratio.toFixed(1)}%`
                : "",
              mocIndex === 0 ? supervisor.name : "",
              moc.name,
              moc.noa,
              moc.plafond,
              moc.target,
              moc.ratio / 100,
              worksheetRow === branchStart ? branch.totalNoa : "",
              worksheetRow === branchStart ? branch.totalPlafond : "",
              worksheetRow === branchStart ? branch.target : "",
              worksheetRow === branchStart ? branch.ratio / 100 : "",
            ]);
            worksheetRow += 1;
          });
          const supervisorEnd = worksheetRow - 1;
          if (supervisorEnd > supervisorStart) {
            [2].forEach((column) =>
              areaMerges.push({
                s: { r: supervisorStart, c: column },
                e: { r: supervisorEnd, c: column },
              }),
            );
          }
        });
        const branchEnd = worksheetRow - 1;
        if (branchEnd > branchStart) {
          areaMerges.push({
            s: { r: branchStart, c: 1 },
            e: { r: branchEnd, c: 1 },
          });
          [8, 9, 10, 11].forEach((column) =>
            areaMerges.push({
              s: { r: branchStart, c: column },
              e: { r: branchEnd, c: column },
            }),
          );
        }
      });
      const areaEnd = worksheetRow - 1;
      if (areaEnd > areaStart) {
        areaMerges.push({
          s: { r: areaStart, c: 0 },
          e: { r: areaEnd, c: 0 },
        });
      }
    });

    const areaWorksheet = XLSX.utils.aoa_to_sheet(areaTable);
    areaWorksheet["!merges"] = areaMerges;
    areaWorksheet["!cols"] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 22 },
      { wch: 10 },
      { wch: 18 },
      { wch: 18 },
      { wch: 14 },
      { wch: 14 },
      { wch: 20 },
      { wch: 18 },
      { wch: 14 },
    ];
    areaWorksheet["!autofilter"] = {
      ref: `A7:L${Math.max(7, worksheetRow)}`,
    };
    const areaSummaryTarget =
      areaWorksheet[XLSX.utils.encode_cell({ r: 4, c: 1 })];
    const areaSummaryRatio =
      areaWorksheet[XLSX.utils.encode_cell({ r: 4, c: 3 })];
    if (areaSummaryTarget) areaSummaryTarget.z = "#,##0";
    if (areaSummaryRatio) areaSummaryRatio.z = "0.0%";
    for (let row = 7; row < worksheetRow; row += 1) {
      [5, 6, 9, 10].forEach((column) => {
        const amountCell =
          areaWorksheet[XLSX.utils.encode_cell({ r: row, c: column })];
        if (amountCell) amountCell.z = "#,##0";
      });
      [7, 11].forEach((column) => {
        const ratioCell =
          areaWorksheet[XLSX.utils.encode_cell({ r: row, c: column })];
        if (ratioCell) ratioCell.z = "0.0%";
      });
    }

    const sumdanTable: (string | number)[][] = [
      ["REKAPITULASI PEMBIAYAAN BERDASARKAN MITRA"],
      [`Periode data: ${periodLabel}`],
      [],
      [
        "JUMLAH MITRA",
        sumdanReport.length,
        "TOTAL NOA",
        reportTotals.sumdanNoa,
        "TOTAL PLAFOND",
        reportTotals.sumdanPlafond,
      ],
      [],
      ["MITRA PEMBIAYAAN", "KODE MITRA", "NOA", "TOTAL PLAFOND", "", ""],
      ...sumdanReport.map((mitra) => [
        mitra.name,
        mitra.code,
        mitra.noa,
        mitra.plafond,
        "",
        "",
      ]),
      [
        "TOTAL MITRA",
        "",
        reportTotals.sumdanNoa,
        reportTotals.sumdanPlafond,
        "",
        "",
      ],
    ];
    const sumdanWorksheet = XLSX.utils.aoa_to_sheet(sumdanTable);
    sumdanWorksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
    ];
    sumdanWorksheet["!cols"] = [
      { wch: 32 },
      { wch: 18 },
      { wch: 14 },
      { wch: 22 },
    ];
    sumdanWorksheet["!autofilter"] = {
      ref: `A6:D${Math.max(6, sumdanReport.length + 6)}`,
    };
    for (let row = 6; row < sumdanReport.length + 7; row += 1) {
      const amountCell =
        sumdanWorksheet[XLSX.utils.encode_cell({ r: row, c: 3 })];
      if (amountCell) amountCell.z = "#,##0";
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, areaWorksheet, "By Area");
    XLSX.utils.book_append_sheet(workbook, sumdanWorksheet, "By Sumdan");
    XLSX.writeFile(
      workbook,
      `Dashboard_Bisnis_${moment().format("YYYYMMDD_HHmm")}.xlsx`,
    );
  };

  const exportPdf = () => {
    if (!hasAnyReportData) {
      message.warning("Tidak ada data yang dapat dicetak sesuai filter.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      message.error("Izinkan pop-up untuk mencetak laporan PDF.");
      return;
    }

    const escapeHtml = (value: string) =>
      value.replace(/[&<>"']/g, (character) => {
        const entities: Record<string, string> = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };
        return entities[character];
      });
    const areaRows: string[] = [];

    reportData.forEach((area) => {
      const areaRowCount = area.branches.reduce(
        (total, branch) =>
          total +
          branch.supervisors.reduce(
            (supervisorTotal, supervisor) =>
              supervisorTotal + supervisor.mocs.length,
            0,
          ),
        0,
      );
      let firstAreaRow = true;

      area.branches.forEach((branch) => {
        const branchRowCount = branch.supervisors.reduce(
          (total, supervisor) => total + supervisor.mocs.length,
          0,
        );
        let firstBranchRow = true;

        branch.supervisors.forEach((supervisor) => {
          supervisor.mocs.forEach((moc, mocIndex) => {
            const cells = [
              ...(firstAreaRow
                ? [
                    `<td rowspan="${areaRowCount}"><strong>${escapeHtml(area.name)}</strong><br><small>Target Rp ${IDRFormat(area.target)} | Rasio ${area.ratio.toFixed(1)}%</small></td>`,
                  ]
                : []),
              ...(firstBranchRow
                ? [
                    `<td rowspan="${branchRowCount}"><strong>${escapeHtml(branch.name)}</strong><br><small>Target Rp ${IDRFormat(branch.target)} | Rasio ${branch.ratio.toFixed(1)}%</small></td>`,
                  ]
                : []),
              ...(mocIndex === 0
                ? [
                    `<td rowspan="${supervisor.mocs.length}">${escapeHtml(supervisor.name)}</td>`,
                  ]
                : []),
              `<td>${escapeHtml(moc.name)}</td>`,
              `<td class="number">${moc.noa}</td>`,
              `<td class="number">${IDRFormat(moc.plafond)}</td>`,
              `<td class="number">${IDRFormat(moc.target)}</td>`,
              `<td class="number">${moc.ratio.toFixed(1)}%</td>`,
              ...(firstBranchRow
                ? [
                    `<td class="number" rowspan="${branchRowCount}">${branch.totalNoa}</td>`,
                    `<td class="number" rowspan="${branchRowCount}">${IDRFormat(branch.totalPlafond)}</td>`,
                    `<td class="number" rowspan="${branchRowCount}">${IDRFormat(branch.target)}</td>`,
                    `<td class="number" rowspan="${branchRowCount}">${branch.ratio.toFixed(1)}%</td>`,
                  ]
                : []),
            ];
            areaRows.push(`<tr>${cells.join("")}</tr>`);
            firstAreaRow = false;
            firstBranchRow = false;
          });
        });
      });
    });

    const sumdanRows = sumdanReport
      .map(
        (mitra) => `<tr>
          <td>${escapeHtml(mitra.name)}</td>
          <td>${escapeHtml(mitra.code)}</td>
          <td class="number">${mitra.noa}</td>
          <td class="number">${IDRFormat(mitra.plafond)}</td>
        </tr>`,
      )
      .join("");
    const summaryCard = (label: string, value: string | number) =>
      `<div class="summary-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`;

    printWindow.document.write(`<!doctype html>
      <html lang="id">
        <head>
          <meta charset="utf-8" />
          <title>Dashboard Bisnis</title>
          <style>
            @page { size: landscape; margin: 11mm; }
            * { box-sizing: border-box; }
            body { margin: 0; font-family: Arial, sans-serif; color: #17243b; }
            .report-page { break-after: page; page-break-after: always; }
            .report-page-last { break-after: auto; page-break-after: auto; }
            .report-header { padding: 16px 20px; color: #fff; background: #17243b; border-radius: 12px; }
            .eyebrow { color: #87d9e8; font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
            h1 { margin: 5px 0; font-size: 19px; }
            .period { color: #c5d2e2; font-size: 10px; }
            .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 12px 0; }
            .summary-card { min-height: 48px; padding: 8px 10px; border: 1px solid #dce6f4; border-radius: 8px; background: #f2f7fd; }
            .summary-card span { display: block; color: #64748b; font-size: 8px; font-weight: 700; text-transform: uppercase; }
            .summary-card strong { display: block; margin-top: 4px; color: #17243b; font-size: 12px; }
            table { border-collapse: collapse; width: 100%; font-size: 9px; }
            th, td { border: 1px solid #aebccd; padding: 6px; }
            th { color: #fff; text-align: center; background: #31547c; }
            td { vertical-align: middle; text-align: center; }
            .number { text-align: right; white-space: nowrap; }
            tfoot td { color: #17243b; font-weight: 700; background: #e8f0fa; }
            thead { display: table-header-group; }
            tr { break-inside: avoid; }
            @media print { .report-header, .summary-card, th, tfoot td { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <section class="report-page">
            <header class="report-header">
              <div class="eyebrow">Dashboard Pencapaian</div>
              <h1>Rekapitulasi Pembiayaan Berdasarkan Area</h1>
              <div class="period">Periode data: ${escapeHtml(periodLabel)}</div>
            </header>
            <div class="summary-grid">
              ${summaryCard("Total Area", reportTotals.areaCount)}
              ${summaryCard("Unit Pelayanan", reportTotals.branchCount)}
              ${summaryCard("Total SPV", reportTotals.supervisorCount)}
              ${summaryCard("Total MOC", reportTotals.mocCount)}
              ${summaryCard("Total NOA", reportTotals.areaNoa)}
              ${summaryCard("Total Plafond", `Rp ${IDRFormat(reportTotals.areaPlafond)}`)}
              ${summaryCard("Total Target", `Rp ${IDRFormat(reportTotals.totalTarget)}`)}
              ${summaryCard("Rasio Area", `${reportTotals.achievementRatio.toFixed(1)}%`)}
            </div>
            <table>
              <thead>
                <tr>
                  <th>AREA PELAYANAN</th>
                  <th>UNIT PELAYANAN</th>
                  <th>SPV</th>
                  <th>MOC</th>
                  <th>NOA</th>
                  <th>PLAFOND</th>
                  <th>TARGET MOC</th>
                  <th>RASIO MOC</th>
                  <th>TOTAL NOA CABANG</th>
                  <th>TOTAL PLAFOND CABANG</th>
                  <th>TARGET CABANG</th>
                  <th>RASIO CABANG</th>
                </tr>
              </thead>
              <tbody>
                ${areaRows.length ? areaRows.join("") : '<tr><td colspan="12">Tidak ada data area pada filter ini.</td></tr>'}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4">TOTAL KESELURUHAN</td>
                  <td class="number">${reportTotals.areaNoa}</td>
                  <td></td>
                  <td class="number">${IDRFormat(reportTotals.totalTarget)}</td>
                  <td class="number">${reportTotals.achievementRatio.toFixed(1)}%</td>
                  <td class="number">${reportTotals.areaNoa}</td>
                  <td class="number">${IDRFormat(reportTotals.areaPlafond)}</td>
                  <td class="number">${IDRFormat(reportTotals.totalTarget)}</td>
                  <td class="number">${reportTotals.achievementRatio.toFixed(1)}%</td>
                </tr>
              </tfoot>
            </table>
          </section>
          <section class="report-page report-page-last">
            <header class="report-header">
              <div class="eyebrow">Dashboard Pencapaian</div>
              <h1>Rekapitulasi Pembiayaan Berdasarkan Mitra</h1>
              <div class="period">Periode data: ${escapeHtml(periodLabel)}</div>
            </header>
            <div class="summary-grid">
              ${summaryCard("Jumlah Mitra", sumdanReport.length)}
              ${summaryCard("Total NOA", reportTotals.sumdanNoa)}
              ${summaryCard("Total Plafond", `Rp ${IDRFormat(reportTotals.sumdanPlafond)}`)}
            </div>
            <table>
              <thead>
                <tr>
                  <th>MITRA PEMBIAYAAN</th>
                  <th>KODE MITRA</th>
                  <th>NOA</th>
                  <th>TOTAL PLAFOND</th>
                </tr>
              </thead>
              <tbody>
                ${sumdanRows || '<tr><td colspan="4">Tidak ada data mitra pada filter ini.</td></tr>'}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2">TOTAL MITRA</td>
                  <td class="number">${reportTotals.sumdanNoa}</td>
                  <td class="number">${IDRFormat(reportTotals.sumdanPlafond)}</td>
                </tr>
              </tfoot>
            </table>
          </section>
          <script>
            window.onload = () => { window.focus(); window.print(); };
          </script>
        </body>
      </html>`);
    printWindow.document.close();
  };

  const columns: TableProps<ISumdan>["columns"] = [
    {
      title: "Nama Mitra",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div>
          <div className="font-bold text-blue-700">{record.name}</div>
          <Tag color="blue">{record.code}</Tag>
        </div>
      ),
    },
    {
      title: "Pencapaian",
      key: "achievement",
      sorter: (a, b) => {
        const getPlafond = (item: ISumdan) =>
          item.ProdukPembiayaans.flatMap((p) => p.Dapems).reduce(
            (acc, c) => acc + c.plafond,
            0,
          );
        return getPlafond(a) - getPlafond(b);
      },
      render: (_, record) => {
        const total = record.ProdukPembiayaans.flatMap((d) => d.Dapems).reduce(
          (acc, curr) => acc + curr.plafond,
          0,
        );
        const allTotal = sumdan
          .flatMap((s) => s.ProdukPembiayaans)
          .flatMap((s) => s.Dapems)
          .reduce((acc, curr) => acc + curr.plafond, 0);
        const percent = (total / allTotal) * 100 || 0;
        return (
          <div className="min-w-50">
            <div className="flex justify-between font-medium">
              <span>{IDRFormat(total)}</span>
              <span className="text-gray-400 text-xs">
                {record.ProdukPembiayaans.flatMap((r) => r.Dapems).length} NOA
              </span>
            </div>
            <Progress
              percent={parseFloat(percent.toFixed(2))}
              size="small"
              status="active"
              strokeColor="#3b82f6"
            />
          </div>
        );
      },
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="p-2 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg text-white">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                Dashboard Pencapaian
              </h1>
              <p className="text-gray-500">Monitoring wilayah kerja</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <RangePicker
              className="rounded-lg h-10 shadow-sm"
              onChange={(_, dateStr) =>
                setPageProps({ ...pageProps, backdate: dateStr })
              }
            />
            <Button icon={<FileSpreadsheet size={16} />} onClick={exportExcel}>
              Excel
            </Button>
            <Button
              icon={<FileText size={16} />}
              onClick={exportPdf}
              type="primary"
            >
              Cetak PDF
            </Button>
          </div>
        </div>

        {/* Areas Section */}
        <div className="space-y-6 mb-8">
          {pageProps.data?.map((area: IArea) => {
            const isAreaExpanded = expandedAreas.includes(area.id);
            const areaNoa = area.Cabangs.flatMap((c) =>
              c.Users.flatMap((u) => getActiveAOData(u)),
            );
            const areaPencapaian = areaNoa.reduce(
              (acc, curr) => acc + curr.plafond,
              0,
            );
            const areaTarget = area.Cabangs.flatMap((c) => c.Users).reduce(
              (acc, curr) => acc + (curr.target || 0),
              0,
            );
            const areaPercent = (areaPencapaian / areaTarget) * 100;

            return (
              <Card
                key={area.id}
                className="shadow-md border-none overflow-hidden"
                styles={{ body: { padding: 0 } }}
              >
                {/* Area Header (Clickable) */}
                <div
                  className="bg-slate-800 p-4 text-white flex justify-between items-center cursor-pointer hover:bg-slate-700 transition-all"
                  onClick={() => toggleArea(area.id)}
                >
                  <div className="flex items-center gap-3">
                    {/* {isAreaExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )} */}
                    <div>
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <MapPin size={16} className="text-blue-400" />{" "}
                        {area.name}
                      </h2>
                    </div>
                  </div>
                  <div className="flex gap-6 items-center">
                    <div className="text-right">
                      <div className="text-sm font-mono">
                        {IDRFormat(areaPencapaian)}/
                        <span className="text-[10px] text-slate-400">
                          {IDRFormat(areaTarget)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Progress: {areaPercent.toFixed(1)}%
                      </div>
                    </div>
                    <Button
                      size="small"
                      type="primary"
                      ghost
                      className="border-slate-500 text-slate-200"
                    >
                      {isAreaExpanded ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </div>
                </div>

                {/* Cabang List (Show/Hide) */}
                {isAreaExpanded && (
                  <div className="p-4 bg-slate-50 space-y-4 animate-in fade-in duration-300">
                    {area.Cabangs.map((cabang) => {
                      const isCabangExpanded = expandedCabangs.includes(
                        cabang.id,
                      );
                      const cabPencapaian = cabang.Users.flatMap((u) =>
                        getActiveAOData(u),
                      ).reduce((a, b) => a + b.plafond, 0);

                      return (
                        <div
                          key={cabang.id}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                        >
                          {/* Cabang Header */}
                          <div
                            className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                            onClick={() => toggleCabang(cabang.id)}
                          >
                            <div className="flex items-center gap-2 font-bold text-gray-700">
                              {isCabangExpanded ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                              <Building2 size={16} className="text-gray-400" />
                              {cabang.name}
                            </div>
                            <div className="text-blue-600 font-mono text-sm">
                              {IDRFormat(cabPencapaian)}
                            </div>
                          </div>

                          {/* User/AO List (Show/Hide) */}
                          {isCabangExpanded && (
                            <div className="divide-y divide-gray-100 animate-in slide-in-from-top-1 duration-200">
                              {cabang.Users.map((u) => {
                                const aoData = getActiveAOData(u);
                                const isAOExpanded = expandedAOs.includes(u.id);
                                const userAch = aoData.reduce(
                                  (a, b) => a + b.plafond,
                                  0,
                                );
                                const userPct = (userAch / u.target) * 100;
                                return (
                                  <div key={u.id}>
                                    <div className="p-4 flex flex-wrap md:flex-nowrap justify-between items-center hover:bg-blue-50/50 transition-colors">
                                      <div className="w-full md:w-1/3">
                                        <div className="font-semibold text-gray-800">
                                          {u.fullname}
                                        </div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-tighter">
                                          {u.position}
                                        </div>
                                      </div>
                                      <div className="flex-1 px-4 min-w-30">
                                        <Progress
                                          percent={parseFloat(
                                            userPct.toFixed(1),
                                          )}
                                          size="small"
                                          strokeColor={
                                            userPct >= 100
                                              ? "#10b981"
                                              : "#3b82f6"
                                          }
                                        />
                                      </div>
                                      <div className="w-full md:w-1/4 text-right">
                                        <div className="font-mono text-sm font-bold text-slate-700">
                                          {IDRFormat(userAch)}
                                        </div>
                                        <div className="text-[10px] text-gray-400 italic">
                                          Target: {IDRFormat(u.target)}
                                        </div>
                                      </div>
                                      <Button
                                        type="text"
                                        size="small"
                                        disabled={aoData.length === 0}
                                        aria-expanded={isAOExpanded}
                                        onClick={() => toggleAO(u.id)}
                                        className="ml-2 shrink-0"
                                      >
                                        {isAOExpanded ? (
                                          <ChevronUp size={16} />
                                        ) : (
                                          <ChevronDown size={16} />
                                        )}
                                        {aoData.length} Pembiayaan
                                      </Button>
                                    </div>

                                    {isAOExpanded && (
                                      <div className="overflow-x-auto border-t border-gray-100 bg-slate-50 px-4 py-3">
                                        <div className="min-w-150">
                                          <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-3 pb-2 text-xs font-semibold uppercase text-gray-400">
                                            <span>Pemohon</span>
                                            <span>Produk</span>
                                            <span>Plafond</span>
                                            <span>Status</span>
                                          </div>
                                          {aoData.map((dapem) => (
                                            <div
                                              key={dapem.id}
                                              className="grid grid-cols-[2fr_2fr_1fr_1fr] items-center gap-4 rounded-md border border-gray-100 bg-white px-3 py-2 text-sm [&+div]:mt-2"
                                            >
                                              <div>
                                                <div className="font-medium text-gray-800">
                                                  {dapem.Debitur.fullname}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                  {dapem.Debitur.nopen}
                                                </div>
                                              </div>
                                              <div>
                                                <div>
                                                  {dapem.ProdukPembiayaan.name}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                  {dapem.JenisPembiayaan.name}
                                                </div>
                                              </div>
                                              <div className="font-mono font-medium">
                                                {IDRFormat(dapem.plafond)}
                                                <div className="text-xs text-gray-400">
                                                  {dapem.tenor} Bulan
                                                </div>
                                              </div>
                                              <Tag color="blue">
                                                {dapem.dropping_status}
                                              </Tag>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Table Summary tetap di bawah */}
        <Card
          title="Rekapitulasi Per Mitra"
          className="shadow-md border-none rounded-xl"
        >
          <Table
            columns={columns}
            dataSource={sumdan}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </div>
    </Spin>
  );
}
