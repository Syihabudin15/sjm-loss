import assert from "node:assert/strict";
import test from "node:test";
import { executeCommand, parseCommand } from "./index.mjs";

test("parses supported commands without accepting arguments on static commands", () => {
  assert.equal(parseCommand("@UPDATE_REPORT").name, "@update_report");
  assert.equal(parseCommand("@update_report today"), null);
  assert.equal(parseCommand("@unknown"), null);
});

test("validates simulasi arguments before replying", async () => {
  const invalid = parseCommand("@simulasi 1800 2500000");
  const valid = parseCommand("@simulasi 1995 2500000");

  assert.match(await executeCommand(invalid, {}), /Tahun atau nominal tidak valid/);
  assert.equal(
    await executeCommand(valid, {}),
    "Fitur masih dalam pengembangan",
  );
});
