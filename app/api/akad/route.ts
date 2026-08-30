import { GetAngsuran, GetDetailDapem } from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";
import { Angsuran, Dapem, Prisma } from "../../../generated/prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const data: { id: string; date_contract: Date; no_contract: string } =
    await req.json();
  const find = await prisma.dapem.findFirst({
    where: { id: data.id },
    include: { Angsurans: true },
  });

  if (!find)
    return NextResponse.json(
      { msg: "Dapem ID tidak ditemukan!", status: 400 },
      { status: 400 },
    );
  try {
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        await tx.dapem.update({
          where: { id: data.id },
          data: {
            date_contract: data.date_contract || new Date(),
            no_contract: data.no_contract,
            date_end: moment(data.date_contract || new Date())
              .add(find.tenor, "month")
              .toDate(),
            tbo_date: moment(data.date_contract || new Date())
              .add(find.tbo, "month")
              .toDate(),
          },
        });
        const generateAngsurans = GenerateTableAngsuran({
          ...find,
          date_contract: data.date_contract || new Date(),
          no_contract: data.no_contract,
        });
        await tx.angsuran.deleteMany({ where: { dapemId: data.id } });
        const newAngsurans =
          find.Angsurans && find.Angsurans.length !== 0
            ? generateAngsurans.map((item) => ({
                ...item,
                date_paid:
                  find.Angsurans.find(
                    (a: Angsuran) => a.counter === item.counter,
                  )?.date_paid || null,
              }))
            : generateAngsurans;
        await tx.angsuran.createMany({
          data: newAngsurans,
        });
        return newAngsurans;
      },
    );
    result.unshift({
      id: "",
      counter: 0,
      date_pay: moment(data.date_contract || new Date()).toDate(),
      date_paid: null,
      dapemId: "",
      principal: 0,
      margin: 0,
      remaining: find.plafond,
      inst_sumdan: 0,
      c_ned: 0,
      fee_banpot: 0,
      note: "",
    });
    return NextResponse.json(
      { msg: "Berhasil memperbarui data akad!", status: 200, data: result },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { msg: "Terjadi kesalahan pada server!", status: 500 },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  const { created_at } = await req.json();
  if (!id)
    return NextResponse.json(
      { msg: "Dapem ID tidak ditemukan!", status: 404 },
      { status: 404 },
    );

  try {
    const find = await prisma.dapem.findFirst({
      where: { id: id },
      include: {
        Angsurans: true,
        ProdukPembiayaan: { include: { Sumdan: true } },
      },
    });
    if (!find)
      return NextResponse.json(
        { msg: "Dapem ID tidak ditemukan!", status: 404 },
        { status: 404 },
      );
    const count = await prisma.dapem.count({
      where: {
        ProdukPembiayaan: { sumdanId: find.ProdukPembiayaan.sumdanId },
        date_contract: { not: null },
      },
    });
    const datecontract = moment(created_at || find.date_contract || new Date());
    const sumdan =
      find.ProdukPembiayaan.Sumdan.code === "VIMA"
        ? "PTBPRVIMA"
        : find.ProdukPembiayaan.Sumdan.code
            .replace(" ", "")
            .replace("BPR", "")
            .replace("BANK", "");
    return NextResponse.json(
      {
        msg: "Berhasil memperbarui data akad!",
        status: 200,
        data: find.no_contract
          ? find.no_contract
          : `${String(count + 1).padStart(3, "0")}/${process.env.NEXT_PUBLIC_APP_CODE_FILE || ""}-PK/${sumdan}/${datecontract.format("MM-YYYY")}`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { msg: "Terjadi kesalahan pada server!", status: 500 },
      { status: 500 },
    );
  }
};

function GenerateTableAngsuran(dapem: Dapem) {
  if (dapem.margin_type === "FLAT") {
    return GenerateFlat(dapem);
  } else {
    return GenerateAnuitas(dapem);
  }
}

function GenerateAnuitas(dapem: Dapem): Angsuran[] {
  const prefix = `${dapem.id}TX`;
  const padLength = 3;

  const angsurans: Angsuran[] = [];

  let sisa = dapem.plafond;
  const detail = GetDetailDapem(dapem as IDapem);

  for (let i = 1; i <= dapem.tenor; i++) {
    const newId = `${prefix}${String(i).padStart(padLength, "0")}`;
    // const bungaBulan = Math.ceil(
    //   sisa * ((dapem.c_margin + dapem.c_margin_sumdan) / 12 / 100),
    // );
    const bungaBulan = Math.round(
      sisa * ((dapem.c_margin + dapem.c_margin_sumdan) / 12 / 100),
    );
    const pokok = detail.detail.angsuranrounded - bungaBulan;
    sisa -= pokok;

    if (sisa < 0) sisa = 0;
    if (i === dapem.tenor) sisa = 0;

    angsurans.push({
      id: newId,
      counter: i,
      date_paid:
        i <= dapem.c_blokir ? moment(dapem.date_contract).toDate() : null,
      date_pay: moment(dapem.date_contract).add(i, "month").toDate(),
      principal: pokok,
      margin: bungaBulan,
      remaining: sisa,
      dapemId: dapem.id,
      inst_sumdan: detail.detail.angsuran_sumdan,
      c_ned: dapem.c_ned,
      fee_banpot: detail.detail.fee_banpot,
      note: "",
    });
  }
  return angsurans;
}

function GenerateFlat(dapem: Dapem): Angsuran[] {
  const prefix = `${dapem.id}TX`;
  const padLength = 3;

  const angsurans: Angsuran[] = [];

  const angsuran = GetAngsuran(
    dapem.plafond,
    dapem.tenor,
    dapem.c_margin + dapem.c_margin_sumdan,
    dapem.margin_type,
    dapem.rounded,
  ).angsuran;
  const angsudan = GetAngsuran(
    dapem.plafond,
    dapem.tenor,
    dapem.c_margin_sumdan,
    dapem.margin_type,
    dapem.rounded,
  ).angsuran;
  let sisa = dapem.plafond;

  for (let i = 1; i <= dapem.tenor; i++) {
    const newId = `${prefix}${String(i).padStart(padLength, "0")}`;
    const pokok = dapem.plafond / dapem.tenor;
    sisa -= pokok;

    if (sisa < 0) sisa = 0;

    angsurans.push({
      id: newId,
      counter: i,
      date_paid:
        i <= dapem.c_blokir ? moment(dapem.date_contract).toDate() : null,
      date_pay: moment(dapem.date_contract).add(i, "month").toDate(),
      principal: pokok,
      margin: angsuran - pokok,
      remaining: sisa,
      dapemId: dapem.id,
      inst_sumdan: angsudan,
      c_ned: dapem.c_ned,
      fee_banpot: 0,
      note: "",
    });
  }
  return angsurans;
}
