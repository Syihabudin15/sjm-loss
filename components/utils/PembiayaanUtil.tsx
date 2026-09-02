import moment from "moment";
import { PV } from "@formulajs/formulajs";
import { EMarginType } from "../../generated/prisma/client";
import { IDapem, IOutputDapemDetail } from "@/libs/IInterfaces";

export const IDRFormat = (number: number) => {
  const temp = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    style: "decimal",
    currency: "IDR",
  }).format(number);
  return temp;
};

export const IDRToNumber = (str: string) => {
  return parseInt(str.replace(/\D/g, ""));
};

export function GetFullAge(startDate: Date, endDate: Date) {
  const momentBirthdate = moment(startDate);
  const dateNow = moment(endDate);

  const durasi = moment.duration(dateNow.diff(momentBirthdate));

  const year = durasi.years();
  const month = durasi.months();
  const day = durasi.days();

  return { year, month, day };
}

export function GetMaxTenor(
  max_usia: number,
  usia_tahun: number,
  usia_bulan: number,
) {
  const tmp = max_usia - usia_tahun;
  const max_tenor = usia_tahun <= max_usia ? tmp * 12 - (usia_bulan + 1) : 0;
  return max_tenor;
}

export function GetMaxPlafond(
  mg_bunga: number,
  tenor: number,
  max_angsuran: number,
) {
  const maxPlafond =
    Number(PV(mg_bunga / 100 / 12, tenor, max_angsuran, 0, 0)) * -1;
  return maxPlafond;
}

export const GetAngsuran = (
  plafond: number,
  tenor: number,
  bunga: number,
  type: EMarginType,
  rounded: number,
  ned?: number,
  round?: boolean,
) => {
  if (type === "FLAT") {
    const pokok = plafond / tenor;
    const margin = (plafond * (bunga / 100)) / 12;
    const angs = pokok + margin;
    const angsuran = round
      ? angs
        ? Math.round(angs / rounded) * rounded
        : 0
      : angs
        ? Math.ceil(angs / rounded) * rounded
        : 0;
    return {
      pokok,
      margin,
      ned: ned || 0,
      angsuran: angsuran + (ned || 0),
    };
  } else if (type === "ANUITAS") {
    const r = bunga / 12 / 100;

    const angs =
      (plafond * (r * Math.pow(1 + r, tenor))) / (Math.pow(1 + r, tenor) - 1);
    const pokok = plafond / tenor;
    const margin = angs - pokok;
    const angsuran = round
      ? angs
        ? Math.round(angs / rounded) * rounded
        : 0
      : angs
        ? Math.ceil(angs / rounded) * rounded
        : 0;
    return {
      angsuran: angsuran + (ned || 0),
      pokok,
      ned: ned || 0,
      margin,
    };
  } else {
    return {
      pokok: 0,
      margin: 0,
      ned: ned || 0,
      angsuran: 0,
    };
  }
};

export const GetDapem = (data: IDapem) => {
  const adm = data.plafond * ((data.c_adm_sumdan + data.c_adm) / 100);
  const provisi =
    data.plafond * ((data.c_provisi_sumdan + data.c_fee_bpp) / 100);
  const asuransi = data.plafond * (data.c_insurance / 100);
  const angs = GetAngsuran(
    data.plafond,
    data.tenor,
    data.c_margin + data.c_margin_sumdan,
    data.margin_type || "ANUITAS",
    data.rounded,
    data.c_ned,
  ).angsuran;
  const blok = data.c_blokir * angs;
  const biaya =
    adm +
    asuransi +
    data.c_gov +
    data.c_account_sumdan +
    data.c_stamp +
    data.c_mutasi +
    data.c_flagging +
    data.c_infomation +
    provisi;

  const lastbiaya = biaya + blok + data.c_takeover;
  const tb = data.plafond - lastbiaya;
  return { biaya, blok, lastbiaya, tb };
};

