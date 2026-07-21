import prisma from "@/libs/Prisma";
import { Prisma } from "../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { page = "1", limit = "50", search, mitra } = params;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: Prisma.PayOfficeWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search } },
        { code: { contains: search } },
        { no_contract: { contains: search } },
        { pic: { contains: search } },
      ],
    }),
    status: true,
    ...(mitra && { mitra: mitra === "true" }),
  };

  const [data, total] = await Promise.all([
    prisma.payOffice.findMany({ where, take: parseInt(limit), skip: skip }),
    prisma.payOffice.count({ where }),
  ]);

  return NextResponse.json({ data: data, total, status: 200 }, { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { id, Dapems, ...saved } = body;
  try {
    const genId = await generateID();
    await prisma.payOffice.create({
      data: { id: genId, ...saved },
    });
    return NextResponse.json({
      status: 201,
      msg: "Berhasil menyimpan data.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      msg: "Gagal menyimpan data. internal server error.",
    });
  }
};

export const PUT = async (request: NextRequest) => {
  const body = await request.json();
  const { id, Dapems, ...updated } = body;
  try {
    await prisma.payOffice.update({
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
    await prisma.payOffice.update({
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
  const prefix = `PAY`;
  const padLength = 4;
  const lastRecord = await prisma.payOffice.count();
  return `${prefix}${String(lastRecord).padStart(padLength, "0")}`;
}
