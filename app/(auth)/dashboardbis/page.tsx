"use client";

import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { IArea, IPageProps, ISumdan, IUserDapem } from "@/libs/IInterfaces";

import {
  DatePicker,
  Spin,
  Table,
  TableProps,
  Progress,
  Tag,
  Card,
  Button,
} from "antd";
import { useEffect, useState } from "react";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  MapPin,
} from "lucide-react";

const { RangePicker } = DatePicker;

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [pageProps, setPageProps] = useState<IPageProps<IArea>>({
    page: 1,
    limit: 1000,
    total: 0,
    data: [],
    search: "",
    backdate: "",
  });
  const [sumdan, setSumdan] = useState<ISumdan[]>([]);
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);
  const [expandedCabangs, setExpandedCabangs] = useState<string[]>([]);
  const [expandedAOs, setExpandedAOs] = useState<string[]>([]);

  const toggleArea = (id: string) => {
    setExpandedAreas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };
  const toggleCabang = (id: string) => {
    setExpandedCabangs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };
  const toggleAO = (id: string) => {
    setExpandedAOs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const getActiveAOData = (user: IUserDapem) => {
    if (user?.AOs?.length) return user.AOs;
    if (user?.AOCabangs?.length) return user.AOCabangs;
    if (user?.AOAreas?.length) return user.AOAreas;

    return [];
  };

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      ...(pageProps.backdate && { backdate: pageProps.backdate }),
    });

    try {
      await fetch(`/api?${params.toString()}`, { method: "POST" })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          setPageProps((prev) => ({ ...prev, data: res.area }));
          setSumdan(res.sumdan);
        });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => getData(), 200);
    return () => clearTimeout(timeout);
  }, [pageProps.backdate]);

  const columns: TableProps<ISumdan>["columns"] = [
    {
      title: "Nama Mitra",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div>
          <div className="font-bold text-blue-700">{record.name}</div>
          <Tag color="blue">{record.code}</Tag>
        </div>
      ),
    },
    {
      title: "Pencapaian",
      key: "achievement",
      sorter: (a, b) => {
        const getPlafond = (item: ISumdan) =>
          item.ProdukPembiayaans.flatMap((p) => p.Dapems).reduce(
            (acc, c) => acc + c.plafond,
            0,
          );
        return getPlafond(a) - getPlafond(b);
      },
      render: (_, record) => {
        const total = record.ProdukPembiayaans.flatMap((d) => d.Dapems).reduce(
          (acc, curr) => acc + curr.plafond,
          0,
        );
        const allTotal = sumdan
          .flatMap((s) => s.ProdukPembiayaans)
          .flatMap((s) => s.Dapems)
          .reduce((acc, curr) => acc + curr.plafond, 0);
        const percent = (total / allTotal) * 100 || 0;
        return (
          <div className="min-w-50">
            <div className="flex justify-between font-medium">
              <span>{IDRFormat(total)}</span>
              <span className="text-gray-400 text-xs">
                {record.ProdukPembiayaans.flatMap((r) => r.Dapems).length} NOA
              </span>
            </div>
            <Progress
              percent={parseFloat(percent.toFixed(2))}
              size="small"
              status="active"
              strokeColor="#3b82f6"
            />
          </div>
        );
      },
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg text-white">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                Dashboard Pencapaian
              </h1>
              <p className="text-gray-500">Monitoring wilayah kerja</p>
            </div>
          </div>
          <RangePicker
            className="rounded-lg h-10 shadow-sm"
            onChange={(_, dateStr) =>
              setPageProps({ ...pageProps, backdate: dateStr })
            }
          />
        </div>

        {/* Areas Section */}
        <div className="space-y-6 mb-8">
          {pageProps.data?.map((area: IArea) => {
            const isAreaExpanded = expandedAreas.includes(area.id);
            const areaNoa = area.Cabangs.flatMap((c) =>
              c.Users.flatMap((u) => getActiveAOData(u)),
            );
            const areaPencapaian = areaNoa.reduce(
              (acc, curr) => acc + curr.plafond,
              0,
            );
            const areaTarget = area.Cabangs.flatMap((c) => c.Users).reduce(
              (acc, curr) => acc + (curr.target || 0),
              0,
            );
            const areaPercent = (areaPencapaian / areaTarget) * 100;

            return (
              <Card
                key={area.id}
                className="shadow-md border-none overflow-hidden"
                styles={{ body: { padding: 0 } }}
              >
                {/* Area Header (Clickable) */}
                <div
                  className="bg-slate-800 p-4 text-white flex justify-between items-center cursor-pointer hover:bg-slate-700 transition-all"
                  onClick={() => toggleArea(area.id)}
                >
                  <div className="flex items-center gap-3">
                    {isAreaExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                    <div>
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <MapPin size={16} className="text-blue-400" />{" "}
                        {area.name}
                      </h2>
                    </div>
                  </div>
                  <div className="flex gap-6 items-center">
                    <div className="hidden md:block text-right">
                      <div className="text-sm font-mono">
                        {IDRFormat(areaPencapaian)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Total Progress: {areaPercent.toFixed(1)}%
                      </div>
                    </div>
                    <Button
                      size="small"
                      type="primary"
                      ghost
                      className="border-slate-500 text-slate-200"
                    >
                      {isAreaExpanded ? "Sembunyikan" : "Lihat Cabang"}
                    </Button>
                  </div>
                </div>

                {/* Cabang List (Show/Hide) */}
                {isAreaExpanded && (
                  <div className="p-4 bg-slate-50 space-y-4 animate-in fade-in duration-300">
                    {area.Cabangs.map((cabang) => {
                      const isCabangExpanded = expandedCabangs.includes(
                        cabang.id,
                      );
                      const cabPencapaian = cabang.Users.flatMap((u) =>
                        getActiveAOData(u),
                      ).reduce((a, b) => a + b.plafond, 0);

                      return (
                        <div
                          key={cabang.id}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                        >
                          {/* Cabang Header */}
                          <div
                            className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                            onClick={() => toggleCabang(cabang.id)}
                          >
                            <div className="flex items-center gap-2 font-bold text-gray-700">
                              {isCabangExpanded ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                              <Building2 size={16} className="text-gray-400" />
                              {cabang.name}
                            </div>
                            <div className="text-blue-600 font-mono text-sm">
                              {IDRFormat(cabPencapaian)}
                            </div>
                          </div>

                          {/* User/AO List (Show/Hide) */}
                          {isCabangExpanded && (
                            <div className="divide-y divide-gray-100 animate-in slide-in-from-top-1 duration-200">
                              {cabang.Users.map((u) => {
                                const aoData = getActiveAOData(u);
                                const isAOExpanded = expandedAOs.includes(u.id);
                                const userAch = aoData.reduce(
                                  (a, b) => a + b.plafond,
                                  0,
                                );
                                const userPct = (userAch / u.target) * 100;
                                return (
                                  <div key={u.id}>
                                    <div className="p-4 flex flex-wrap md:flex-nowrap justify-between items-center hover:bg-blue-50/50 transition-colors">
                                      <div className="w-full md:w-1/3">
                                        <div className="font-semibold text-gray-800">
                                          {u.fullname}
                                        </div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-tighter">
                                          {u.position}
                                        </div>
                                      </div>
                                      <div className="flex-1 px-4 min-w-30">
                                        <Progress
                                          percent={parseFloat(
                                            userPct.toFixed(1),
                                          )}
                                          size="small"
                                          strokeColor={
                                            userPct >= 100
                                              ? "#10b981"
                                              : "#3b82f6"
                                          }
                                        />
                                      </div>
                                      <div className="w-full md:w-1/4 text-right">
                                        <div className="font-mono text-sm font-bold text-slate-700">
                                          {IDRFormat(userAch)}
                                        </div>
                                        <div className="text-[10px] text-gray-400 italic">
                                          Target: {IDRFormat(u.target)}
                                        </div>
                                      </div>
                                      <Button
                                        type="text"
                                        size="small"
                                        disabled={aoData.length === 0}
                                        aria-expanded={isAOExpanded}
                                        onClick={() => toggleAO(u.id)}
                                        className="ml-2 shrink-0"
                                      >
                                        {isAOExpanded ? (
                                          <ChevronUp size={16} />
                                        ) : (
                                          <ChevronDown size={16} />
                                        )}
                                        {aoData.length} Pembiayaan
                                      </Button>
                                    </div>

                                    {isAOExpanded && (
                                      <div className="overflow-x-auto border-t border-gray-100 bg-slate-50 px-4 py-3">
                                        <div className="min-w-150">
                                          <div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-3 pb-2 text-xs font-semibold uppercase text-gray-400">
                                            <span>Pemohon</span>
                                            <span>Produk</span>
                                            <span>Plafond</span>
                                            <span>Status</span>
                                          </div>
                                          {aoData.map((dapem) => (
                                            <div
                                              key={dapem.id}
                                              className="grid grid-cols-[2fr_2fr_1fr_1fr] items-center gap-4 rounded-md border border-gray-100 bg-white px-3 py-2 text-sm [&+div]:mt-2"
                                            >
                                              <div>
                                                <div className="font-medium text-gray-800">
                                                  {dapem.Debitur.fullname}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                  {dapem.Debitur.nopen}
                                                </div>
                                              </div>
                                              <div>
                                                <div>
                                                  {dapem.ProdukPembiayaan.name}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                  {dapem.JenisPembiayaan.name}
                                                </div>
                                              </div>
                                              <div className="font-mono font-medium">
                                                {IDRFormat(dapem.plafond)}
                                                <div className="text-xs text-gray-400">
                                                  {dapem.tenor} Bulan
                                                </div>
                                              </div>
                                              <Tag color="blue">
                                                {dapem.dropping_status}
                                              </Tag>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Table Summary tetap di bawah */}
        <Card
          title="Rekapitulasi Per Mitra"
          className="shadow-md border-none rounded-xl"
        >
          <Table
            columns={columns}
            dataSource={sumdan}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </div>
    </Spin>
  );
}
