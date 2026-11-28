import { showInfo } from "./info.mjs";
import { listCommands } from "./list-command.mjs";
import { getReport } from "./report.mjs";
import { simulate } from "./simulasi.mjs";

const commandHandlers = new Map([
  ["@list_command", () => listCommands()],
  ["@update_report", (_, context) => getReport("@update_report", context)],
  ["@pending_report", (_, context) => getReport("@pending_report", context)],
  ["@info", () => showInfo()],
  ["@simulasi", (args, context) => simulate(args, context)],
]);

export function parseCommand(text) {
  const match = text.trim().match(/^(@[\w]+)(?:\s+([\s\S]*))?$/i);
  if (!match) return null;

  const name = match[1].toLowerCase();
  const handler = commandHandlers.get(name);
  if (!handler) return null;
  if (name !== "@simulasi" && match[2]) return null;

  return { name, args: match[2] || "", handler };
}

export function executeCommand(command, context) {
  return command.handler(command.args, context);
}
