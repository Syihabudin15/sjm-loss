"use client";

import { ViewFiles } from "@/components";
import { useUser } from "@/components/UserContext";
import {
  ExportToExcel,
  FilterData,
  GetBerkasStatusTag,
  GetDroppingStatusTag,
  MappingToExcelDapem,
} from "@/components/utils/CompUtils";
import { DetailDapem } from "@/components/utils/LayoutUtils";
import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";
import {
  IActionTable,
  IAgentFronting,
  IDapem,
  IPageProps,
  IPayOffice,
  IViewFiles,
} from "@/libs/IInterfaces";

import {
  ArrowRightOutlined,
  BankOutlined,
  FileFilled,
  FileProtectOutlined,
  FolderOutlined,
  PayCircleOutlined,
  PrinterOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import type { JenisPembiayaan, Sumdan } from "../../../generated/prisma/client";
import {
  Button,
  Card,
  DatePicker,
  Input,
  Progress,
  Select,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState, useCallback, useMemo } from "react";
const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

export default function Page() {
  const [pageProps, setPageProps] = useState<IPageProps<IDapem>>({
    page: 1,
    limit: 50,
    total: 0,
    data: [],
    search: "",
    sumdanId: "",
    jenisPembiayaanId: "",
    document_status: "",
    guarantee_status: "",
    payOfficeId: "",
    agentFrontingId: "",
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
  const [pays, setPays] = useState<IPayOffice[]>([]);
  const [agents, setAgents] = useState<IAgentFronting[]>([]);
  const user = useUser();
  const [views, setViews] = useState<IViewFiles>({
    open: false,
    data: [],
  });

  // OPTIMASI 1: Amankan fungsi fetch dengan useCallback agar referensinya stabil
  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageProps.page.toString(),
        limit: pageProps.limit.toString(),
        approv_status: "DISETUJUI",
        ...(pageProps.search && { search: pageProps.search }),
        ...(pageProps.sumdanId && { sumdanId: pageProps.sumdanId }),
        ...(pageProps.jenisPembiayaanId && {
          jenisPembiayaanId: pageProps.jenisPembiayaanId,
        }),
        ...(pageProps.document_status && {
          document_status: pageProps.document_status,
        }),
        ...(pageProps.guarantee_status && {
          guarantee_status: pageProps.guarantee_status,
        }),
        ...(pageProps.agentFrontingId && {
          agentFrontingId: pageProps.agentFrontingId,
        }),
        ...(pageProps.payOfficeId && { payOfficeId: pageProps.payOfficeId }),
        ...(pageProps.backdate && { backdate: pageProps.backdate }),
        includes: "true",
      });

      const res = await fetch(`/api/dapem?${params.toString()}`);
      const json = await res.json();
      setPageProps((prev) => ({
        ...prev,
        data: json.data,
        total: json.total,
      }));
    } catch (err) {
      console.error("Failed to fetch dapem data", err);
    } finally {
      setLoading(false);
    }
  }, [
    pageProps.page,
    pageProps.limit,
    pageProps.search,
    pageProps.sumdanId,
    pageProps.jenisPembiayaanId,
    pageProps.document_status,
    pageProps.guarantee_status,
    pageProps.agentFrontingId,
    pageProps.payOfficeId,
    pageProps.backdate,
  ]);

  // OPTIMASI 2: Gabungkan trigger pemanggilan getData ke dalam satu debounced-effect terpusat
  // Ini mencegah request ganda (duplicate requests) saat parameter berubah bersamaan
  useEffect(() => {
    const timeout = setTimeout(() => {
      getData();
    }, 180); // Debounce ringan 180ms sangat efektif menahan ketikan keyboard pada kolom pencarian

    return () => clearTimeout(timeout);
  }, [
    getData,
    pageProps.page,
    pageProps.limit,
    pageProps.search,
    pageProps.sumdanId,
    pageProps.jenisPembiayaanId,
    pageProps.backdate,
    pageProps.document_status,
    pageProps.guarantee_status,
    pageProps.payOfficeId,
    pageProps.agentFrontingId,
  ]);

  // Master data fetching tetap berjalan sekali di awal
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [resSumdan, resJenis, resPay, resAgent] = await Promise.all([
          fetch("/api/sumdan?limit=500").then((res) => res.json()),
          fetch("/api/jenis?limit=50").then((res) => res.json()),
          fetch("/api/payoffice?limit=100").then((res) => res.json()),
          fetch("/api/agent?limit=100").then((res) => res.json()),
        ]);

        if (isMounted) {
          setSumdans(resSumdan.data);
          setJeniss(resJenis.data);
          setPays(resPay.data);
          setAgents(resAgent.data);
        }
      } catch (err) {
        console.error("Failed to load master data", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

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
  const paysOptions = useMemo(
    () => pays.map((s) => ({ label: s.name, value: s.id })),
    [agents],
  );

  // OPTIMASI 3: Gunakan useMemo untuk definisi kolom agar Table AntD tidak membuat ulang objek kolom di setiap render
  const columns: TableProps<IDapem>["columns"] = useMemo(
    () => [
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
        fixed:
          typeof window !== "undefined" && window.innerWidth < 600
            ? false
            : true,
        render(value, record) {
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
        render(value, record) {
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
        render(value, record) {
          const detail = GetDetailDapem(record);
          return (
            <div className="text-xs">
              <div className="flex gap-2 items-center">
                <Tag color={"blue"}>
                  <BankOutlined /> {IDRFormat(detail.detail.angsuran_sumdan)}
                </Tag>
                <Tag color={"blue"}>
                  {IDRFormat(detail.angsuran - detail.detail.angsuran_sumdan)}
                </Tag>
              </div>
              <div className="flex justify-center">
                <Tag color={"blue"}> {IDRFormat(detail.angsuran)}</Tag>
              </div>
            </div>
          );
        },
      },
      {
        title: "Produk Pembiayaan",
        dataIndex: "produk",
        key: "produk",
        render(value, record) {
          return (
            <div>
              <p>
                {record.ProdukPembiayaan.name}{" "}
                <span>({record.ProdukPembiayaan.Sumdan.code})</span>
              </p>
              <p className="opacity-80 text-xs">
                {record.JenisPembiayaan.name}
              </p>
            </div>
          );
        },
      },
      {
        title: "AO & UP",
        dataIndex: "aoup",
        key: "aoup",
        render(value, record) {
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
        title: "Agent Fronting",
        dataIndex: "agentFrontingId",
        key: "agentFrontingId",
        render(value, record) {
          return (
            <div>
              <div>{record.AgentFronting?.name}</div>
              <div className="text-xs opacity-80">
                {record.AgentFronting?.code}
              </div>
            </div>
          );
        },
      },
      {
        title: "Nomor Akad",
        dataIndex: "dataakad",
        key: "dataakad",
        render(value, record) {
          return (
            <div>
              {record.no_contract && <div>{record.no_contract}</div>}
              {record.date_contract && (
                <div className="text-xs opacity-80">
                  {moment(record.date_contract).format("DD/MM/YYYY")}
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: "Mutasi & Takeover",
        dataIndex: "produk",
        key: "produk",
        width: 350,
        render(value, record) {
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
        title: "Status Dropping",
        dataIndex: "dropping_status",
        key: "dropping_status",
        width: 180,
        render: (_, record) => {
          return (
            <div className="flex gap-1">
              {GetDroppingStatusTag(record.dropping_status)}
              {record.Dropping && record.Dropping.process_at && (
                <div className="text-xs">
                  {moment(record.Dropping.process_at).format(
                    "DD/MM/YYYY HH:mm",
                  )}
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: "Status Berkas",
        dataIndex: "berkas_status",
        key: "berkas_status",
        width: 250,
        render: (_, record) => {
          return (
            <div>
              <div className="flex gap-1">
                {GetBerkasStatusTag(record.document_status)}
                <Button
                  size="small"
                  icon={<FileFilled />}
                  disabled={!record.Berkas || !record.Berkas.file_sub}
                  onClick={() =>
                    setViews({
                      open: true,
                      data: [
                        {
                          name: "Pengiriman",
                          url: record.Berkas?.file_sub || "",
                        },
                        {
                          name: "Bukti Terima",
                          url: record.Berkas?.file_proof || "",
                        },
                      ],
                    })
                  }
                ></Button>
                {record.Berkas && record.Berkas.process_at && (
                  <span className="text-xs opacity-80">
                    Send :{" "}
                    {moment(record.Berkas.process_at).format("DD/MM/YYYY")}
                  </span>
                )}
              </div>
              <Paragraph
                ellipsis={{
                  rows: 2,
                  expandable: "collapsible",
                }}
                style={{ fontSize: 11 }}
              >
                {record.document_desc}
              </Paragraph>
            </div>
          );
        },
      },
      {
        title: "Status Jaminan",
        dataIndex: "Jaminan_status",
        key: "Jaminan_status",
        width: 350,
        render: (_, record) => {
          const isTbo =
            moment().isAfter(record.tbo_date, "date") &&
            (!record.Jaminan || !record.Jaminan.status);
          return (
            <div>
              <div className="flex gap-1">
                {GetBerkasStatusTag(record.guarantee_status)}
                <Tag color={isTbo ? "red" : "blue"} variant="solid">
                  {isTbo ? "LEWAT TBO" : "MASA TBO"}
                </Tag>
                <Button
                  size="small"
                  icon={<FileFilled />}
                  disabled={!record.Jaminan || !record.Jaminan.file_sub}
                  onClick={() =>
                    setViews({
                      open: true,
                      data: [
                        {
                          name: "Pengiriman",
                          url: record.Jaminan?.file_sub || "",
                        },
                        {
                          name: "Bukti Terima",
                          url: record.Jaminan?.file_proof || "",
                        },
                      ],
                    })
                  }
                ></Button>
                <div className="text-xs opacity-80">
                  <div>
                    TBO : {moment(record.tbo_date).format("DD/MM/YYYY")}
                  </div>
                  {record.Jaminan && record.Jaminan.process_at && (
                    <div>
                      Send :{" "}
                      {moment(record.Jaminan.process_at).format("DD/MM/YYYY")}
                    </div>
                  )}
                </div>
              </div>
              <Paragraph
                ellipsis={{
                  rows: 2,
                  expandable: "collapsible",
                }}
                style={{ fontSize: 11 }}
              >
                {record.guarantee_desc}
              </Paragraph>
            </div>
          );
        },
      },
      {
        title: "Progress",
        dataIndex: "progress",
        key: "progress",
        width: 150,
        render: (date, record) => {
          let percent = 40;
          if (record.takeover_status === "DISETUJUI") percent += 10;
          if (record.mutasi_status === "DISETUJUI") percent += 10;
          if (record.flagging_status === "DISETUJUI") percent += 10;
          if (record.cash_status === "DISETUJUI") percent += 10;
          if (record.document_status === "MITRA") percent += 10;
          if (record.guarantee_status === "MITRA") percent += 10;
          return <Progress percent={percent} />;
        },
      },
      {
        title: "Progres Tagihan",
        dataIndex: "progres",
        key: "progres",
        width: 150,
        render(value, record) {
          const filter = record.Angsurans.filter((f) => f.date_paid !== null);
          return (
            <Tooltip title={`${filter.length} / ${record.tenor}`}>
              <Progress
                percent={parseFloat(
                  String(((filter.length / record.tenor) * 100).toFixed(2)),
                )}
              />
            </Tooltip>
          );
        },
      },
      {
        title: "Asuransi",
        dataIndex: "biaya_sumdan",
        key: "biaya_sumdan",
        render(value, record) {
          const asuransi = GetDetailDapem(record).asuransi;
          return (
            <div className="text-xs text-right">
              <span>{IDRFormat(asuransi)}</span>
            </div>
          );
        },
      },
      {
        title: "Biaya Sumdan",
        dataIndex: "biaya_sumdan",
        key: "biaya_sumdan",
        render(value, record) {
          const adm = record.plafond * (record.c_adm_sumdan / 100);
          const provisi = record.plafond * (record.c_provisi_sumdan / 100);
          const total = adm + provisi + record.c_account_sumdan;
          return (
            <div className="text-xs text-right">
              <span>{IDRFormat(total)}</span>
            </div>
          );
        },
      },
      {
        title: "Biaya Koperasi",
        dataIndex: "biaya",
        key: "biaya",
        render(value, record) {
          const adm = record.plafond * (record.c_adm / 100);
          const tatalaksana =
            record.c_gov +
            record.c_stamp +
            record.c_infomation +
            record.c_mutasi;
          return (
            <div className="text-xs text-right">
              <span>{IDRFormat(adm + tatalaksana)}</span>
            </div>
          );
        },
      },
      {
        title: "Takeover",
        dataIndex: "c_takeover",
        key: "c_takeover",
        render(value, record) {
          return (
            <div className="text-xs text-right">
              <span>{IDRFormat(record.c_takeover)}</span>
            </div>
          );
        },
      },
      {
        title: "Blokir Angsuran",
        dataIndex: "blokir",
        key: "blokir",
        render(value, record) {
          const angs = GetDetailDapem(record).angsuran;
          return (
            <div className="text-xs text-right">
              <p>
                {record.c_blokir} x {IDRFormat(angs)}
              </p>
              <p>{IDRFormat(record.c_blokir * angs)}</p>
            </div>
          );
        },
      },
      {
        title: "Created",
        dataIndex: "created_at",
        key: "created_at",
        render(value, record) {
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
                  setSelected((prev) => ({
                    ...prev,
                    upsert: true,
                    selected: record,
                  }))
                }
              ></Button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [pageProps.page, pageProps.limit],
  );

  // OPTIMASI 4: Pindahkan kalkulasi matematika berat di bagian Summary ke dalam useMemo terpisah
  // Ini mencegah kalkulasi looping array berat diulang-ulang saat mengetik teks/membuka filter
  const tableSummaryData = useMemo(() => {
    if (!pageProps.data || pageProps.data.length === 0) return null;

    let totalPlafond = 0,
      angs = 0,
      angsSumdan = 0,
      adm_sumdan = 0,
      prov_sumdan = 0;
    let rek_sumdan = 0,
      adm = 0,
      asuransi = 0;
    let tatalaksana = 0,
      inform = 0,
      mutasi = 0;
    let takeover = 0,
      blokir = 0;

    for (let i = 0; i < pageProps.data.length; i++) {
      const curr = pageProps.data[i];
      const detailDapem = GetDetailDapem(curr);

      totalPlafond += curr.plafond;
      angs += detailDapem.angsuran;
      angsSumdan += detailDapem.detail.angsuran_sumdan;

      const p = curr.plafond / 100;
      adm_sumdan += p * curr.c_adm_sumdan;
      prov_sumdan += p * curr.c_provisi_sumdan;
      rek_sumdan += curr.c_account_sumdan;

      adm += p * curr.c_adm;
      asuransi += p * curr.c_insurance;

      tatalaksana += curr.c_gov;
      inform += curr.c_infomation;
      mutasi += curr.c_mutasi;

      takeover += curr.c_takeover;
      blokir += curr.c_blokir * detailDapem.angsuran;
    }

    return {
      totalPlafond,
      angs,
      angsSumdan,
      admAngsuran: Math.ceil(angs - angsSumdan),
      sumdanTotal: adm_sumdan + prov_sumdan + rek_sumdan,
      koperasiTotal: adm,
      laksanaTotal: tatalaksana + inform + mutasi,
      asuransi,
      takeover,
      blokir,
    };
  }, [pageProps.data]);

  // Handler yang di-memoized
  const handleClearFilter = useCallback(() => {
    setPageProps((prev) => ({
      ...prev,
      sumdanId: "",
      jenisPembiayaanId: "",
      agentFrontingId: "",
      payOfficeId: "",
      document_status: "",
      guarantee_status: "",
      backdate: "",
    }));
  }, []);

  const handleExportExcel = useCallback(() => {
    ExportToExcel(
      [{ sheetname: "alldata", data: MappingToExcelDapem(pageProps.data) }],
      "nominatif",
    );
  }, [pageProps.data]);

  return (
    <Card
      title={
        <div className="flex gap-2 font-bold text-xl">
          <FileProtectOutlined /> Daftar Nominatif
        </div>
      }
      styles={{ body: { padding: 5 } }}
    >
      <div className="flex justify-between my-1 gap-2 overflow-auto">
        <div className="flex gap-2">
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

                <div className="flex flex-col space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate">
                    Kantor Bayar
                  </label>
                  <Select
                    size="small"
                    placeholder="Kantor..."
                    options={paysOptions}
                    value={pageProps.payOfficeId}
                    onChange={(e) =>
                      setPageProps((prev) => ({
                        ...prev,
                        payOfficeId: e,
                        page: 1,
                      }))
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate">
                    Status Berkas
                  </label>
                  <Select
                    size="small"
                    placeholder="Status..."
                    options={[
                      { label: "UNIT", value: "UNIT" },
                      { label: "PUSAT", value: "PUSAT" },
                      { label: "DELIVERY", value: "DELIVERY" },
                      { label: "MITRA", value: "MITRA" },
                    ]}
                    value={pageProps.document_status}
                    onChange={(e) =>
                      setPageProps((prev) => ({
                        ...prev,
                        document_status: e,
                        page: 1,
                      }))
                    }
                    allowClear
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate">
                    Status Jaminan
                  </label>
                  <Select
                    size="small"
                    placeholder="Status..."
                    options={[
                      { label: "UNIT", value: "UNIT" },
                      { label: "PUSAT", value: "PUSAT" },
                      { label: "DELIVERY", value: "DELIVERY" },
                      { label: "MITRA", value: "MITRA" },
                    ]}
                    value={pageProps.guarantee_status}
                    onChange={(e) =>
                      setPageProps((prev) => ({
                        ...prev,
                        guarantee_status: e,
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
          <Input.Search
            size="small"
            style={{ width: 170 }}
            placeholder="Cari nama..."
            onChange={(e) =>
              setPageProps((prev) => ({ ...prev, search: e.target.value }))
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
        summary={() => {
          if (!tableSummaryData) return null;
          return (
            <Table.Summary.Row className="text-xs bg-blue-400">
              <Table.Summary.Cell index={0} colSpan={2} className="text-center">
                <b>SUMMARY</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} className="text-center">
                <b>{IDRFormat(tableSummaryData.totalPlafond)}</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} className="text-center font-bold">
                <div>
                  {IDRFormat(tableSummaryData.angsSumdan)} +{" "}
                  {IDRFormat(tableSummaryData.admAngsuran)}
                </div>
                <div className="border-t border-gray-500">
                  {IDRFormat(tableSummaryData.angs)}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell
                index={5}
                colSpan={8}
                className="text-center font-bold"
              />
              <Table.Summary.Cell index={12} className="font-bold">
                <div className="text-right">
                  {IDRFormat(tableSummaryData.asuransi)}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={14} className="font-bold">
                <div className="text-right">
                  {IDRFormat(tableSummaryData.sumdanTotal)}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={15} className="font-bold">
                <div className="text-right">
                  {IDRFormat(tableSummaryData.koperasiTotal)}
                </div>
              </Table.Summary.Cell>
              {/* <Table.Summary.Cell index={16} className="font-bold">
                <div className="text-right">
                  {IDRFormat(tableSummaryData.provTotal)}
                </div>
              </Table.Summary.Cell> */}
              <Table.Summary.Cell index={17} className="font-bold">
                <div className="text-right">
                  {IDRFormat(tableSummaryData.laksanaTotal)}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={18} className="font-bold">
                <div className="text-right">
                  {IDRFormat(tableSummaryData.takeover)}
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={19} className="font-bold">
                <div className="text-right">
                  {IDRFormat(tableSummaryData.blokir)}
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
            setSelected((prev) => ({
              ...prev,
              selected: undefined,
              upsert: val,
            }))
          }
          data={selected.selected}
          key={"detail" + selected.selected.id}
          allowprogres={true}
        />
      )}
      <ViewFiles
        setOpen={(v: boolean) => setViews((prev) => ({ ...prev, open: v }))}
        data={views}
      />
    </Card>
  );
}
