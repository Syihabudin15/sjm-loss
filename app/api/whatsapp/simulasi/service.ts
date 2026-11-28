import { calculateOtsSimulation } from "@/libs/OtsSimulation";
import prisma from "@/libs/Prisma";
import { renderSimulationImage } from "./render";

type SimulationResult =
  | { ok: false; status: number; msg: string }
  | { ok: true; image: Buffer };

export async function createSimulationImage(
  birthdate: Date,
  salary: number,
): Promise<SimulationResult> {
  const defaults = await prisma.oTSDefault.findFirst({
    orderBy: { id: "asc" },
    include: {
      ProdukPembiayaan: true,
      JenisPembiayaan: true,
      Sumdan: {
        include: {
          ProdukPembiayaans: {
            where: { status: true },
            orderBy: { name: "asc" },
          },
        },
      },
    },
  });

  if (!defaults) {
    return {
      ok: false,
      status: 404,
      msg: "Konfigurasi simulasi OTSDefault belum tersedia.",
    };
  }

  const simulationDate = new Date();
  const simulation = calculateOtsSimulation({
    birthdate,
    simulationDate,
    salary,
    sumdan: defaults.Sumdan,
    jenis: defaults.JenisPembiayaan,
    configuredProduct: defaults.ProdukPembiayaan,
  });

  if (!simulation.product) {
    return {
      ok: false,
      status: 422,
      msg: `Produk sesuai usia ${simulation.age.year} tahun tidak tersedia pada Sumdan ${defaults.Sumdan.name}.`,
    };
  }

  if (!simulation.calculation) {
    return {
      ok: false,
      status: 422,
      msg: "Simulasi belum dapat dihitung. Periksa jenis pembiayaan dan tenor maksimum produk.",
    };
  }

  const image = await renderSimulationImage({
    birthdate,
    simulationDate,
    salary,
    age: simulation.age,
    sumdan: defaults.Sumdan,
    jenis: defaults.JenisPembiayaan,
    product: simulation.product,
    maxTenor: simulation.maxTenor,
    plafond: simulation.plafond,
    calculation: simulation.calculation,
  });

  return { ok: true, image };
}
