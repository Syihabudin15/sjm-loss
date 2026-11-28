// libs/whatsapp.ts
export async function sendWaNotification(
  message: string,
  target?: string | string[],
): Promise<boolean> {
  const port = process.env.WA_PORT || "6002";
  const secret = process.env.WA_WORKER_SECRET || "";
  const defaultTarget = target || process.env.WA_DEFAULT_ID || "";
  const cleanTarget = Array.isArray(defaultTarget)
    ? defaultTarget.map((t) => t.trim()).filter(Boolean)
    : defaultTarget.trim();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": secret,
      },
      body: JSON.stringify({ target: cleanTarget, message }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("[WA] Gagal kirim notifikasi:", errBody);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[WA] Tidak dapat terhubung ke wa-worker:", error);
    return false;
  }
}
