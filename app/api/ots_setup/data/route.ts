import { NextRequest, NextResponse } from "next/server";
import { GetUserSession } from "../../utils/wheres";
import { getSession } from "@/libs/Auth";
import prisma from "@/libs/Prisma";
import { EOTSStatus } from "@/generated/prisma/client";
import moment from "moment";
import { defaultApp } from "@/libs/IInterfaces";

const getTodayData = async (id: string) => {
  const data = await prisma.oTSDetail.findMany({
    where: {
      OTSData: { userId: id },
      ots_status: { in: ["PENDING", "PROSES"] },
    },
    include: {
      Debitur: true,
      OTSData: true,
    },
  });
  return data;
};

export const GET = async (req: NextRequest) => {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const { status } = params;

  const session = await getSession();
  if (!session)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });
  const user = await GetUserSession(session);
  if (!user)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });

  const findToday = await getTodayData(user.id);
  const datastatus = status
    ? await prisma.oTSDetail.findMany({
        where: {
          ots_status: status as EOTSStatus,
        },
        include: {
          Debitur: true,
          OTSData: true,
        },
      })
    : [];

  return NextResponse.json(
    { status: 200, today: findToday, datastatus },
    { status: 200 },
  );
};

export const POST = async (req: NextRequest) => {
  const { province, city, district, ward } = await req.json();

  const session = await getSession();
  if (!session)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });
  const user = await GetUserSession(session);
  if (!user)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });

  const findApp = await prisma.oTSDefault.findFirst();
  const app = findApp || defaultApp;

  const findOtsBeffore = await prisma.oTSDetail.findMany({
    where: {
      OTSData: { userId: user.id },
    },
  });
  const debId = findOtsBeffore.map((f) => f.debiturNopen);

  const todayData = await getTodayData(user.id);
  const availableTake = app.pagesize - todayData.length;
  if (availableTake <= 0) {
    return NextResponse.json(
      {
        data: [],
        status: 403,
        msg: "Data kamu lebih atau sama dengan 10. mohon sebagian lalu coba lagi!",
      },
      { status: 403 },
    );
  }

  const find = await prisma.debitur.findMany({
    where: {
      Dapems: {
        none: {
          dropping_status: {
            in: ["DISETUJUI", "DITOLAK", "DRAFT", "PENDING", "PROSES"],
          },
        },
      },
      nopen: { notIn: debId },
      ...(province && { province }),
      ...(city && { city }),
      ...(district && { district }),
      ...(ward && { ward }),
    },
    take: availableTake,
  });

  await prisma.$transaction(
    async (tx) => {
      const dataots = await tx.oTSData.create({
        data: {
          get_date: new Date(),
          ...(province && { province }),
          ...(city && { city }),
          ...(district && { district }),
          ...(ward && { ward }),
          userId: user.id,
          pagesize: app.pagesize,
          count: 1,
          reset_date: moment().add(app.reset_day, "day").endOf("day").toDate(),
        },
      });
      const savedData = find.map((d) => ({
        ots_status: EOTSStatus.PENDING,

        oTSDataId: dataots.id,
        debiturNopen: d.nopen,
      }));
      await tx.oTSDetail.createMany({ data: savedData });
      return true;
    },
    { timeout: 10000 },
  );

  return NextResponse.json(
    { status: 200, msg: `Total ${availableTake} berhasil di dapatkan` },
    { status: 200 },
  );
};

export const DELETE = async (req: NextRequest) => {
  const { id, status } = await req.json();

  const find = await prisma.oTSDetail.findFirst({ where: { id } });
  if (!find) {
    return NextResponse.json(
      { status: 404, msg: "Data tidak ditemukan" },
      { status: 404 },
    );
  }
  if (status === "DELETE") {
    await prisma.oTSDetail.delete({ where: { id } });
  } else {
    await prisma.oTSDetail.update({
      where: { id },
      data: { ots_status: status as EOTSStatus },
    });
  }

  return NextResponse.json(
    {
      status: 200,
      msg: `Data ${find.debiturNopen} berhasil ${status === "DELETE" ? "dihapus" : "diupdate"}`,
    },
    { status: 200 },
  );
};
