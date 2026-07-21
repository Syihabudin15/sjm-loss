import prisma from "@/libs/Prisma";

import { JenisPembiayaan, Prisma } from "../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { page = "1", limit = "50", search } = params;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: Prisma.JenisPembiayaanWhereInput = {
    ...(search && { name: { contains: search } }),
    status: true,
  };
  const [data, total] = await Promise.all([
    prisma.jenisPembiayaan.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
    }),
    prisma.jenisPembiayaan.count({ where }),
  ]);

  return NextResponse.json({
    status: 200,
    data: data,
    total: total,
  });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { id, ...saved } = body;
  try {
    const genId = await generateID();
    await prisma.jenisPembiayaan.create({
      data: { id: genId, ...saved },
    });

    return NextResponse.json({
      status: 201,
      msg: "Berhasil menyimpan data.",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      status: 500,
      msg: "Gagal menyimpan data. internal server error.",
    });
  }
};

export const PUT = async (request: NextRequest) => {
  const body: JenisPembiayaan = await request.json();
  const { id, ...updated } = body;
  try {
    await prisma.jenisPembiayaan.update({
      where: { id: id },
      data: { ...updated, updated_at: new Date() },
    });
    return NextResponse.json({
      status: 200,
      msg: "Berhasil memperbarui data.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      msg: "Gagal memperbarui data. internal server error.",
    });
  }
};

export const DELETE = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    await prisma.jenisPembiayaan.update({
      where: { id: id },
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

export async function generateID() {
  const prefix = `TYPE`;
  const padLength = 4;
  const lastRecord = await prisma.jenisPembiayaan.count();
  return `${prefix}${String(lastRecord).padStart(padLength, "0")}`;
}
