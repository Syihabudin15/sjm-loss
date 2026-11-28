const ERROR_MESSAGE = "❌ Maaf, permintaan gagal diproses oleh sistem.";

export async function getReport(command, { appPort, chatJid, internalGroup }) {
  const url = new URL(
    `/api/whatsapp/ai_command`,
    `http://127.0.0.1:${appPort}`,
  );
  url.searchParams.set("groupid", chatJid);
  url.searchParams.set("command", command);
  if (internalGroup) url.searchParams.set("internalgroup", "ya");

  const response = await fetch(url);
  const data = await response.json();

  return response.ok && data.msg ? data.msg : data.msg || ERROR_MESSAGE;
}
