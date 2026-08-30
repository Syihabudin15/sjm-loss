import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import { IAngsuran } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";
import { Angsuran, Prisma } from "../../../generated/prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { GetUserSession, ORDapem, WheresDapem } from "../utils/wheres";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "50";
  const search = req.nextUrl.searchParams.get("search");
  const sumdanId = req.nextUrl.searchParams.get("sumdanId");
  const backdate = req.nextUrl.searchParams.get("backdate");
  const paid_status = req.nextUrl.searchParams.get("paid_status");
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const session = await getSession();
  if (!session)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });
  // const user = await prisma.user.findFirst({
  //   where: { id: session.user.id },
  //   include: { Role: true, Cabang: true },
  // });
  const user = await GetUserSession(session);
  if (!user)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });

  const whereFunc = WheresDapem(user);
  const where: Prisma.DapemWhereInput = {
    status: true,
    dropping_status: "DISETUJUI",
    ...(search && ORDapem(search)),
    ...(sumdanId && { ProdukPembiayaan: { sumdanId: sumdanId } }),
    ...whereFunc,
    Angsurans: {
      some: {
        date_pay: {
          gte: moment(backdate || new Date())
            .startOf("month")
            .toDate(),
          lte: moment(backdate || new Date())
            .endOf("month")
            .toDate(),
        },
        ...(paid_status
          ? paid_status === "paid"
            ? { date_paid: { not: null } }
            : { date_paid: null }
          : {}),
      },
    },
  };

  const [data, total] = await Promise.all([
    prisma.dapem.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      orderBy: {
        created_at: "desc",
      },
      include: {
        Debitur: true,
        ProdukPembiayaan: { include: { Sumdan: true } },
        JenisPembiayaan: true,
        User: true,
        AO: { include: { Cabang: { include: { Area: true } } } },
        AOCabang: { include: { Cabang: { include: { Area: true } } } },
        AOArea: { include: { Cabang: { include: { Area: true } } } },
        Berkas: true,
        Jaminan: true,
        Angsurans: true,
        Dropping: true,
        Pelunasan: true,
        PayOffice: true,
        Insurance: true,
      },
    }),
    prisma.dapem.count({ where }),
  ]);

  return NextResponse.json(
    { data: serializeForApi(data), total, status: 200 },
    { status: 200 },
  );
};

export const POST = async (req: NextRequest) => {
  const data: IAngsuran[] = await req.json();

  try {
    const setData = data.map((d) => {
      const { Dapem, ...saved } = d;
      return prisma.angsuran.update({
        where: { id: d.id },
        data: { ...saved, date_paid: new Date() },
      });
    });
    await prisma.$transaction(setData);
    return NextResponse.json(
      { msg: "Update data berhasil", status: 200 },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error", status: 500 },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const data: Angsuran = await req.json();

  try {
    await prisma.angsuran.update({ where: { id: data.id }, data });

    return NextResponse.json(
      { msg: "Update data berhasil", status: 200 },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error", status: 500 },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");

  if (!id)
    return NextResponse.json(
      { msg: "Not Found", status: 404 },
      { status: 404 },
    );

  const find = await prisma.angsuran.findFirst({
    where: { id },
    include: {
      Dapem: {
        include: {
          ProdukPembiayaan: { include: { Sumdan: true } },
          AO: true,
          AOCabang: true,
          AOArea: true,
          Debitur: true,
        },
      },
    },
  });
  return NextResponse.json(
    { msg: "OK", data: serializeForApi(find), status: 200 },
    { status: 200 },
  );
};
