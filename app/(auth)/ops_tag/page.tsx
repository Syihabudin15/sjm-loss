"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import moment from "moment";
import type { Sumdan } from "../../../generated/prisma/client";
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
} from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import {
  BankOutlined,
  EditOutlined,
  FileFilled,
  FileProtectOutlined,
  FolderOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

import { FormInput, ViewFiles } from "@/components";
import { useUser } from "@/components/UserContext";
import { useAccess } from "@/libs/Permission";
import {
  ExportToExcel,
  FilterData,
  MappingToExcelDapem,
} from "@/components/utils/CompUtils";
import { DetailDapem } from "@/components/utils/LayoutUtils";
import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";
import {
  IActionTable,
  IDapem,
  IPageProps,
  IViewFiles,
} from "@/libs/IInterfaces";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

export default function Page() {
  const [pageProps, setPageProps] = useState<IPageProps<IDapem>>({
    page: 1,
    limit: 50,
    total: 0,
    data: [],
    search: "",
    sumdanId: "",
    backdate: "",
    add_mitra: "",
    file_skp: "",
    file_account: "",
  });

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<IActionTable<IDapem>>({
    upsert: false,
    delete: false,
    proses: false,
    selected: undefined,
  });

  const [sumdans, setSumdans] = useState<Sumdan[]>([]);
  const [views, setViews] = useState<IViewFiles>({ open: false, data: [] });

  const { modal } = App.useApp();
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/ops_tag";
  const { hasAccess } = useAccess(currentPath);
  const user = useUser();

  // Membungkus fetch data utama dengan useCallback
  const getData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pageProps.page.toString(),
      limit: pageProps.limit.toString(),
      approv_status: "DISETUJUI",
      includes: "true",
      ...(pageProps.search && { search: pageProps.search }),
      ...(pageProps.sumdanId && { sumdanId: pageProps.sumdanId }),
      ...(pageProps.backdate && { backdate: pageProps.backdate }),
      ...(pageProps.add_mitra && { add_mitra: pageProps.add_mitra }),
      ...(pageProps.file_skp && { file_skp: pageProps.file_skp }),
      ...(pageProps.file_account && { file_account: pageProps.file_skp }),
    });

    try {
      const res = await fetch(`/api/dapem?${params.toString()}`);
      const json = await res.json();
      setPageProps((prev) => ({
        ...prev,
        data: json.data || [],
        total: json.total || 0,
      }));
    } catch (error) {
      console.error("Failed to fetch dapem data:", error);
    } finally {
      setLoading(false);
    }
  }, [
    pageProps.page,
    pageProps.limit,
    pageProps.search,
    pageProps.sumdanId,
    pageProps.backdate,
    pageProps.add_mitra,
    pageProps.file_skp,
    pageProps.file_account,
  ]);

  // Debounce data fetching
  useEffect(() => {
    const timeout = setTimeout(() => {
      getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [getData]);

  // Fetch data master sekali saat mounting
  useEffect(() => {
    let isMounted = true;
    const fetchMasterData = async () => {
      try {
        const [resSumdan] = await Promise.all([
          fetch("/api/sumdan?limit=500").then((r) => r.json()),
        ]);

        if (isMounted) {
          setSumdans(resSumdan.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch master data:", error);
      }
    };

    fetchMasterData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Transformasi data untuk Select option dimemokan agar tidak di-map terus-menerus
  const sumdanOptions = useMemo(
    () => sumdans.map((s) => ({ label: s.code, value: s.id })),
    [sumdans],
  );

  // Definisi kolom tabel dimemokan agar referensinya tetap sama
  const columns: TableProps<IDapem>["columns"] = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        render: (_, record, index) => (
          <div>
            <div>{(pageProps.page - 1) * pageProps.limit + index + 1}</div>
            <div className="opacity-80 ">{record.id}</div>
          </div>
        ),
      },
      {
        title: "Pemohon",
        dataIndex: "pemohon",
        key: "pemohon",
        fixed:
          typeof window !== "undefined" && window.innerWidth < 600
            ? false
            : true,
        render: (_, record) => (
          <div>
            <p className="font-bold">{record.Debitur?.fullname}</p>
            <div className=" opacity-80">
              <p>@{record.Debitur?.nopen}</p>
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
          const detail = GetDetailDapem(record);
          return (
            <div className="">
              <div className="flex gap-2 items-center">
                <Tag color="blue">
                  <BankOutlined /> {IDRFormat(detail.detail.angsuran_sumdan)}
                </Tag>
                <Tag color="blue">
                  {IDRFormat(detail.angsuran - detail.detail.angsuran_sumdan)}
                </Tag>
              </div>
              <div className="flex justify-center mt-1">
                <Tag color="blue">{IDRFormat(detail.angsuran)}</Tag>
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
              {record.ProdukPembiayaan?.name}{" "}
              <span>({record.ProdukPembiayaan?.Sumdan?.code})</span>
            </p>
            <p className="opacity-80 ">{record.JenisPembiayaan?.name}</p>
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
              <div className=" opacity-80">
                {ao?.Cabang?.name} | {ao?.Cabang?.Area?.name}
              </div>
            </div>
          );
        },
      },
      {
        title: "Agent Fronting",
        dataIndex: "agentFrontingId",
        key: "agentFrontingId",
        render: (_, record) => (
          <div>
            <div>{record.AgentFronting?.name}</div>
            <div className=" opacity-80">{record.AgentFronting?.code}</div>
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
              <div className=" opacity-80">
                {moment(record.date_contract).format("DD/MM/YYYY")}
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Status Add Mitra",
        dataIndex: "add_mitra",
        key: "add_mitra",
        render: (_, record) => (
          <div className="flex justify-center items-center">
            <Tag color={record.add_mitra ? "green" : "red"} variant="solid">
              {record.add_mitra ? "SELESAI" : "PENDING"}
            </Tag>
          </div>
        ),
      },
      {
        title: "File SKP",
        dataIndex: "file_skp",
        key: "file_skp",
        render: (_, record) => (
          <div className="flex justify-center items-center">
            <Button
              icon={<FileFilled />}
              size="small"
              disabled={!record.file_account}
              onClick={() =>
                setViews({
                  open: true,
                  data: [
                    { name: "Berkas SKP", url: record.file_account || "" },
                  ],
                })
              }
            />
          </div>
        ),
      },
      {
        title: "File Rekening",
        dataIndex: "file_account",
        key: "file_account",
        render: (_, record) => (
          <div className="flex justify-center items-center">
            <Button
              icon={<FileFilled />}
              size="small"
              disabled={!record.file_account}
              onClick={() =>
                setViews({
                  open: true,
                  data: [
                    { name: "Buku Tabungan", url: record.file_account || "" },
                  ],
                })
              }
            />
          </div>
        ),
      },
      {
        title: "Created",
        dataIndex: "created_at",
        key: "created_at",
        render: (_, record) => (
          <div>
            <div>{record.User?.fullname}</div>
            <div className="opacity-80 ">
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
          <div className="flex gap-2">
            {hasAccess("update") && (
              <Button
                icon={<EditOutlined />}
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
            )}
            <Tooltip
              title={`Detail Data ${record.Debitur?.fullname || ""} (${record.nopen})`}
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
    ],
    [pageProps.page, pageProps.limit, hasAccess],
  );

  const handleClearFilter = useCallback(() => {
    setPageProps((prev) => ({
      ...prev,
      search: "",
      sumdanId: "",
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
          <FileProtectOutlined /> Proses SKP & Rekening
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
              </div>
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
                Status Add Mitra
              </label>
              <Select
                size="small"
                placeholder="status add"
                options={[
                  { label: "Sudah di Add", value: "true" },
                  { label: "Belum di Add", value: "false" },
                ]}
                value={pageProps.add_mitra}
                onChange={(e) =>
                  setPageProps((prev) => ({
                    ...prev,
                    add_mitra: e,
                    page: 1,
                  }))
                }
                allowClear
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate">
                File SKP
              </label>
              <Select
                size="small"
                placeholder="file skp"
                options={[
                  { label: "Ada", value: "true" },
                  { label: "Tidak Ada", value: "false" },
                ]}
                value={pageProps.file_skp}
                onChange={(e) =>
                  setPageProps((prev) => ({
                    ...prev,
                    file_skp: e,
                    page: 1,
                  }))
                }
                allowClear
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate">
                File Rekening
              </label>
              <Select
                size="small"
                placeholder="file rekening"
                options={[
                  { label: "Ada", value: "true" },
                  { label: "Tidak Ada", value: "false" },
                ]}
                value={pageProps.file_account}
                onChange={(e) =>
                  setPageProps((prev) => ({
                    ...prev,
                    file_account: e,
                    page: 1,
                  }))
                }
                allowClear
                style={{ width: "100%" }}
              />
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
            value={pageProps.search}
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
        scroll={{ x: "max-content", y: "55vh" }}
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
          record={selected.selected}
          key={`detail${selected.selected.id}`}
          allowprogres
        />
      )}
      <ViewFiles
        setOpen={(v: boolean) => setViews((prev) => ({ ...prev, open: v }))}
        data={views}
      />
      {selected.selected && selected.proses && (
        <UpdateStatus
          open={selected.proses}
          setOpen={(val: boolean) =>
            setSelected((prev) => ({
              ...prev,
              proses: val,
              selected: undefined,
            }))
          }
          getData={getData}
          dapem={selected.selected}
          key={`upsert${selected.selected.id}`}
          hook={modal}
        />
      )}
    </Card>
  );
}

interface UpdateStatusProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  getData: () => Promise<void>;
  dapem: IDapem;
  hook: HookAPI;
}

const UpdateStatus = ({
  open,
  setOpen,
  getData,
  dapem,
  hook,
}: UpdateStatusProps) => {
  const [data, setData] = useState<IDapem>(dapem);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dapem", {
        method: "PUT",
        body: JSON.stringify(data),
      }).then((r) => r.json());

      if (res.status === 200) {
        hook.success({
          title: "BERHASIL",
          content: "Data Pembiayaan berhasil diupdate",
        });
        await getData();
        setOpen(false);
      } else {
        hook.error({ title: "ERROR!!", content: res.msg });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      hook.error({ title: "ERROR!!", content: "Terjadi kesalahan jaringan." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Update Data ${dapem.id}`}
      open={open}
      onCancel={() => setOpen(false)}
      // width={500}
      loading={loading}
      onOk={handleSubmit}
      style={{ top: 20 }}
    >
      <div className="my-4 flex gap-2 flex-col">
        <FormInput
          data={{
            label: "Pemohon",
            class: "flex-1",
            type: "text",
            disabled: true,
            value: `${dapem.Debitur?.fullname || ""} (${dapem.nopen})`,
          }}
        />
        <FormInput
          data={{
            label: "Status Add Mitra",
            class: "flex-1",
            type: "select",
            value: data.add_mitra,
            options: [
              { label: "Sudah di Add", value: true },
              { label: "Belum di Add", value: false },
            ],
            onChange: (e: boolean) =>
              setData((prev) => ({ ...prev, add_mitra: e })),
          }}
        />
        <FormInput
          data={{
            label: "File SKP",
            class: "flex-1",
            type: "upload",
            value: data.file_skp,
            onChange: (e: string | null) =>
              setData((prev) => ({ ...prev, file_skp: e })),
          }}
        />
        <FormInput
          data={{
            label: "File Rekening",
            class: "flex-1",
            type: "upload",
            value: data.file_account,
            onChange: (e: string | null) =>
              setData((prev) => ({ ...prev, file_account: e })),
          }}
        />
        <FormInput
          data={{
            label: "File IDPB",
            class: "flex-1",
            type: "upload",
            value: data.file_idpb,
            onChange: (e: string | null) =>
              setData((prev) => ({ ...prev, file_idpb: e })),
          }}
        />
      </div>
    </Modal>
  );
};
