import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import prisma from "@/libs/Prisma";
import { NextRequest, NextResponse } from "next/server";
import { WheresDapem } from "../utils/wheres";
import { Prisma } from "../../../generated/prisma/client";

export const GET = async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { page = "1", limit = "50", search, includes, includeproduct } = params;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const session = await getSession();

  if (!session)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: {
      AgentFronting: { include: { SumdanAgentFrontings: true } },
      Role: true,
      Cabang: true,
    },
  });
  if (!user)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });

  const whereFunc = WheresDapem(user);
  const where: Prisma.SumdanWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search } },
        { code: { contains: search } },
        { contract_no: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ],
    }),
    ...(user.sumdanId && { id: user.sumdanId }),
    ...(user.agentFrontingId && {
      SumdanAgentFrontings: {
        some: {
          sumdanId: {
            in: user.AgentFronting?.SumdanAgentFrontings.map(
              (s: any) => s.sumdanId,
            ),
          },
        },
      },
    }),
    status: true,
  };

  const [data, total] = await Promise.all([
    prisma.sumdan.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      include: {
        ...(includes && {
          ProdukPembiayaans: {
            include: {
              Dapems: {
                where: {
                  status: true,
                  dropping_status: { in: ["DISETUJUI", "LUNAS"] },
                  ...whereFunc,
                },
                include: { Angsurans: true },
              },
            },
          },
        }),
        ...(includeproduct && {
          ProdukPembiayaans: { include: { Sumdan: true } },
        }),
      },
    }),
    prisma.sumdan.count({ where }),
  ]);

  return NextResponse.json({
    status: 200,
    data: serializeForApi(data),
    total: total,
  });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { id, ProductPembiayaans, ...saved } = body;
  try {
    const genId = await generateID();
    await prisma.sumdan.create({
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
  const body = await request.json();
  const { id, ProductPembiayaans, file, ...updated } = body;
  try {
    await prisma.sumdan.update({
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
    await prisma.sumdan.update({
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

export const PATCH = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id");

  const data = await prisma.sumdan.findFirst({
    where: { id: id as string },
    include: {
      ProdukPembiayaans: true,
    },
  });
  return NextResponse.json({ msg: "ok", status: 200, data }, { status: 200 });
};

export async function generateID() {
  const prefix = `MITRA`;
  const padLength = 4;
  const lastRecord = await prisma.sumdan.count();
  return `${prefix}${String(lastRecord).padStart(padLength, "0")}`;
}
