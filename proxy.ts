import type { NextRequest } from "next/server";
import { refreshToken } from "./libs/Auth";

export async function proxy(request: NextRequest) {
  return await refreshToken(request);
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboardbis",
    "/simulasi",
    "/monitoring",
    "/proses/:path*",
    "/pencairan/:path*",
    "/ttpb/:path*",
    "/ttpj/:path*",
    "/nominatif",
    "/tmftb",
    "/tagihan",
    "/debitur",
    "/pelunasan",
    "/lapkeu/:path*",
    "/database",
    "/slik-analyze",
    "/master/:path*",
    "/guest_book",
  ],
};
