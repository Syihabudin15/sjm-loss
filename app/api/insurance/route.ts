import prisma from "@/libs/Prisma";
import { Insurance, Prisma } from "../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { page = "1", limit = "50", search } = params;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: Prisma.InsuranceWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search } },
        { code: { contains: search } },
        { no_contract: { contains: search } },
        { pic: { contains: search } },
      ],
    }),
    status: true,
  };

  const [data, total] = await Promise.all([
    prisma.insurance.findMany({ where, take: parseInt(limit), skip: skip }),
    prisma.insurance.count({ where }),
  ]);

  return NextResponse.json({ data: data, total, status: 200 }, { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { id, Dapems, ...saved } = body;
  try {
    const genId = await generateID();
    await prisma.insurance.create({
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
  const body: Insurance = await request.json();
  const { id, ...updated } = body;
  try {
    await prisma.insurance.update({
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
    await prisma.insurance.update({
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
  const prefix = `INSC`;
  const padLength = 4;
  const lastRecord = await prisma.insurance.count();
  return `${prefix}${String(lastRecord).padStart(padLength, "0")}`;
}
