import { GetRoman, serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import { IDocument } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";
import { Prisma } from "../../../../generated/prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import { WheresDapem } from "../../utils/wheres";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "50";
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { data: [], total: 0, status: 200 },
      { status: 200 },
    );
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: {
      Role: true,
      Cabang: true,
      AgentFronting: { include: { SumdanAgentFrontings: true } },
    },
  });
  if (!user)
    return NextResponse.json(
      { data: [], total: 0, status: 200 },
      { status: 200 },
    );

  const whereFunc = WheresDapem(user);
  const where: Prisma.SumdanWhereInput = {
    status: true,
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
  };

  const [data, total] = await Promise.all([
    prisma.sumdan.findMany({
      where,
      include: {
        ProdukPembiayaans: {
          include: {
            Dapems: {
              include: {
                Debitur: true,
                JenisPembiayaan: true,
                ProdukPembiayaan: { include: { Sumdan: true } },
              },
              where: {
                dropping_status: { in: ["DISETUJUI", "LUNAS"] },
                berkasId: null,
                document_status: { notIn: ["DELIVERY", "MITRA"] },
                ...whereFunc,
              },
              orderBy: { created_at: "desc" },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      skip: skip,
      take: parseInt(limit),
    }),
    prisma.sumdan.count({ where }),
  ]);

  const newData = data.map((d: any) => ({
    ...d,
    Dapems: d.ProdukPembiayaans.flatMap((pd: any) => pd.Dapems),
  }));

  return NextResponse.json({
    status: 200,
    data: serializeForApi(newData),
    total: total,
  });
};

export const POST = async (req: NextRequest) => {
  const data: IDocument = await req.json();

  try {
    const { Sumdan, Dapems, ...saved } = data;
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const drop = await tx.berkas.create({ data: saved });
      for (const dpm of Dapems) {
        await tx.dapem.update({
          where: { id: dpm.id },
          data: { berkasId: drop.id, document_status: "DELIVERY" },
        });
      }
      return true;
    });

    return NextResponse.json(
      {
        msg: "Data Penyerahan Berkas berhasil dicetak. mohon cek di menu Permohonana SD",
        status: 200,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error!", status: 500 },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id") || "id";
  const { created_at } = await req.json();
  const count = await prisma.berkas.count({ where: { sumdanId: id } });
  const sumdan = await prisma.sumdan.findFirst({ where: { id } });
  if (!sumdan)
    return NextResponse.json(
      { msg: "Id tidak ditemukan!", status: 400 },
      { status: 400 },
    );

  const nomor = `${String(count + 1).padStart(3, "0")}/${process.env.NEXT_PUBLIC_APP_CODE_FILE}/SD-${sumdan.code.replace("BPR", "").replace("BANK", "").replace(" ", "")}/${GetRoman(moment(created_at || new Date()).month() + 1)}/${moment(created_at || new Date()).year()}`;

  return NextResponse.json({ data: nomor, status: 200 }, { status: 200 });
};
