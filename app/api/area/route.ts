import { getSession } from "@/libs/Auth";
import { IArea } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";

import { Prisma } from "../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { page = "1", limit = "50", search } = params;
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

  const where: Prisma.AreaWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search } },
        { Cabangs: { some: { name: { contains: search } } } },
      ],
    }),
    ...(user.Role.data_status === "AREA" && { id: user.Cabang.areaId }),
    ...(user.Role.data_status === "CABANG" && {
      Cabangs: { some: { id: user.cabangId } },
    }),
    ...(user.Role.data_status === "USER" && {
      Cabangs: { some: { Users: { some: { id: user.id } } } },
    }),
    status: true,
  };
  const [data, total] = await Promise.all([
    prisma.area.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      orderBy: {
        created_at: "desc",
      },
      include: {
        Cabangs: {
          where: {
            ...(user.Role.data_status === "CABANG" && { id: user.cabangId }),
            ...(user.Role.data_status === "USER" && {
              Users: { some: { id: user.id } },
            }),
            status: true,
          },
        },
      },
    }),
    prisma.area.count({ where }),
  ]);

  return NextResponse.json({
    status: 200,
    data: data,
    total: total,
  });
};

export const POST = async (request: NextRequest) => {
  const body: IArea = await request.json();
  const { id, Cabangs, ...saved } = body;
  try {
    const generateId = await generateAreaId();
    await Promise.all([
      prisma.area.create({
        data: { id: generateId, ...saved },
      }),
      // HeadAreas.map((h) => {
      //   const { id: hId, ...headarea } = h;
      //   return prisma.headArea.create({
      //     data: { ...headarea, areaId: generateId },
      //   });
      // }),
    ]);
    return NextResponse.json({
      status: 201,
      msg: "Berhasil menyimpan data area.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      msg: "Gagal menyimpan data area. internal server error.",
    });
  }
};

export const PUT = async (request: NextRequest) => {
  const body: IArea = await request.json();
  const { id, Cabangs, ...updated } = body;
  try {
    await Promise.all([
      prisma.area.update({
        where: { id: id },
        data: { ...updated, updated_at: new Date() },
      }),
      // HeadAreas.map((h) => {
      //   const { id: hId, ...headarea } = h;
      //   return prisma.headArea.upsert({
      //     where: { id: hId },
      //     create: headarea,
      //     update: { ...headarea, updated_at: new Date() },
      //   });
      // }),
    ]);
    return NextResponse.json({
      status: 200,
      msg: "Berhasil memperbarui data area.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      msg: "Gagal memperbarui data area. internal server error.",
    });
  }
};

export const DELETE = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    await prisma.area.update({
      where: { id: id },
      data: { status: false, updated_at: new Date() },
    });
    return NextResponse.json({
      status: 200,
      msg: "Berhasil menghapus data area.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      msg: "Gagal menghapus data area. internal server error.",
    });
  }
};

export async function generateAreaId() {
  const prefix = "KW";
  const padLength = 3;
  const lastRecord = await prisma.area.count({});
  return `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;
}
