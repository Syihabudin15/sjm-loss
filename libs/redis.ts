import Redis from "ioredis";

// Otomatis terhubung ke URL yang diberikan
const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
  {
    lazyConnect: true,
  },
);

// Anda tetap bisa memantau event jika terjadi error atau berhasil koneksi
redisClient.on("error", (err) => console.error("Redis Client Error", err));

export default redisClient;
