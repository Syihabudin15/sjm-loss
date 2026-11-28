import http from "node:http";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import { handleCommandMessage } from "./command_service.mjs";

const PORT = Number(process.env.WA_PORT || 6002);
const SECRET = process.env.WA_WORKER_SECRET || "";
const AUTH_DIR = "./wa-worker/auth_session";

let sock = null;
let isConnected = false;
let pairingRequested = false;

function formatJid(target) {
  const clean = String(target).trim();
  if (clean.endsWith("@g.us") || clean.endsWith("@s.whatsapp.net")) {
    return clean;
  }
  const digits = clean.replace(/\D/g, "");
  return `${digits}@s.whatsapp.net`;
}

async function startWhatsApp() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    browser: ["SJM-SIPP", "Chrome", "1.0.0"],
    printQRInTerminal: false,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !sock.authState.creds.registered) {
      console.log("[WA] Scan QR Code berikut:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      isConnected = true;
      pairingRequested = false;
      console.log("[WA] WhatsApp terhubung dan siap mengirim pesan.");
    }

    if (connection === "close") {
      isConnected = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log(
        `[WA] Koneksi terputus (code: ${statusCode ?? "unknown"}). Reconnect: ${shouldReconnect}`,
      );

      if (shouldReconnect) {
        setTimeout(() => {
          startWhatsApp().catch((err) =>
            console.error("[WA] Gagal reconnect:", err),
          );
        }, 3000);
      } else {
        console.log(
          "[WA] Sesi logged out. Hapus wa-worker/auth_session lalu login ulang.",
        );
      }
    }
  });
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const msg of messages) {
      await handleCommandMessage(sock, msg, {
        allowedGroup: (process.env.WA_GROUP_ALLOWED || "").split(","),
        appPort: process.env.PORT || process.env.APP_PORT || 6001,
        // workerSecret: process.env.WA_WORKER_SECRET || "",
      });
    }
  });

  // Dukungan Pairing Code jika WA_PHONE_NUMBER diisi dan belum terdaftar
  const phoneNumber = process.env.WA_PHONE_NUMBER;
  if (!sock.authState.creds.registered && phoneNumber && !pairingRequested) {
    pairingRequested = true;
    setTimeout(async () => {
      try {
        const cleanPhone = phoneNumber.replace(/\D/g, "");
        const code = await sock.requestPairingCode(cleanPhone);
        console.log("========================================");
        console.log("KODE PAIRING WHATSAPP:", code);
        console.log("========================================");
      } catch (err) {
        console.error("[WA] Gagal meminta pairing code:", err);
      }
    }, 3000);
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, connected: isConnected }));
    return;
  }

  if (req.method === "GET" && req.url === "/groups") {
    if (SECRET && req.headers["x-api-key"] !== SECRET) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "Unauthorized" }));
      return;
    }

    if (!sock || !isConnected) {
      res.writeHead(503, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "WhatsApp belum terhubung" }));
      return;
    }

    try {
      const groups = await sock.groupFetchAllParticipating();
      const list = Object.values(groups).map((g) => ({
        id: g.id,
        subject: g.subject,
        participantsCount: g.participants?.length ?? 0,
      }));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, total: list.length, groups: list }));
    } catch (err) {
      console.error("[WA] Gagal mengambil daftar grup:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ ok: false, error: "Gagal mengambil daftar grup" }),
      );
    }
    return;
  }

  if (req.method === "POST" && req.url === "/send") {
    if (SECRET && req.headers["x-api-key"] !== SECRET) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "Unauthorized" }));
      return;
    }

    let rawBody = "";
    req.on("data", (chunk) => {
      rawBody += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { target, message } = JSON.parse(rawBody || "{}");
        const targets = Array.isArray(target) ? target : target ? [target] : [];

        if (targets.length === 0 || !message) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              ok: false,
              error: "target dan message wajib diisi",
            }),
          );
          return;
        }

        if (!sock || !isConnected) {
          res.writeHead(503, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ ok: false, error: "WhatsApp belum terhubung" }),
          );
          return;
        }

        const results = [];
        for (let i = 0; i < targets.length; i++) {
          const jid = formatJid(targets[i]);
          try {
            await sock.sendMessage(jid, { text: message });
            results.push({ jid, ok: true });
          } catch (err) {
            console.error(`[WA] Gagal kirim ke ${jid}:`, err);
            results.push({
              jid,
              ok: false,
              error: err?.message || "Gagal kirim",
            });
          }

          // Beri jeda 800ms jika masih ada target berikutnya
          if (i < targets.length - 1) {
            await sleep(800);
          }
        }

        const allSuccess = results.every((r) => r.ok);
        res.writeHead(allSuccess ? 200 : 207, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ ok: allSuccess, results }));
      } catch (err) {
        console.error("[WA] Gagal mengirim pesan:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Gagal mengirim pesan" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: false, error: "Not found" }));
});

server.listen(PORT, "127.0.0.1", async () => {
  console.log(`[WA] Server lokal berjalan di http://127.0.0.1:${PORT}`);
  await startWhatsApp();
});
