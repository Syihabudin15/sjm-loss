// const groupHistory = new Map();
const userCooldown = new Map();
const COOLDOWN_MS = 3000; // 5 detik per pengirim

function isOnCooldown(senderJid) {
  if (!senderJid) return false;
  const now = Date.now();
  const lastTime = userCooldown.get(senderJid) || 0;
  if (now - lastTime < COOLDOWN_MS) return true;
  userCooldown.set(senderJid, now);
  return false;
}

function extractMessageText(msg) {
  const m = msg.message;
  if (!m) return "";
  // return (
  //   m.conversation ||
  //   m.extendedTextMessage?.text ||
  //   m.imageMessage?.caption ||
  //   m.videoMessage?.caption ||
  //   ""
  // ).trim();
  return (m.conversation || m.extendedTextMessage?.text || "").trim();
}

// function pushGroupHistory(chatJid, senderName, text) {
//   const list = groupHistory.get(chatJid) || [];
//   list.push({
//     sender: senderName || "Anggota",
//     text,
//     time: new Date().toISOString(),
//   });
//   if (list.length > MAX_HISTORY) list.shift();
//   groupHistory.set(chatJid, list);
// }

export async function handleCommandMessage(sock, msg, options = {}) {
  const { allowedGroup, appPort } = options;
  if (!msg.message || msg.key.fromMe) return;

  const chatJid = msg.key.remoteJid;
  if (!chatJid) return;

  const isGroup = chatJid.endsWith("@g.us");
  if (!isGroup) return;
  const internalGroup = allowedGroup.includes(chatJid);

  const text = extractMessageText(msg);
  if (!text) return;

  if (!["@update_report"].includes(text)) return;

  const senderJid = isGroup ? msg.key.participant : chatJid;
  // const senderName = msg.pushName || senderJid?.split("@")[0] || "User";

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

  try {
    await sock.sendMessage(chatJid, {
      react: { text: "⏳", key: msg.key },
    });

    let replyText = "";

    switch (text) {
      case "@update_report": {
        const res = await fetch(
          `http://127.0.0.1:${appPort}/api/whatsapp/ai_command?groupid=${chatJid}${internalGroup ? "&internalgroup=ya" : ""}`,
        );
        const data = await res.json();
        replyText =
          res.ok && data.msg
            ? data.msg
            : res.msg || "❌ Maaf, permintaan gagal diproses oleh sistem.";
        break;
      }
    }

    await sock.sendMessage(chatJid, { text: replyText }, { quoted: msg });
    await sock.sendMessage(chatJid, {
      react: { text: "✅", key: msg.key },
    });
  } catch (err) {
    console.error("[WA-Command] Gagal memproses perintah:", err);
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
