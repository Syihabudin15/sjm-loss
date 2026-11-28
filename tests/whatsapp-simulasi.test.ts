import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { renderSimulationImage } from "../app/api/whatsapp/simulasi/render";
import { calculateOtsSimulation } from "../libs/OtsSimulation";

test("uses the age-eligible product and renders a PNG simulation", async () => {
  const birthdate = new Date("1955-01-01T00:00:00.000Z");
  const simulationDate = new Date("2026-01-01T00:00:00.000Z");
  const sumdan = {
    id: "sumdan-1",
    name: "Sumdan Example",
    code: "SE",
    dsr: 95,
    rounded: 1000,
    c_ned: 10000,
    c_adm_sumdan: 1,
    c_provisi_sumdan: 0.5,
    c_adm: 1,
    c_provisi: 1,
    c_account_sumdan: 100000,
    c_gov: 1000,
    c_information: 2000,
    c_stamps: 3000,
    c_flagging: 0,
    fee_banpot: 1,
    ProdukPembiayaans: [
      {
        id: "eligible",
        name: "Produk Eligible",
        min_age: 40,
        max_age: 75,
        max_tenor: 180,
        max_paid: 75,
        max_plafond: 200000000,
        c_margin: 10,
        c_margin_sumdan: 0,
        margin_type: "ANUITAS" as const,
        c_insurance: 1,
      },
    ],
  };
  const jenis = {
    id: "jenis-1",
    name: "Jenis Example",
    c_blokir: 0,
    c_mutasi: 1000,
  };
  const simulation = calculateOtsSimulation({
    birthdate,
    simulationDate,
    salary: 2500000,
    sumdan,
    jenis,
    configuredProduct: null,
  });

  assert.equal(simulation.age.year, 71);
  assert.equal(simulation.product?.id, "eligible");
  assert.equal(simulation.maxTenor, 47);
  assert.ok(simulation.calculation);

  const image = await renderSimulationImage({
    birthdate,
    simulationDate,
    salary: 2500000,
    age: simulation.age,
    sumdan,
    jenis,
    product: simulation.product,
    maxTenor: simulation.maxTenor,
    plafond: simulation.plafond,
    calculation: simulation.calculation,
  });
  const metadata = await sharp(image).metadata();

  assert.equal(metadata.format, "png");
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 1480);
});
