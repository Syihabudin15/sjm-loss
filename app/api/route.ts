import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import prisma from "@/libs/Prisma";
import { Prisma } from "../../generated/prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { WheresDapem } from "./utils/wheres";

export const GET = async (req: NextRequest) => {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ data: null, status: 400 }, { status: 400 });
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: { Role: true, Cabang: true },
  });
  if (!user)
    return NextResponse.json({ data: null, status: 400 }, { status: 400 });

  const where: Prisma.DapemWhereInput = {
    status: true,
    ...WheresDapem(user),
  };

  const [alldata, droppingall, droppingmonthly, byjepem, sumdan] =
    await Promise.all([
      prisma.dapem.findMany({ where }),
      prisma.dapem.findMany({
        where: {
          dropping_status: { in: ["DISETUJUI", "LUNAS"] },
          ...where,
        },
        include: {
          Dropping: { select: { process_at: true } },
          Debitur: { select: { group_skep: true } },
          Angsurans: {
            where: {
              date_pay: {
                lte: moment().endOf("month").toDate(),
              },
            },
          },
        },
      }),
      prisma.dapem.findMany({
        where: {
          dropping_status: { in: ["DISETUJUI", "LUNAS"] },
          status: true,
          Dropping: {
            process_at: {
              gte: moment().startOf("month").toDate(),
              lte: moment().endOf("month").toDate(),
            },
          },
          ...where,
        },
        include: {
          Dropping: { select: { process_at: true } },
          Debitur: { select: { group_skep: true } },
          Angsurans: {
            where: { date_paid: null },
          },
        },
      }),
      prisma.jenisPembiayaan.findMany({
        include: {
          Dapems: {
            where: {
              dropping_status: { in: ["DISETUJUI", "LUNAS"] },
              ...where,
            },
          },
        },
      }),
      prisma.sumdan.findMany({
        where: {
          ...(user.sumdanId && { id: user.sumdanId }),
          ...(user.agentFrontingId && {
            SumdanAgentFrontings: {
              some: { agentFrontingId: user.agentFrontingId },
            },
          }),
        },
        include: {
          ProdukPembiayaans: {
            include: {
              Dapems: {
                where: {
                  dropping_status: { in: ["DISETUJUI", "LUNAS"] },
                  ...where,
                },
              },
            },
          },
        },
      }),
    ]);

  const prevmonth = [];

  // Mulai dari bulan sekarang
  for (let i = 5; i >= 0; i--) {
    // .clone() sangat penting agar tidak merubah variabel bulan utama
    // .subtract(i, 'months') untuk mundur ke belakang
    const targetMonth = moment().subtract(i, "months");

    const temp = droppingall.filter((dp: any) => {
      return (
        dp.Dropping &&
        moment(dp.Dropping.process_at).isSame(targetMonth, "month") &&
        moment(dp.Dropping.process_at).isSame(targetMonth, "year")
      ); // Pastikan tahunnya juga sama
    });

    prevmonth.push({
      month: targetMonth.format("MMM YY"),
      data: temp,
    });
  }

  return NextResponse.json(
    {
      alldata: serializeForApi(alldata),
      droppingall: serializeForApi(droppingall),
      droppingmonthly: serializeForApi(droppingmonthly),
      prevmonth: serializeForApi(prevmonth),
      byjepem: serializeForApi(byjepem),
      bysumdan: serializeForApi(sumdan),
      status: 200,
    },
    { status: 200 },
  );
};

// DAHBOARD BISNIS
export const POST = async (req: NextRequest) => {
  const backdate = req.nextUrl.searchParams.get("backdate");

  const session = await getSession();
  if (!session)
    return NextResponse.json({ data: null, status: 400 }, { status: 400 });
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: { Role: true, Cabang: true },
  });
  if (!user)
    return NextResponse.json({ data: null, status: 400 }, { status: 400 });

  const where: Prisma.DapemWhereInput = {
    dropping_status: "DISETUJUI",
    status: true,
    ...(user.sumdanId && {
      ProdukPembiayaan: { sumdanId: user.sumdanId },
    }),
    ...(user.Role.data_status === "AREA" && {
      OR: [
        { AO: { Cabang: { areaId: user.Cabang.areaId } } },
        { AOCabang: { Cabang: { areaId: user.Cabang.areaId } } },
        { AOArea: { Cabang: { areaId: user.Cabang.areaId } } },
      ],
    }),
    ...(user.Role.data_status === "CABANG" && {
      OR: [
        { AO: { cabangId: user.cabangId } },
        { AOCabang: { cabangId: user.cabangId } },
        { AOArea: { cabangId: user.cabangId } },
      ],
    }),
    ...(user.Role.data_status === "USER" && {
      OR: [
        { AO: { id: user.id } },
        { AOCabang: { id: user.id } },
        { AOArea: { id: user.id } },
      ],
    }),
    ...(user.agentFrontingId && {
      agentFrontingId: user.agentFrontingId,
    }),
    ...(backdate && {
      created_at: {
        gte: moment(backdate.split(",")[0]).toDate(),
        lte: moment(backdate.split(",")[1]).toDate(),
      },
    }),
  };

  const [area, sumdan] = await Promise.all([
    prisma.area.findMany({
      where: {
        status: true,
        ...(user.Role.data_status === "AREA" && { id: user.Cabang.areaId }),
        ...(user.Role.data_status === "CABANG" && {
          Cabangs: { some: { id: user.cabangId } },
        }),
        ...(user.Role.data_status === "USER" && {
          Cabangs: { some: { Users: { some: { id: user.id } } } },
        }),
      },
      include: {
        Cabangs: {
          include: {
            Users: {
              include: {
                AOs: { where },
                AOCabangs: { where },
                AOAreas: { where },
              },
            },
          },
        },
      },
    }),
    prisma.sumdan.findMany({
      where: {
        ...(user.sumdanId && { id: user.sumdanId }),
        ...(user.agentFrontingId && {
          SumdanAgentFrontings: {
            some: { agentFrontingId: user.agentFrontingId },
          },
        }),
      },
      include: {
        ProdukPembiayaans: {
          include: {
            Dapems: { where },
          },
        },
      },
    }),
  ]);

  return NextResponse.json(
    { area: serializeForApi(area), sumdan: serializeForApi(sumdan) },
    { status: 200 },
  );
};
