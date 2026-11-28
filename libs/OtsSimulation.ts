import {
  GetDetailDapem,
  GetFullAge,
  GetMaxPlafond,
  GetMaxTenor,
} from "@/components/utils/PembiayaanUtil";
import type {
  JenisPembiayaan,
  ProdukPembiayaan,
  Sumdan,
} from "@/generated/prisma/client";

type SimulationProduct = Pick<
  ProdukPembiayaan,
  | "id"
  | "name"
  | "min_age"
  | "max_age"
  | "max_tenor"
  | "max_paid"
  | "max_plafond"
  | "c_margin"
  | "c_margin_sumdan"
  | "margin_type"
  | "c_insurance"
>;

type SimulationSumdan = Pick<
  Sumdan,
  | "id"
  | "name"
  | "code"
  | "dsr"
  | "rounded"
  | "c_ned"
  | "c_adm_sumdan"
  | "c_provisi_sumdan"
  | "c_adm"
  | "c_provisi"
  | "c_account_sumdan"
  | "c_gov"
  | "c_information"
  | "c_stamps"
  | "c_flagging"
  | "fee_banpot"
> & {
  ProdukPembiayaans: SimulationProduct[];
};

type SimulationJenis = Pick<
  JenisPembiayaan,
  "id" | "name" | "c_blokir" | "c_mutasi"
>;

export function calculateOtsSimulation({
  birthdate,
  simulationDate,
  salary,
  sumdan,
  jenis,
  configuredProduct,
}: {
  birthdate: Date;
  simulationDate: Date;
  salary: number;
  sumdan: SimulationSumdan | null | undefined;
  jenis: SimulationJenis | null | undefined;
  configuredProduct: SimulationProduct | null;
}) {
  const age = GetFullAge(birthdate, simulationDate);
  const eligibleProducts = (sumdan?.ProdukPembiayaans || []).filter(
    (product) => age.year >= product.min_age && age.year < product.max_age,
  );
  const product =
    configuredProduct &&
    eligibleProducts.some((item) => item.id === configuredProduct.id)
      ? configuredProduct
      : (eligibleProducts[0] ?? null);
  const maxTenor = Math.max(
    0,
    Math.min(
      product?.max_tenor || 0,
      GetMaxTenor(product?.max_paid || 0, age.year, age.month),
    ),
  );
  const maxInstallment = Math.max(
    0,
    ((salary - 100000) * (sumdan?.dsr || 0)) / 100,
  );
  const plafond = Math.max(
    0,
    Math.min(
      product?.max_plafond || 0,
      maxTenor > 0
        ? Math.trunc(
            GetMaxPlafond(
              (product?.c_margin || 0) + (product?.c_margin_sumdan || 0),
              maxTenor,
              maxInstallment,
            ),
          )
        : 0,
    ),
  );
  const calculation =
    product?.id && jenis?.id && sumdan && maxTenor >= 1
      ? GetDetailDapem({
          plafond,
          tenor: maxTenor,
          c_margin: product.c_margin,
          c_margin_sumdan: product.c_margin_sumdan,
          margin_type: product.margin_type,
          rounded: sumdan.rounded,
          c_ned: sumdan.c_ned,
          c_adm_sumdan: sumdan.c_adm_sumdan,
          c_provisi_sumdan: sumdan.c_provisi_sumdan,
          c_insurance: product.c_insurance,
          c_adm: sumdan.c_adm,
          c_provisi: sumdan.c_provisi,
          c_account_sumdan: sumdan.c_account_sumdan,
          c_gov: sumdan.c_gov,
          c_infomation: sumdan.c_information,
          c_stamp: sumdan.c_stamps,
          c_mutasi: jenis.c_mutasi,
          c_fee_bpp: 0,
          c_flagging: sumdan.c_flagging,
          fee_banpot: sumdan.fee_banpot,
          c_takeover: 0,
          c_blokir: jenis.c_blokir,
        })
      : null;

  return {
    age,
    eligibleProducts,
    product,
    maxTenor,
    maxInstallment,
    plafond,
    calculation,
  };
}
