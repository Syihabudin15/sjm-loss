import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./IInterfaces";
import prisma from "./Prisma";
import { getAccessForPath } from "./AccessUtils";
import { Role } from "../generated/prisma/client";
import { clearCacheHash, getCacheJSON, setCacheJSON } from "./redisservice";

const secretKey = new TextEncoder().encode(process.env.APP_KEY || "secretcode");
const CACHE_TTL = 5 * 60 * 60; // 5 jam dalam detik untuk Redis

export async function encrypt(payload: JwtPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey);
}

export async function decrypt(params: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(params, secretKey, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function signIn(user: IUser) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function signOut() {
  (await cookies()).set("session", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}
export async function getSession(): Promise<JwtPayload | null> {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  const result: JwtPayload = await decrypt(session);
  return result;
}

export async function refreshToken(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;
  if (!sessionToken) return NextResponse.redirect(new URL("/", request.url));

  // Optimasi: Gunakan decrypt langsung agar tidak double-read cookies
  const payload = await decrypt(sessionToken).catch(() => null);
  if (!payload) return NextResponse.redirect(new URL("/", request.url));

  const pathname = request.nextUrl.pathname;

  if (payload && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Cek menu access
  const menuaccess = listMenuServer.find((f) => f.key === pathname);
  const needaccess = menuaccess ? menuaccess.needaccess : true;
  if (!needaccess) return NextResponse.next();

  // OPTIMASI UTAMA: Menggunakan fungsi Cache menggantikan Prisma langsung
  const permission = await getRoleWithCache(payload.user.roleId);
  if (!permission)
    return NextResponse.redirect(new URL("/unauthorize", request.url));

  // Sesuaikan instansiasi object Role untuk fungsi hasAccess Anda
  const access = hasAccess(
    { id: payload.user.roleId, permission } as Role,
    pathname,
    "read",
  );

  if (!access)
    return NextResponse.redirect(new URL("/unauthorize", request.url));

  return NextResponse.next();
}

async function getRoleWithCache(roleId: string) {
  // Cek Redis cache terlebih dahulu
  const cached = await getCacheJSON<{ permission: string }>(`role:${roleId}`);

  if (cached) {
    return cached.permission;
  }

  // Jika tidak ada di cache, ambil dari Database
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    select: { permission: true },
  });

  if (role) {
    // Simpan ke Redis cache untuk request berikutnya
    await setCacheJSON(`role:${roleId}`, role, CACHE_TTL);
    return role.permission;
  }

  return null;
}

export async function clearRoleCache(roleId?: string) {
  if (roleId) {
    await clearCacheHash(`role:${roleId}`, "");
  } else {
    // Untuk menghapus semua role cache, gunakan clearCachePrefix
    const { clearCachePrefix } = await import("./redisservice");
    await clearCachePrefix("role:");
  }
}

function hasAccess(role: Role, path: string, action: string): boolean {
  return getUserAccess(role, path).includes(action);
}
function getUserAccess(role: Role, path: string): string[] {
  try {
    const permissions: { path: string; access: string[] }[] = JSON.parse(
      role.permission || "[]",
    );

    return getAccessForPath(permissions, path);
  } catch {
    return [];
  }
}

export const listMenuServer: { key: string; needaccess: boolean }[] = [
  {
    key: "/dash",
    needaccess: false,
  },
  {
    key: "/dashboard",
    needaccess: true,
  },
  {
    key: "/dashboardbis",
    needaccess: true,
  },
  {
    key: "/dashboard_fronting",
    needaccess: true,
  },
  {
    key: "/simulasi",
    needaccess: true,
  },
  {
    key: "/monitoring",
    needaccess: true,
  },
  {
    key: "/pendingdata",
    needaccess: true,
  },
  {
    key: "/proses/verif",
    needaccess: true,
  },
  {
    key: "/proses/slik",
    needaccess: true,
  },
  {
    key: "/proses/approv",
    needaccess: true,
  },
  {
    key: "/pencairan/print",
    needaccess: true,
  },
  {
    key: "/pencairan/dropping",
    needaccess: true,
  },
  {
    key: "/ttpb/print",
    needaccess: true,
  },
  {
    key: "/ttpb/dropping",
    needaccess: true,
  },
  {
    key: "/ttpj/print",
    needaccess: true,
  },
  {
    key: "/ttpj/dropping",
    needaccess: true,
  },
  {
    key: "/nominatif",
    needaccess: true,
  },
  {
    key: "/tmftb",
    needaccess: true,
  },
  {
    key: "/tagihan",
    needaccess: true,
  },
  {
    key: "/debitur",
    needaccess: true,
  },
  {
    key: "/pelunasan",
    needaccess: true,
  },
  {
    key: "/lapkeu/coa",
    needaccess: true,
  },
  {
    key: "/lapkeu/jurnal",
    needaccess: true,
  },
  {
    key: "/lapkeu/neraca",
    needaccess: true,
  },
  {
    key: "/lapkeu/neraca-rugilaba",
    needaccess: true,
  },
  {
    key: "/lapkeu/rugilaba",
    needaccess: true,
  },
  {
    key: "/database",
    needaccess: true,
  },
  {
    key: "/master/users",
    needaccess: true,
  },
  {
    key: "/profile",
    needaccess: false,
  },
  {
    key: "/master/roles",
    needaccess: true,
  },
  {
    key: "/master/mitra",
    needaccess: true,
  },
  {
    key: "/master/user",
    needaccess: true,
  },
  {
    key: "/master/area",
    needaccess: true,
  },
  {
    key: "/master/jenis",
    needaccess: true,
  },
  {
    key: "/master/agent",
    needaccess: true,
  },
  {
    key: "/master/payoffice",
    needaccess: true,
  },
  {
    key: "/master/insurance",
    needaccess: true,
  },
];
