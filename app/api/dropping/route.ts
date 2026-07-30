import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import { IDropping } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";
import { Prisma } from "../../../generated/prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { ORDapem, WheresDapem } from "../utils/wheres";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "50";
  const search = req.nextUrl.searchParams.get("search") || "";
  const sumdanId = req.nextUrl.searchParams.get("sumdanId") || "";
  const status = req.nextUrl.searchParams.get("status");
  const backdate = req.nextUrl.searchParams.get("backdate");
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { data: [], total: 0, status: 200 },
      { status: 200 },
    );
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: { Role: true, Cabang: true },
  });
  if (!user)
    return NextResponse.json(
      { data: [], total: 0, status: 200 },
      { status: 200 },
    );

  const whereFunc = WheresDapem(user);
  const where: Prisma.DroppingWhereInput = {
    ...(search && {
      OR: [
        { id: { contains: search } },
        {
          Dapems: {
            some: ORDapem(search),
          },
        },
      ],
    }),
    ...(sumdanId && { sumdanId: sumdanId }),
    ...(backdate && {
      created_at: {
        gte: moment(backdate.split(",")[0]).toDate(),
        lte: moment(backdate.split(",")[1]).toDate(),
      },
    }),
    ...(user.sumdanId && { sumdanId: user.sumdanId }),
    ...(status && { status: status === "true" ? true : false }),
    Dapems: {
      some: {
        status: true,
        ...whereFunc,
      },
    },
  };

  const [data, total] = await Promise.all([
    prisma.dropping.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      orderBy: {
        created_at: "desc",
      },
      include: {
        Sumdan: { select: { name: true, code: true } },
        Dapems: {
          where: {
            status: true,
            ...whereFunc,
          },
          include: {
            // Debitur: {
            //   select: {
            //     fullname: true,
            //     nopen: true,
            //     no_skep: true,
            //     date_skep: true,
            //     group_skep: true,
            //     account_number: true,
            //     account_name: true,
            //     birthplace: true,
            //     birthdate: true,
            //     nik: true,
            //     phone: true,
            //     address: true,
            //     ward: true,
            //     district: true,
            //     city: true,
            //     province: true,
            //     pos_code: true,
            //   },
            // },
            Debitur: true,
            ProdukPembiayaan: {
              include: {
                Sumdan: { select: { code: true, name: true, address: true } },
              },
            },
            JenisPembiayaan: {
              select: {
                name: true,
                status_mutasi: true,
                status_takeover: true,
              },
            },
            AO: {
              include: {
                Cabang: { include: { Area: { select: { name: true } } } },
              },
            },
            AOCabang: {
              include: {
                Cabang: { include: { Area: { select: { name: true } } } },
              },
            },
            AOArea: {
              include: {
                Cabang: { include: { Area: { select: { name: true } } } },
              },
            },
            User: {
              include: {
                Cabang: { include: { Area: { select: { name: true } } } },
              },
            },
          },
        },
      },
    }),
    await prisma.dropping.count({ where }),
  ]);

  return NextResponse.json({
    status: 200,
    data: serializeForApi(data),
    total: total,
  });
};

export const PUT = async (req: NextRequest) => {
  const data: IDropping = await req.json();

  try {
    const { Dapems, Sumdan, ...saved } = data;
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.dropping.update({ where: { id: data.id }, data: saved });
      for (const dpm of Dapems) {
        const {
          ProdukPembiayaan,
          JenisPembiayaan,
          AO,
          AOCabang,
          AOArea,
          User,
          Debitur,
          Angsurans,
          Berkas,
          Jaminan,
          Dropping,
          Pelunasan,
          AgentFronting,
          PayOffice,
          PrevPayOffice,
          Insurance,
          ...dpmData
        } = dpm;
        await prisma.dapem.update({
          where: { id: dpm.id },
          data: {
            ...dpmData,
            takeover_status: JenisPembiayaan.status_takeover
              ? "DRAFT"
              : "DISETUJUI",
            mutasi_status: JenisPembiayaan.status_mutasi
              ? "DRAFT"
              : "DISETUJUI",
          },
        });
      }
    });
    return NextResponse.json(
      {
        msg: "Data Pencairan berhasil diperbarui.",
        status: 200,
      },
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
      { status: 404, msg: "Not found!" },
      { status: 404 },
    );

  const find = await prisma.dropping.findFirst({
    where: { id },
    include: { Dapems: true },
  });
  if (find) {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.dapem.updateMany({
        where: { droppingId: id },
        data: { droppingId: null },
      });
      await tx.dropping.delete({ where: { id } });
      return true;
    });
  }

  return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
};
