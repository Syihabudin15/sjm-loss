import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import prisma from "@/libs/Prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../generated/prisma/client";

export const GET = async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { page = "1", limit = "50", search } = params;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const session = await getSession();

  if (!session)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    select: { id: true },
  });
  if (!user)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });

  const where: Prisma.DataSimulasiWhereInput = {
    ...(search && {
      OR: [{ fullname: { contains: search } }, { nopen: { contains: search } }],
    }),
    userId: user.id,
    status: true,
  };

  const [data, total] = await Promise.all([
    prisma.dataSimulasi.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      select: {
        id: true,
        fullname: true,
        salary: true,
        nopen: true,
        plafond: true,
        tenor: true,
        c_margin: true,
        c_margin_sumdan: true,
        c_adm: true,
        c_adm_sumdan: true,
        c_insurance: true,
        c_flagging: true,
        c_provisi: true,
        c_account: true,
        c_gov: true,
        c_takeover: true,
        c_information: true,
        c_mutasi: true,
        c_blokir: true,
        c_fee_banpot: true,
        c_ned: true,
        c_stamp: true,
        created_at: true,
        updated_at: true,
        User: { select: { fullname: true } },
        JenisPembiayaan: {
          select: { name: true, status_mutasi: true, status_takeover: true },
        },
        Product: {
          select: {
            name: true,
            Sumdan: { select: { code: true, name: true } },
          },
        },
      },
    }),
    prisma.dataSimulasi.count({ where }),
  ]);

  return NextResponse.json({
    status: 200,
    data: serializeForApi(data),
    total: total,
  });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { id, Product, JenisPembiayaan, User, Sumdan, ...saved } = body;
  if (!body.nopen || !body.fullname) {
    return NextResponse.json(
      {
        status: 400,
        msg: "Mohon sisi nama dan Nopen!.",
      },
      { status: 400 },
    );
  }
  try {
    await prisma.dataSimulasi.create({
      data: { ...saved },
    });
    return NextResponse.json({
      status: 201,
      msg: "Berhasil menyimpan data.",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        status: 500,
        msg: "Gagal menyimpan data. internal server error.",
      },
      { status: 500 },
    );
  }
};

export const PUT = async (request: NextRequest) => {
  const body = await request.json();
  const { id, Product, JenisPembiayaan, User, ...updated } = body;
  try {
    await prisma.dataSimulasi.update({
      where: { id: id },
      data: { ...updated, updated_at: new Date() },
    });
    return NextResponse.json({
      status: 200,
      msg: "Berhasil memperbarui data.",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      status: 500,
      msg: "Gagal memperbarui data. internal server error.",
    });
  }
};

export const DELETE = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    await prisma.dataSimulasi.update({
      where: { id: parseInt(id) },
      data: { status: false, updated_at: new Date() },
    });
    return NextResponse.json({
      status: 200,
      msg: "Berhasil menghapus data.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      msg: "Gagal menghapus data. internal server error.",
    });
  }
};

export const PATCH = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id");

  const data = await prisma.dataSimulasi.findFirst({
    where: { id: parseInt(id as string) },
    include: {
      JenisPembiayaan: true,
      Product: { include: { Sumdan: true } },
      User: true,
    },
  });
  return NextResponse.json({ msg: "ok", status: 200, data }, { status: 200 });
};
