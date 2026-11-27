"use client";

import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { defaultApp, IOTSDefault, IOTSDetail } from "@/libs/IInterfaces";
import {
  CalendarOutlined,
  CalculatorOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  App,
  AutoComplete,
  Avatar,
  Button,
  Card,
  Collapse,
  Empty,
  Input,
  Modal,
  Pagination,
  Popover,
  Progress,
  Spin,
  Tabs,
  Tag,
} from "antd";
import { HookAPI } from "antd/lib/modal/useModal";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { SimulasiAutomation } from "./util";

type LocationField = "province" | "city" | "district" | "ward";
type LocationOptions = Record<LocationField, string[]>;

const emptyLocationOptions: LocationOptions = {
  province: [],
  city: [],
  district: [],
  ward: [],
};

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [datastatus, setDataStatus] = useState<string | null>(null);
  const [data, setData] = useState<IOTSDetail[]>([]);
  const [app, setApp] = useState<IOTSDefault>(defaultApp);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openGetData, setOpenGetData] = useState(false);
  const [openSimulasi, setOpenSimulasi] = useState<{
    record: IOTSDetail | undefined;
    open: boolean;
  }>({
    record: undefined,
    open: false,
  });
  const { modal } = App.useApp();

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(datastatus && { status: datastatus }),
      });

      const res = await fetch(`/api/ots_setup/data?${params.toString()}`);
      const json = await res.json();
      setData(datastatus ? json.datastatus : json.today);
    } catch (err) {
      console.error("Gagal memuat data dapem pending:", err);
    } finally {
      setLoading(false);
    }
  }, [datastatus]);

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [datastatus]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/ots_setup`);
      const json = await res.json();
      setApp(json.data);
      setLoading(false);
    })();
  }, []);

  const handleUpdate = async (id: string, status: string) => {
    setLoading(true);
    const res = await fetch(`/api/ots_setup/data`, {
      method: "DELETE",
      body: JSON.stringify({
        id,
        status,
      }),
    });
    const json = await res.json();
    if (json.status === 200) {
      modal.success({ content: json.msg });
      await getData();
    } else {
      modal.error({ content: json.msg });
    }
    setLoading(false);
  };

  const renderExpandedDetails = (record: IOTSDetail) => {
    const address = [
      record.Debitur.address,
      record.Debitur.ward && `Kelurahan ${record.Debitur.ward}`,
      record.Debitur.district && `Kecamatan ${record.Debitur.district}`,
      record.Debitur.city,
      record.Debitur.province,
    ]
      .filter(Boolean)
      .join(", ");
    const phone = record.Debitur.phone;
    const phoneDigits = phone?.replace(/\D/g, "");
    const whatsappNumber = phoneDigits
      ? phoneDigits.startsWith("0")
        ? `62${phoneDigits.slice(1)}`
        : phoneDigits.startsWith("62")
          ? phoneDigits
          : `62${phoneDigits}`
      : null;

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Alamat
          </div>
          {address ? (
            <a
              className="block max-w-[320px] whitespace-normal text-blue-700 hover:text-blue-900"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ overflowWrap: "anywhere" }}
            >
              <EnvironmentOutlined className="mr-1" />
              {address}
            </a>
          ) : (
            <span>-</span>
          )}
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            No. Telepon
          </div>
          {phone && whatsappNumber ? (
            <a
              className="text-green-700 hover:text-green-900"
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {phone}
            </a>
          ) : (
            <span>-</span>
          )}
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Plafond Sebelumnya
          </div>
          <div>{IDRFormat(record.Debitur.plafond)}</div>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tanggal Lunas
          </div>
          <div>
            {record.Debitur.end_date
              ? moment(record.Debitur.end_date).format("DD/MM/YYYY")
              : "-"}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Kantor Bayar
          </div>
          <div>
            {record.Debitur.PayOffice?.name || "-"}
            {record.Debitur.kc_payoffice
              ? ` (${record.Debitur.kc_payoffice})`
              : ""}
          </div>
        </div>
      </div>
    );
  };

  const isDailyActivity = datastatus === null;
  const pageSize = app?.pagesize ?? 0;
  const pendingCount = data.filter(
    (record) => record.ots_status === "PENDING",
  ).length;
  const processingCount = data.filter(
    (record) => record.ots_status === "PROSES",
  ).length;
  const filteredData = data.filter((record) => {
    const query = searchText.trim().toLocaleLowerCase();
    return (
      !query ||
      record.Debitur.fullname.toLocaleLowerCase().includes(query) ||
      record.debiturNopen.toLocaleLowerCase().includes(query) ||
      (record.Debitur.city || "").toLocaleLowerCase().includes(query)
    );
  });
  const cardPageSize = 12;
  const pageData = filteredData.slice(
    (currentPage - 1) * cardPageSize,
    currentPage * cardPageSize,
  );
  const statusColor: Record<string, string> = {
    PENDING: "orange",
    PROSES: "blue",
    AKTIF: "green",
  };
  const statusLabel: Record<string, string> = {
    PENDING: "Menunggu proses",
    PROSES: "Sedang diproses",
    AKTIF: "Aktif",
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-3 sm:p-5">
      <Card className="overflow-hidden rounded-2xl border-0 bg-gradient-to-r from-sky-50 via-white to-indigo-50 shadow-sm">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
              <UserOutlined />
              Operasional
            </div>
            <h1 className="m-0 text-2xl font-bold text-slate-800 sm:text-3xl">
              Data OTS
            </h1>
            <p className="mb-0 mt-2 max-w-2xl text-sm text-slate-600">
              Kelola data debitur, tinjau informasi penting, dan lanjutkan
              proses dalam satu tempat.
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusCircleOutlined />}
            onClick={() => setOpenGetData(true)}
            className="self-start shadow-sm md:self-auto"
          >
            Tarik Data Baru
          </Button>
        </div>
        {isDailyActivity && (
          <div className="mt-6 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-3">
            <div className="rounded-xl bg-white/80 p-4">
              <div className="text-sm text-slate-500">Data dalam daftar</div>
              <div className="mt-1 text-2xl font-bold text-slate-800">
                {data.length}
                <span className="ml-1 text-sm font-normal text-slate-500">
                  debitur
                </span>
              </div>
            </div>
            <div className="rounded-xl bg-white/80 p-4">
              <div className="text-sm text-slate-500">Menunggu proses</div>
              <div className="mt-1 text-2xl font-bold text-orange-600">
                {pendingCount}
                <span className="ml-1 text-sm font-normal text-slate-500">
                  debitur
                </span>
              </div>
            </div>
            <div className="rounded-xl bg-white/80 p-4">
              <div className="text-sm text-slate-500">Sedang diproses</div>
              <div className="mt-1 text-2xl font-bold text-blue-700">
                {processingCount}
                <span className="ml-1 text-sm font-normal text-slate-500">
                  debitur
                </span>
              </div>
            </div>
            <div className="rounded-xl bg-white/80 p-4 sm:col-span-3">
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">
                  Kapasitas daftar harian
                </span>
                <span className="text-slate-500">
                  {data.length} / {pageSize}
                </span>
              </div>
              <Progress
                percent={
                  pageSize > 0
                    ? Math.min(Math.round((data.length / pageSize) * 100), 100)
                    : 0
                }
                showInfo={false}
                strokeColor={data.length >= pageSize ? "#f59e0b" : "#2563eb"}
              />
            </div>
          </div>
        )}
      </Card>

      <Card className="rounded-2xl shadow-sm" styles={{ body: { padding: 0 } }}>
        <Tabs
          activeKey={datastatus ?? "daily-avtivity"}
          className="px-4"
          items={[
            {
              key: "daily-avtivity",
              label: "Aktivitas Harian",
            },
            {
              key: "PROSES",
              label: "Sedang Proses",
            },
            {
              key: "AKTIF",
              label: "Aktif",
            },
          ]}
          onChange={(e: string) => {
            setDataStatus(e === "daily-avtivity" ? null : e);
            setCurrentPage(1);
          }}
        />
        <div className="space-y-4 px-4 pb-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="m-0 text-lg font-semibold text-slate-800">
                {isDailyActivity
                  ? "Daftar aktivitas hari ini"
                  : statusLabel[datastatus || ""] || "Daftar debitur"}
              </h2>
              <p className="mb-0 mt-1 text-sm text-slate-500">
                {filteredData.length} data
                {searchText ? " ditemukan" : " tersedia"}
              </p>
            </div>
            <Input
              allowClear
              prefix={<SearchOutlined className="text-slate-400" />}
              placeholder="Cari nama, nomor pensiun, atau kota"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                setCurrentPage(1);
              }}
              className="sm:max-w-sm"
            />
          </div>

          <Spin spinning={loading}>
            {pageData.length ? (
              <div className="grid items-start gap-4 md:grid-cols-2">
                {pageData.map((record, index) => (
                  <Card
                    key={record.id}
                    hoverable
                    className="h-full rounded-xl border border-slate-300 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                    styles={{ body: { padding: 16 } }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          size={46}
                          className="shrink-0 bg-blue-100 font-semibold text-blue-700"
                        >
                          {record.Debitur.fullname
                            .trim()
                            .slice(0, 1)
                            .toUpperCase()}
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-slate-800">
                            {record.Debitur.fullname}
                          </div>
                          <div className="text-sm text-slate-500">
                            No. Pensiun: {record.debiturNopen}
                          </div>
                        </div>
                      </div>
                      <Tag
                        color={statusColor[record.ots_status] || "default"}
                        className="m-0 shrink-0 rounded-full px-3 py-1"
                      >
                        {statusLabel[record.ots_status] || record.ots_status}
                      </Tag>
                    </div>

                    <div className="my-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-emerald-50 p-3">
                        <div className="mb-1 text-xs text-emerald-700">
                          <DollarCircleOutlined className="mr-1" />
                          Gaji pensiun
                        </div>
                        <div className="font-semibold text-slate-800">
                          {IDRFormat(record.Debitur.salary)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-amber-50 p-3">
                        <div className="mb-1 text-xs text-amber-700">
                          <CalendarOutlined className="mr-1" />
                          Tanggal lunas
                        </div>
                        <div className="font-semibold text-slate-800">
                          {record.Debitur.end_date
                            ? moment(record.Debitur.end_date).format(
                                "DD/MM/YYYY",
                              )
                            : "-"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                      <span>
                        <ClockCircleOutlined className="mr-1" />
                        Ditarik{" "}
                        {moment(record.OTSData.get_date).format("DD/MM/YYYY")}
                      </span>
                      <span>
                        <ClockCircleOutlined className="mr-1 text-rose-500" />
                        Reset{" "}
                        {moment(record.OTSData.reset_date).format("DD/MM/YYYY")}
                      </span>
                      <span className="ml-auto">#{index + 1}</span>
                    </div>

                    <Collapse
                      ghost
                      size="small"
                      className="mt-2"
                      items={[
                        {
                          key: "details",
                          label: (
                            <span className="font-medium text-blue-700">
                              <InfoCircleOutlined className="mr-2" />
                              Detail debitur
                            </span>
                          ),
                          children: renderExpandedDetails(record),
                        },
                      ]}
                    />

                    {isDailyActivity && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                        <Button
                          icon={<CalculatorOutlined />}
                          onClick={() =>
                            setOpenSimulasi({ record, open: true })
                          }
                        >
                          Simulasi
                        </Button>
                        {record.ots_status === "PENDING" && (
                          <>
                            <Popover
                              title="Konfirmasi proses data ini?"
                              trigger="click"
                              placement="topRight"
                              content={
                                <div className="flex justify-end">
                                  <Button
                                    size="small"
                                    type="primary"
                                    onClick={() =>
                                      handleUpdate(record.id, "PROSES")
                                    }
                                  >
                                    Ya, proses
                                  </Button>
                                </div>
                              }
                            >
                              <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                              >
                                Proses
                              </Button>
                            </Popover>
                            <Popover
                              title="Konfirmasi hapus data ini?"
                              trigger="click"
                              placement="topRight"
                              content={
                                <div className="flex justify-end">
                                  <Button
                                    size="small"
                                    danger
                                    onClick={() =>
                                      handleUpdate(record.id, "HAPUS")
                                    }
                                  >
                                    Ya, hapus
                                  </Button>
                                </div>
                              }
                            >
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                className="ml-auto"
                              >
                                Hapus
                              </Button>
                            </Popover>
                          </>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Empty
                className="py-12"
                description={
                  searchText
                    ? "Tidak ada data yang cocok dengan pencarian."
                    : "Belum ada data pada kategori ini."
                }
              />
            )}
          </Spin>
          {filteredData.length > cardPageSize && (
            <div className="flex justify-center pt-2">
              <Pagination
                current={currentPage}
                pageSize={cardPageSize}
                total={filteredData.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} dari ${total} debitur`
                }
              />
            </div>
          )}
        </div>
      </Card>
      <GetNewData
        open={openGetData}
        setOpen={(b: boolean) => setOpenGetData(b)}
        getData={getData}
        hook={modal}
      />
      {openSimulasi.record && (
        <SimulasiAutomation
          open={openSimulasi.open}
          setOpen={(b: any) => setOpenSimulasi(b)}
          record={openSimulasi.record}
          appData={app}
          key={openSimulasi.record.id}
        />
      )}
    </div>
  );
}

