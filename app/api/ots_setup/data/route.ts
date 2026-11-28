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
      Debitur: { include: { PayOffice: { select: { name: true } } } },
      OTSData: true,
    },
    orderBy: {
      OTSData: { get_date: "desc" },
    },
  });
  return data;
};

export const GET = async (req: NextRequest) => {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  const { status, locations, province, city, district } = params;

  const session = await getSession();
  if (!session)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });
  const user = await GetUserSession(session);
  if (!user)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });

  if (locations) {
    let values: string[];
    if (locations === "province") {
      const rows = await prisma.debitur.groupBy({
        by: ["province"],
        where: { province: { not: null } },
        orderBy: { province: "asc" },
      });
      values = rows.flatMap((row) => (row.province ? [row.province] : []));
    } else if (locations === "city") {
      const rows = await prisma.debitur.groupBy({
        by: ["city"],
        where: {
          city: { not: null },
          ...(province && { province }),
        },
        orderBy: { city: "asc" },
      });
      values = rows.flatMap((row) => (row.city ? [row.city] : []));
    } else if (locations === "district") {
      const rows = await prisma.debitur.groupBy({
        by: ["district"],
        where: {
          district: { not: null },
          ...(province && { province }),
          ...(city && { city }),
        },
        orderBy: { district: "asc" },
      });
      values = rows.flatMap((row) => (row.district ? [row.district] : []));
    } else if (locations === "ward") {
      const rows = await prisma.debitur.groupBy({
        by: ["ward"],
        where: {
          ward: { not: null },
          ...(province && { province }),
          ...(city && { city }),
          ...(district && { district }),
        },
        orderBy: { ward: "asc" },
      });
      values = rows.flatMap((row) => (row.ward ? [row.ward] : []));
    } else {
      return NextResponse.json(
        { msg: "Tingkat wilayah tidak valid." },
        { status: 400 },
      );
    }

    return NextResponse.json({ status: 200, locations: values });
  }

  const findToday = await getTodayData(user.id);
  const datastatus = status
    ? await prisma.oTSDetail.findMany({
        where: {
          ots_status: status as EOTSStatus,
        },
        include: {
          Debitur: { include: { PayOffice: { select: { name: true } } } },
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
        msg: `Data kamu lebih atau sama dengan ${app.pagesize}. mohon hapus sebagian lalu coba lagi!`,
      },
      { status: 403 },
    );
  }
  const maxgetCount = await prisma.oTSData.count({
    where: {
      userId: user.id,
      get_date: {
        gte: moment().startOf("day").toDate(),
        lte: moment().endOf("day").toDate(),
      },
    },
  });

  if (maxgetCount >= app.max_daily_get) {
    return NextResponse.json(
      {
        data: [],
        status: 403,
        msg: `Maksimal Get data sudah tercapai (${app.max_daily_get}x). Coba lagi besok!`,
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
      Otsdetails: {
        none: {},
      },
      payOfficeId: app.payOfficeId,
      nopen: { notIn: debId },
      ...(province && { province }),
      ...(city && { city }),
      ...(district && { district }),
      ...(ward && { ward }),
    },
    take: availableTake,
  });

  if (find.length === 0) {
    return NextResponse.json(
      {
        data: [],
        status: 403,
        msg: `Tidak ada lagi data di area yg dipilih. mohon pilih area lain!`,
      },
      { status: 403 },
    );
  }

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
        },
      });
      const savedData = find.map((d) => ({
        ots_status: EOTSStatus.PENDING,
        reset_count: 0,
        get_date: new Date(),
        reset_date: moment().endOf("day").toDate(),

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
  const findApp = await prisma.oTSDefault.findFirst();
  const app = findApp || defaultApp;

  await prisma.oTSDetail.update({
    where: { id },
    data: {
      ots_status: status as EOTSStatus,
      reset_date: moment().add(app.reset_day, "day").endOf("day").toDate(),
    },
  });

  return NextResponse.json(
    {
      status: 200,
      msg: `Data ${find.debiturNopen} berhasil ${status === "HAPUS" ? "dihapus" : "diupdate"}`,
    },
    { status: 200 },
  );
};
