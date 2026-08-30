import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import { IPelunasan } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";
import {
  ESettleStatus,
  ESubmissionStatus,
  Prisma,
} from "../../../generated/prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { GetUserSession } from "../utils/wheres";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "50";
  const search = req.nextUrl.searchParams.get("search") || "";
  const type = req.nextUrl.searchParams.get("type");
  const status_paid = req.nextUrl.searchParams.get("status_paid");
  const sumdanId = req.nextUrl.searchParams.get("sumdanId");
  const backdate = req.nextUrl.searchParams.get("backdate");
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { data: [], total: 0, status: 200 },
      { status: 200 },
    );
  // const user = await prisma.user.findFirst({
  //   where: { id: session.user.id },
  //   include: { Role: true, Cabang: true },
  // });
  const user = await GetUserSession(session);
  if (!user)
    return NextResponse.json(
      { data: [], total: 0, status: 200 },
      { status: 200 },
    );

  const where: Prisma.PelunasanWhereInput = {
    ...(search && {
      Dapem: {
        OR: [
          { no_contract: { contains: search } },
          {
            Debitur: {
              OR: [
                { fullname: { contains: search } },
                { nopen: { contains: search } },
                { no_skep: { contains: search } },
                { name_skep: { contains: search } },
                { account_number: { contains: search } },
              ],
            },
          },
        ],
      },
    }),
    ...(type && { type: type as ESettleStatus }),
    ...(status_paid && { status_paid: status_paid as ESubmissionStatus }),
    ...(sumdanId && { Dapem: { ProdukPembiayaan: { sumdanId } } }),
    ...(backdate && {
      created_at: {
        gte: moment(backdate.split(",")[0]).toDate(),
        lte: moment(backdate.split(",")[1]).toDate(),
      },
    }),
    ...(user.sumdanId && {
      Dapem: {
        ProdukPembiayaan: {
          sumdanId: user.sumdanId,
        },
      },
    }),
    ...(user.Role.data_status === "AREA" && {
      Dapem: {
        AO: { Cabang: { areaId: user.Cabang.areaId } },
        AOCabang: { Cabang: { areaId: user.Cabang.areaId } },
        AOArea: { Cabang: { areaId: user.Cabang.areaId } },
        User: { Cabang: { areaId: user.Cabang.areaId } },
      },
    }),
    ...(user.Role.data_status === "CABANG" && {
      Dapem: {
        AO: { cabangId: user.cabangId },
        AOCabang: { cabangId: user.cabangId },
        AOArea: { cabangId: user.cabangId },
        User: { cabangId: user.cabangId },
      },
    }),
    ...(user.Role.data_status === "USER" && {
      Dapem: {
        AO: { id: user.id },
        AOCabang: { id: user.id },
        AOArea: { id: user.id },
        User: { id: user.id },
      },
    }),
  };

  const [data, total] = await Promise.all([
    await prisma.pelunasan.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      orderBy: {
        created_at: "desc",
      },
      include: {
        Dapem: {
          include: {
            Debitur: true,
            ProdukPembiayaan: { include: { Sumdan: true } },
            JenisPembiayaan: true,
            User: {
              include: {
                Cabang: {
                  include: {
                    Area: true,
                  },
                },
              },
            },
            AO: {
              include: {
                Cabang: {
                  include: {
                    Area: true,
                  },
                },
              },
            },
            AOCabang: {
              include: {
                Cabang: {
                  include: {
                    Area: true,
                  },
                },
              },
            },
            AOArea: {
              include: {
                Cabang: {
                  include: {
                    Area: true,
                  },
                },
              },
            },
            Berkas: true,
            Jaminan: true,
            Angsurans: true,
            Dropping: true,
            Pelunasan: true,
            PayOffice: true,
            Insurance: true,
          },
        },
      },
    }),
    prisma.pelunasan.count({ where }),
  ]);

  return NextResponse.json(
    { msg: "OK", status: 200, data: serializeForApi(data), total },
    { status: 200 },
  );
};

export const POST = async (req: NextRequest) => {
  const data: IPelunasan = await req.json();
  try {
    const { id, Dapem, ...saved } = data;
    const genId = await generatePelunasanId();
    await prisma.pelunasan.create({ data: { ...saved, id: genId } });

    return NextResponse.json(
      { msg: "Data pelunasan berhasil ditambahkan", status: 200 },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const data: IPelunasan = await req.json();
  try {
    const { id, Dapem, ...saved } = data;
    await prisma.$transaction([
      prisma.pelunasan.update({
        where: { id },
        data: saved,
      }),
      prisma.dapem.update({
        where: { id: Dapem.id },
        data: {
          dropping_status:
            data.status_paid === "DISETUJUI" ? "LUNAS" : "DISETUJUI",
        },
      }),
    ]);

    return NextResponse.json(
      { msg: "Data pelunasan berhasil diperbarui", status: 200 },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json(
      { msg: "Not Found", status: 404 },
      { status: 404 },
    );
  await prisma.pelunasan.delete({ where: { id } });

  return NextResponse.json(
    { msg: "Data pelunasan berhasil dihapus", status: 200 },
    { status: 200 },
  );
};

export const PATCH = async (req: NextRequest) => {
  const data = await prisma.dapem.findMany({
    where: {
      OR: [{ Pelunasan: null }, { Pelunasan: { status_paid: "DITOLAK" } }],
      status: true,
      dropping_status: "DISETUJUI",
    },
    include: {
      Debitur: true,
      ProdukPembiayaan: { include: { Sumdan: true } },
      JenisPembiayaan: true,
      User: {
        include: {
          Cabang: {
            include: {
              Area: true,
            },
          },
        },
      },
      AO: {
        include: {
          Cabang: {
            include: {
              Area: true,
            },
          },
        },
      },
      AOCabang: {
        include: {
          Cabang: {
            include: {
              Area: true,
            },
          },
        },
      },
      AOArea: {
        include: {
          Cabang: {
            include: {
              Area: true,
            },
          },
        },
      },
      Berkas: true,
      Jaminan: true,
      Angsurans: true,
      Dropping: true,
      Pelunasan: true,
      PayOffice: true,
      Insurance: true,
    },
  });

  return NextResponse.json(
    { data: serializeForApi(data), msg: "OK", status: 200 },
    { status: 200 },
  );
};

async function generatePelunasanId() {
  const prefix = `PAIDOFF`;
  const padLength = 4;
  const lastRecord = await prisma.pelunasan.count({});
  return `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;
}