const GetNewData = ({
  open,
  setOpen,
  getData,
  hook,
}: {
  open: boolean;
  setOpen: Function;
  getData: Function;
  hook: HookAPI;
}) => {
  const [data, setdata] = useState({
    province: "",
    city: "",
    district: "",
    ward: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState<LocationField | null>(
    null,
  );
  const [locationOptions, setLocationOptions] =
    useState<LocationOptions>(emptyLocationOptions);
  const [locationError, setLocationError] = useState<string | null>(null);

  const loadLocationOptions = useCallback(
    async (
      field: LocationField,
      filters: Partial<Record<LocationField, string>>,
    ) => {
      setLoadingOptions(field);
      setLocationError(null);
      try {
        const params = new URLSearchParams({ locations: field });
        Object.entries(filters).forEach(([key, value]) => {
          if (value?.trim()) params.set(key, value.trim());
        });

        const response = await fetch(
          `/api/ots_setup/data?${params.toString()}`,
        );
        const result: { locations?: string[]; msg?: string } =
          await response.json();
        if (!response.ok) {
          throw new Error(result.msg || "Gagal memuat saran wilayah.");
        }

        setLocationOptions((prev) => ({
          ...prev,
          [field]: result.locations || [],
        }));
      } catch (error) {
        setLocationError(
          error instanceof Error
            ? error.message
            : "Gagal memuat saran wilayah.",
        );
      } finally {
        setLoadingOptions(null);
      }
    },
    [],
  );

  const updateLocation = (field: LocationField, value: string) => {
    setdata((prev) => {
      if (field === "province") {
        return { ...prev, province: value, city: "", district: "", ward: "" };
      }
      if (field === "city") {
        return { ...prev, city: value, district: "", ward: "" };
      }
      if (field === "district") {
        return { ...prev, district: value, ward: "" };
      }
      return { ...prev, ward: value };
    });

    setLocationOptions((prev) => {
      if (field === "province") {
        return { ...prev, city: [], district: [], ward: [] };
      }
      if (field === "city") {
        return { ...prev, district: [], ward: [] };
      }
      if (field === "district") {
        return { ...prev, ward: [] };
      }
      return prev;
    });
  };

  const handleOK = async () => {
    setLoading(true);

    const res = await fetch(`/api/ots_setup/data`, {
      method: "POST",
      body: JSON.stringify({
        province: data.province.trim(),
        city: data.city.trim(),
        district: data.district.trim(),
        ward: data.ward.trim(),
      }),
    });
    const json = await res.json();
    if (json.status === 200) {
      hook.success({ content: json.msg });
      closeModal();
      await getData();
    } else {
      hook.error({ content: json.msg });
    }
    setLoading(false);
  };

  const closeModal = () => {
    setOpen(false);
    setdata({ province: "", city: "", district: "", ward: "" });
    setLocationOptions(emptyLocationOptions);
    setLocationError(null);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 py-1">
          <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
            <EnvironmentOutlined />
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-800">
              Tarik Data OTS
            </div>
            <div className="text-xs font-normal text-slate-500">
              Tentukan wilayah untuk mencari debitur
            </div>
          </div>
        </div>
      }
      open={open}
      onCancel={closeModal}
      onOk={handleOK}
      okText="Tarik Data"
      cancelText="Batal"
      okButtonProps={{ icon: <PlusCircleOutlined /> }}
      confirmLoading={loading}
      centered
      width={640}
      destroyOnHidden
    >
      <div className="space-y-4 pt-3">
        <Alert
          showIcon
          type="info"
          message="Pilih saran wilayah atau ketik secara manual"
          description="Saran akan mengikuti wilayah yang dipilih sebelumnya. Kolom boleh dikosongkan untuk pencarian yang lebih luas."
        />
        {locationError && (
          <Alert
            showIcon
            type="warning"
            message="Saran wilayah belum tersedia"
            description={`${locationError} Anda tetap dapat mengisi kolom secara manual.`}
          />
        )}
        {loadingOptions && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Spin size="small" />
            Memuat saran wilayah...
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["province", "Provinsi", "Pilih atau ketik provinsi"],
              ["city", "Kota/Kabupaten", "Pilih atau ketik kota/kabupaten"],
              ["district", "Kecamatan", "Pilih atau ketik kecamatan"],
              ["ward", "Kelurahan", "Pilih atau ketik kelurahan"],
            ] as const
          ).map(([field, label, placeholder]) => (
            <div key={field} className="space-y-1.5">
              <label
                htmlFor={`ots-location-${field}`}
                className="text-sm font-medium text-slate-700"
              >
                {label}
              </label>
              <AutoComplete
                value={data[field]}
                options={locationOptions[field].map((value) => ({
                  value,
                  label: value,
                }))}
                onChange={(value) => updateLocation(field, value)}
                onFocus={() => {
                  if (
                    field === "province" &&
                    locationOptions.province.length === 0
                  ) {
                    void loadLocationOptions("province", {});
                  }
                }}
                onSelect={(value) => {
                  if (field === "province") {
                    void loadLocationOptions("city", { province: value });
                  } else if (field === "city") {
                    void loadLocationOptions("district", {
                      province: data.province,
                      city: value,
                    });
                  } else if (field === "district") {
                    void loadLocationOptions("ward", {
                      province: data.province,
                      city: data.city,
                      district: value,
                    });
                  }
                }}
                onBlur={() => {
                  if (field === "province" && data.province.trim()) {
                    void loadLocationOptions("city", {
                      province: data.province,
                    });
                  } else if (field === "city" && data.city.trim()) {
                    void loadLocationOptions("district", {
                      province: data.province,
                      city: data.city,
                    });
                  } else if (field === "district" && data.district.trim()) {
                    void loadLocationOptions("ward", {
                      province: data.province,
                      city: data.city,
                      district: data.district,
                    });
                  }
                }}
                filterOption={(inputValue, option) =>
                  String(option?.value || "")
                    .toLocaleLowerCase()
                    .includes(inputValue.toLocaleLowerCase())
                }
                suffixIcon={<DownOutlined className="text-slate-400" />}
                allowClear
                className="w-full"
                id={`ots-location-${field}`}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
