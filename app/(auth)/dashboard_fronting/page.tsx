"use client";

import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { IAgentFronting, IPageProps } from "@/libs/IInterfaces";
import { DatePicker, Spin, Card } from "antd";
import { useEffect, useState } from "react";

const { RangePicker } = DatePicker;

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [pageProps, setPageProps] = useState<IPageProps<IAgentFronting>>({
    page: 1,
    limit: 1000,
    total: 0,
    data: [],
    search: "",
    backdate: "",
  });

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: pageProps.limit.toString(),
      includes: "true",
      ...(pageProps.backdate && { backdate: pageProps.backdate }),
    });

    try {
      fetch(`/api/agent?${params.toString()}`)
        .then((r) => r.json())
        .then((res) =>
          setPageProps((prev) => ({
            ...prev,
            data: res.data,
            total: res.total,
          })),
        );
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

  return (
    <Spin spinning={loading}>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              Dashboard Pencapaian
            </h1>
            <p className="text-gray-500">
              Monitoring real-time berdasarkan Agent Fronting
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">
              Filter Periode:
            </span>
            <RangePicker
              className="rounded-lg shadow-sm"
              onChange={(_, dateStr) =>
                setPageProps({ ...pageProps, backdate: dateStr })
              }
            />
          </div>
        </div>

        {/* Areas Section */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {pageProps.data?.map((area) => {
            const areaNoa = area.Dapems;
            const areaPencapaian = areaNoa.reduce(
              (acc, curr) => acc + curr.plafond,
              0,
            );
            const areaPercent = (areaPencapaian / area.target) * 100;

            return (
              <Card
                key={area.id}
                className="shadow-md border-none overflow-hidden"
                styles={{ body: { padding: 0 } }}
              >
                {/* Area Header */}
                <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-wider">
                      {area.name}
                    </h2>
                    <span className="text-xs text-slate-400">
                      {areaNoa.length} Total NOA Terdaftar
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-mono">
                      {IDRFormat(areaPencapaian)}
                    </div>
                    <div className="text-xs text-slate-400">
                      Target: {IDRFormat(area.target)} ({areaPercent.toFixed(2)}
                      %)
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Spin>
  );
}
