import prisma from "@/libs/Prisma";
import moment from "moment";

async function fetchReportRows(
  groupid: string | undefined,
  internalgroup: string | undefined,
  sumdanId: string | undefined,
) {
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();

  return prisma.dapem.findMany({
    where: {
      ...(!internalgroup && groupid
        ? {
            ProdukPembiayaan: { sumdanId },
            slik_status: "DISETUJUI",
          }
        : {}),
      status: true,
      OR: [
        {
          created_at: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        {
          date_contract: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        {
          Dropping: {
            process_at: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        },
      ],
    },
    select: {
      dropping_status: true,
      verif_status: true,
      plafond: true,
      Debitur: { select: { fullname: true } },
    },
  });
}

type ReportRecord = Awaited<ReturnType<typeof fetchReportRows>>[number];

export type ReportData = {
  internalGroup: boolean;
  draft: ReportRecord[];
  batal: ReportRecord[];
  ditolak: ReportRecord[];
  pendingSumdan: ReportRecord[];
  pendingInternal: ReportRecord[];
  proses: ReportRecord[];
  dropping: ReportRecord[];
};

export type ReportLoadResult =
  | { ok: false; status: 403; msg: string }
  | ({ ok: true } & ReportData);

export async function loadReportData(
  groupid: string | undefined,
  internalgroup: string | undefined,
): Promise<ReportLoadResult> {
  let sumdanId: string | undefined;

  if (!internalgroup && groupid) {
    const sumdan = await prisma.sumdan.findFirst({
      where: { group_id: groupid },
    });

    if (!sumdan) {
      return {
        ok: false,
        status: 403,
        msg: "Group ID belum terkonfigurasi di SJM Notify",
      };
    }

    if (!sumdan.allow_bot) {
      return {
        ok: false,
        status: 403,
        msg: "Mitra belum diizinkan untk menggunakan SJM Notify",
      };
    }

    sumdanId = sumdan.id;
  }

  const records = await fetchReportRows(groupid, internalgroup, sumdanId);

  return {
    ok: true,
    internalGroup: Boolean(internalgroup),
    draft: records.filter((record) => record.dropping_status === "DRAFT"),
    batal: records.filter((record) => record.dropping_status === "BATAL"),
    ditolak: records.filter((record) => record.dropping_status === "DITOLAK"),
    pendingSumdan: records.filter(
      (record) =>
        record.dropping_status === "PENDING" &&
        record.verif_status === "DISETUJUI",
    ),
    pendingInternal: records.filter(
      (record) =>
        record.dropping_status === "PENDING" &&
        record.verif_status === "PENDING",
    ),
    proses: records.filter((record) => record.dropping_status === "PROSES"),
    dropping: records.filter(
      (record) => record.dropping_status === "DISETUJUI",
    ),
  };
}
