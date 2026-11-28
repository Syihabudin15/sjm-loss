import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import { config } from "./config.mjs";
import { createWorkerHttpServer } from "./http_server.mjs";
import { handleCommandMessage } from "./command_service.mjs";

let sock = null;
let isConnected = false;
let pairingRequested = false;

async function startWhatsApp() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { state, saveCreds } = await useMultiFileAuthState(config.authDir);
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
          startWhatsApp().catch((error) =>
            console.error("[WA] Gagal reconnect:", error),
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
        allowedGroups: config.allowedGroups,
        appPort: config.appPort,
      });
    }
  });

  if (!sock.authState.creds.registered && config.phoneNumber && !pairingRequested) {
    pairingRequested = true;
    setTimeout(async () => {
      try {
        const cleanPhone = config.phoneNumber.replace(/\D/g, "");
        const code = await sock.requestPairingCode(cleanPhone);
        console.log("========================================");
        console.log("KODE PAIRING WHATSAPP:", code);
        console.log("========================================");
      } catch (error) {
        console.error("[WA] Gagal meminta pairing code:", error);
      }
    }, 3000);
  }
}

const server = createWorkerHttpServer({
  getSocket: () => sock,
  isConnected: () => isConnected,
  secret: config.secret,
});

server.listen(config.port, "127.0.0.1", async () => {
  console.log(
    `[WA] Server lokal berjalan di http://127.0.0.1:${config.port}`,
  );
  await startWhatsApp();
});
