import prisma from "@/libs/Prisma";
import moment from "moment";

import { Prisma } from "../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getSession } from "@/libs/Auth";
import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { clearUserSessionCache, GetUserSession } from "../utils/wheres";

export const GET = async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const {
    page = "1",
    limit = "50",
    search,
    areaId,
    cabangId,
    roleId,
    pkwt_status,
    agentFrontingId,
    sumdanId,
  } = params;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const session = await getSession();
  if (!session)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });
  // const user = await prisma.user.findFirst({
  //   where: { id: session.user.id },
  //   include: { Role: true, Cabang: true },
  // });
  const user = await GetUserSession(session);
  if (!user)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });

  const where: Prisma.UserWhereInput = {
    ...(search && {
      OR: [
        { fullname: { contains: search } },
        { username: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { nip: { contains: search } },
        { nik: { contains: search } },
        { id: { contains: search } },
      ],
    }),
    ...(roleId && { roleId: roleId }),
    ...(user.sumdanId && { sumdanId: user.sumdanId }),
    ...(pkwt_status &&
      !["EXPIRED", "NOT SET"].includes(pkwt_status) && {
        pkwt_status: pkwt_status,
      }),
    ...(pkwt_status === "NOT SET" && { end_pkwt: null }),
    ...(pkwt_status === "EXPIRED" && {
      end_pkwt: {
        lte: new Date(),
      },
    }),
    ...(areaId && { Cabang: { areaId: areaId } }),
    ...(cabangId && { cabangId: cabangId }),
    ...(agentFrontingId && { agentFrontingId: agentFrontingId }),
    ...(sumdanId && { sumdanId: sumdanId }),
    ...(user.Role.data_status === "AREA" && {
      Cabang: { areaId: user.Cabang.areaId },
    }),
    ...(user.Role.data_status === "CABANG" && { cabangId: user.cabangId }),
    ...(user.Role.data_status === "USER" && { id: user.id }),
    ...(user.agentFrontingId && { agentFrontingId: { not: null } }),
    status: true,
  };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      orderBy: {
        updated_at: "desc",
      },
      include: {
        Cabang: {
          include: {
            Area: true,
          },
        },
        Sumdan: true,
        Role: true,
        AgentFronting: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    status: 200,
    data: serializeForApi(data),
    total: total,
  });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const { id, nip, password, AgentFronting, Sumdan, Role, Cabang, ...saved } =
    body;
  try {
    const find = await prisma.user.findFirst({
      where: { username: saved.username },
    });
    if (find) {
      return NextResponse.json(
        { status: 400, msg: "Maaf username telah digunakan!" },
        { status: 400 },
      );
    }
    const generateNIP = await generateUserNIP(saved.cabangId);
    const genID = await generateID();
    const pass = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { id: genID, nip: generateNIP, password: pass, ...saved },
    });
    return NextResponse.json({
      status: 201,
      msg: "Berhasil menyimpan data user.",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      status: 500,
      msg: "Gagal menyimpan data user. internal server error.",
    });
  }
};

export const PUT = async (request: NextRequest) => {
  const body = await request.json();
  const { id, AgentFronting, Role, Sumdan, Cabang, ...updated } = body;
  try {
    const find = await prisma.user.findFirst({ where: { id } });

    if (!find)
      return NextResponse.json(
        { status: 404, msg: "Not found user" },
        { status: 404 },
      );
    if (find) {
      if (body.password && body.password !== "" && body.password.length < 20) {
        updated.password = await bcrypt.hash(body.password, 10);
      } else {
        updated.password = find.password;
      }
    }

    await prisma.user.update({
      where: { id: id },
      data: { ...updated, updated_at: new Date() },
    });
    if (updated.cabangId && updated.cabangId !== find.cabangId) {
      clearUserSessionCache(find.id);
    }
    return NextResponse.json({
      status: 200,
      msg: "Berhasil memperbarui data user.",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      status: 500,
      msg: "Gagal memperbarui data user. internal server error.",
    });
  }
};

export const DELETE = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id") || "";
  try {
    await prisma.user.update({
      where: { id: id },
      data: { status: false, updated_at: new Date() },
    });
    return NextResponse.json({
      status: 200,
      msg: "Berhasil menghapus data user.",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      msg: "Gagal menghapus data user. internal server error.",
    });
  }
};

export const PATCH = async (request: NextRequest) => {
  const body: {
    id: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
  } = await request.json();
  try {
    const find = await prisma.user.findFirst({ where: { id: body.id } });

    if (!find) {
      return NextResponse.json(
        {
          status: 404,
          msg: "Gagal ganti password, User tidak ditemukan!",
        },
        { status: 404 },
      );
    }
    const verify = await bcrypt.compare(body.password, find.password);
    if (!verify) {
      return NextResponse.json(
        {
          status: 400,
          msg: "Password lama salah!!",
        },
        { status: 400 },
      );
    }

    const newPass = await bcrypt.hash(body.confirmPassword, 10);

    await prisma.user.update({
      where: { id: body.id },
      data: { password: newPass, updated_at: new Date() },
    });
    return NextResponse.json({
      status: 200,
      msg: "Update password berhasil!.",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        status: 500,
        msg: "Gagal memperbarui password. internal server error.",
      },
      { status: 500 },
    );
  }
};

export async function generateUserNIP(cabangId: string) {
  const prefix = `${moment().year()}${moment().month()}`;
  const padLength = 4;
  const lastRecord = await prisma.user.count({});
  const cabang = await prisma.cabang.findFirst({ where: { id: cabangId } });
  return `${prefix}${cabang ? cabang.areaId.replace("KW", "") : "001"}${cabang ? cabang.id.replace("UP", "") : "0001"}${String(
    lastRecord,
  ).padStart(padLength, "0")}`;
}
export async function generateID() {
  const prefix = `USR`;
  const padLength = 6;
  const lastRecord = await prisma.user.count();
  return `${prefix}${String(lastRecord).padStart(padLength, "0")}`;
}
