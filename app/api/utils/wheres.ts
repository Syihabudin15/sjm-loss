import { Cabang, Role, User } from "@/generated/prisma";
import { Prisma } from "@/generated/prisma/client";
import prisma from "@/libs/Prisma";
import {
  getCacheJSON,
  setCacheJSON,
  clearCachePrefix,
} from "@/libs/redisservice";

interface UserWhere extends User {
  Cabang: Cabang;
  Role: Role;
}

export const WheresDapem = (user: UserWhere | any) => {
  const where: Prisma.DapemWhereInput = {
    ...(user.Role.data_status === "AREA" && {
      OR: [
        { AO: { Cabang: { areaId: user.Cabang.areaId } } },
        { AOCabang: { Cabang: { areaId: user.Cabang.areaId } } },
        { AOArea: { Cabang: { areaId: user.Cabang.areaId } } },
        { User: { Cabang: { areaId: user.Cabang.areaId } } },
      ],
    }),
    ...(user.Role.data_status === "CABANG" && {
      OR: [
        { AO: { cabangId: user.cabangId } },
        { AOCabang: { cabangId: user.cabangId } },
        { AOArea: { cabangId: user.cabangId } },
        { User: { cabangId: user.cabangId } },
      ],
    }),
    ...(user.Role.data_status === "USER" && {
      OR: [
        { aoId: user.id },
        { aoCabangId: user.id },
        { aoAreaId: user.id },
        { userId: user.id },
      ],
    }),
    ...(user.sumdanId && { ProdukPembiayaan: { sumdanId: user.sumdanId } }),
    // ...(user.agentFrontingId && { agentFrontingId: user.agentFrontingId }),
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
    select: {
      id: true,
      fullname: true,
      nip: true,
      Cabang: {
        select: {
          id: true,
          name: true,
          Area: { select: { id: true, name: true } },
        },
      },
    },
    // include: {
    //   Cabang: {
    //     omit: {
    //       status: true,
    //       created_at: true,
    //       updated_at: true,
    //       phone: true,
    //       address: true,
    //     },
    //     include: { Area: { select: { name: true } } },
    //   },
    // },
    // omit: {
    //   status: true,
    //   email: true,
    //   password: true,
    //   target: true,
    //   start_pkwt: true,
    //   end_pkwt: true,
    //   created_at: true,
    //   updated_at: true,
    // },
  };
  return where;
};

// Tentukan umur cache (5 jam dalam detik untuk Redis)
const USER_CACHE_TTL = 5 * 60 * 60;

export const GetUserSession = async (session: any) => {
  const userId = session?.user?.id;
  if (!userId) return null;

  // Cek Redis cache terlebih dahulu
  const cachedUser = await getCacheJSON<any>(`user:${userId}`);

  if (cachedUser) {
    return cachedUser; // Mengembalikan data dari cache (< 1ms)
  }

  // Jika tidak ada di cache, baru lakukan query ke database
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      Role: {
        select: { data_status: true, id: true, name: true, permission: true },
      },
      Cabang: {
        select: { areaId: true, id: true, Area: { select: { name: true } } },
      },
      Sumdan: { select: { name: true, id: true } },
      AgentFronting: {
        select: {
          id: true,
          SumdanAgentFrontings: { select: { id: true, sumdanId: true } },
        },
      },
    },
    // omit: {
    //   fullname: true,
    //   status: true,
    //   pkwt_status: true,
    //   phone: true,
    //   email: true,
    //   password: true,
    //   nip: true,
    //   nik: true,
    //   target: true,
    //   position: true,
    //   start_pkwt: true,
    //   end_pkwt: true,
    //   created_at: true,
    //   updated_at: true,
    // },
  });

  // Jika user ditemukan, simpan ke Redis cache
  if (user) {
    await setCacheJSON(`user:${userId}`, user, USER_CACHE_TTL);
  }

  return user;
};

// Fungsi helper untuk menghapus cache jika data user/cabang/role diubah oleh admin
export async function clearUserSessionCache(userId?: string) {
  if (userId) {
    const { clearCacheHash } = await import("@/libs/redisservice");
    await clearCacheHash(`user:${userId}`);
  } else {
    await clearCachePrefix("user:");
  }
}
