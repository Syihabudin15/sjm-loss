import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import { IDocument } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";
import { EDocStatus, Prisma } from "../../../generated/prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { GetUserSession, ORDapem, WheresDapem } from "../utils/wheres";

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

  const whereFunc = WheresDapem(user);
  const where: Prisma.BerkasWhereInput = {
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
    ...(user.sumdanId && { sumdanId: user.sumdanId }),
    ...(backdate && {
      created_at: {
        gte: moment(backdate.split(",")[0]).toDate(),
        lte: moment(backdate.split(",")[1]).toDate(),
      },
    }),
    ...(status && { status: status as EDocStatus }),
    Dapems: {
      some: {
        status: true,
        ...whereFunc,
      },
    },
  };

  const [data, total] = await Promise.all([
    prisma.berkas.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      orderBy: {
        created_at: "desc",
      },
      include: {
        Sumdan: true,
        Dapems: {
          where: {
            status: true,
            ...whereFunc,
          },
          include: {
            Debitur: true,
            ProdukPembiayaan: true,
            JenisPembiayaan: true,
          },
        },
      },
    }),
    prisma.berkas.count({ where }),
  ]);

  return NextResponse.json({
    status: 200,
    data: serializeForApi(data),
    total: total,
  });
};

export const PUT = async (req: NextRequest) => {
  const data: IDocument = await req.json();

  try {
    const { Dapems, Sumdan, ...saved } = data;
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.berkas.update({ where: { id: data.id }, data: saved });
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
        await prisma.dapem.update({ where: { id: dpm.id }, data: dpmData });
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

  const find = await prisma.berkas.findFirst({
    where: { id },
    include: { Dapems: true },
  });
  if (find) {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.dapem.updateMany({
        where: { berkasId: id },
        data: { berkasId: null, document_status: "PUSAT" },
      });
      await tx.berkas.delete({ where: { id } });
      return true;
    });
  }

  return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
};
