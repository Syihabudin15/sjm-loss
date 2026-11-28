import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runDailyOtsCleanup() {
  console.log("[CRON] Data OTS Menjalankan tugas pukul 01:00 WIB...");
  try {
    const findResetOts = await prisma.oTSDetail.findMany({
      where: {
        ots_status: { in: ["PENDING", "HAPUS", "PROSES"] },
        reset_date: { lte: new Date() },
      },
    });

    if (findResetOts.length !== 0) {
      await prisma.oTSDetail.deleteMany({
        where: { id: { in: findResetOts.map((f) => f.id) } },
      });
    }

    console.log(
      `[CRON] Data OTS Berhasil Dijalankan. ${findResetOts.length} data ots berhasil dihapus.`,
    );
  } catch (error) {
    console.error("[CRON] Data OTS Gagal menjalankan tugas:", error);
  }
}

// async function runDailyPendingReport() {
//   console.log("[CRON] Morning Report Menjalankan tugas pukul 07:00 WIB...");
//   try {
//     // console.log(
//     //   `[CRON] Morning Report Berhasil Dijalankan. ${findResetOts.length} data ots berhasil dihapus.`,
//     // );
//   } catch (error) {
//     console.error("[CRON] Morning Report Gagal menjalankan tugas:", error);
//   }
// }

// Menjalankan setiap hari pukul 01:00 WIB
cron.schedule("0 1 * * *", runDailyOtsCleanup, {
  timezone: "Asia/Jakarta",
});

// Menjalankan setiap hari pukul 07:00 WIB
// cron.schedule("0 7 * * *", runMorningSevenCheck, {
//   timezone: "Asia/Jakarta",
// });

console.log(
  "[CRON] Worker aktif. Jadwal: setiap hari 01:00 WIB (Asia/Jakarta).",
);

async function shutdown(signal) {
  console.log(`[CRON] Menerima sinyal ${signal}, menutup koneksi Prisma...`);
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
