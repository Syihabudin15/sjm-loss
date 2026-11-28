import { NextRequest, NextResponse } from "next/server";
import { createSimulationImage } from "./service";

export const runtime = "nodejs";

function isValidDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    value <= new Date().toISOString().slice(0, 10)
  );
}

export async function GET(req: NextRequest) {
  const workerSecret = process.env.WA_WORKER_SECRET;
  if (!workerSecret || req.headers.get("x-api-key") !== workerSecret) {
    return NextResponse.json(
      { msg: "Unauthorized" },
      { status: 401 },
    );
  }

  const birthdateInput = req.nextUrl.searchParams.get("birthdate") || "";
  const salaryInput = req.nextUrl.searchParams.get("salary") || "";
  const salary = Number(salaryInput);

  if (!isValidDateOnly(birthdateInput) || !Number.isSafeInteger(salary) || salary <= 0) {
    return NextResponse.json(
      {
        msg: "Tanggal lahir atau gaji tidak valid. Kirim tanggal format YYYY-MM-DD dan gaji lebih dari 0.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await createSimulationImage(
      new Date(`${birthdateInput}T00:00:00.000Z`),
      salary,
    );
    if (!result.ok) {
      return NextResponse.json({ msg: result.msg }, { status: result.status });
    }

    return new NextResponse(new Uint8Array(result.image), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[WA Simulasi] Gagal membuat gambar simulasi:", error);
    return NextResponse.json(
      { msg: "Gagal membuat gambar simulasi pembiayaan." },
      { status: 500 },
    );
  }
}
