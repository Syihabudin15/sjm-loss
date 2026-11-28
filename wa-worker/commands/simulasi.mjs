const usageError =
  "⚠️ Format: `@simulasi DD/MM/YYYY gaji`\nContoh: `@simulasi 01/01/1955 2500000`";
const invalidError =
  "⚠️ Tanggal lahir atau gaji tidak valid. Gunakan format `DD/MM/YYYY` dan gaji lebih dari 0.";

function parseBirthDate(value) {
  let year;
  let month;
  let day;

  const localDate = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (localDate) {
    [, day, month, year] = localDate;
  } else if (isoDate) {
    [, year, month, day] = isoDate;
  } else {
    return null;
  }

  if (Number(year) < 1900 || Number(year) > new Date().getFullYear()) {
    return null;
  }

  const parsedDate = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );
  if (
    parsedDate.getUTCFullYear() !== Number(year) ||
    parsedDate.getUTCMonth() !== Number(month) - 1 ||
    parsedDate.getUTCDate() !== Number(day) ||
    parsedDate > new Date()
  ) {
    return null;
  }

  return `${year}-${month}-${day}`;
}

export function parseSimulationArgs(args) {
  const [birthDateInput, salaryInput, ...extraArgs] = args
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!birthDateInput || !salaryInput || extraArgs.length > 0) {
    return { ok: false, message: usageError };
  }

  const birthdate = parseBirthDate(birthDateInput);
  const salaryIsValid = /^[\d.,]+$/.test(salaryInput);
  const salary = Number(salaryInput.replace(/[.,]/g, ""));
  if (
    !birthdate ||
    !salaryIsValid ||
    !Number.isSafeInteger(salary) ||
    salary <= 0
  ) {
    return { ok: false, message: invalidError };
  }

  return { ok: true, birthdate, salary };
}

export async function simulate(args, { appPort, workerSecret }) {
  const parsed = parseSimulationArgs(args);
  if (!parsed.ok) return parsed.message;

  const url = new URL("/api/whatsapp/simulasi", `http://127.0.0.1:${appPort}`);
  url.searchParams.set("birthdate", parsed.birthdate);
  url.searchParams.set("salary", String(parsed.salary));

  const response = await fetch(url, {
    headers: { "x-api-key": workerSecret || "" },
  });
  if (response.headers.get("content-type")?.includes("image/png")) {
    return {
      image: Buffer.from(await response.arrayBuffer()),
      caption: "Hasil Analisa Simulasi Pembiayaan.",
    };
  }

  const data = await response.json();
  return data.msg || "❌ Simulasi gagal diproses oleh sistem.";
}
