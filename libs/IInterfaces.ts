import {
  AgentFronting,
  Angsuran,
  Area,
  Berkas,
  Cabang,
  CategoryOfAccount,
  Dapem,
  DataSimulasi,
  Debitur,
  Dropping,
  Insurance,
  Jaminan,
  JenisPembiayaan,
  JournalDetail,
  JournalEntry,
  PayOffice,
  Pelunasan,
  ProdukPembiayaan,
  Role,
  Sumdan,
  SumdanAgentFronting,
  User,
} from "../generated/prisma/client";

export interface IUser extends User {
  sumdan: string | null;
  cabang: string;
  area: string;
  Role: Role;
}

export interface IPermission {
  path: string;
  access: string[];
}

export interface IActionTable<T> {
  upsert: boolean;
  delete: boolean;
  proses: boolean;
  selected: T | undefined;
}

export interface IPageProps<T> {
  page: number;
  limit: number;
  search: string;
  total: number;
  data: T[];
  [key: string]: any;
}

export interface IViewFiles {
  open: boolean;
  data: { name: string; url: string }[];
}

export interface IDesc {
  name: string;
  date: Date;
  desc: string;
}
export interface ICashDesc {
  amount: number;
  date: Date;
  desc: string;
  file: string;
}

// Models
export interface ISumdan extends Sumdan {
  ProdukPembiayaans: IProdukPembiayaan[];
}

export interface IArea extends Area {
  Cabangs: ICabang[];
}
export interface IProdukPembiayaan extends ProdukPembiayaan {
  Sumdan: Sumdan;
  Dapems: IDapem[];
}
export interface IJenisPembiayaan extends JenisPembiayaan {
  Dapems: IDapem[];
}
export interface ICabang extends Cabang {
  Area: IArea;
  Users: IUserDapem[];
}
export interface IUserDapem extends User {
  Sumdan: ISumdan;
  AgentFronting: IAgentFronting;
  Cabang: ICabang;
  Dapems: IDapem[];
  AOs: IDapem[];
  AOCabangs: IDapem[];
  AOAreas: IDapem[];
}
export interface ISumdanAgentFronting extends SumdanAgentFronting {
  Sumdan: Sumdan;
  AgentFronting: AgentFronting;
}
export interface IAgentFronting extends AgentFronting {
  Users: IUserDapem[];
  Dapems: IDapem[];
  SumdanAgentFrontings: ISumdanAgentFronting[];
}

export interface IDapem extends Dapem {
  Debitur: Debitur;
  ProdukPembiayaan: IProdukPembiayaan;
  User: IUserDapem;
  AO: IUserDapem | null;
  AOCabang: IUserDapem | null;
  AOArea: IUserDapem | null;
  Dropping: Dropping | null;
  Berkas: Berkas | null;
  Jaminan: Jaminan | null;
  JenisPembiayaan: JenisPembiayaan;
  Angsurans: Angsuran[];
  Pelunasan: Pelunasan | null;
  AgentFronting: IAgentFronting | null;
  PayOffice: PayOffice;
  PrevPayOffice: PayOffice;
  Insurance: Insurance;
}

export interface IDropping extends Dropping {
  Sumdan: Sumdan;
  Dapems: IDapem[];
}
export interface IDocument extends Berkas {
  Sumdan: Sumdan;
  Dapems: IDapem[];
}

export interface ISumdanDropping extends Sumdan {
  Dapems: IDapem[];
}

export interface IDebitur extends Debitur {
  Dapems: IDapem[];
  PayOffice: IPayOffice;
}

export interface IPelunasan extends Pelunasan {
  Dapem: IDapem;
}

export interface IAngsuran extends Angsuran {
  Dapem: IDapem;
}

export interface IJournalDetail extends JournalDetail {
  JournalEntry: JournalEntry;
  User: User | null;
  CategoryOfAccount: CategoryOfAccount;
}

export interface IJournalEntry extends JournalEntry {
  JournalDetails: IJournalDetail[];
}

export interface ICategoryOfAccount extends CategoryOfAccount {
  Childrens: ICategoryOfAccount[];
  Parent: ICategoryOfAccount | null;
  JournalDetails: IJournalDetail[];
}

export interface IPayOffice extends PayOffice {
  Dapems: IDapem[];
}
export interface IInsurance extends Insurance {
  Dapems: IDapem[];
}
export interface IDataSimulasi extends DataSimulasi {
  JenisPembiayaan: JenisPembiayaan;
  Product: ProdukPembiayaan;
  User: User;
}
// End Models

export interface IExportData {
  data: { [key: string]: any }[];
  sheetname: string;
}

export interface UserType extends User {
  Cabang: ICabang;
  Sumdan: Sumdan;
  Role: Role;
  AgentFronting: AgentFronting;
}

export interface IFiles {
  name: string;
  url: string;
}

export interface IOutputDapemDetail {
  detail: {
    adm_sumdan: number;
    provisi_sumdan: number;
    asuransi: number;
    adm: number;
    provisi: number;
    angsuran: number;
    fee_banpot: number;
    angsuran_sumdan: number;
    angsuranasli: number;
    angsuranrounded: number;
  };
  angsuran: number;
  provisi: number;
  administrasi: number;
  asuransi: number;
  by_sumdan: number;
  biaya: number;
  tk: number;
  tb: number;
  biayakop: number;
}
