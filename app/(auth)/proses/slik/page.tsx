"use client";

import { useUser } from "@/components/UserContext";
import {
  ExportToExcel,
  FilterData,
  GetStatusTag,
  MappingToProsesDapem,
  ProsesPembiayaan,
} from "@/components/utils/CompUtils";
import { DetailDapem } from "@/components/utils/LayoutUtils";
import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";
import {
  IActionTable,
  IDapem,
  IDesc,
  IPageProps,
  IUser,
} from "@/libs/IInterfaces";
import { useAccess } from "@/libs/Permission";

import {
  ArrowRightOutlined,
  BankOutlined,
  FileProtectOutlined,
  FolderOutlined,
  FormOutlined,
  PayCircleOutlined,
  PrinterOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { JenisPembiayaan, Sumdan } from "../../../../generated/prisma/client";
import {
  App,
  Button,
  Card,
  DatePicker,
  Input,
  Select,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;
const { RangePicker } = DatePicker;

export default function Page() {
  const [pageProps, setPageProps] = useState<IPageProps<IDapem>>({
    page: 1,
    limit: 100,
    total: 0,
    data: [],
    search: "",
    sumdanId: "",
    jenisPembiayaanId: "",
    slik_status: "",
    backdate: "",
  });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<IActionTable<IDapem>>({
    upsert: false,
    delete: false,
    proses: false,
    selected: undefined,
  });
  const [sumdans, setSumdans] = useState<Sumdan[]>([]);
  const [jeniss, setJeniss] = useState<JenisPembiayaan[]>([]);
  const { modal } = App.useApp();
  const { hasAccess } = useAccess(
    window ? window.location.pathname : "/proses/slik",
  );
  const user = useUser();

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pageProps.page.toString(),
      limit: pageProps.limit.toString(),
      slik_status: pageProps.approv_status || "all",
      ...(pageProps.search && { search: pageProps.search }),
      ...(pageProps.sumdanId && { sumdanId: pageProps.sumdanId }),
      ...(pageProps.jenisPembiayaanId && {
        jenisPembiayaanId: pageProps.jenisPembiayaanId,
      }),
      ...(pageProps.backdate && { backdate: pageProps.backdate }),
      includes: true,
    });

    const res = await fetch(`/api/dapem?${params.toString()}`);
    const json = await res.json();
    setPageProps((prev) => ({
      ...prev,
      data: json.data,
      total: json.total,
    }));
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [
    pageProps.page,
    pageProps.limit,
    pageProps.search,
    pageProps.sumdanId,
    pageProps.slik_status,
    pageProps.jenisPembiayaanId,
    pageProps.backdate,
  ]);

  useEffect(() => {
    (async () => {
      await fetch("/api/sumdan")
        .then((res) => res.json())
        .then((res) => setSumdans(res.data));
      await fetch("/api/jenis")
        .then((res) => res.json())
        .then((res) => setJeniss(res.data));
    })();
  }, []);

  const columns: TableProps<IDapem>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render(value, record, index) {
        return (
          <div>
            <div>{(pageProps.page - 1) * pageProps.limit + index + 1}</div>
            <div className="opacity-80 text-xs">{record.id}</div>
          </div>
        );
      },
    },
    {
      title: "Pemohon",
      dataIndex: "pemohon",
      key: "pemohon",
      fixed: window && window.innerWidth > 600 ? "left" : false,
      render(value, record, index) {
        return (
          <div>
            <p className="font-bold">{record.Debitur.fullname}</p>
            <div className="text-xs opacity-80">
              <p>@{record.Debitur.nopen}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Permohonan",
      dataIndex: "permohonan",
      key: "permohonan",
      render(value, record, index) {
        return (
          <div>
            <div>
              Plafond : <Tag color={"blue"}>{IDRFormat(record.plafond)}</Tag>
            </div>
            <div>
              Tenor : <Tag color={"blue"}>{record.tenor} Bulan</Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "Angsuran",
      dataIndex: "angsuran",
      key: "angsuran",
      render(value, record, index) {
        const temp = GetDetailDapem(record);
        return (
          <div className="text-xs">
            <div className="flex gap-2 items-center">
              <Tag color={"blue"}>
                <BankOutlined /> {IDRFormat(temp.detail.angsuran_sumdan)}
              </Tag>
              <Tag color={"blue"}>
                {IDRFormat(temp.angsuran - temp.detail.angsuran_sumdan)}
              </Tag>
            </div>
            <div className="flex justify-center">
              <Tag color={"blue"}> {IDRFormat(temp.angsuran)}</Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "Produk Pembiayaan",
      dataIndex: "produk",
      key: "produk",
      render(value, record, index) {
        return (
          <div>
            <p>
              {record.ProdukPembiayaan.name}{" "}
              <span>({record.ProdukPembiayaan.Sumdan.code})</span>
            </p>
            <p className="opacity-80">{record.JenisPembiayaan.name}</p>
          </div>
        );
      },
    },
    {
      title: "AO & UP",
      dataIndex: "aoup",
      key: "aoup",
      render(value, record, index) {
        const ao = record.AO || record.AOCabang || record.AOArea;
        return (
          <div>
            <div>
              {ao?.fullname} ({ao?.position})
            </div>
            <div className="text-xs opacity-80">
              {ao?.Cabang.name} | {ao?.Cabang.Area.name}
            </div>
          </div>
        );
      },
    },
    {
      title: "Status SLIK",
      dataIndex: "slik_status",
      key: "slik_status",
      width: 250,
      render: (_, record, i) => {
        const temp = record.slik_desc
          ? (JSON.parse(record.slik_desc) as IDesc)
          : null;
        return (
          <div className="flex gap-1">
            {GetStatusTag(record.slik_status)}
            {temp && (
              <Paragraph
                ellipsis={{
                  rows: 2,
                  expandable: "collapsible",
                }}
                style={{ fontSize: 11 }}
              >
                {temp.desc}
                <p>
                  (By {temp.name} at {moment(temp.date).format("DD/MM/YYYY")})
                </p>
              </Paragraph>
            )}
          </div>
        );
      },
    },
    {
      title: "Status VERIFIKASI",
      dataIndex: "verif_status",
      key: "verif_status",
      width: 250,
      render: (_, record, i) => {
        const temp = record.verif_desc
          ? (JSON.parse(record.verif_desc) as IDesc)
          : null;
        return (
          <div className="flex gap-1">
            {GetStatusTag(record.verif_status)}
            {temp && (
              <Paragraph
                ellipsis={{
                  rows: 2,
                  expandable: "collapsible",
                }}
                style={{ fontSize: 11 }}
              >
                {temp.desc}
                <p>
                  (By {temp.name} at {moment(temp.date).format("DD/MM/YYYY")})
                </p>
              </Paragraph>
            )}
          </div>
        );
      },
    },
    {
      title: "Mutasi & Takeover",
      dataIndex: "produk",
      key: "produk",
      render(value, record, index) {
        return (
          <div>
            {record.JenisPembiayaan.status_mutasi && (
              <div style={{ fontSize: 9 }}>
                <SwapOutlined />{" "}
                <Tag style={{ fontSize: 9 }} color={"red"}>
                  {record.PrevPayOffice.code}
                </Tag>{" "}
                <ArrowRightOutlined style={{ fontSize: 9 }} />{" "}
                <Tag style={{ fontSize: 9 }} color={"blue"}>
                  {record.PayOffice.code || record.PayOffice.name}
                </Tag>
              </div>
            )}
            {record.JenisPembiayaan.status_takeover && (
              <div style={{ fontSize: 9 }}>
                <PayCircleOutlined />{" "}
                <Tag color={"blue"} style={{ fontSize: 9 }}>
                  {record.takeover_from} (
                  {moment(record.takeover_date).format("DD/MM/YYYY")})
                </Tag>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render(value, record, index) {
        return (
          <div>
            <div>{record.User.fullname}</div>
            <div className="opacity-80 text-xs">
              {moment(record.created_at).format("DD/MM/YYYY")}
            </div>
          </div>
        );
      },
    },
    {
      title: "Aksi",
      key: "action",
      width: 100,
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip
            title={`Detail Data ${record.Debitur.fullname} (${record.nopen})`}
          >
            <Button
              icon={<FolderOutlined />}
              type="primary"
              size="small"
              onClick={() =>
                setSelected({ ...selected, upsert: true, selected: record })
              }
            ></Button>
          </Tooltip>
          {hasAccess("proses") && record.slik_status === "PENDING" && (
            <Button
              size="small"
              type="primary"
              icon={<FormOutlined />}
              onClick={() =>
                setSelected({ ...selected, proses: true, selected: record })
              }
            ></Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex gap-2 font-bold text-xl">
          <FileProtectOutlined /> Verifikasi SLIK
        </div>
      }
      styles={{ body: { padding: 5 } }}
    >
      <div className="flex justify-between my-1 gap-2 overflow-auto">
        <div className="flex gap-2">
          <FilterData
            clearfilter={() =>
              setPageProps((prev) => ({
                ...prev,
                sumdanId: "",
                jenisPembiayaanId: "",
                slik_status: "all",
                backdate: "",
              }))
            }
            children={
              <>
                <div className="my-2">
                  <p>Periode :</p>
                  <RangePicker
                    size="small"
                    value={pageProps.backdate}
                    onChange={(date, dateStr) =>
                      setPageProps({ ...pageProps, backdate: dateStr, page: 1 })
                    }
                    style={{ width: "100%" }}
                  />
                </div>
                {user && !user.sumdanId && (
                  <div className="my-2">
                    <p>Mitra pembiayaan :</p>
                    <Select
                      size="small"
                      placeholder="Pilih Mitra..."
                      options={sumdans.map((s) => ({
                        label: s.code,
                        value: s.id,
                      }))}
                      value={pageProps.sumdanId}
                      onChange={(e) =>
                        setPageProps({ ...pageProps, sumdanId: e, page: 1 })
                      }
                      allowClear
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
                <div className="my-2">
                  <p>Jenis pembiayaan :</p>
                  <Select
                    size="small"
                    placeholder="Pilih Jenis..."
                    options={jeniss.map((s) => ({
                      label: s.name,
                      value: s.id,
                    }))}
                    value={pageProps.jenisPembiayaanId}
                    onChange={(e) =>
                      setPageProps({
                        ...pageProps,
                        jenisPembiayaanId: e,
                        page: 1,
                      })
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="my-2">
                  <p>Status pembiayaan</p>
                  <Select
                    size="small"
                    placeholder="Pilih Status..."
                    options={[
                      { label: "PENDING", value: "PENDING" },
                      { label: "SETUJU", value: "DISETUJUI" },
                      { label: "TOLAK", value: "DITOLAK" },
                    ]}
                    value={pageProps.slik_status}
                    onChange={(e) =>
                      setPageProps({ ...pageProps, slik_status: e, page: 1 })
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>
              </>
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <Button
            icon={<PrinterOutlined />}
            size="small"
            type="primary"
            onClick={() =>
              ExportToExcel(
                [
                  {
                    sheetname: "alldata",
                    data: MappingToProsesDapem(pageProps.data),
                  },
                  {
                    sheetname: "antri",
                    data: MappingToProsesDapem(
                      pageProps.data.filter((d) => d.slik_status === "PENDING"),
                    ),
                  },
                  {
                    sheetname: "setuju",
                    data: MappingToProsesDapem(
                      pageProps.data.filter(
                        (d) => d.slik_status === "DISETUJUI",
                      ),
                    ),
                  },
                  {
                    sheetname: "tolak",
                    data: MappingToProsesDapem(
                      pageProps.data.filter((d) => d.slik_status === "DITOLAK"),
                    ),
                  },
                ],
                "proses_permohonan",
              )
            }
          >
            Excel
          </Button>
          <Input.Search
            size="small"
            style={{ width: 170 }}
            placeholder="Cari nama..."
            value={pageProps.search}
            onChange={(e) =>
              setPageProps({ ...pageProps, search: e.target.value })
            }
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={pageProps.data}
        size="small"
        loading={loading}
        rowKey={"id"}
        bordered
        scroll={{ x: "max-content", y: "48vh" }}
        pagination={{
          current: pageProps.page,
          pageSize: pageProps.limit,
          total: pageProps.total,
          onChange: (page, pageSize) => {
            setPageProps((prev) => ({
              ...prev,
              page,
              limit: pageSize,
            }));
          },
          pageSizeOptions: [50, 100, 500, 1000],
          showSizeChanger: true,
        }}
        summary={(pageData) => {
          let angsuran = 0;
          let angsuran_sumdan = 0;
          let plafond = 0;

          pageData.forEach((d) => {
            const angs = GetDetailDapem(d);
            angsuran += angs.angsuran;
            angsuran_sumdan += angs.detail.angsuran_sumdan;
            plafond += d.plafond;
          });

          return (
            <Table.Summary.Row className="text-xs bg-blue-400">
              <Table.Summary.Cell index={0} colSpan={2} className="text-center">
                <b>SUMMARY</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} className="text-center">
                <b>{IDRFormat(plafond)}</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} className="text-center font-bold">
                <div>
                  {IDRFormat(angsuran_sumdan)} +{" "}
                  {IDRFormat(angsuran - angsuran_sumdan)}
                </div>
                <div className="border-t border-gray-500">
                  {IDRFormat(angsuran)}
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
      {selected.selected && selected.upsert && (
        <DetailDapem
          open={selected.upsert}
          setOpen={(val: boolean) =>
            setSelected({ ...selected, selected: undefined, upsert: val })
          }
          data={selected.selected}
          key={"detail" + selected.selected.id}
        />
      )}
      {selected.selected && selected.proses && (
        <ProsesPembiayaan
          data={selected.selected}
          open={selected.proses}
          setOpen={(e: boolean) => setSelected({ ...selected, proses: e })}
          hook={modal}
          user={user as IUser}
          getData={getData}
          name="slik"
          nextname="verif_status"
        />
      )}
    </Card>
  );
}