export const GetDetailDapem = (dapem: IDapem): IOutputDapemDetail => {
  const adm_sumdan = dapem.plafond * (dapem.c_adm_sumdan / 100);
  const provisi_sumdan = dapem.plafond * (dapem.c_provisi_sumdan / 100);
  const asuransi = dapem.plafond * (dapem.c_insurance / 100) + dapem.c_flagging;
  const adm = dapem.plafond * (dapem.c_adm / 100);
  const provisi = dapem.plafond * (dapem.c_provisi / 100);

  const lainlain =
    dapem.c_infomation + dapem.c_stamp + dapem.c_mutasi + dapem.c_fee_bpp;
  const angsuran = ValidateAngsuran(dapem);
  const angsuran_sumdan = ValidateAngsuran(dapem, true);
  const biaya =
    adm +
    +adm_sumdan +
    provisi +
    provisi_sumdan +
    dapem.c_account_sumdan +
    asuransi +
    dapem.c_gov +
    lainlain;
  const biayakop = adm + provisi + dapem.c_gov + asuransi + lainlain;
  const angs = dapem.rounded
    ? Math.ceil(angsuran / dapem.rounded) * dapem.rounded
    : angsuran;
  const feebanpot = angs * (dapem.fee_banpot / 100);
  const angsurantotal = angs + dapem.c_ned + feebanpot;

  return {
    detail: {
      adm_sumdan,
      provisi_sumdan,
      asuransi,
      adm,
      provisi,
      angsuran,
      angsuran_sumdan,
      fee_banpot: feebanpot,
      angsuranasli: angsuran,
      angsuranrounded: angs,
    },
    angsuran: angsurantotal,
    administrasi: adm + adm_sumdan,
    provisi: provisi + provisi_sumdan,
    asuransi,
    by_sumdan: adm_sumdan + provisi_sumdan + dapem.c_account_sumdan,
    biaya,
    biayakop,
    tk: dapem.plafond - biaya,
    tb:
      dapem.plafond -
      (biaya + dapem.c_takeover + dapem.c_blokir * angsurantotal),
  };
};

const ValidateAngsuran = (dapem: IDapem, sumdan?: boolean) => {
  if (dapem.margin_type === "ANUITAS") return AngsuranAnuitas(dapem, sumdan);
  if (dapem.margin_type === "FLAT") return AngsuranFlat(dapem, sumdan);
  return AngsuranAnuitas(dapem);
};

const AngsuranAnuitas = (dapem: IDapem, sumdan?: boolean) => {
  const rate = sumdan
    ? dapem.c_margin_sumdan
    : dapem.c_margin + dapem.c_margin_sumdan;
  const r = rate / 12 / 100;

  const angs =
    (dapem.plafond * (r * Math.pow(1 + r, dapem.tenor))) /
    (Math.pow(1 + r, dapem.tenor) - 1);
  // const rounded = sumdan ? dapem.rounded_sumdan : dapem.rounded;
  // return Math.ceil(angs / rounded) * rounded;
  return angs;
};

const AngsuranFlat = (dapem: IDapem, sumdan?: boolean) => {
  const pokok = dapem.plafond / dapem.tenor;
  const r = sumdan
    ? dapem.c_margin_sumdan
    : dapem.c_margin + dapem.c_margin_sumdan;
  const margin = (dapem.plafond * (r / 100)) / 12;
  const angs = pokok + margin;
  return angs;
};

export const GetSisaPokokMargin = (data: IDapem) => {
  const periode = data.Angsurans.find((d) =>
    moment(d.date_pay).isSame(moment().toDate(), "month"),
  );
  const prev = data.Angsurans.filter(
    (d) =>
      moment(d.date_pay).isBefore(moment().toDate(), "month") &&
      d.date_paid === null,
  );
  return {
    principal: periode
      ? periode.date_paid
        ? periode.remaining
        : periode.remaining + periode.principal
      : data.plafond,
    count: periode
      ? periode.date_paid
        ? periode.counter
        : periode.counter + 1
      : data.tenor,
    prevcount: periode
      ? periode.date_paid
        ? prev.length
        : prev.length + 1
      : 0,
    prevvalueprincipal: periode
      ? periode.date_paid
        ? prev.reduce((acc, curr) => acc + curr.principal, 0)
        : prev.reduce((acc, curr) => acc + curr.principal, 0) +
          periode.principal
      : 0,
    prevvalueall: periode
      ? periode.date_paid
        ? prev.reduce((acc, curr) => acc + curr.principal + curr.margin, 0)
        : prev.reduce((acc, curr) => acc + curr.principal + curr.margin, 0) +
          periode.margin +
          periode.principal
      : 0,
    install: periode ? periode.principal + periode.margin : 0,
  };
};

export function GetRoman(number: number): string {
  const romawi = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];
  return romawi[number - 1] || "";
}

export function serializeForApi<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v)),
  );
}

export const getInitialDapemDetail = (): IOutputDapemDetail => ({
  detail: {
    adm_sumdan: 0,
    provisi_sumdan: 0,
    asuransi: 0,
    adm: 0,
    provisi: 0,
    angsuran: 0,
    angsuran_sumdan: 0,
    fee_banpot: 0,
    angsuranasli: 0,
    angsuranrounded: 0,
  },
  angsuran: 0,
  provisi: 0,
  administrasi: 0,
  asuransi: 0,
  by_sumdan: 0,
  biaya: 0,
  biayakop: 0,
  tk: 0,
  tb: 0,
});
