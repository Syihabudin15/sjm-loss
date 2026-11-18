import { getSession } from "@/libs/Auth";
import { hasAccessForPath, IAccessPermission } from "@/libs/AccessUtils";
import prisma from "@/libs/Prisma";
import { Prisma } from "../../../generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const guestBookPath = "/guest_book";
const allowedOrigin =
  process.env.GUEST_BOOK_ALLOWED_ORIGIN || "https://sjm.biz.id";

function addCorsHeaders(request: NextRequest, response: NextResponse) {
  if (request.headers.get("origin") !== allowedOrigin) return response;

  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.append("Vary", "Origin");
  return response;
}

function withCors(
  handler: (request: NextRequest) => Promise<NextResponse>,
) {
  return async (request: NextRequest) =>
    addCorsHeaders(request, await handler(request));
}

async function authorize(action: string) {
  const session = await getSession();
  const roleId = session?.user?.roleId;
  if (!roleId) return false;

  const role = await prisma.role.findUnique({
    where: { id: roleId },
    select: { permission: true },
  });
  if (!role) return false;

  try {
    const permissions = JSON.parse(
      role.permission || "[]",
    ) as IAccessPermission[];
    return hasAccessForPath(permissions, guestBookPath, action);
  } catch {
    return false;
  }
}

function nullableText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function isOptionalText(value: unknown) {
  return value === undefined || value === null || typeof value === "string";
}

function parseParticipants(value: unknown) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;

  const participants = [];
  for (const participant of value) {
    if (!participant || typeof participant !== "object") {
      return null;
    }

    const item = participant as Record<string, unknown>;
    if (typeof item.name !== "string" || !item.name.trim()) return null;
    if (!isOptionalText(item.phone) || !isOptionalText(item.desc)) return null;
    participants.push({
      name: item.name.trim(),
      phone: nullableText(item.phone),
      desc: nullableText(item.desc),
    });
  }
  return participants;
}

function parseGuestBook(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const dateCome = new Date(
    typeof data.date_come === "string" ? data.date_come : "",
  );
  const participants = parseParticipants(data.GbookParticipants);

  if (!name || Number.isNaN(dateCome.getTime()) || !participants) return null;
  if (
    ![
      data.phone,
      data.email,
      data.address,
      data.desc,
      data.result_desc,
    ].every(isOptionalText)
  ) {
    return null;
  }
  if (
    data.status_come !== undefined &&
    typeof data.status_come !== "boolean"
  ) {
    return null;
  }
  if (data.file !== undefined && data.file !== null && typeof data.file !== "string") {
    return null;
  }

  return {
    name,
    phone: nullableText(data.phone),
    email: nullableText(data.email),
    address: nullableText(data.address),
    date_come: dateCome,
    status_come: data.status_come ?? true,
    desc: nullableText(data.desc),
    result_desc: nullableText(data.result_desc),
    file: nullableText(data.file),
    participants,
  };
}

async function getGuestBooks(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(params.get("limit") || "10", 10) || 10),
  );
  const search = params.get("search")?.trim();
  const statusCome = params.get("statusCome");
  const where: Prisma.GuestBookWhereInput = {
    status: true,
    ...(statusCome === "true" && { status_come: true }),
    ...(statusCome === "false" && { status_come: false }),
    ...(search && {
      OR: [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        { address: { contains: search } },
      ],
    }),
  };

  try {
    const [data, total] = await Promise.all([
      prisma.guestBook.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ date_come: "desc" }, { created_at: "desc" }],
        include: { GbookParticipants: true },
      }),
      prisma.guestBook.count({ where }),
    ]);

    return NextResponse.json({ data, total, status: 200 });
  } catch (error) {
    console.error("Gagal mengambil data buku tamu:", error);
    return NextResponse.json(
      { msg: "Gagal mengambil data buku tamu." },
      { status: 500 },
    );
  }
}

async function createGuestBook(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ msg: "Data tidak valid." }, { status: 400 });
  }

  const parsed = parseGuestBook(body);
  if (!parsed) {
    return NextResponse.json(
      { msg: "Data buku tamu tidak valid. Periksa nama, tanggal, dan data peserta." },
      { status: 400 },
    );
  }

  const { participants, ...data } = parsed;
  try {
    await prisma.guestBook.create({
      data: {
        ...data,
        GbookParticipants: { create: participants },
      },
    });
    return NextResponse.json(
      { msg: "Data buku tamu berhasil ditambahkan." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Gagal menambahkan data buku tamu:", error);
    return NextResponse.json(
      { msg: "Gagal menambahkan data buku tamu." },
      { status: 500 },
    );
  }
}

async function updateGuestBook(request: NextRequest) {
  if (!(await authorize("update"))) {
    return NextResponse.json({ msg: "Akses ditolak." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ msg: "Data tidak valid." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ msg: "ID buku tamu tidak valid." }, { status: 400 });
  }
  const bodyData = body as Record<string, unknown>;
  if (typeof bodyData.id !== "string" || !bodyData.id) {
    return NextResponse.json({ msg: "ID buku tamu tidak valid." }, { status: 400 });
  }
  const id = bodyData.id;
  const parsed = parseGuestBook(body);
  if (!parsed) {
    return NextResponse.json(
      { msg: "Data buku tamu tidak valid. Periksa nama, tanggal, dan data peserta." },
      { status: 400 },
    );
  }

  const { participants, ...data } = parsed;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.guestBook.update({
        where: { id, status: true },
        data: {
          ...data,
          updated_at: new Date(),
        },
      });
      await tx.gBookParticipant.deleteMany({ where: { guestBookId: id } });
      if (participants.length) {
        await tx.gBookParticipant.createMany({
          data: participants.map((participant) => ({
            ...participant,
            guestBookId: id,
          })),
        });
      }
    });
    return NextResponse.json({ msg: "Data buku tamu berhasil diperbarui." });
  } catch (error) {
    console.error("Gagal memperbarui data buku tamu:", error);
    return NextResponse.json(
      { msg: "Data buku tamu tidak ditemukan atau gagal diperbarui." },
      { status: 500 },
    );
  }
}

async function deleteGuestBook(request: NextRequest) {
  if (!(await authorize("delete"))) {
    return NextResponse.json({ msg: "Akses ditolak." }, { status: 403 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ msg: "ID buku tamu tidak ditemukan." }, { status: 400 });
  }

  try {
    await prisma.guestBook.update({
      where: { id, status: true },
      data: { status: false, updated_at: new Date() },
    });
    return NextResponse.json({ msg: "Data buku tamu berhasil diarsipkan." });
  } catch (error) {
    console.error("Gagal mengarsipkan data buku tamu:", error);
    return NextResponse.json(
      { msg: "Data buku tamu tidak ditemukan atau gagal diarsipkan." },
      { status: 404 },
    );
  }
}

export const GET = withCors(getGuestBooks);
export const POST = withCors(createGuestBook);
export const PUT = withCors(updateGuestBook);
export const DELETE = withCors(deleteGuestBook);

export async function OPTIONS(request: NextRequest) {
  if (request.headers.get("origin") !== allowedOrigin) {
    return new NextResponse(null, { status: 403 });
  }
  return addCorsHeaders(request, new NextResponse(null, { status: 204 }));
}
