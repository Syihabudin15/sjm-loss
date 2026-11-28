import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import prisma from "@/libs/Prisma";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const { groupid, internalgroup } = params;

  try {
    let sumdanId = "";
    if (!internalgroup && groupid) {
      const findSumdan = await prisma.sumdan.findFirst({
        where: { group_id: groupid },
      });
      if (findSumdan) {
        if (findSumdan.allow_bot) {
          sumdanId = findSumdan.id;
        } else {
          return NextResponse.json(
            {
              msg: `Mitra belum diizinkan untk menggunakan SJM Notify`,
              status: 403,
            },
            { status: 403 },
          );
        }
      } else {
        return NextResponse.json(
          {
            msg: `Group ID belum terkonfigurasi di SJM Notify`,
            status: 403,
          },
          { status: 403 },
        );
      }
    }
    const find = await prisma.dapem.findMany({
      where: {
        ...(!internalgroup &&
          groupid && {
            ProdukPembiayaan: { sumdanId },
            slik_status: "DISETUJUI",
          }),
        status: true,
        OR: [
          {
            created_at: {
              gte: moment().startOf("month").toDate(),
              lte: moment().endOf("month").toDate(),
            },
          },
          {
            date_contract: {
              gte: moment().startOf("month").toDate(),
              lte: moment().endOf("month").toDate(),
            },
          },
          {
            Dropping: {
              process_at: {
                gte: moment().startOf("month").toDate(),
                lte: moment().endOf("month").toDate(),
              },
            },
          },
        ],
      },
    });
    const draft = find.filter((p) => p.dropping_status === "DRAFT");
    const batal = find.filter((p) => p.dropping_status === "BATAL");
    const ditolak = find.filter((p) => p.dropping_status === "DITOLAK");
    const pendingSumdan = find.filter(
      (p) => p.dropping_status === "PENDING" && p.verif_status === "DISETUJUI",
    );
    const pendingInternal = find.filter(
      (p) => p.dropping_status === "PENDING" && p.verif_status === "PENDING",
    );
    const proses = find.filter((p) => p.dropping_status === "PROSES");
    const dropping = find.filter((p) => p.dropping_status === "DISETUJUI");

    const replyText = `
📊 *UPDATE REPORT BULAN ${moment().format("MMMM YYYY")}*

• *Draft :* \`${draft.length} NOA\` | \`Rp. ${IDRFormat(draft.reduce((acc, curr) => acc + curr.plafond, 0))}\`
• *Batal :* \`${batal.length} NOA\` | \`Rp. ${IDRFormat(batal.reduce((acc, curr) => acc + curr.plafond, 0))}\`
• *Ditolak :* \`${ditolak.length} NOA\` | \`Rp. ${IDRFormat(ditolak.reduce((acc, curr) => acc + curr.plafond, 0))}\`
${
  internalgroup
    ? `• *Pending Internal:* \`${pendingInternal.length} NOA\` | \`Rp. ${IDRFormat(pendingInternal.reduce((acc, curr) => acc + curr.plafond, 0))}\`
• *Pending Mitra:* \`${pendingSumdan.length} NOA\` | \`Rp. ${IDRFormat(pendingSumdan.reduce((acc, curr) => acc + curr.plafond, 0))}\``
    : `• *Pending :* \`${pendingSumdan.length} NOA\` | \`Rp. ${IDRFormat(pendingSumdan.reduce((acc, curr) => acc + curr.plafond, 0))}\``
}
• *Proses/Akad :* \`${proses.length} NOA\` | \`Rp. ${IDRFormat(proses.reduce((acc, curr) => acc + curr.plafond, 0))}\`
• *Dropping :* \`${dropping.length} NOA\` | \`Rp. ${IDRFormat(dropping.reduce((acc, curr) => acc + curr.plafond, 0))}\`

> @SJM Notify
`;

    return NextResponse.json({ status: 200, msg: replyText }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 },
    );
  }
};
