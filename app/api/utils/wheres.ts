import prisma from "@/libs/Prisma";
import { Cabang, Prisma, Role, User } from "../../../generated/prisma/client";

interface UserWhere extends User {
  Cabang: Cabang;
  Role: Role;
}

export const WheresDapem = (user: UserWhere | any) => {
  const where: Prisma.DapemWhereInput = {
    ...(user.Role.data_status === "AREA" && {
      AO: { Cabang: { areaId: user.Cabang.areaId } },
      AOCabang: { Cabang: { areaId: user.Cabang.areaId } },
      AOArea: { Cabang: { areaId: user.Cabang.areaId } },
      User: { Cabang: { areaId: user.Cabang.areaId } },
    }),
    ...(user.Role.data_status === "CABANG" && {
      AO: { cabangId: user.cabangId },
      AOCabang: { cabangId: user.cabangId },
      AOArea: { cabangId: user.cabangId },
      User: { cabangId: user.cabangId },
    }),
    ...(user.Role.data_status === "USER" && {
      aoId: user.id,
      aoCabangId: user.id,
      aoAreaId: user.id,
      userId: user.id,
    }),
    ...(user.sumdanId && { ProdukPembiayaan: { sumdanId: user.sumdanId } }),
    ...(user.agentFrontingId && { agentFrontingId: user.agentFrontingId }),
  };
  return where;
};

export const ORDapem = (search: string) => {
  const where: Prisma.DapemWhereInput = {
    OR: [
      { id: { contains: search } },
      { no_contract: { contains: search } },
      { Dropping: { id: { contains: search } } },
      {
        Debitur: {
          OR: [
            { fullname: { contains: search } },
            { nopen: { contains: search } },
            { no_skep: { contains: search } },
            { name_skep: { contains: search } },
            { account_number: { contains: search } },
          ],
        },
      },
    ],
  };
  return where;
};

export const AOInclude = () => {
  const where: Prisma.UserFindFirstArgs = {
    include: {
      Cabang: {
        omit: {
          status: true,
          created_at: true,
          updated_at: true,
          phone: true,
          address: true,
        },
        include: { Area: { select: { name: true } } },
      },
    },
    omit: {
      status: true,
      email: true,
      password: true,
      target: true,
      start_pkwt: true,
      end_pkwt: true,
      created_at: true,
      updated_at: true,
    },
  };
  return where;
};

// 1. Buat kontainer cache global agar tidak ter-reset saat hot-reload (development)
const globalForUserCache = globalThis as unknown as {
  userSessionCache: Map<string, { data: any; createdAt: number }>;
};

const userSessionCache = globalForUserCache.userSessionCache || new Map();
if (process.env.NODE_ENV !== "production")
  globalForUserCache.userSessionCache = userSessionCache;

// Tentukan umur cache (misal: 3 menit / 180000 ms)
const USER_CACHE_TTL = 5 * 60 * 60 * 1000;

export const GetUserSession = async (session: any) => {
  const userId = session?.user?.id;
  if (!userId) return null;

  const now = Date.now();
  const cachedUser = userSessionCache.get(userId);

  // 2. Cek apakah data user sudah ada di memori dan belum kedaluwarsa
  if (cachedUser && now - cachedUser.createdAt < USER_CACHE_TTL) {
    return cachedUser.data; // Mengembalikan data instan tanpa menyentuh DB (< 1ms)
  }

  // 3. Jika tidak ada di cache, baru lakukan query ke database
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      Role: { select: { data_status: true } },
      Cabang: { select: { areaId: true, id: true } },
    },
    omit: {
      fullname: true,
      status: true,
      pkwt_status: true,
      phone: true,
      email: true,
      password: true,
      nip: true,
      nik: true,
      target: true,
      position: true,
      start_pkwt: true,
      end_pkwt: true,
      created_at: true,
      updated_at: true,
    },
  });

  // 4. Jika user ditemukan, simpan ke memori cache
  if (user) {
    userSessionCache.set(userId, {
      data: user,
      createdAt: now,
    });
  }

  return user;
};

// Fungsi helper untuk menghapus cache jika data user/cabang/role diubah oleh admin
export function clearUserSessionCache(userId?: string) {
  if (userId) {
    userSessionCache.delete(userId);
  } else {
    userSessionCache.clear();
  }
}
