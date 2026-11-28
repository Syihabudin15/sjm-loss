import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import prisma from "@/libs/Prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const [data, jenis, sumdan, payOffice] = await Promise.all([
      prisma.oTSDefault.findFirst({
        orderBy: { id: "asc" },
        include: {
          ProdukPembiayaan: { include: { Sumdan: true } },
          JenisPembiayaan: true,
          PayOffice: true,
          Sumdan: {
            include: {
              ProdukPembiayaans: {
                where: { status: true },
                orderBy: { name: "asc" },
              },
            },
          },
        },
      }),
      prisma.jenisPembiayaan.findMany({
        where: { status: true },
        orderBy: { name: "asc" },
      }),
      prisma.sumdan.findMany({
        where: { status: true, fronting: false },
        orderBy: { name: "asc" },
        include: {
          ProdukPembiayaans: {
            where: { status: true },
            orderBy: { name: "asc" },
          },
        },
      }),
      prisma.payOffice.findMany({
        where: { status: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, code: true },
      }),
    ]);
    return NextResponse.json(
      {
        data: serializeForApi(data),
        jenis,
        sumdan: serializeForApi(sumdan),
        payOffice,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to load OTS setup:", error);
    return NextResponse.json(
      { msg: "Gagal memuat konfigurasi OTS." },
      { status: 500 },
    );
  }
};

export const PUT = async (request: NextRequest) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { msg: "Format data konfigurasi tidak valid." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { msg: "Format data konfigurasi tidak valid." },
      { status: 400 },
    );
  }

  const values = body as Record<string, unknown>;
  const {
    pagesize,
    reset_day,
    max_dev,
    max_daily_get,
    produkPembiayaanId,
    sumdanId,
    payOfficeId,
    jenisPembiayaanId,
  } = values;
  const productId =
    typeof produkPembiayaanId === "string" && produkPembiayaanId.trim()
      ? produkPembiayaanId.trim()
      : null;

  if (
    typeof pagesize !== "number" ||
    !Number.isInteger(pagesize) ||
    pagesize < 0 ||
    typeof reset_day !== "number" ||
    !Number.isInteger(reset_day) ||
    reset_day < 1 ||
    reset_day > 31 ||
    typeof max_dev !== "number" ||
    !Number.isFinite(max_dev) ||
    max_dev < 0 ||
    typeof max_daily_get !== "number" ||
    !Number.isInteger(max_daily_get) ||
    max_daily_get < 1 ||
    (produkPembiayaanId !== undefined &&
      produkPembiayaanId !== null &&
      typeof produkPembiayaanId !== "string") ||
    typeof sumdanId !== "string" ||
    !sumdanId ||
    typeof payOfficeId !== "string" ||
    !payOfficeId ||
    typeof jenisPembiayaanId !== "string" ||
    !jenisPembiayaanId
  ) {
    return NextResponse.json(
      { msg: "Periksa kembali nilai konfigurasi OTS." },
      { status: 400 },
    );
  }

  try {
    const [sumdan, payOffice, jenis, product] = await Promise.all([
      prisma.sumdan.findFirst({
        where: { id: sumdanId, status: true, fronting: false },
        select: { id: true },
      }),
      prisma.payOffice.findFirst({
        where: { id: payOfficeId, status: true },
        select: { id: true },
      }),
      prisma.jenisPembiayaan.findFirst({
        where: { id: jenisPembiayaanId, status: true },
        select: { id: true },
      }),
      productId
        ? prisma.produkPembiayaan.findFirst({
            where: {
              id: productId,
              sumdanId,
              status: true,
              Sumdan: { status: true, fronting: false },
            },
            select: { id: true },
          })
        : Promise.resolve(null),
    ]);

    if (!sumdan || !payOffice || !jenis || (productId && !product)) {
      return NextResponse.json(
        {
          msg: "Sumdan, kantor bayar, jenis, atau produk pembiayaan tidak tersedia atau tidak sesuai.",
        },
        { status: 400 },
      );
    }

    const data = {
      pagesize,
      reset_day,
      max_dev,
      max_daily_get,
      produkPembiayaanId: productId,
      sumdanId,
      payOfficeId,
      jenisPembiayaanId,
    };
    const existing = await prisma.oTSDefault.findFirst({
      orderBy: { id: "asc" },
      select: { id: true },
    });
    const saved = existing
      ? await prisma.oTSDefault.update({
          where: { id: existing.id },
          data,
          include: {
            ProdukPembiayaan: { include: { Sumdan: true } },
            JenisPembiayaan: true,
            PayOffice: true,
            Sumdan: {
              include: {
                ProdukPembiayaans: {
                  where: { status: true },
                  orderBy: { name: "asc" },
                },
              },
            },
          },
        })
      : await prisma.oTSDefault.create({
          data,
          include: {
            ProdukPembiayaan: { include: { Sumdan: true } },
            JenisPembiayaan: true,
            PayOffice: true,
            Sumdan: {
              include: {
                ProdukPembiayaans: {
                  where: { status: true },
                  orderBy: { name: "asc" },
                },
              },
            },
          },
        });

    return NextResponse.json(
      {
        data: serializeForApi(saved),
        msg: "Konfigurasi OTS berhasil disimpan.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to save OTS setup:", error);
    return NextResponse.json(
      { msg: "Gagal menyimpan konfigurasi OTS." },
      { status: 500 },
    );
  }
};
