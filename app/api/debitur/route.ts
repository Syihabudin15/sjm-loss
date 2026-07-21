import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import prisma from "@/libs/Prisma";
import { Prisma } from "../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { WheresDapem } from "../utils/wheres";

export const GET = async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const {
    page = "1",
    limit = "50",
    search,
    address,
    group_skep,
    payOfficeId,
    aktif,
  } = params;
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

  const whereFunc = WheresDapem(user);
  const where: Prisma.DebiturWhereInput = {
    ...(search && {
      OR: [
        { nopen: { contains: search } },
        { fullname: { contains: search } },
        { account_number: { contains: search } },
        { no_skep: { contains: search } },
        { name_skep: { contains: search } },
      ],
    }),
    ...(address && {
      OR: [
        { address: { contains: address } },
        { ward: { contains: address } },
        { district: { contains: address } },
        { city: { contains: address } },
        { province: { contains: address } },
        { pos_code: { contains: address } },
      ],
    }),
    ...(group_skep && { group_skep: group_skep }),
    ...(payOfficeId && { payOfficeId: payOfficeId }),
    Dapems: {
      some: {
        ...(aktif && {
          dropping_status: { in: ["DISETUJUI", "LUNAS", "PROSES"] },
          status: true,
        }),
        ...whereFunc,
      },
    },
  };
  const [data, total] = await Promise.all([
    prisma.debitur.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      include: {
        Dapems: {
          where: {
            status: true,
            ...whereFunc,
          },
          include: {
            ProdukPembiayaan: { include: { Sumdan: true } },
            JenisPembiayaan: true,
            AO: { include: { Cabang: { include: { Area: true } } } },
            AOCabang: { include: { Cabang: { include: { Area: true } } } },
            AOArea: { include: { Cabang: { include: { Area: true } } } },
            Angsurans: true,
          },
        },
        PayOffice: true,
      },
    }),
    prisma.debitur.count({ where }),
  ]);

  return NextResponse.json({
    status: 200,
    data: serializeForApi(data),
    total: total,
  });
};

export const PATCH = async (request: NextRequest) => {
  const nopen = request.nextUrl.searchParams.get("nopen");
  if (!nopen) {
    return NextResponse.json(
      { status: 400, msg: "Tidak ada nopen dalam parameter!" },
      { status: 400 },
    );
  }

  const find = await prisma.debitur.findFirst({
    where: { nopen: nopen },
  });
  if (!find) {
    return NextResponse.json(
      { status: 404, msg: "Debitur dengan nopen tersebut tidak ditemukan!" },
      { status: 404 },
    );
  }
  return NextResponse.json(
    { status: 200, msg: "OK", data: serializeForApi(find) },
    { status: 200 },
  );
};
