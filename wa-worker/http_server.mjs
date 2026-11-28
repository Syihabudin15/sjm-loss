import http from "node:http";

function respond(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function formatJid(target) {
  const clean = String(target).trim();
  if (clean.endsWith("@g.us") || clean.endsWith("@s.whatsapp.net")) {
    return clean;
  }
  const digits = clean.replace(/\D/g, "");
  return `${digits}@s.whatsapp.net`;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";
    req.on("data", (chunk) => {
      rawBody += chunk.toString();
    });
    req.on("error", reject);
    req.on("end", () => {
      try {
        resolve(JSON.parse(rawBody || "{}"));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createWorkerHttpServer({ getSocket, isConnected, secret }) {
  return http.createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      respond(res, 200, { ok: true, connected: isConnected() });
      return;
    }

    if (req.method === "GET" && req.url === "/groups") {
      if (secret && req.headers["x-api-key"] !== secret) {
        respond(res, 401, { ok: false, error: "Unauthorized" });
        return;
      }

      const sock = getSocket();
      if (!sock || !isConnected()) {
        respond(res, 503, { ok: false, error: "WhatsApp belum terhubung" });
        return;
      }

      try {
        const groups = await sock.groupFetchAllParticipating();
        const list = Object.values(groups).map((group) => ({
          id: group.id,
          subject: group.subject,
          participantsCount: group.participants?.length ?? 0,
        }));
        respond(res, 200, { ok: true, total: list.length, groups: list });
      } catch (error) {
        console.error("[WA] Gagal mengambil daftar grup:", error);
        respond(res, 500, {
          ok: false,
          error: "Gagal mengambil daftar grup",
        });
      }
      return;
    }

    if (req.method === "POST" && req.url === "/send") {
      if (secret && req.headers["x-api-key"] !== secret) {
        respond(res, 401, { ok: false, error: "Unauthorized" });
        return;
      }

      try {
        const { target, message } = await readJsonBody(req);
        const targets = Array.isArray(target) ? target : target ? [target] : [];

        if (targets.length === 0 || !message) {
          respond(res, 400, {
            ok: false,
            error: "target dan message wajib diisi",
          });
          return;
        }

        const sock = getSocket();
        if (!sock || !isConnected()) {
          respond(res, 503, {
            ok: false,
            error: "WhatsApp belum terhubung",
          });
          return;
        }

        const results = [];
        for (let i = 0; i < targets.length; i++) {
          const jid = formatJid(targets[i]);
          try {
            await sock.sendMessage(jid, { text: message });
            results.push({ jid, ok: true });
          } catch (error) {
            console.error(`[WA] Gagal kirim ke ${jid}:`, error);
            results.push({
              jid,
              ok: false,
              error: error?.message || "Gagal kirim",
            });
          }

          if (i < targets.length - 1) await sleep(800);
        }

        const allSuccess = results.every((result) => result.ok);
        respond(res, allSuccess ? 200 : 207, {
          ok: allSuccess,
          results,
        });
      } catch (error) {
        console.error("[WA] Gagal mengirim pesan:", error);
        respond(res, 500, { ok: false, error: "Gagal mengirim pesan" });
      }
      return;
    }

    respond(res, 404, { ok: false, error: "Not found" });
  });
}
