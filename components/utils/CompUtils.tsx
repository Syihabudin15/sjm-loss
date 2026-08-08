"use client";

import { IDapem, IDesc, IExportData, IFiles, IUser } from "@/libs/IInterfaces";
import {
  CategoryOfAccount,
  EDapemStatus,
  EDocStatus,
  ESubmissionStatus,
} from "../../generated/prisma/client";
import {
  Button,
  Divider,
  Drawer,
  Input,
  message,
  Modal,
  Tag,
  Upload,
  UploadProps,
} from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import { useState } from "react";
import { FormInput } from "./FormUtils";
import { GetAngsuran, GetDetailDapem, IDRFormat } from "./PembiayaanUtil";
import * as XLSX from "xlsx";
import moment from "moment";
import {
  ClearOutlined,
  CloudUploadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

export const GetStatusTag = (status: ESubmissionStatus | undefined | null) => {
  if (status) {
    return (
      <Tag
        color={
          status === "DISETUJUI"
            ? "green"
            : status === "PENDING"
              ? "orange"
              : "red"
        }
        variant="solid"
      >
        {status}
      </Tag>
    );
  }
  return <div></div>;
};

export const GetDroppingStatusTag = (
  status: EDapemStatus | undefined | null,
) => {
  if (status) {
    return (
      <Tag
        color={
          status === "DISETUJUI" || status === "LUNAS"
            ? "green"
            : status === "DRAFT"
              ? "black"
              : status === "PENDING"
                ? "orange"
                : status === "PROSES"
                  ? "blue"
                  : "red"
        }
        variant="solid"
      >
        {status}
      </Tag>
    );
  }
  return <div></div>;
};
export const GetBerkasStatusTag = (status: EDocStatus | undefined | null) => {
  if (status) {
    return (
      <Tag
        color={
          status === "MITRA"
            ? "green"
            : status === "DELIVERY"
              ? "blue"
              : "orange"
        }
        variant="solid"
      >
        {status}
      </Tag>
    );
  }
  return <div></div>;
};

export const ProsesPembiayaan = ({
  data,
  open,
  setOpen,
  getData,
  hook,
  name,
  nextname,
  nextnameValue,
  user,
}: {
  data: IDapem;
  open: boolean;
  setOpen: Function;
  getData: Function;
  hook: HookAPI;
  name: string;
  nextname: string;
  nextnameValue?: string;
  user: IUser;
}) => {
  const [loading, setLoading] = useState(false);
  const [temp, setTemp] = useState<IDapem>(data);
  const [desc, setDesc] = useState<IDesc>(
    data[(name + "_desc") as keyof IDapem]
      ? (JSON.parse(data[(name + "_desc") as keyof IDapem] as string) as IDesc)
      : defaultDesc,
  );

  const handleSubmit = async () => {
    setLoading(true);
    desc.name = user.fullname;
    desc.date = new Date();
    await fetch("/api/dapem?id=" + data.id, {
      method: "PUT",
      body: JSON.stringify({
        ...temp,
        [name + "_desc"]: JSON.stringify(desc),
      }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status === 200) {
          setOpen(false);
          hook.success({
            title: "BERHASIL",
            content: "Data pembiayaan berhasil di proses!",
          });
          await getData();
        } else {
          hook.error({ title: "ERROR!!", content: res.msg });
        }
      });
    setLoading(false);
  };

  return (
    <Modal
      onOk={() => handleSubmit()}
      open={open}
      onCancel={() => setOpen(false)}
      loading={loading}
      title={"Proses Pembiayaan " + data.id}
      style={{ top: 20 }}
      okText="Submit"
    >
      <div className="flex my-4 flex-col gap-2">
        <FormInput
          data={{
            label: "Nama Pemohon",
            type: "text",
            value: data.Debitur.fullname,
            disabled: true,
          }}
        />
        <FormInput
          data={{
            label: "Nomor Pensiun",
            type: "text",
            value: data.Debitur.nopen,
            disabled: true,
          }}
        />
        <FormInput
          data={{
            label: "Jenis Pembiayaan",
            type: "text",
            value: data.JenisPembiayaan.name,
            disabled: true,
          }}
        />
        <FormInput
          data={{
            label: "Produk Pembiayaan",
            type: "text",
            value: `${data.ProdukPembiayaan.id} ${data.ProdukPembiayaan.name}`,
            disabled: true,
          }}
        />
        <FormInput
          data={{
            label: "Pembiayaan",
            type: "text",
            value: `${IDRFormat(data.plafond)} | ${data.tenor} Bulan`,
            disabled: true,
          }}
        />
        <FormInput
          data={{
            label: "Angsuran",
            type: "text",
            value: IDRFormat(
              GetAngsuran(
                data.plafond,
                data.tenor,
                data.c_margin + data.c_margin_sumdan,
                data.margin_type,
                data.rounded,
                data.c_ned,
              ).angsuran,
            ),
            disabled: true,
          }}
        />
        <Divider style={{ fontSize: 12 }}>Proses Pembiayaan</Divider>
        <FormInput
          data={{
            label: "Status Pembiayaan",
            required: true,
            type: "select",
            options: [
              { label: "PENDING", value: "PENDING" },
              { label: "SETUJU", value: "DISETUJUI" },
              { label: "TOLAK", value: "DITOLAK" },
            ],
            value: temp[(name + "_status") as keyof IDapem],
            onChange: (e: string) =>
              setTemp({
                ...temp,
                [(name + "_status") as keyof IDapem]: e,
                ...(e === "DISETUJUI" && {
                  [nextname]: nextnameValue || "PENDING",
                }),
                ...(e === "DITOLAK" && {
                  dropping_status: "DITOLAK",
                }),
              }),
          }}
        />
        <FormInput
          data={{
            label: "Keterangan",
            type: "textarea",
            value: desc.desc,
            onChange: (e: string) => setDesc({ ...desc, desc: e }),
          }}
        />
        {user.sumdanId && (
          <FormInput
            data={{
              label: "File (PDF)",
              type: "upload",
              accept: "application/pdf",
              value: temp.file_proses,
              onChange: (e: string) => setTemp({ ...temp, file_proses: e }),
            }}
          />
        )}
      </div>
    </Modal>
  );
};

export const FilterData = ({
  children,
  clearfilter,
}: {
  children: React.ReactNode;
  clearfilter?: Function;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        icon={<FilterOutlined />}
        size="small"
        onClick={() => setOpen(true)}
      >
        Filter
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(!open)}
        title="FILTER DATA"
        placement="right"
        size={window && window.innerWidth > 600 ? "30%" : "60%"}
      >
        {children}
        <div className="flex justify-end mt-3">
          <Button
            size="small"
            danger
            icon={<ClearOutlined />}
            onClick={() => clearfilter && clearfilter()}
          >
            Clear Filter
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

const defaultDesc: IDesc = {
  name: "",
  date: new Date(),
  desc: "",
};

export const ExportToExcel = (data: IExportData[], filename: string) => {
  const wb = XLSX.utils.book_new();
  for (const d of data) {
    const ws = XLSX.utils.json_to_sheet(d.data);
    XLSX.utils.book_append_sheet(wb, ws, d.sheetname);
  }
  XLSX.writeFile(wb, `${filename}_${moment().format("DDMMYYYY")}.xlsx`);
};

export const MappingToExcelDapem = (data: IDapem[]) => {
  return data.map((d, i) => {
    const angs = GetAngsuran(
      d.plafond,
      d.tenor,
      d.c_margin + d.c_margin_sumdan,
      d.margin_type,
      d.rounded,
      d.c_ned,
    ).angsuran;
    const angsSumdan = GetAngsuran(
      d.plafond,
      d.tenor,
      d.c_margin_sumdan,
      d.margin_type,
      d.rounded,
    ).angsuran;
    return {
      NO: i + 1,
      PEMOHON: d.Debitur.fullname,
      NOPEN: d.nopen,
      "JENIS PEMBIAYAAN": d.JenisPembiayaan.name,
      "PRODUK PEMBIAYAAN": d.ProdukPembiayaan.name,
      "SUMBER DANA": d.ProdukPembiayaan.Sumdan.code,
      PLAFOND: d.plafond,
      TENOR: d.tenor,
      "TANGGAL PERMOHONAN": d.created_at,
      "TANGGAL AKAD": d.date_contract,
      "NO AKAD": d.no_contract,
      "NO SKEP": d.Debitur.no_skep,
      "STATUS DROPPING": d.dropping_status,
      "TANGGAL DROPPING": d.Dropping ? d.Dropping.process_at : null,
      AO: d.AO?.fullname,
      "AO CABANG": d.AOCabang?.fullname,
      "AO AREA": d.AOArea?.fullname,
      CABANG: (d.AO || d.AOCabang || d.AOArea)?.Cabang.name,
      AREA: (d.AO || d.AOCabang || d.AOArea)?.Cabang.Area.name,
      "ADMIN INPUT": d.User.fullname,
      "": "",
      B_ADM_SUMDAN: d.plafond * (d.c_adm_sumdan / 100),
      B_ADM_KOPERASI: d.plafond * (d.c_adm / 100),
      B_ASURANSI: d.plafond * (d.c_insurance / 100),
      B_PROV_SUMDAN: d.plafond * (d.c_provisi_sumdan / 100),
      B_FEE_BPP: d.plafond * (d.c_fee_bpp / 100),
      B_REKENING_SUMDAN: d.c_account_sumdan,
      B_TATALAKSANA: d.c_gov,
      B_MATERAI: d.c_stamp,
      B_FLAGGING: d.c_flagging,
      B_SISTEM_INFORMASI: d.c_infomation,
      B_MUTASI: d.c_mutasi,
      BLOKIR_ANGSURAN: d.c_blokir,
      NOMINAL_TAKEOVER: d.c_takeover,
      X_BLOKIR_ANGSURAN: d.c_blokir,
      B_BLOKIR_ANGSURAN: angs * d.c_blokir,
      NOMINAL_ANGSURAN: angs,
      ANGSURAN_SUMDAN: angsSumdan,
      ANGSURAN_KOPERASI: angs - angsSumdan,
    };
  });
};

export const MappingToProsesDapem = (data: IDapem[]) => {
  return data.map((d, i) => ({
    NO: i + 1,
    PEMOHON: d.Debitur.fullname,
    NOPEN: d.nopen,
    "JENIS PEMBIAYAAN": d.JenisPembiayaan.name,
    "PRODUK PEMBIAYAAN": d.ProdukPembiayaan.name,
    "SUMBER DANA": d.ProdukPembiayaan.Sumdan.code,
    PLAFOND: d.plafond,
    TENOR: d.tenor,
    "TANGGAL PERMOHONAN": d.created_at,
    "TANGGAL SLIK": d.slik_status,
    "TANGGAL VERIFIKASI": d.verif_status,
    "TANGGAL APPROVAL": d.approv_status,
    "KETERANGAN SLIK": d.slik_desc,
    "KETERANGAN VERIFIKASI": d.verif_desc,
    "KETERANGAN APPROVAL": d.approv_desc,
    AO: (d.AO || d.AOCabang || d.AOArea)?.fullname,
    CABANG: (d.AO || d.AOCabang || d.AOArea)?.Cabang.name,
    AREA: (d.AO || d.AOCabang || d.AOArea)?.Cabang.Area.name,
    ADMIN: d.User.fullname,
  }));
};

export const MappingToTagihan = (data: IDapem[], periode?: string) => {
  return data.map((d, i) => {
    const detail = GetDetailDapem(d);
    const find = d.Angsurans.find((a) =>
      moment(a.date_pay).isSame(periode || new Date(), "month"),
    );

    return {
      NO: i + 1,
      PEMOHON: d.Debitur.fullname,
      NOPEN: d.nopen,
      "NOMOR AKAD": d.no_contract,
      "TANGGAL AKAD": d.date_contract,
      PLAFOND: d.plafond,
      TENOR: d.tenor,
      ANGSURAN_MITRA: detail.detail.angsuran_sumdan,
      ANGSURAN_KOPERASI: detail.angsuran - detail.detail.angsuran_sumdan,
      NOMINAL_ANGSURAN: detail.angsuran,
      ANGSURAN_KE: find?.counter,
      POKOK: find?.principal,
      MARGIN: find?.margin,
      NED: find?.c_ned,
      FEE_BANPOT: detail.detail.fee_banpot,
      STATUS: find?.date_paid ? "DIBAYAR" : "BELUMBAYAR",
    };
  });
};

export const TypeAccount = (account: CategoryOfAccount) => {
  switch (account.type) {
    case "ASSET":
      return "D";
    case "KEWAJIBAN":
      return "K";
    case "MODAL":
      return "K";
    case "PENDAPATAN":
      return "K";
    case "BEBAN":
      return "D";
    default:
      return "D";
  }
};

export const ParseStrToFiles = (str: string | null) => {
  if (!str) return;
  return JSON.parse(str) as IFiles[];
};

export const UpsertFiles = ({
  record,
  setRecord,
}: {
  record: IFiles;
  setRecord: Function;
}) => {
  // const [data, setData] = useState<IFiles>(record);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const res = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      });

      const resData = await res.json();
      if (resData.secure_url) {
        alert("Uploaded");
        setRecord((prev: IFiles) => ({ ...prev, url: resData.secure_url }));
      } else {
        message.error(resData.error.message);
      }
    } catch (err) {
      console.log(err);
      message.error("Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFiles = async () => {
    setLoading(true);
    await fetch("/api/upload", {
      method: "DELETE",
      body: JSON.stringify({ publicId: record.url }),
    })
      .then(() => {
        setRecord((prev: IFiles) => ({ ...prev, url: "" }));
      })
      .catch((err) => {
        console.log(err);
        message.error("Gagal hapus file!.");
      });
    setLoading(false);
  };

  const props: UploadProps = {
    beforeUpload: async (file) => {
      setLoading(true);
      await handleUpload(file);
      setLoading(false);
      return false; // prevent automatic upload
    },
    showUploadList: false, // sembunyikan default list
    accept: "application/pdf",
  };

  return (
    <div className="flex justify-between gap-2">
      <div className="flex-1">
        <Input
          value={record.name}
          onChange={(e) =>
            setRecord((prev: IFiles) => ({ ...prev, name: e.target.value }))
          }
          size="small"
        />
      </div>
      <div className="flex-1">
        {record.url ? (
          <Button
            icon={<CloudUploadOutlined />}
            size="small"
            type="primary"
            onClick={() => handleDeleteFiles()}
          >
            Browse
          </Button>
        ) : (
          <Upload {...props}>
            <Button
              icon={<CloudUploadOutlined />}
              size="small"
              type="primary"
              loading={loading}
              disabled={loading}
            >
              Browse
            </Button>
          </Upload>
        )}
      </div>
    </div>
  );
};
