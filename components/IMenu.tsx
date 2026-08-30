import {
  AccountBookOutlined,
  BankOutlined,
  BarChartOutlined,
  BookOutlined,
  BorderOuterOutlined,
  BranchesOutlined,
  CalculatorOutlined,
  ContainerOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DiffOutlined,
  DollarCircleOutlined,
  FileProtectOutlined,
  FolderOpenOutlined,
  GlobalOutlined,
  KeyOutlined,
  MoneyCollectOutlined,
  PercentageOutlined,
  PieChartOutlined,
  ReadOutlined,
  RobotOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  SlidersOutlined,
  SnippetsOutlined,
  TagOutlined,
  TeamOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { Banknote } from "lucide-react";

export interface IMenu {
  label: string | React.ReactNode;
  key: string;
  icon: string | React.ReactNode;
  needaccess: boolean;
  availableAccess?: string[];
}
export interface IMenuType extends IMenu {
  children?: IMenu[];
}

export const listMenuUI: IMenuType[] = [
  {
    label: "Dashboard",
    key: "/dashboard",
    icon: <DashboardOutlined />,
    needaccess: true,
    availableAccess: ["read"],
  },
  {
    label: "Dashboard Bisnis",
    key: "/dashboardbis",
    icon: <DashboardOutlined />,
    needaccess: true,
    availableAccess: ["read"],
  },
  {
    label: "Dashboard Fronting",
    key: "/dashboard_fronting",
    icon: <DashboardOutlined />,
    needaccess: true,
    availableAccess: ["read"],
  },
  {
    label: "Simulasi Pembiayaan",
    key: "/simulasi",
    icon: <CalculatorOutlined />,
    needaccess: true,
    availableAccess: ["read", "update", "showpercent", "update_bop", "deviasi"],
  },
  {
    label: "Data Simulasi",
    key: "/data_simulasi",
    icon: <CalculatorOutlined />,
    needaccess: true,
    availableAccess: ["read", "update", "delete"],
  },
  {
    label: "Monitoring Pembiayaan",
    key: "/monitoring",
    icon: <ReadOutlined />,
    needaccess: true,
    availableAccess: ["read", "write", "update", "delete"],
  },
  {
    label: "Pending Data",
    key: "/pendingdata",
    icon: <ReadOutlined />,
    needaccess: true,
    availableAccess: ["read", "write", "update", "delete"],
  },
  {
    label: "Proses Pembiayaan",
    key: "/proses",
    icon: <FileProtectOutlined />,
    needaccess: true,
    children: [
      {
        label: "Verifikasi Pembiayaan",
        key: "/proses/verif",
        icon: <FileProtectOutlined />,
        needaccess: true,
        availableAccess: ["read", "proses"],
      },
      {
        label: "Verifikasi SLIK",
        key: "/proses/slik",
        icon: <FileProtectOutlined />,
        needaccess: true,
        availableAccess: ["read", "proses"],
      },
      {
        label: "Approval Pembiayaan",
        key: "/proses/approv",
        icon: <FileProtectOutlined />,
        needaccess: true,
        availableAccess: ["read", "proses"],
      },
    ],
  },
  {
    label: "Dropping Pembiayaan",
    key: "/pencairan",
    icon: <TransactionOutlined />,
    needaccess: true,
    children: [
      {
        label: "Cetak SI",
        key: "/pencairan/print",
        icon: <DiffOutlined />,
        needaccess: true,
        availableAccess: ["read", "write"],
      },
      {
        label: "Permohonan Dropping",
        key: "/pencairan/dropping",
        icon: <DollarCircleOutlined />,
        needaccess: true,
        availableAccess: ["read", "update", "proses"],
      },
    ],
  },
  {
    label: "Sending Document",
    key: "/ttpb",
    icon: <FolderOpenOutlined />,
    needaccess: true,
    children: [
      {
        label: "Cetak SD",
        key: "/ttpb/print",
        icon: <DiffOutlined />,
        needaccess: true,
        availableAccess: ["read", "write"],
      },
      {
        label: "Permohonan SD",
        key: "/ttpb/dropping",
        icon: <FolderOpenOutlined />,
        needaccess: true,
        availableAccess: ["read", "update", "proses"],
      },
    ],
  },
  {
    label: "Sending Jaminan",
    key: "/ttpj",
    icon: <SecurityScanOutlined />,
    needaccess: true,
    children: [
      {
        label: "Cetak TTPJ",
        key: "/ttpj/print",
        icon: <DiffOutlined />,
        needaccess: true,
        availableAccess: ["read", "write"],
      },
      {
        label: "Permohonan TTPJ",
        key: "/ttpj/dropping",
        icon: <SecurityScanOutlined />,
        needaccess: true,
        availableAccess: ["read", "update", "proses"],
      },
    ],
  },
  {
    label: "Daftar Nominatif",
    key: "/nominatif",
    icon: <FileProtectOutlined />,
    needaccess: true,
    availableAccess: ["read", "update"],
  },
  {
    label: "Proses TMFTB",
    key: "/tmftb",
    icon: <FileProtectOutlined />,
    needaccess: true,
    availableAccess: ["read", "update"],
  },
  {
    label: "Tagihan",
    key: "/tagihan",
    icon: <MoneyCollectOutlined />,
    needaccess: true,
    availableAccess: ["read", "write", "update", "proses"],
  },
  {
    label: "Data Debitur",
    key: "/debitur",
    icon: <BookOutlined />,
    needaccess: true,
    availableAccess: ["read"],
  },
  {
    label: "Pelunasan Debitur",
    key: "/pelunasan",
    icon: <MoneyCollectOutlined />,
    needaccess: true,
    availableAccess: ["read", "write", "update", "delete", "proses"],
  },
  {
    label: "Laporan Keuangan",
    key: "/lapkeu",
    icon: <PieChartOutlined />,
    needaccess: true,
    children: [
      {
        label: "Chart Of Account",
        key: "/lapkeu/coa",
        icon: <SnippetsOutlined />,
        needaccess: true,
        availableAccess: ["read", "write", "update", "delete"],
      },
      {
        label: "Jurnal Entry",
        key: "/lapkeu/jurnal",
        icon: <AccountBookOutlined />,
        needaccess: true,
        availableAccess: ["read", "write", "update", "delete"],
      },
      {
        label: "Neraca",
        key: "/lapkeu/neraca",
        icon: <BarChartOutlined />,
        needaccess: true,
        availableAccess: ["read"],
      },
      {
        label: "Neraca Rugilaba",
        key: "/lapkeu/neraca-rugilaba",
        icon: <PercentageOutlined />,
        needaccess: true,
        availableAccess: ["read"],
      },
      {
        label: "Rugilaba",
        key: "/lapkeu/rugilaba",
        icon: <SlidersOutlined />,
        needaccess: true,
        availableAccess: ["read"],
      },
    ],
  },
  {
    label: "Database",
    key: "/database",
    icon: <DatabaseOutlined />,
    needaccess: true,
    availableAccess: ["read"],
  },
  {
    label: "SLIK Analyze",
    key: "/slik-analyze",
    icon: <SecurityScanOutlined />,
    needaccess: true,
    availableAccess: ["read"],
  },
  {
    label: "Profile Setting",
    key: "/profile",
    icon: <SettingOutlined />,
    needaccess: false,
    availableAccess: ["read"],
  },
  {
    label: "Master Data",
    key: "/master",
    icon: <RobotOutlined />,
    needaccess: true,
    children: [
      {
        label: "Manajemen Role",
        key: "/master/roles",
        icon: <KeyOutlined />,
        needaccess: true,
        availableAccess: ["read", "write", "update", "delete"],
      },
      {
        label: "Manajemen User",
        key: "/master/users",
        icon: <TeamOutlined />,
        needaccess: true,
        availableAccess: ["read", "write", "update", "delete"],
      },
      {
        label: "Manajemen Unit",
        key: "/master/area",
        icon: <BranchesOutlined />,
        needaccess: true,
        availableAccess: ["read", "write", "update", "delete"],
      },
      {
        label: "Manajemen Mitra",
        key: "/master/mitra",
        icon: <BankOutlined />,
        needaccess: true,
        availableAccess: ["read", "write", "update", "delete"],
      },
      {
        label: "Jenis Pembiayaan",
        key: "/master/jenis",
        icon: <BorderOuterOutlined />,
        needaccess: true,
        availableAccess: ["read", "write", "update", "delete"],
      },
      {
        label: "Manajemen Agent",
        key: "/master/agent",
        icon: <GlobalOutlined />,
        needaccess: true,
        availableAccess: ["read", "write", "update", "delete"],
      },
      {
        label: "Produk Agent",
        key: "/master/mitra_front",
        icon: <Banknote />,
        needaccess: true,
        availableAccess: ["read", "write", "update", "delete"],
      },
      {
        label: "Kantor Bayar",
        key: "/master/payoffice",
        icon: <TagOutlined />,
        needaccess: true,
        availableAccess: ["read", "write", "update", "delete"],
      },
      {
        label: "Asuransi",
        key: "/master/insurance",
        icon: <ContainerOutlined />,
        needaccess: true,
        availableAccess: ["read", "write", "update", "delete"],
      },
    ],
  },
];

export const listMenuServer: { key: string; needaccess: boolean }[] = [
  {
    key: "/dash",
    needaccess: false,
  },
  {
    key: "/dashboard",
    needaccess: true,
  },
  {
    key: "/dashboardbis",
    needaccess: true,
  },
  {
    key: "/dashboard_fronting",
    needaccess: true,
  },
  {
    key: "/simulasi",
    needaccess: true,
  },
  {
    key: "/data_simulasi",
    needaccess: true,
  },
  {
    key: "/monitoring",
    needaccess: true,
  },
  {
    key: "/pendingdata",
    needaccess: true,
  },
  {
    key: "/proses/verif",
    needaccess: true,
  },
  {
    key: "/proses/slik",
    needaccess: true,
  },
  {
    key: "/proses/approv",
    needaccess: true,
  },
  {
    key: "/pencairan/print",
    needaccess: true,
  },
  {
    key: "/pencairan/dropping",
    needaccess: true,
  },
  {
    key: "/tppb/print",
    needaccess: true,
  },
  {
    key: "/tppb/dropping",
    needaccess: true,
  },
  {
    key: "/tppj/print",
    needaccess: true,
  },
  {
    key: "/tppj/dropping",
    needaccess: true,
  },
  {
    key: "/nominatif",
    needaccess: true,
  },
  {
    key: "/tmftb",
    needaccess: true,
  },
  {
    key: "/tagihan",
    needaccess: true,
  },
  {
    key: "/debitur",
    needaccess: true,
  },
  {
    key: "/pelunasan",
    needaccess: true,
  },
  {
    key: "/lapkeu/coa",
    needaccess: true,
  },
  {
    key: "/lapkeu/jurnal",
    needaccess: true,
  },
  {
    key: "/lapkeu/neraca",
    needaccess: true,
  },
  {
    key: "/lapkeu/neraca-rugilaba",
    needaccess: true,
  },
  {
    key: "/lapkeu/rugilaba",
    needaccess: true,
  },
  {
    key: "/database",
    needaccess: true,
  },
  {
    key: "/master/users",
    needaccess: true,
  },
  {
    key: "/profile",
    needaccess: false,
  },
  {
    key: "/master/roles",
    needaccess: true,
  },
  {
    key: "/master/mitra",
    needaccess: true,
  },
  {
    key: "/master/user",
    needaccess: true,
  },
  {
    key: "/master/area",
    needaccess: true,
  },
  {
    key: "/master/jenis",
    needaccess: true,
  },
  {
    key: "/master/agent",
    needaccess: true,
  },
  {
    key: "/master/mitra_front",
    needaccess: true,
  },
  {
    key: "/master/payoffice",
    needaccess: true,
  },
  {
    key: "/master/insurance",
    needaccess: true,
  },
];

export const MenuPermission = (
  items: IMenuType[],
  allowedKeys: string[],
): any[] => {
  return items
    .map((item) => {
      // 1. Destructuring untuk membuang properti non-standar Ant Design
      // include 'availableAccess' dan 'needaccess' agar tidak lolos ke komponen UI
      const { needaccess, availableAccess, ...cleanItem } = item;

      // 2. Jika menu memiliki anak (submenu)
      if (item.children && item.children.length > 0) {
        const filteredChildren = MenuPermission(item.children, allowedKeys);

        // Jika anak-anaknya ada yang lolos hak akses, tampilkan menu induk ini
        if (filteredChildren.length > 0) {
          return {
            ...cleanItem,
            children: filteredChildren,
          };
        }

        // Jika semua anaknya tidak boleh diakses, induknya otomatis ikut disembunyikan
        return null;
      }

      // 3. Pengecekan hak akses untuk menu utama / sub-menu paling ujung (leaf node)
      const isAllowed = !item.needaccess
        ? true
        : allowedKeys.includes(item.key);

      if (isAllowed) {
        return cleanItem;
      }

      return null;
    })
    .filter(Boolean) as any[]; // Menghapus nilai null dari array hasil filter
};
