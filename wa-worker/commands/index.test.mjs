import assert from "node:assert/strict";
import test from "node:test";
import { parseCommand } from "./index.mjs";
import { parseSimulationArgs } from "./simulasi.mjs";

test("parses supported commands without accepting arguments on static commands", () => {
  assert.equal(parseCommand("@UPDATE_REPORT").name, "@update_report");
  assert.equal(parseCommand("@update_report today"), null);
  assert.equal(parseCommand("@unknown"), null);
});

test("requires a complete birth date and a positive salary for simulasi", () => {
  const missingDate = parseSimulationArgs("1955 2500000");
  const invalidDate = parseSimulationArgs("31/02/1955 2500000");
  const validArgs = parseSimulationArgs("01/01/1955 2500000");
  const validCommand = parseCommand("@simulasi 01/01/1955 2500000");

  assert.equal(missingDate.ok, false);
  assert.equal(invalidDate.ok, false);
  assert.deepEqual(validArgs, {
    ok: true,
    birthdate: "1955-01-01",
    salary: 2500000,
  });
  assert.equal(
    parseSimulationArgs("01/01/1955 0").ok,
    false,
  );
  assert.equal(parseSimulationArgs("01/01/1955 gaji").ok, false);
  assert.equal(validCommand.name, "@simulasi");
  assert.equal(validCommand.args, "01/01/1955 2500000");
});
