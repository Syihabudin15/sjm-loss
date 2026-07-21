import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import prisma from "@/libs/Prisma";
import { Prisma, SumdanAgentFronting } from "../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { WheresDapem } from "../utils/wheres";

export const GET = async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { page = "1", limit = "50", search, includes } = params;
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

  const where: Prisma.AgentFrontingWhereInput = {
    ...(search && {
      OR: [
        { id: { contains: search } },
        { name: { contains: search } },
        { code: { contains: search } },
      ],
    }),
    ...(user.agentFrontingId && { id: user.agentFrontingId }),
  };

  const whereFunc = WheresDapem(user);
  const [data, total] = await Promise.all([
    prisma.agentFronting.findMany({
      where: where,
      skip: skip,
      take: parseInt(limit),
      include: {
        ...(includes && {
          SumdanAgentFrontings: {
            include: { Sumdan: { include: { ProdukPembiayaans: true } } },
          },
          Users: { include: { Cabang: { include: { Area: true } } } },
          Dapems: {
            where: {
              status: true,
              dropping_status: "DISETUJUI",
              ...whereFunc,
            },
          },
        }),
      },
    }),
    prisma.agentFronting.count({ where }),
  ]);

  return NextResponse.json(
    { data: serializeForApi(data), total, status: 200 },
    { status: 200 },
  );
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  const find = await prisma.agentFronting.findFirst({
    where: { id: data.id },
  });
  if (find)
    return NextResponse.json(
      { msg: "ID sudah digunakan!", status: 400 },
      { status: 400 },
    );
  try {
    const { id, SumdanAgentFrontings, Users, Dapems, ...saved } = data;
    const genId = await generateID();
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const agent = await tx.agentFronting.create({
        data: { id: genId, ...saved },
      });
      await tx.sumdanAgentFronting.createMany({
        data: SumdanAgentFrontings.map((s: SumdanAgentFronting) => ({
          sumdanId: s.sumdanId,
          agentFrontingId: agent.id,
        })),
      });
      return true;
    });

    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  const find = await prisma.agentFronting.findFirst({
    where: { id: data.id },
  });
  if (!find)
    return NextResponse.json(
      { msg: "ID atau No Akun sudah digunakan!", status: 400 },
      { status: 400 },
    );

  try {
    const { id, SumdanAgentFrontings, Users, Dapems, ...saved } = data;
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const agent = await tx.agentFronting.update({
        where: { id: id },
        data: saved,
      });
      await tx.sumdanAgentFronting.deleteMany({
        where: { agentFrontingId: data.id },
      });
      await tx.sumdanAgentFronting.createMany({
        data: SumdanAgentFrontings.map((s: SumdanAgentFronting) => ({
          sumdanId: s.sumdanId,
          agentFrontingId: agent.id,
        })),
      });
      return true;
    });

    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id") || "1";
  if (!id)
    return NextResponse.json(
      { msg: "ID tidak ditemukan!", status: 404 },
      { status: 404 },
    );
  try {
    await prisma.agentFronting.delete({
      where: { id },
    });

    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 },
    );
  }
};

export async function generateID() {
  const prefix = `AGENT`;
  const padLength = 4;
  const lastRecord = await prisma.agentFronting.count();
  return `${prefix}${String(lastRecord).padStart(padLength, "0")}`;
}
