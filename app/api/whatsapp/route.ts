import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Opsional: lindungi endpoint dengan secret/token khusus admin
  //   const adminKey = req.headers.get("x-admin-key");
  //   if (process.env.WA_ADMIN_KEY && adminKey !== process.env.WA_ADMIN_KEY) {
  //     return NextResponse.json(
  //       { ok: false, message: "Unauthorized" },
  //       { status: 401 },
  //     );
  //   }

  const port = process.env.WA_PORT || "6002";
  const workerSecret = process.env.WA_WORKER_SECRET || "";

  try {
    const res = await fetch(`http://127.0.0.1:${port}/groups`, {
      method: "GET",
      headers: {
        "x-api-key": workerSecret,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API WA GROUPS]", error);
    return NextResponse.json(
      { ok: false, message: "Gagal terhubung ke wa-worker" },
      { status: 502 },
    );
  }
}
