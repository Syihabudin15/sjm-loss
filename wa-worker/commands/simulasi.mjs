const usageError =
  "⚠️ Format salah. Gunakan:\n`@simulasi [tahun] [nominal]`\nContoh: `@simulasi 1995 2500000`";
const invalidError =
  "⚠️ Tahun atau nominal tidak valid.\nContoh: `@simulasi 1995 2500000`";

export function simulate(args) {
  const rawArgs = args.trim().split(/\s+/).filter(Boolean);
  if (rawArgs.length < 2) return usageError;

  const year = Number(rawArgs[0]);
  const amount = Number(rawArgs[1].replace(/[^\d]/g, ""));

  if (
    !Number.isInteger(year) ||
    year < 1900 ||
    year > 2100 ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return invalidError;
  }

  return "Fitur masih dalam pengembangan";
}
