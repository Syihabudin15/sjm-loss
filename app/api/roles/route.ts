import { clearRoleCache } from "@/libs/Auth";
import prisma from "@/libs/Prisma";
import { Prisma, Role } from "../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const page = request.nextUrl.searchParams.get("page") || "1";
  const limit = request.nextUrl.searchParams.get("limit") || "50";
  const search = request.nextUrl.searchParams.get("search") || "";
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: Prisma.RoleWhereInput = {
    ...(search && { name: { contains: search } }),
    status: true,
  };

  const [data, total] = await Promise.all([
    prisma.role.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      orderBy: {
        updated_at: "desc",
      },
    }),
    prisma.role.count({ where }),
  ]);

  return NextResponse.json({
    status: 200,
    data: data,
    total: total,
  });
};

export const POST = async (request: NextRequest) => {
  const body: Role = await request.json();
  const { id, ...saved } = body;
  try {
    const genId = await generateID();
    await prisma.role.create({
      data: { id: genId, ...saved },
    });
    return NextResponse.json({
      status: 201,
      message: "Berhasil menyimpan data.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Gagal menyimpan data. internal server error.",
    });
  }
};

export const PUT = async (request: NextRequest) => {
  const body: Role = await request.json();
  const { id, ...updated } = body;
  try {
    await prisma.role.update({
      where: { id: id },
      data: { ...updated, updated_at: new Date() },
    });
    clearRoleCache(id);
    return NextResponse.json({
      status: 200,
      message: "Berhasil memperbarui data.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Gagal memperbarui data. internal server error.",
    });
  }
};

export const DELETE = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    await prisma.role.update({
      where: { id: id },
      data: { status: false, updated_at: new Date() },
    });
    return NextResponse.json({
      status: 200,
      message: "Berhasil menghapus data.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Gagal menghapus data. internal server error.",
    });
  }
};

export async function generateID() {
  const prefix = `ROLE`;
  const padLength = 6;
  const lastRecord = await prisma.role.count();
  return `${prefix}${String(lastRecord).padStart(padLength, "0")}`;
}
