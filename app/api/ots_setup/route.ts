import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import prisma from "@/libs/Prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const [data, jenis, sumdan] = await Promise.all([
      prisma.oTSDefault.findFirst({
        orderBy: { id: "asc" },
        include: {
          ProdukPembiayaan: { include: { Sumdan: true } },
          JenisPembiayaan: true,
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
    ]);
    return NextResponse.json(
      { data: serializeForApi(data), jenis, sumdan: serializeForApi(sumdan) },
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
    produkPembiayaanId,
    jenisPembiayaanId,
  } = values;

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
    typeof produkPembiayaanId !== "string" ||
    !produkPembiayaanId ||
    typeof jenisPembiayaanId !== "string" ||
    !jenisPembiayaanId
  ) {
    return NextResponse.json(
      { msg: "Periksa kembali nilai konfigurasi OTS." },
      { status: 400 },
    );
  }

  try {
    const [product, jenis] = await Promise.all([
      prisma.produkPembiayaan.findFirst({
        where: {
          id: produkPembiayaanId,
          status: true,
          Sumdan: { status: true },
        },
        select: { id: true },
      }),
      prisma.jenisPembiayaan.findFirst({
        where: { id: jenisPembiayaanId, status: true },
        select: { id: true },
      }),
    ]);

    if (!product || !jenis) {
      return NextResponse.json(
        { msg: "Produk atau jenis pembiayaan tidak tersedia." },
        { status: 400 },
      );
    }

    const data = {
      pagesize,
      reset_day,
      max_dev,
      produkPembiayaanId,
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
          },
        })
      : await prisma.oTSDefault.create({
          data,
          include: {
            ProdukPembiayaan: { include: { Sumdan: true } },
            JenisPembiayaan: true,
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
