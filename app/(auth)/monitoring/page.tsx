"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import moment from "moment";
import { JenisPembiayaan, Sumdan } from "../../../generated/prisma/client";
import {
  App,
  Button,
  Card,
  DatePicker,
  Input,
  Modal,
  Select,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import {
  ArrowRightOutlined,
  BankOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileFilled,
  FolderOutlined,
  PayCircleOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
  ReadOutlined,
  RobotOutlined,
  SwapOutlined,
} from "@ant-design/icons";

import { printContract } from "@/components/pdfutils/akad/Akad";
import { printMonitoring } from "@/components/pdfutils/etc/printMonitoring";
import { useUser } from "@/components/UserContext";
import {
  ExportToExcel,
  FilterData,
  GetDroppingStatusTag,
  GetStatusTag,
  MappingToExcelDapem,
} from "@/components/utils/CompUtils";

import {
  GetDetailDapem,
  // GetRoman,
  IDRFormat,
} from "@/components/utils/PembiayaanUtil";
import {
  IActionTable,
  IAgentFronting,
  IDapem,
  IDesc,
  IPageProps,
  IViewFiles,
} from "@/libs/IInterfaces";
import { useAccess } from "@/libs/Permission";
const { Paragraph } = Typography;
import dayjs from "dayjs";
import dynamic from "next/dynamic";
const { RangePicker } = DatePicker;

const DetailDapem = dynamic(
  () => import("@/components/utils/LayoutUtils").then((mod) => mod.DetailDapem),
  {
    ssr: false,
  },
);
const FormInput = dynamic(
  () => import("@/components").then((mod) => mod.FormInput),
  {
    ssr: false,
  },
);
const ViewFiles = dynamic(
  () => import("@/components").then((mod) => mod.ViewFiles),
  {
    ssr: false,
  },
);

interface IActionTableAkad<T> extends IActionTable<T> {
  cetakAkad: boolean;
}

export default function Page() {
  const [pageProps, setPageProps] = useState<IPageProps<IDapem>>({
    page: 1,
    limit: 100,
    total: 0,
    data: [],
    search: "",
    sumdanId: "",
    jenisPembiayaanId: "",
    agentFrontingId: "",
    backdate: "",
  });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<IActionTableAkad<IDapem>>({
    upsert: false,
    delete: false,
    proses: false,
    selected: undefined,
    cetakAkad: false,
  });
  const [sumdans, setSumdans] = useState<Sumdan[]>([]);
  const [jeniss, setJeniss] = useState<JenisPembiayaan[]>([]);
  const [agents, setAgents] = useState<IAgentFronting[]>([]);
  const { modal } = App.useApp();

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/pendingdata";
  const { hasAccess } = useAccess(currentPath);
  const user = useUser();
  const [views, setViews] = useState<IViewFiles>({ open: false, data: [] });

  // 1. Fetch data utama dibungkus useCallback agar stabil
  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageProps.page.toString(),
        limit: pageProps.limit.toString(),
        ...(pageProps.search && { search: pageProps.search }),
        ...(pageProps.sumdanId && { sumdanId: pageProps.sumdanId }),
        ...(pageProps.backdate && { backdate: pageProps.backdate }),
        ...(pageProps.jenisPembiayaanId && {
          jenisPembiayaanId: pageProps.jenisPembiayaanId,
        }),
        ...(pageProps.agentFrontingId && {
          agentFrontingId: pageProps.agentFrontingId,
        }),
        includes: "true",
      });

      const res = await fetch(`/api/dapem?${params.toString()}`);
      const json = await res.json();
      setPageProps((prev) => ({
        ...prev,
        data: json.data || [],
        total: json.total || 0,
      }));
    } catch (err) {
      console.error("Gagal memuat data dapem pending:", err);
    } finally {
      setLoading(false);
    }
  }, [
    pageProps.page,
    pageProps.limit,
    pageProps.search,
    pageProps.sumdanId,
    pageProps.jenisPembiayaanId,
    pageProps.agentFrontingId,
    pageProps.backdate,
  ]);

  // Debouncer pencarian
  useEffect(() => {
    const timeout = setTimeout(() => {
      getData();
    }, 250);
    return () => clearTimeout(timeout);
  }, [getData]);

  // Fetch master data sekali saat mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [resSumdan, resJenis, resAgent] = await Promise.all([
          fetch("/api/sumdan?limit=500").then((res) => res.json()),
          fetch("/api/jenis?limit=50").then((res) => res.json()),
          fetch("/api/agent?limit=100").then((res) => res.json()),
        ]);

        if (isMounted) {
          setSumdans(resSumdan.data || []);
          setJeniss(resJenis.data || []);
          setAgents(resAgent.data || []);
        }
      } catch (err) {
        console.error("Gagal memuat master data filter:", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Mencegah mapping array Select Options di setiap render ulang
  const sumdanOptions = useMemo(
    () => sumdans.map((s) => ({ label: s.code, value: s.id })),
    [sumdans],
  );
  const jenisOptions = useMemo(
    () => jeniss.map((s) => ({ label: s.name, value: s.id })),
    [jeniss],
  );
  const agentOptions = useMemo(
    () => agents.map((s) => ({ label: s.name, value: s.id })),
    [agents],
  );

  // 3. Gabungkan ringkasan kalkulasi data ke dalam satu loop useMemo tunggal
  const calculatedSummary = useMemo(() => {
    let angsuran = 0;
    let angsuran_sumdan = 0;
    let plafond = 0;

    const dataLength = pageProps.data?.length || 0;
    for (let i = 0; i < dataLength; i++) {
      const d = pageProps.data[i];
      const angs = GetDetailDapem(d);
      angsuran += angs.angsuran;
      angsuran_sumdan += angs.detail.angsuran_sumdan;
      plafond += d.plafond;
    }
    return { angsuran, angsuran_sumdan, plafond };
  }, [pageProps.data]);

  // 4. Bersihkan dependensi `selected` dari useMemo columns agar table tidak re-render radikal saat modal dibuka/ditutup
  const columns: TableProps<IDapem>["columns"] = useMemo(() => {
    return [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        render: (_, record, index) => (
          <div>
            <div>{(pageProps.page - 1) * pageProps.limit + index + 1}</div>
            <div className="opacity-80 text-xs">{record.id}</div>
          </div>
        ),
      },
      {
        title: "Pemohon",
        dataIndex: "pemohon",
        key: "pemohon",
        fixed: window && window.innerWidth > 600 ? "left" : false,
        render: (_, record) => (
          <div>
            <p className="font-bold">{record.Debitur.fullname}</p>
            <div className="text-xs opacity-80">
              <p>@{record.Debitur.nopen}</p>
            </div>
          </div>
        ),
      },
      {
        title: "Permohonan",
        dataIndex: "permohonan",
        key: "permohonan",
        render: (_, record) => (
          <div>
            <div>
              Plafond : <Tag color="blue">{IDRFormat(record.plafond)}</Tag>
            </div>
            <div>
              Tenor : <Tag color="blue">{record.tenor} Bulan</Tag>
            </div>
          </div>
        ),
      },
      {
        title: "Angsuran",
        dataIndex: "angsuran",
        key: "angsuran",
        render: (_, record) => {
          const temp = GetDetailDapem(record);
          return (
            <div className="text-xs">
              <div className="flex gap-2 items-center">
                <Tag color="blue">
                  <BankOutlined /> {IDRFormat(temp.detail.angsuran_sumdan)}
                </Tag>
                <Tag color="blue">
                  {IDRFormat(temp.angsuran - temp.detail.angsuran_sumdan)}
                </Tag>
              </div>
              <div className="flex justify-center mt-1">
                <Tag color="blue"> {IDRFormat(temp.angsuran)}</Tag>
              </div>
            </div>
          );
        },
      },
      {
        title: "Produk Pembiayaan",
        dataIndex: "produk",
        key: "produk",
        render: (_, record) => (
          <div>
            <p>
              {record.ProdukPembiayaan.name}{" "}
              <span>({record.ProdukPembiayaan.Sumdan.code})</span>
            </p>
            <p className="opacity-80 text-xs">{record.JenisPembiayaan.name}</p>
          </div>
        ),
      },
      {
        title: "AO & UP",
        dataIndex: "aoup",
        key: "aoup",
        render: (_, record) => {
          const ao = record.AO || record.AOCabang || record.AOArea;
          return (
            <div>
              <div>{ao?.fullname}</div>
              <div className="text-xs opacity-80">
                {ao?.Cabang.name} | {ao?.Cabang.Area.name}
              </div>
            </div>
          );
        },
      },
      {
        title: "Status VERIFIKASI",
        dataIndex: "verif_status",
        key: "verif_status",
        width: 250,
        render: (_, record) => {
          const temp = record.verif_desc
            ? (JSON.parse(record.verif_desc) as IDesc)
            : null;
          return (
            <div className="flex gap-1">
              {GetStatusTag(record.verif_status)}
              {temp && (
                <Paragraph
                  ellipsis={{ rows: 2, expandable: "collapsible" }}
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
        title: "Status SLIK",
        dataIndex: "slik_status",
        key: "slik_status",
        width: 250,
        render: (_, record) => {
          const temp = record.slik_desc
            ? (JSON.parse(record.slik_desc) as IDesc)
            : null;
          return (
            <div className="flex gap-1">
              {GetStatusTag(record.slik_status)}
              {temp && (
                <Paragraph
                  ellipsis={{ rows: 2, expandable: "collapsible" }}
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
        title: "Status APPROVAL",
        dataIndex: "approvel_status",
        key: "approvel_status",
        width: 250,
        render: (_, record) => {
          const temp = record.approv_desc
            ? (JSON.parse(record.approv_desc) as IDesc)
            : null;
          return (
            <div className="flex gap-1">
              {GetStatusTag(record.approv_status)}
              {temp && (
                <Paragraph
                  ellipsis={{ rows: 2, expandable: "collapsible" }}
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
        title: "Status Dropping",
        dataIndex: "dropping_status",
        key: "dropping_status",
        width: 180,
        render: (_, record) => (
          <div className="flex gap-1">
            {GetDroppingStatusTag(record.dropping_status)}
            {record.Dropping?.process_at && (
              <div className="text-xs">
                {moment(record.Dropping.process_at).format("DD/MM/YYYY HH:mm")}
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Berkas Akad",
        dataIndex: "akad",
        key: "akad",
        render: (_, record) => (
          <div className="flex gap-2">
            <Button
              icon={<FileFilled />}
              size="small"
              disabled={!record.file_contract}
              onClick={() =>
                setViews({
                  open: true,
                  data: [
                    { name: "Berkas Akad", url: record.file_contract || "" },
                  ],
                })
              }
            />
            {hasAccess("update") && (
              <Button
                icon={<PrinterOutlined />}
                type="primary"
                size="small"
                onClick={() =>
                  setSelected((prev) => ({
                    ...prev,
                    selected: record,
                    cetakAkad: true,
                  }))
                }
              />
            )}
          </div>
        ),
      },
      {
        title: "Nomor Akad",
        dataIndex: "dataakad",
        key: "dataakad",
        render: (_, record) => (
          <div>
            {record.no_contract && <div>{record.no_contract}</div>}
            {record.date_contract && (
              <div className="text-xs opacity-80">
                {moment(record.date_contract).format("DD/MM/YYYY")}
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Mutasi & Takeover",
        dataIndex: "produk",
        key: "produk_mutasi",
        width: 350,
        render: (_, record) => (
          <div>
            {record.JenisPembiayaan.status_mutasi && (
              <div style={{ fontSize: 9 }}>
                <SwapOutlined />{" "}
                <Tag style={{ fontSize: 9 }} color="red">
                  {record.PrevPayOffice.code}
                </Tag>{" "}
                <ArrowRightOutlined style={{ fontSize: 9 }} />{" "}
                <Tag style={{ fontSize: 9 }} color="blue">
                  {record.PayOffice.code || record.PayOffice.name}
                </Tag>
              </div>
            )}
            {record.JenisPembiayaan.status_takeover && (
              <div style={{ fontSize: 9 }} className="mt-1">
                <PayCircleOutlined />{" "}
                <Tag color="blue" style={{ fontSize: 9 }}>
                  {record.takeover_from} (
                  {moment(record.takeover_date).format("DD/MM/YYYY")})
                </Tag>
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Created",
        dataIndex: "created_at",
        key: "created_at",
        render: (_, record) => (
          <div>
            <div>{record.User.fullname}</div>
            <div className="opacity-80 text-xs">
              {moment(record.created_at).format("DD/MM/YYYY")}
            </div>
          </div>
        ),
      },
      {
        title: "Aksi",
        key: "action",
        width: 100,
        render: (_, record) => (
          <div className="flex gap-1 flex-wrap justify-center">
            {/* {hasAccess("write") && (
              <Button
                icon={<PrinterOutlined />}
                type="primary"
                size="small"
                onClick={() => printForm(record)}
              />
            )} */}
            {hasAccess("update") && (
              <Link href={`/monitoring/upsert/${record.id}`}>
                <Button icon={<EditOutlined />} size="small" type="primary" />
              </Link>
            )}
            {hasAccess("update") &&
              ["DRAFT", "BATAL", "DITOLAK"].includes(
                record.dropping_status,
              ) && (
                <Tooltip title="Ajukan permohonan ini? (Naikan ke verifikasi)">
                  <Button
                    icon={<CheckCircleOutlined />}
                    size="small"
                    type="primary"
                    onClick={() =>
                      setSelected((prev) => ({
                        ...prev,
                        proses: true,
                        selected: record,
                      }))
                    }
                  />
                </Tooltip>
              )}
            {hasAccess("delete") && (
              <Button
                icon={<DeleteOutlined />}
                size="small"
                type="primary"
                danger
                onClick={() =>
                  setSelected((prev) => ({
                    ...prev,
                    delete: true,
                    selected: record,
                  }))
                }
                disabled={["DISETUJUI", "LUNAS"].includes(
                  record.dropping_status,
                )}
              />
            )}
            <Tooltip
              title={`Detail Data ${record.Debitur.fullname} (${record.nopen})`}
            >
              <Button
                icon={<FolderOutlined />}
                type="primary"
                size="small"
                onClick={() =>
                  setSelected((prev) => ({
                    ...prev,
                    upsert: true,
                    selected: record,
                  }))
                }
              />
            </Tooltip>
          </div>
        ),
      },
    ];
  }, [pageProps.page, pageProps.limit, hasAccess]); // selected DIBUANG dari dependensi agar tabel tidak lag/re-render total

  // Callback excel stabil
  const handleExportExcel = useCallback(() => {
    ExportToExcel(
      [{ sheetname: "alldata", data: MappingToExcelDapem(pageProps.data) }],
      "pendingdata",
    );
  }, [pageProps.data]);

  // Callback penangan summary stabil
  const handleTableSummary = useCallback(
    () => (
      <Table.Summary.Row className="text-xs bg-blue-400">
        <Table.Summary.Cell index={0} colSpan={2} className="text-center">
          <b>SUMMARY</b>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3} className="text-center">
          <b>{IDRFormat(calculatedSummary.plafond)}</b>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4} className="text-center font-bold">
          <div>
            {IDRFormat(calculatedSummary.angsuran_sumdan)} +{" "}
            {IDRFormat(
              calculatedSummary.angsuran - calculatedSummary.angsuran_sumdan,
            )}
          </div>
          <div className="border-t border-gray-500">
            {IDRFormat(calculatedSummary.angsuran)}
          </div>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    ),
    [calculatedSummary],
  );

  // Callback penangan clear filter
  const handleClearFilter = useCallback(() => {
    setPageProps((prev) => ({
      ...prev,
      sumdanId: "",
      jenisPembiayaanId: "",
      agentFrontingId: "",
      backdate: "",
      page: 1,
    }));
  }, []);

  return (
    <Card
      title={
        <div className="flex gap-2 font-bold text-xl">
          <ReadOutlined /> Monitoring Pembiayaan
        </div>
      }
      styles={{ body: { padding: 5 } }}
    >
      <div className="flex justify-between my-1 gap-2 overflow-auto">
        <div className="flex gap-2">
          {hasAccess("write") && (
            <Link href={"/monitoring/upsert"}>
              <Button type="primary" size="small" icon={<PlusCircleOutlined />}>
                Tambah
              </Button>
            </Link>
          )}
          <FilterData clearfilter={handleClearFilter}>
            <div className="p-1">
              <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
                <div className="col-span-2 flex flex-col space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Periode
                  </label>
                  <RangePicker
                    size="small"
                    value={
                      Array.isArray(pageProps.backdate) &&
                      pageProps.backdate.length === 2
                        ? [
                            dayjs(pageProps.backdate[0]),
                            dayjs(pageProps.backdate[1]),
                          ]
                        : null
                    }
                    onChange={(date, dateStr) =>
                      setPageProps((prev) => ({
                        ...prev,
                        backdate: dateStr,
                        page: 1,
                      }))
                    }
                    style={{ width: "100%" }}
                  />
                </div>

                {user && !user.sumdanId && (
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate">
                      Mitra Pembiayaan
                    </label>
                    <Select
                      size="small"
                      placeholder="Mitra..."
                      options={sumdanOptions}
                      value={pageProps.sumdanId}
                      onChange={(e) =>
                        setPageProps((prev) => ({
                          ...prev,
                          sumdanId: e,
                          page: 1,
                        }))
                      }
                      allowClear
                      style={{ width: "100%" }}
                    />
                  </div>
                )}

                <div className="flex flex-col space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate">
                    Jenis Pembiayaan
                  </label>
                  <Select
                    size="small"
                    placeholder="Jenis..."
                    options={jenisOptions}
                    value={pageProps.jenisPembiayaanId}
                    onChange={(e) =>
                      setPageProps((prev) => ({
                        ...prev,
                        jenisPembiayaanId: e,
                        page: 1,
                      }))
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate">
                    Agent Fronting
                  </label>
                  <Select
                    size="small"
                    placeholder="Agent..."
                    options={agentOptions}
                    value={pageProps.agentFrontingId}
                    onChange={(e) =>
                      setPageProps((prev) => ({
                        ...prev,
                        agentFrontingId: e,
                        page: 1,
                      }))
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>
          </FilterData>
        </div>
        <div className="flex gap-2">
          <Button
            icon={<PrinterOutlined />}
            size="small"
            type="primary"
            onClick={handleExportExcel}
          >
            Excel
          </Button>
          <Button
            icon={<PrinterOutlined />}
            size="small"
            type="primary"
            onClick={() =>
              printMonitoring(pageProps.data, sumdans, pageProps.backdate)
            }
          >
            PDF
          </Button>
          {/* {hasAccess("write") && (
            <Button
              icon={<PrinterOutlined />}
              type="primary"
              size="small"
              onClick={() => printForm()}
            >
              Form
            </Button>
          )} */}
          <Input.Search
            size="small"
            style={{ width: 170 }}
            placeholder="Cari nama..."
            value={pageProps.search}
            onChange={(e) =>
              setPageProps((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1,
              }))
            }
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={pageProps.data}
        size="small"
        loading={loading}
        rowKey="id"
        bordered
        scroll={{ x: "max-content", y: "48vh" }}
        pagination={{
          current: pageProps.page,
          pageSize: pageProps.limit,
          total: pageProps.total,
          onChange: (page, pageSize) => {
            setPageProps((prev) => ({ ...prev, page, limit: pageSize }));
          },
          pageSizeOptions: [50, 100, 500, 1000],
          showSizeChanger: true,
        }}
        summary={handleTableSummary}
      />

      {selected.selected && selected.proses && (
        <SendSubmission
          data={selected.selected}
          open={selected.proses}
          setOpen={(val: boolean) =>
            setSelected((prev) => ({
              ...prev,
              proses: val,
              selected: undefined,
            }))
          }
          getData={getData}
          hook={modal}
          key={"send" + selected.selected.id}
        />
      )}
      {selected.selected && selected.delete && (
        <DeleteSubmission
          open={selected.delete}
          setOpen={(val: boolean) =>
            setSelected((prev) => ({
              ...prev,
              selected: undefined,
              delete: val,
            }))
          }
          getData={getData}
          data={selected.selected}
          hook={modal}
          key={"delete" + selected.selected.id}
        />
      )}
      {selected.selected && selected.cetakAkad && (
        <PrintContractSubmission
          open={selected.cetakAkad}
          setOpen={(val: boolean) =>
            setSelected((prev) => ({
              ...prev,
              selected: undefined,
              cetakAkad: val,
            }))
          }
          getData={getData}
          data={selected.selected}
          hook={modal}
          key={"contract" + selected.selected.id}
        />
      )}
      {selected.selected && selected.upsert && (
        <DetailDapem
          open={selected.upsert}
          setOpen={(val: boolean) =>
            setSelected((prev) => ({
              ...prev,
              selected: undefined,
              upsert: val,
            }))
          }
          data={selected.selected}
          key={"detail" + selected.selected.id}
          allowprogres
        />
      )}
      <ViewFiles
        setOpen={(v: boolean) => setViews((prev) => ({ ...prev, open: v }))}
        data={views}
      />
    </Card>
  );
}

// Sub-komponen penanganan aksi dengan pembaruan state yang stabil
const SendSubmission = ({
  data,
  open,
  setOpen,
  getData,
  hook,
}: {
  data: IDapem;
  open: boolean;
  setOpen: Function;
  getData: Function;
  hook: HookAPI;
}) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dapem?id=" + data.id, {
        method: "PUT",
        body: JSON.stringify({
          ...data,
          verif_status: "PENDING",
          slik_status: "PENDING",
          dropping_status: "PENDING",
        }),
      }).then((r) => r.json());
      if (res.status === 200) {
        setOpen(false);
        await getData();
      } else {
        hook.error({ title: "ERROR!!", content: res.msg });
      }
    } catch {
      hook.error({ content: "Gagal memproses data pengajuan." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title="Konfirmasi Permohonan"
      loading={loading}
      onOk={handleSubmit}
      destroyOnHidden
    >
      <div className="my-4">
        <p>
          Ajukan permohonan ini ke verifikasi{" "}
          <span className="font-bold">*{data.id}*</span>?
        </p>
        <p className="italic text-xs text-blue-500 mt-4">
          Mohon cek kembali data yang telah diinput, pastikan sudah lengkap dan
          siap di verifikasi!
        </p>
      </div>
    </Modal>
  );
};

const DeleteSubmission = ({
  data,
  open,
  setOpen,
  getData,
  hook,
}: {
  data: IDapem;
  open: boolean;
  setOpen: Function;
  getData: Function;
  hook: HookAPI;
}) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dapem?id=" + data.id, {
        method: "DELETE",
      }).then((r) => r.json());
      if (res.status === 200) {
        await getData();
        setOpen(false);
      } else {
        hook.error({ content: res.msg });
      }
    } catch {
      hook.error({
        content: `Internal Server Error!!. Hapus data permohonan kredit ${data.id} gagal`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dapem?id=" + data.id, {
        method: "PUT",
        body: JSON.stringify({ ...data, dropping_status: "BATAL" }),
      }).then((r) => r.json());
      if (res.status === 200) {
        setOpen(false);
        await getData();
      } else {
        hook.error({ title: "ERROR!!", content: res.msg });
      }
    } catch {
      hook.error({ content: "Gagal membatalkan pengajuan." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title="Konfirmasi Hapus Permohonan"
      loading={loading}
      footer={[]}
      destroyOnHidden
    >
      <div className="my-4">
        <p>
          Hapus Data Pembiayaan ini{" "}
          <span className="font-bold">*{data.id}*</span>?
        </p>
        <div className="mt-4 text-xs italic text-blue-500">
          <p>Hapus : Hapus dari monitoring!</p>
          <p>Batalkan : Update status menjadi BATAL!</p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button danger onClick={handleDelete}>
          Hapus Pengajuan
        </Button>
        <Button danger onClick={handleCancel}>
          Batalkan Pengajuan
        </Button>
        <Button onClick={() => setOpen(false)}>Tutup</Button>
      </div>
    </Modal>
  );
};

const PrintContractSubmission = ({
  open,
  setOpen,
  data,
  getData,
  hook,
}: {
  open: boolean;
  setOpen: Function;
  data: IDapem;
  getData: Function;
  hook: HookAPI;
}) => {
  const [temp, setTemp] = useState<IDapem>(data);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/akad", {
        method: "POST",
        body: JSON.stringify({
          id: data.id,
          date_contract: temp.date_contract,
          no_contract: temp.no_contract,
        }),
      }).then((r) => r.json());
      if (res.status === 200) {
        await getData();
        printContract({ ...temp, Angsurans: res.data } as IDapem);
      } else {
        hook.error({ content: res.msg });
      }
    } catch {
      hook.error({ content: `Internal Server Error!!. Generate PK gagal` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title={"Cetak Akad " + data.id}
      loading={loading}
      onOk={handleSubmit}
      okButtonProps={{ disabled: !temp.date_contract || !temp.no_contract }}
      destroyOnHidden
    >
      <div className="flex flex-col gap-2">
        <FormInput
          data={{
            label: "Pemohon",
            type: "text",
            required: true,
            value: `${data.Debitur.fullname} (${data.nopen})`,
            disabled: true,
          }}
        />
        <FormInput
          data={{
            label: "Tanggal Akad",
            type: "date",
            required: true,
            value: moment(temp.date_contract).format("YYYY-MM-DD"),
            onChange: (e: string) =>
              setTemp((prev) => ({ ...prev, date_contract: new Date(e) })),
          }}
        />
        <FormInput
          data={{
            // key: `${formInputId}-no-contract`,
            label: "Nomor Akad",
            type: "text",
            required: true,
            value: temp.no_contract,
            onChange: (e: string) =>
              setTemp((prev) => ({ ...prev, no_contract: e })),
            suffix: (
              <Button
                size="small"
                icon={<RobotOutlined />}
                type="primary"
                onClick={() =>
                  setTemp((prev) => ({
                    ...prev,
                    no_contract: `${data.id.replace("P", "")}/${process.env.NEXT_PUBLIC_APP_CODE_FILE || "MANTARA"}-${data.ProdukPembiayaan.Sumdan.code === "VIMA" ? "PTBPRVIMA" : data.ProdukPembiayaan.Sumdan.code.replace(" ", "").replace("BPR", "").replace("BANK", "")}/${moment(prev.date_contract || new Date()).format("DD-YYYY")}`,
                  }))
                }
              />
            ),
          }}
        />
        <FormInput
          data={{
            label: "Jenis Margin",
            type: "text",
            required: true,
            value: `${data.c_margin + data.c_margin_sumdan}% (${data.margin_type})`,
            disabled: true,
          }}
        />
        <FormInput
          data={{
            label: "Mitra",
            type: "text",
            required: true,
            value: data.ProdukPembiayaan.Sumdan.name,
            disabled: true,
          }}
        />
      </div>
    </Modal>
  );
};
