import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { JwtPayload } from "jsonwebtoken";
import { hasAccess } from "./Permission";
import { IUser } from "./IInterfaces";
import { listMenuServer } from "@/components/IMenu";
import prisma from "./Prisma";
import { Role } from "../generated/prisma/client";

const secretKey = new TextEncoder().encode(process.env.APP_KEY || "secretcode");
const globalForCache = globalThis as unknown as {
  roleCache: Map<string, { permission: any; createdAt: number }>;
};

const roleCache = globalForCache.roleCache || new Map();
if (process.env.NODE_ENV !== "production") globalForCache.roleCache = roleCache;
const CACHE_TTL = 5 * 60 * 60 * 1000;

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

  (await cookies()).set("session", session, { expires });
}

export async function signOut() {
  (await cookies()).set("session", "", { expires: new Date(0) });
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
  const now = Date.now();
  const cached = roleCache.get(roleId);

  // Jika data ada di cache dan belum kedaluwarsa, ambil dari cache (Secepat Redis!)
  if (cached && now - cached.createdAt < CACHE_TTL) {
    return cached.permission;
  }

  // Jika tidak ada di cache / sudah kedaluwarsa, ambil dari Database
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    select: { permission: true },
  });

  if (role) {
    // Simpan ke cache untuk request berikutnya
    roleCache.set(roleId, {
      permission: role.permission,
      createdAt: now,
    });
    return role.permission;
  }

  return null;
}
export function clearRoleCache(roleId?: string) {
  if (roleId) {
    roleCache.delete(roleId);
  } else {
    roleCache.clear();
  }
}
