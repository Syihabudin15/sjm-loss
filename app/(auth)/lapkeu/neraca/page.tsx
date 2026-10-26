"use client";

import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { ICategoryOfAccount, IJournalDetail } from "@/libs/IInterfaces";
import { PrinterOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Divider, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
const { RangePicker } = DatePicker;

interface INeraca {
  asset: ICategoryOfAccount[];
  kewajiban: ICategoryOfAccount[];
  modal: ICategoryOfAccount[];
  pendapatan: IJournalDetail[];
  beban: IJournalDetail[];
  shu: number;
}

export default function NeracaPage() {
  const [backdate, setBackdate] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<INeraca>({
    asset: [],
    kewajiban: [],
    modal: [],
    pendapatan: [],
    beban: [],
    shu: 0,
  });

  const getData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (backdate[0]) params.append("start", backdate[0]);
      if (backdate[1]) params.append("end", backdate[1]);

      const res = await fetch(`/api/neraca?${params.toString()}`);
      const json = await res.json();
      setData(json.data);
    } catch (error) {
      console.error("Gagal mengambil data neraca", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [backdate]);

  // Kalkulasi Total menggunakan useMemo untuk performa
  const totalAsset = useMemo(
    () =>
      data.asset.reduce(
        (acc, d) =>
          acc +
          d.Childrens.reduce(
            (accC, dc) =>
              accC +
              dc.JournalDetails.reduce(
                (accJ, j) => accJ + (j.debit - j.credit),
                0,
              ),
            0,
          ),
        0,
      ),
    [data.asset],
  );

  const totalKewajiban = useMemo(
    () =>
      data.kewajiban.reduce(
        (acc, d) =>
          acc +
          d.Childrens.reduce(
            (accC, dc) =>
              accC +
              dc.JournalDetails.reduce(
                (accJ, j) => accJ + (j.credit - j.debit),
                0,
              ),
            0,
          ),
        0,
      ),
    [data.kewajiban],
  );

  const totalModal = useMemo(
    () =>
      data.modal.reduce(
        (acc, d) =>
          acc +
          d.Childrens.reduce(
            (accC, dc) =>
              accC +
              dc.JournalDetails.reduce(
                (accJ, j) => accJ + (j.credit - j.debit),
                0,
              ),
            0,
          ),
        0,
      ) + data.shu,
    [data.modal, data.shu],
  );

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              NERACA (BALANCE SHEET)
            </h1>
            <p className="text-gray-500 text-xs">
              {process.env.NEXT_PUBLIC_APP_FULLNAME}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RangePicker
              onChange={(_, dateStr) => setBackdate(dateStr)}
              className="w-64"
            />
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={async () => {
                const { printNeraca } = await import(
                  "@/components/pdfutils/lapkeu/printNeraca"
                );
                printNeraca(data, backdate.join(" - "));
              }}
            >
              Cetak PDF
            </Button>
          </div>
        </div>
      </Card>

      <Spin spinning={loading}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SISI KIRI: ASSET */}
          <Card title="AKTIVA (ASSETS)" className="shadow-sm">
            <div className="space-y-6">
              {data.asset.map((cat) => (
                <div key={cat.id}>
                  <h3 className="font-bold text-blue-600 border-b mb-2 uppercase tracking-wider text-sm">
                    {cat.name}
                  </h3>
                  {cat.Childrens.map((acc) => {
                    const balance = acc.JournalDetails.reduce(
                      (a, b) => a + (b.debit - b.credit),
                      0,
                    );
                    return (
                      <div
                        key={acc.id}
                        className="flex justify-between py-1 text-sm border-b border-gray-50 hover:bg-gray-50 ml-4"
                      >
                        <span>{acc.name}</span>
                        <span className="font-mono">{IDRFormat(balance)}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <Divider />
            <div className="flex justify-between items-center bg-blue-50 p-3 rounded">
              <span className="font-bold text-blue-800">TOTAL AKTIVA</span>
              <span className="text-lg font-bold text-blue-800 font-mono">
                {IDRFormat(totalAsset)}
              </span>
            </div>
          </Card>

          {/* SISI KANAN: KEWAJIBAN & MODAL */}
          <Card title="PASSIVA (LIABILITIES & EQUITY)" className="shadow-sm">
            <div className="space-y-6">
              {/* Kewajiban Section */}
              <section>
                <h3 className="font-bold text-red-600 border-b mb-2 uppercase tracking-wider text-sm">
                  KEWAJIBAN
                </h3>
                {data.kewajiban.map((cat) =>
                  cat.Childrens.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex justify-between py-1 text-sm border-b border-gray-50"
                    >
                      <span>{acc.name}</span>
                      <span className="font-mono">
                        {IDRFormat(
                          acc.JournalDetails.reduce(
                            (a, b) => a + (b.credit - b.debit),
                            0,
                          ),
                        )}
                      </span>
                    </div>
                  )),
                )}
              </section>

              {/* Modal Section */}
              <section>
                <h3 className="font-bold text-green-600 border-b mb-2 uppercase tracking-wider text-sm">
                  MODAL
                </h3>
                {data.modal.map((cat) =>
                  cat.Childrens.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex justify-between py-1 text-sm border-b border-gray-50 ml-4"
                    >
                      <span>{acc.name}</span>
                      <span className="font-mono">
                        {IDRFormat(
                          acc.JournalDetails.reduce(
                            (a, b) => a + (b.credit - b.debit),
                            0,
                          ),
                        )}
                      </span>
                    </div>
                  )),
                )}
                <div className="flex justify-between py-1 text-sm font-semibold italic text-green-700">
                  <span>SHU Tahun Berjalan</span>
                  <span className="font-mono">{IDRFormat(data.shu)}</span>
                </div>
              </section>
            </div>
            <Divider />
            <div className="flex justify-between items-center bg-green-50 p-3 rounded">
              <span className="font-bold text-green-800">TOTAL PASSIVA</span>
              <span className="text-lg font-bold text-green-800 font-mono">
                {IDRFormat(totalKewajiban + totalModal)}
              </span>
            </div>

            {/* Indikator Balance */}
            {Math.abs(totalAsset - (totalKewajiban + totalModal)) > 1 && (
              <div className="mt-4 p-2 bg-red-100 text-red-600 text-center text-xs rounded border border-red-200">
                ⚠️ Peringatan: Neraca tidak seimbang! Selisih:{" "}
                {IDRFormat(totalAsset - (totalKewajiban + totalModal))}
              </div>
            )}
          </Card>
        </div>
      </Spin>
    </div>
  );
}
