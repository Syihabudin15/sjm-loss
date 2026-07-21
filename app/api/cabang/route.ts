import { getSession } from "@/libs/Auth";
import prisma from "@/libs/Prisma";
import { Cabang, Prisma } from "../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { page = "1", limit = "50", search, areaId } = params;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const session = await getSession();
  if (!session)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: { Role: true, Cabang: true },
  });
  if (!user)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });

  const where: Prisma.CabangWhereInput = {
    ...(search && { name: { contains: search } }),
    ...(areaId && { areaId: areaId }),
    ...(user.Role.data_status === "AREA" && { areaId: user.Cabang.areaId }),
    ...(user.Role.data_status === "CABANG" && { id: user.cabangId }),
    ...(user.Role.data_status === "USER" && {
      Users: { some: { id: user.id } },
    }),
    status: true,
  };

  const [data, total] = await Promise.all([
    prisma.cabang.findMany({
      where,
      take: parseInt(limit),
      skip: skip,
    }),
    prisma.cabang.count({ where }),
  ]);

  return NextResponse.json({ data: data, total, status: 200 }, { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const body: Cabang = await request.json();
  const { id, ...saved } = body;
  try {
    const generateId = await generateCabangId();
    await prisma.cabang.create({
      data: { id: generateId, ...saved },
    });
    return NextResponse.json({
      status: 201,
      msg: "Berhasil menyimpan data cabang.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      msg: "Gagal menyimpan data cabang. internal server error.",
    });
  }
};

export const PUT = async (request: NextRequest) => {
  const body: Cabang = await request.json();
  const { id, ...updated } = body;
  try {
    await prisma.cabang.update({
      where: { id: id },
      data: { ...updated, updated_at: new Date() },
    });
    return NextResponse.json({
      status: 200,
      msg: "Berhasil memperbarui data cabang.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      msg: "Gagal memperbarui data cabang. internal server error.",
    });
  }
};

export const DELETE = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    await prisma.cabang.update({
      where: { id: id },
      data: { status: false, updated_at: new Date() },
    });
    return NextResponse.json({
      status: 200,
      msg: "Berhasil menghapus data cabang.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      msg: "Gagal menghapus data cabang. internal server error.",
    });
  }
};

export async function generateCabangId() {
  const prefix = "UP";
  const padLength = 4;
  const lastRecord = await prisma.cabang.count({});
  return `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;
}
