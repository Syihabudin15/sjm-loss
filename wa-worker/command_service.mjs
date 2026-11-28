import { executeCommand, parseCommand } from "./commands/index.mjs";

const userCooldown = new Map();
const COOLDOWN_MS = 3000;

function isOnCooldown(senderJid) {
  if (!senderJid) return false;
  const now = Date.now();
  const lastTime = userCooldown.get(senderJid) || 0;
  if (now - lastTime < COOLDOWN_MS) return true;
  userCooldown.set(senderJid, now);
  return false;
}

function extractMessageText(msg) {
  const message = msg.message;
  if (!message) return "";
  return (message.conversation || message.extendedTextMessage?.text || "")
    .trim();
}

export async function handleCommandMessage(sock, msg, options = {}) {
  if (!msg.message || msg.key.fromMe) return;

  const chatJid = msg.key.remoteJid;
  if (!chatJid || !chatJid.endsWith("@g.us")) return;

  const text = extractMessageText(msg);
  if (!text) return;

  const command = parseCommand(text);
  if (!command) return;

  const senderJid = msg.key.participant || chatJid;
  if (isOnCooldown(senderJid)) {
    await sock.sendMessage(
      chatJid,
      {
        text: "⏳ Tunggu beberapa detik sebelum mengirim perintah `@` berikutnya.",
      },
      { quoted: msg },
    );
    return;
  }

  const allowedGroups = options.allowedGroups || [];
  const internalGroup = allowedGroups.includes(chatJid);

  try {
    await sock.sendMessage(chatJid, {
      react: { text: "⏳", key: msg.key },
    });

    const reply = await executeCommand(command, {
      appPort: options.appPort || 6001,
      chatJid,
      internalGroup,
      workerSecret: options.workerSecret,
    });

    let response;
    if (typeof reply === "string") {
      response = { text: reply };
    } else if (
      reply &&
      Buffer.isBuffer(reply.image) &&
      typeof reply.caption === "string"
    ) {
      response = { image: reply.image, caption: reply.caption };
    } else {
      throw new TypeError("Command menghasilkan respons yang tidak dikenal.");
    }

    await sock.sendMessage(chatJid, response, { quoted: msg });
    await sock.sendMessage(chatJid, {
      react: { text: "✅", key: msg.key },
    });
  } catch (error) {
    console.error("[WA-Command] Gagal memproses perintah:", error);
    await sock.sendMessage(chatJid, {
      react: { text: "❌", key: msg.key },
    });
    await sock.sendMessage(
      chatJid,
      { text: "❌ Terjadi gangguan saat menghubungi layanan AI." },
      { quoted: msg },
    );
  }
}
