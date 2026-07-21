import { getSession } from "@/libs/Auth";
import prisma from "@/libs/Prisma";
import { Prisma } from "../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

  try {
    const where: Prisma.DapemWhereInput = {
      status: true,
      ...(user.sumdanId && {
        ProdukPembiayaan: { sumdanId: user.sumdanId },
      }),
      ...(user.agentFrontingId && { agentFrontingId: user.agentFrontingId }),
      ...(user.Role.data_status === "AREA" && {
        OR: [
          { AO: { Cabang: { areaId: user.Cabang.areaId } } },
          { AOCabang: { Cabang: { areaId: user.Cabang.areaId } } },
          { AOArea: { Cabang: { areaId: user.Cabang.areaId } } },
          { User: { Cabang: { areaId: user.Cabang.areaId } } },
        ],
      }),
      ...(user.Role.data_status === "CABANG" && {
        OR: [
          { AO: { cabangId: user.cabangId } },
          { AOCabang: { cabangId: user.cabangId } },
          { AOArea: { cabangId: user.cabangId } },
          { User: { cabangId: user.cabangId } },
        ],
      }),
      ...(user.Role.data_status === "USER" && {
        OR: [
          { AO: { id: user.id } },
          { AOCabang: { id: user.id } },
          { AOArea: { id: user.id } },
          { User: { id: user.id } },
        ],
      }),
    };
    const [
      draft,
      verif,
      slik,
      approv,
      akad,
      printSI,
      SI,
      printSD,
      SD,
      printTTPJ,
      TTPJ,
      pelunasan,
    ] = await Promise.all([
      prisma.dapem.count({
        where: {
          dropping_status: "DRAFT",
          ...where,
        },
      }),
      prisma.dapem.count({
        where: {
          dropping_status: "PENDING",
          verif_status: "PENDING",
          ...where,
        },
      }),
      prisma.dapem.count({
        where: {
          dropping_status: "PENDING",
          slik_status: "PENDING",
          ...where,
        },
      }),
      prisma.dapem.count({
        where: {
          dropping_status: "PENDING",
          approv_status: "PENDING",
          slik_status: "DISETUJUI",
          verif_status: "DISETUJUI",
          ...where,
        },
      }),
      prisma.dapem.count({
        where: {
          dropping_status: "PROSES",
          approv_status: "DISETUJUI",
          file_contract: null,
          ...where,
        },
      }),
      prisma.dapem.count({
        where: {
          dropping_status: "PROSES",
          approv_status: "DISETUJUI",
          file_contract: { not: null },
          video_contract: { not: null },
          droppingId: null,
          ...where,
        },
      }),
      prisma.dropping.count({
        where: {
          status: false,
          ...(user.sumdanId && {
            sumdanId: user.sumdanId,
          }),
        },
      }),
      prisma.dapem.count({
        where: {
          dropping_status: "DISETUJUI",
          berkasId: null,
          ...where,
        },
      }),
      prisma.berkas.count({
        where: {
          status: { not: "MITRA" },
          ...(user.sumdanId && {
            sumdanId: user.sumdanId,
          }),
          Dapems: {
            some: {
              ...where,
            },
          },
        },
      }),
      prisma.dapem.count({
        where: {
          dropping_status: "DISETUJUI",
          jaminanId: null,
          ...where,
        },
      }),
      prisma.jaminan.count({
        where: {
          status: { not: "MITRA" },
          ...(user.sumdanId && {
            sumdanId: user.sumdanId,
          }),
          Dapems: {
            some: {
              ...where,
            },
          },
        },
      }),
      prisma.pelunasan.count({
        where: {
          Dapem: {
            ...where,
          },
          OR: [
            { status_paid: "PENDING" },
            { guarantee_status: { not: { in: ["PUSAT", "UNIT"] } } },
          ],
        },
      }),
    ]);

    return NextResponse.json(
      {
        data: {
          draft,
          verif,
          slik,
          approv,
          akad,
          printSI,
          SI,
          printSD,
          SD,
          printTTPJ,
          TTPJ,
          pelunasan,
        },
        status: 200,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      data: {
        draft: 0,
        verif: 0,
        slik: 0,
        approv: 0,
        akad: 0,
        printSI: 0,
        SI: 0,
        printSD: 0,
        SD: 0,
        printTTPJ: 0,
        TTPJ: 0,
        pelunasan: 0,
      },
    });
  }
};
