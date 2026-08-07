"use client";

import { FormInput } from "@/components";
import {
  GetDetailDapem,
  GetFullAge,
  getInitialDapemDetail,
  GetMaxPlafond,
  GetMaxTenor,
  IDRFormat,
  IDRToNumber,
} from "@/components/utils/PembiayaanUtil";
import {
  IDapem,
  IDebitur,
  IOutputDapemDetail,
  ISumdan,
} from "@/libs/IInterfaces";
import { useAccess } from "@/libs/Permission";
import {
  HistoryOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type {
  Debitur,
  JenisPembiayaan,
  ProdukPembiayaan,
  Sumdan,
} from "../../../generated/prisma/client";
import {
  App,
  Button,
  Card,
  Descriptions,
  Divider,
  Input,
  Modal,
  Select,
  Tooltip,
} from "antd";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";

export default function Page() {
  const [tglLahirStr, setTglLahirStr] = useState("");
  const [data, setData] = useState<IDapemSimulasi>(defaultData);
  const [jenis, setJenis] = useState<JenisPembiayaan[]>([]);
  const [sumdan, setSumdan] = useState<ISumdan[]>([]);
  const [sumdanAv, setSumdanAv] = useState<ISumdan[]>([]);
  const [details, setDetails] = useState<IOutputDapemDetail>(
    getInitialDapemDetail,
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { hasAccess } = useAccess(pathname || "/simulasi");
  const { message } = App.useApp();

  useEffect(() => {
    const { year, month } = GetFullAge(data.Debitur.birthdate, data.created_at);
    const newAv = sumdan.map((s) => {
      const prod = s.ProdukPembiayaans.filter(
        (p) => year >= p.min_age && year < p.max_age,
      );
      return { ...s, ProdukPembiayaans: prod };
    });
    setSumdanAv(newAv);
    if (
      data.produkPembiayaanId &&
      newAv.flatMap((a) => a.ProdukPembiayaans).length === 0
    ) {
      message.error("Produk tidak tersedia!");
      setData({
        ...defaultData,
        Debitur: {
          birthdate: data.Debitur.birthdate,
          salary: data.Debitur.salary,
        } as IDebitur,
        created_at: data.created_at,
      });
      return;
    }
    const tempProduk = newAv.flatMap((a) => a.ProdukPembiayaans);
    if (
      tempProduk.length === 1 &&
      tempProduk[0].id !== data.produkPembiayaanId
    ) {
      const findSumdan = newAv.find(
        (s) => s.id === tempProduk[0].sumdanId,
      ) as Sumdan;
      const find = tempProduk[0];
      setData((prev) => ({
        ...prev,
        produkPembiayaanId: find.id,
        ProdukPembiayaan: find,
        Sumdan: findSumdan,
        c_margin_sumdan: findSumdan.c_margin,
        c_adm_sumdan: findSumdan.c_adm_sumdan,
        c_provisi_sumdan: findSumdan.c_provisi_sumdan,
        c_account_sumdan: findSumdan.c_account_sumdan,
        c_margin: find.c_margin,
        c_adm: findSumdan.c_adm,
        c_provisi: findSumdan.c_provisi,
        c_insurance: find.c_insurance,
        c_gov: findSumdan.c_gov,
        c_stamp: findSumdan.c_stamps,
        c_flagging: findSumdan.c_flagging,
        c_infomation: findSumdan.c_information,
        rounded: findSumdan.rounded,
        fee_banpot: findSumdan.fee_banpot,
        c_ned: findSumdan.c_ned,
      }));
    }
    const maxTenn = GetMaxTenor(data.ProdukPembiayaan.max_paid, year, month);
    const maxTen =
      parseInt(String(maxTenn)) > data.ProdukPembiayaan.max_tenor
        ? data.ProdukPembiayaan.max_tenor
        : parseInt(String(maxTenn));
    const maxPlaff = parseInt(
      String(
        GetMaxPlafond(
          data.c_margin + data.c_margin_sumdan,
          data.tenor,
          ((data.Debitur.salary - 100000) * data.Sumdan.dsr) / 100,
        ),
      ),
    );

    const maxPlaf =
      maxPlaff > data.ProdukPembiayaan.max_plafond
        ? data.ProdukPembiayaan.max_plafond
        : maxPlaff;

    const detailDapem = GetDetailDapem(data);
    setDetails(detailDapem);

    if (
      detailDapem.detail.angsuranrounded >
      data.Debitur.salary * (data.Sumdan.dsr / 100)
    ) {
      message.error(
        "Angsuran lebih dari 95%, mohon sesuaikan kembali pembiayaan!",
      );
      setData((prev) => ({ ...prev, plafond: 0 }));
      return;
    }
    setData((prev) => ({
      ...prev,
      max_tenor: maxTen,
      max_plafond: maxPlaf,
      tenor: prev.tenor > maxTen ? maxTen : prev.tenor,
      plafon: prev.plafond > maxPlaf ? maxPlaf : prev.plafond,
    }));
  }, [
    data.created_at,
    data.plafond,
    data.tenor,
    data.Debitur.birthdate,
    data.Debitur.salary,
    data.margin_type,
    data.ProdukPembiayaan,
    data.c_margin_sumdan,
    data.c_adm_sumdan,
    data.c_provisi_sumdan,
    data.c_account_sumdan,
    data.c_adm,
    data.c_insurance,
    data.c_provisi,
    data.c_gov,
    data.c_stamp,
    data.c_flagging,
    data.c_infomation,
    data.c_mutasi,
    data.c_blokir,
    data.c_fee_bpp,
    data.c_margin,
    data.fee_banpot,
    data.c_takeover,
    data.c_ned,
  ]);

  useEffect(() => {
    if (data.Debitur.birthdate) {
      setTglLahirStr(moment(data.Debitur.birthdate).format("DD/MM/YYYY"));
    }
  }, [data.Debitur.birthdate]);
  const autoFormatDate = (val: string) => {
    const v = val.replace(/\D/g, ""); // Hanya izinkan angka
    if (v.length <= 2) return v;
    if (v.length <= 4) return `${v.slice(0, 2)}/${v.slice(2)}`;
    return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4, 8)}`;
  };

  const handleSearch = async () => {
    setLoading(true);
    await fetch("/api/debitur?nopen=" + data.nopen, { method: "PATCH" })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          setData({
            ...data,
            Debitur: { ...data.Debitur, ...res.data },
          });
        }
      });
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([
        fetch("/api/jenis?limit=100")
          .then((res) => res.json())
          .then((res) => setJenis(res.data)),
        fetch("/api/sumdan?limit=500&includes=true&includeproduct=true")
          .then((res) => res.json())
          .then((res) => setSumdan(res.data)),
      ]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row">
      <Card
        loading={loading}
        style={{ flex: 1 }}
        styles={{
          title: { margin: 0, padding: 0 },
          body: { margin: 12, padding: 0 },
        }}
      >
        <FormInput
          data={{
            label: "Tanggal Simulasi",
            type: "date",
            mode: "vertical",
            class: "flex-1",
            disabled: !hasAccess("update"),
            value: moment(data.created_at).format("YYYY-MM-DD"),
            onChange: (e: string) =>
              setData({ ...data, created_at: new Date(e) }),
          }}
        />
        <div className="flex gap-2 flex-wrap">
          <FormInput
            data={{
              label: "Nomor Pensiun",
              type: "text",
              mode: "vertical",
              class: "flex-1",
              value: data.nopen,
              onChange: (e: string) => setData({ ...data, nopen: e }),
              suffix: (
                <Button
                  size="small"
                  type="primary"
                  icon={<SearchOutlined />}
                  loading={loading}
                  onClick={() => handleSearch()}
                ></Button>
              ),
            }}
          />
          <FormInput
            data={{
              label: "Nama Lengkap",
              type: "text",
              mode: "vertical",
              class: "flex-1",
              value: data.Debitur.fullname,
              onChange: (e: string) =>
                setData({ ...data, Debitur: { ...data.Debitur, fullname: e } }),
            }}
          />
          <FormInput
            data={{
              label: "Tanggal Lahir",
              type: "text",
              mode: "vertical",
              class: "flex-1",
              value: tglLahirStr,
              onChange: (e: string) => {
                // 1. Format text secara visual
                const formatted = autoFormatDate(e);
                setTglLahirStr(formatted);

                // 2. Update data tanggal UTAMA hanya ketika input sudah lengkap (10 karakter)
                if (formatted.length === 10) {
                  const parsedDate = moment(formatted, "DD/MM/YYYY");
                  if (parsedDate.isValid()) {
                    setData({
                      ...data,
                      Debitur: {
                        ...data.Debitur,
                        birthdate: parsedDate.toDate(),
                      },
                    });
                  }
                }
              },
            }}
          />
          {data.Debitur.birthdate &&
            (() => {
              const { year, month, day } = GetFullAge(
                data.Debitur.birthdate,
                data.created_at,
              );
              return (
                <div className="w-full">
                  <p>Usia Pemohon</p>
                  <div className="flex gap-2">
                    <Input
                      disabled
                      style={{ color: "black" }}
                      value={year}
                      suffix={
                        <span className="text-xs italic opacity-70">Thn</span>
                      }
                    />
                    <Input
                      disabled
                      style={{ color: "black" }}
                      value={month}
                      suffix={
                        <span className="text-xs italic opacity-70">Bln</span>
                      }
                    />
                    <Input
                      disabled
                      style={{ color: "black" }}
                      value={day}
                      suffix={
                        <span className="text-xs italic opacity-70">Hr</span>
                      }
                    />
                  </div>
                </div>
              );
            })()}
          <FormInput
            data={{
              label: "Gaji Pensiun",
              type: "text",
              mode: "vertical",
              class: "flex-1",
              value: IDRFormat(data.Debitur.salary),
              onChange: (e: string) =>
                setData({
                  ...data,
                  Debitur: { ...data.Debitur, salary: IDRToNumber(e || "0") },
                }),
            }}
          />
          <FormInput
            data={{
              label: "Jenis Pembiayaan",
              type: "select",
              mode: "vertical",
              class: "flex-1",
              options: jenis.map((j) => ({ label: j.name, value: j.id })),
              value: data.jenisPembiayaanId,
              onChange: (e: string) => {
                const find = jenis.find((f) => f.id === e);
                if (find) {
                  setData({
                    ...data,
                    JenisPembiayaan: find,
                    c_mutasi: find.c_mutasi,
                    c_blokir: find.c_blokir,
                    jenisPembiayaanId: find.id,
                  });
                }
              },
            }}
          />
          <div className="w-full">
            <p>Produk Pembiayaan</p>
            <Select
              className="w-full"
              options={sumdanAv.map((j) => ({
                label: j.name,
                options: j.ProdukPembiayaans.map((p) => ({
                  label: `${p.name}`,
                  value: p.id,
                })),
              }))}
              value={data.produkPembiayaanId}
              onChange={(e: string) => {
                const find = sumdan
                  .flatMap((s) => s.ProdukPembiayaans)
                  .find((f) => f.id === e);
                if (find) {
                  const findSumdan = sumdan.find((s) => s.id === find.sumdanId);
                  if (findSumdan) {
                    setData({
                      ...data,
                      Sumdan: findSumdan as Sumdan,
                      ProdukPembiayaan: find,
                      produkPembiayaanId: find.id,
                      c_margin_sumdan: findSumdan.c_margin,
                      c_margin: find.c_margin,
                      c_adm_sumdan: findSumdan.c_adm_sumdan,
                      c_adm: findSumdan.c_adm,
                      c_provisi_sumdan: findSumdan.c_provisi_sumdan,
                      c_account_sumdan: findSumdan.c_account_sumdan,
                      c_gov: findSumdan.c_gov,
                      c_provisi: findSumdan.c_provisi,
                      c_stamp: findSumdan.c_stamps,
                      c_flagging: findSumdan.c_flagging,
                      c_infomation: findSumdan.c_information,
                      c_insurance: find.c_insurance,
                      rounded: findSumdan.rounded,
                      c_ned: findSumdan.c_ned,
                      fee_banpot: findSumdan.fee_banpot,
                    });
                  }
                }
              }}
              allowClear
            />
          </div>
          {hasAccess("deviasi") ? (
            <div className="w-full flex gap-2">
              <div className="flex-1">
                <div>Margin Sumdan</div>
                <div>
                  <Input
                    value={data.c_margin_sumdan || 0}
                    type="number"
                    onChange={(e) =>
                      setData({
                        ...data,
                        c_margin_sumdan: parseFloat(
                          e.target.value.toString() || "0",
                        ),
                      })
                    }
                    hidden={!hasAccess("deviasi")}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div>Margin Sumdan</div>
                <div>
                  <Input
                    value={data.c_margin || 0}
                    type="number"
                    onChange={(e) =>
                      setData({
                        ...data,
                        c_margin: parseFloat(e.target.value.toString() || "0"),
                      })
                    }
                    hidden={!hasAccess("deviasi")}
                  />
                </div>
              </div>
            </div>
          ) : (
            <FormInput
              data={{
                label: "Margin",
                type: "number",
                mode: "vertical",
                class: `flex-1`,
                value: data.c_margin + data.c_margin_sumdan,
                disabled: true,
                hidden: true,
              }}
            />
          )}
          <div className="w-full bg-gray-800 text-gray-50 p-2 rounded">
            Rekomendasi Pembiayaan
          </div>
          <div className="w-full flex gap-2">
            <div className="flex-1">
              <div>Tenor</div>
              <Input
                value={data.tenor || 0}
                type="number"
                onChange={(e) =>
                  setData({ ...data, tenor: Number(e.target.value || 0) })
                }
              />
            </div>
            <div className="flex-1">
              <div>Max Tenor</div>
              <Input value={data.max_tenor} type="number" disabled />
            </div>
          </div>
          <div className="w-full flex gap-2">
            <div className="flex-1">
              <div>Plafond</div>
              <Input
                value={IDRFormat(data.plafond || 0)}
                onChange={(e) =>
                  setData({
                    ...data,
                    plafond: IDRToNumber(e.target.value || "0"),
                  })
                }
              />
            </div>
            <div className="flex-1">
              <div>Max Plafond</div>
              <Input value={IDRFormat(data.max_plafond || 0)} disabled />
            </div>
          </div>
          <div className="flex-1 flex gap-2">
            <div className="flex-1">
              <div>Angsuran</div>
              <Input
                value={IDRFormat(details.detail.angsuranrounded || 0)}
                disabled
              />
            </div>
            <div className="flex-1">
              <div>Max Angsuran</div>
              <Input
                value={IDRFormat(
                  (data.Debitur.salary * data.Sumdan.dsr) / 100 || 0,
                )}
                disabled
              />
            </div>
          </div>
        </div>
      </Card>
      <Card
        loading={loading}
        style={{ flex: 1 }}
        styles={{
          title: { margin: 0, padding: 0 },
          body: { margin: 12, padding: 0 },
        }}
      >
        <div className="w-full bg-red-500 text-gray-50 p-2 rounded mb-1">
          Rincian Biaya
        </div>
        {hasAccess("deviasi") ? (
          <>
            <div className="flex gap-2 justify-between items-center py-1 border-b border-dashed flex-wrap">
              <div className="w-[150]">Admin Sumdan</div>
              <div className="flex-1 flex gap-2 justify-end">
                <Tooltip title="Administrasi">
                  <Input
                    size="small"
                    style={{ flex: 1, minWidth: 50 }}
                    value={data.c_adm_sumdan}
                    type={"number"}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        c_adm_sumdan: parseFloat(e.target.value || "0"),
                      }))
                    }
                  />
                </Tooltip>
                {/* <Tooltip title="Provisi">
                  <Input
                    size="small"
                    style={{ flex: 1, minWidth: 50 }}
                    value={data.c_provisi_sumdan}
                    type={"number"}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        c_provisi_sumdan: parseFloat(e.target.value || "0"),
                      }))
                    }
                  />
                </Tooltip> */}
                <Input
                  size="small"
                  disabled
                  value={IDRFormat(details.detail.adm_sumdan)}
                  style={{ textAlign: "right", color: "black", width: 130 }}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-between items-center py-1 border-b border-dashed flex-wrap">
              <div className="w-[150]">Buka Rekening</div>
              <div className="flex-1 flex gap-2 justify-end">
                <Input
                  size="small"
                  value={IDRFormat(data.c_account_sumdan)}
                  style={{ textAlign: "right", color: "black", width: 130 }}
                  onChange={(e) =>
                    setData({
                      ...data,
                      c_account_sumdan: IDRToNumber(e.target.value || "0"),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 justify-between items-center py-1 border-b border-dashed flex-wrap">
              <div className="w-[150]">Admin Koperasi</div>
              <div className="flex-1 flex gap-2 justify-end">
                <Tooltip title="Adm Kop">
                  <Input
                    size="small"
                    style={{ flex: 1, minWidth: 50 }}
                    value={data.c_adm}
                    type={"number"}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        c_adm: parseFloat(e.target.value || "0"),
                      }))
                    }
                  />
                </Tooltip>
                {/* <Tooltip title="Provisi Kop">
                  <Input
                    size="small"
                    style={{ flex: 1, minWidth: 50 }}
                    value={data.c_provisi}
                    type={"number"}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        c_provisi: parseFloat(e.target.value || "0"),
                      }))
                    }
                  />
                </Tooltip> */}
                <Input
                  size="small"
                  disabled
                  value={IDRFormat(details.detail.adm)}
                  style={{ textAlign: "right", color: "black", width: 130 }}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-between items-center py-1 border-b border-dashed flex-wrap">
              <div className="w-[150]">Asuransi</div>
              <div className="flex-1 flex gap-2 justify-end">
                <Input
                  size="small"
                  style={{ flex: 1, minWidth: 50 }}
                  value={data.c_insurance}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      c_insurance: parseFloat(e.target.value || "0"),
                    }))
                  }
                  type={"number"}
                />
                <Input
                  size="small"
                  disabled
                  value={IDRFormat(details.asuransi)}
                  style={{ textAlign: "right", color: "black", width: 130 }}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-between items-center py-1 border-b border-dashed flex-wrap">
              <div className="w-[150]">Tatalaksana</div>
              <div className="flex-1 flex gap-2 justify-end">
                <Input
                  size="small"
                  value={IDRFormat(data.c_gov)}
                  style={{ textAlign: "right", color: "black", width: 130 }}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      c_gov:
                        IDRToNumber(e.target.value || "0") > data.Sumdan.max_bpp
                          ? data.Sumdan.max_bpp
                          : IDRToNumber(e.target.value || "0"),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 justify-between items-center py-1 border-b border-dashed flex-wrap">
              <div className="w-[150]">Data Informasi</div>
              <div className="flex-1 flex gap-2 justify-end">
                <Input
                  size="small"
                  value={IDRFormat(data.c_infomation)}
                  style={{ textAlign: "right", color: "black", width: 130 }}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      c_infomation: IDRToNumber(e.target.value || "0"),
                    }))
                  }
                />
              </div>
            </div>
            {/* <div className="flex gap-2 justify-between items-center py-1 border-b border-dashed flex-wrap">
              <div className="w-[150]">Materai</div>
              <div className="flex-1 flex gap-2 justify-end">
                <Input
                  size="small"
                  value={IDRFormat(data.c_stamp)}
                  style={{ textAlign: "right", color: "black", width: 130 }}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      c_stamp: IDRToNumber(e.target.value || "0"),
                    }))
                  }
                />
              </div>
            </div> */}
            <div className="flex gap-2 justify-between items-center py-1 border-b border-dashed flex-wrap">
              <div className="w-[150]">Mutasi & Flagging</div>
              <div className="flex-1 flex gap-2 justify-end">
                <Input
                  size="small"
                  value={IDRFormat(data.c_mutasi)}
                  style={{ textAlign: "right", color: "black", width: 130 }}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      c_mutasi: IDRToNumber(e.target.value || "0"),
                    }))
                  }
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
              <div className="flex-1">Biaya Administrasi</div>
              <div className="flex gap-2 flex-2">
                <Input
                  size="small"
                  style={{ width: 80 }}
                  disabled
                  suffix={<span className="text-xs italic opacity-70">%</span>}
                  value={
                    data.c_adm + data.c_adm_sumdan
                    // data.c_provisi +
                    // data.c_provisi_sumdan
                  }
                  type={"number"}
                  // hidden={!hasAccess("showpercent")}
                  hidden={true}
                />
                <Input
                  size="small"
                  disabled
                  value={IDRFormat(details.administrasi)}
                  style={{ textAlign: "right", color: "black" }}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
              <div className="flex-1">Biaya Asuransi</div>
              <div className="flex gap-2 flex-2">
                <Input
                  size="small"
                  style={{ width: 80 }}
                  disabled={!hasAccess("update")}
                  suffix={<span className="text-xs italic opacity-70">%</span>}
                  value={data.c_insurance}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      c_insurance: Number(e.target.value || "0"),
                    }))
                  }
                  type={"number"}
                  hidden={!hasAccess("showpercent")}
                />
                <Input
                  size="small"
                  disabled
                  value={IDRFormat(details.asuransi)}
                  style={{ textAlign: "right", color: "black" }}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
              <div className="flex-1">Biaya Buka Rekening</div>
              <div className="flex gap-2 flex-2">
                <Input
                  size="small"
                  disabled={!hasAccess("update")}
                  value={IDRFormat(data.c_account_sumdan)}
                  style={{ textAlign: "right", color: "black" }}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      c_account_sumdan: IDRToNumber(e.target.value || "0"),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
              <div className="flex-1">Biaya Tatalaksana</div>
              <div className="flex gap-2 flex-2">
                <Input
                  size="small"
                  disabled={!hasAccess("update")}
                  value={IDRFormat(data.c_gov)}
                  style={{ textAlign: "right", color: "black" }}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      c_gov:
                        IDRToNumber(e.target.value || "0") > data.Sumdan.max_bpp
                          ? data.Sumdan.max_bpp
                          : IDRToNumber(e.target.value || "0"),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
              <div className="flex-1">Biaya Data Informasi</div>
              <div className="flex gap-2 flex-2">
                <Input
                  size="small"
                  disabled={!hasAccess("update")}
                  value={IDRFormat(data.c_infomation)}
                  style={{ textAlign: "right", color: "black" }}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      c_infomation: IDRToNumber(e.target.value || "0"),
                    }))
                  }
                />
              </div>
            </div>
            {/* <div
              className="flex gap-2 justify-between items-center my-1 border-b border-dashed"
              hidden
            >
              <div className="flex-1">Biaya Metarai</div>
              <div className="flex gap-2 flex-2">
                <Input
                  size="small"
                  disabled={!hasAccess("update")}
                  value={IDRFormat(data.c_stamp)}
                  style={{ textAlign: "right", color: "black" }}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      c_stamp: IDRToNumber(e.target.value || "0"),
                    }))
                  }
                />
              </div>
            </div> */}
            <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
              <div className="flex-1">Biaya Mutasi</div>
              <div className="flex gap-2 flex-2">
                <Input
                  size="small"
                  disabled={!hasAccess("update")}
                  value={IDRFormat(data.c_mutasi)}
                  style={{ textAlign: "right", color: "black" }}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      c_mutasi: IDRToNumber(e.target.value || "0"),
                    }))
                  }
                />
              </div>
            </div>
          </>
        )}
        <div className="flex gap-2 justify-between items-center my-1 font-bold text-red-500 border-t mt-2">
          <div className="flex-1">Total Biaya</div>
          <div className="text-right">{IDRFormat(details.biaya)}</div>
        </div>
        <div className="w-full bg-blue-800 text-gray-50 p-2 rounded mb-1">
          Rincian Pembiayaan
        </div>
        <div className="flex gap-2 justify-between items-center my-1 font-bold text-blue-500 border-b border-dashed">
          <div className="flex-1">Terima Kotor</div>
          <div className="text-right">{IDRFormat(details.tk)}</div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 text-red-500 border-b border-dashed">
          <div className="flex-1">Nominal Takeover</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              value={IDRFormat(data.c_takeover)}
              style={{ textAlign: "right", color: "black" }}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  c_takeover: IDRToNumber(e.target.value || "0"),
                }))
              }
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 border-b border-dashed">
          <div className="flex-1">Blokir Angsuran</div>
          <div className="flex gap-2 flex-2">
            <Input
              size="small"
              style={{ width: 100 }}
              suffix={<span className="text-xs italic opacity-70">x</span>}
              value={data.c_blokir}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  c_blokir: IDRToNumber(e.target.value || "0"),
                }))
              }
              type={"number"}
            />
            <Input
              size="small"
              disabled
              value={IDRFormat(data.c_blokir * details.angsuran || 0)}
              style={{ textAlign: "right", color: "black" }}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-between items-center my-1 font-bold text-green-500 border-t mt-2">
          <div className="flex-1">Terima Bersih</div>
          <div className="text-right">{IDRFormat(details.tb)}</div>
        </div>
        <Divider style={{ marginBottom: 5 }}>Informasi Tambahan</Divider>
        <div className="italic">
          <div className="flex justify-between border-b border-dashed">
            <div>Angsuran</div>
            <div>{IDRFormat(details.detail.angsuranrounded)}</div>
          </div>
          <div className="flex justify-between border-b border-dashed">
            <div>NED+Fee</div>
            <div>{IDRFormat(details.detail.fee_banpot + data.c_ned)}</div>
          </div>
          <div className="flex justify-between border-b border-dashed">
            <div>Total angsuran</div>
            <div>{IDRFormat(details.angsuran)}</div>
          </div>
          <div className="flex justify-between border-b border-dashed">
            <div>Sisa Gaji</div>
            <div>{IDRFormat(data.Debitur.salary - details.angsuran)}</div>
          </div>
          <div className="flex justify-between border-b border-dashed">
            <div>DBR (%)</div>
            <div>
              {(
                (details.detail.angsuranrounded / data.Debitur.salary) * 100 ||
                0
              ).toFixed(2)}{" "}
              % / {data.Sumdan.dsr} %
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-between">
          <Button
            danger
            icon={<HistoryOutlined />}
            onClick={() => setData(defaultData)}
          >
            Reset
          </Button>
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={() => setOpen(true)}
          >
            Cetak
          </Button>
        </div>
      </Card>
      <ModalDetailPembiayaan
        data={data}
        setOpen={setOpen}
        open={open}
        detail={details}
      />
    </div>
  );
}

const ModalDetailPembiayaan = ({
  data,
  open,
  setOpen,
  detail,
}: {
  data: IDapemSimulasi;
  open: boolean;
  setOpen: Function;
  detail: IOutputDapemDetail;
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (printRef.current === null) return;

    try {
      const dataUrl = await toPng(printRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `Analisa-${data.Debitur.fullname || "Pembiayaan"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mendownload gambar", err);
    }
  };
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={[]}
      width={1100}
      style={{ top: 10 }}
    >
      <div ref={printRef} style={{ padding: "10px", backgroundColor: "#fff" }}>
        <p className="font-bold text-lg mb-1">PERHITUNGAN PEMBIAYAAN</p>
        <div className="flex gap-2 flex-col sm:flex-row justify-between">
          <div className="flex-1">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item
                label="Tanggal Simulasi"
                style={{ padding: 5 }}
              >
                {moment(data.created_at).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Nomor Pensiun" style={{ padding: 5 }}>
                {data.nopen}
              </Descriptions.Item>
              <Descriptions.Item label="Nama Lengkap" style={{ padding: 5 }}>
                {data.Debitur.fullname}
              </Descriptions.Item>
              <Descriptions.Item label="Gaji Pensiun" style={{ padding: 5 }}>
                {IDRFormat(data.Debitur.salary)}
              </Descriptions.Item>
              <Descriptions.Item label="Tanggal Lahir" style={{ padding: 5 }}>
                {moment(data.Debitur.birthdate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Usia Pemohon" style={{ padding: 5 }}>
                {(() => {
                  const { year, month, day } = GetFullAge(
                    data.Debitur.birthdate,
                    data.created_at,
                  );
                  return `${year} Thn ${month} Bln ${day} Hr`;
                })()}
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div className="flex-1">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item
                label="Jenis Pembiayaan"
                style={{ padding: 5 }}
              >
                {data.JenisPembiayaan.name}
              </Descriptions.Item>
              <Descriptions.Item
                label="Produk Pembiayaan"
                style={{ padding: 5 }}
              >
                {data.ProdukPembiayaan.name} ({data.Sumdan.code})
              </Descriptions.Item>
              {/* <Descriptions.Item label="Margin" style={{ padding: 5 }}>
                {data.c_margin + data.c_margin_sumdan}%
              </Descriptions.Item> */}
              <Descriptions.Item label="Plafond" style={{ padding: 5 }}>
                {IDRFormat(data.plafond)}
              </Descriptions.Item>
              <Descriptions.Item label="Tenor" style={{ padding: 5 }}>
                {data.tenor}
              </Descriptions.Item>
              <Descriptions.Item
                label="Usia/Tanggal Lunas"
                style={{ fontSize: 12, padding: 5 }}
              >
                {(() => {
                  const { year, month, day } = GetFullAge(
                    data.Debitur.birthdate,
                    moment(data.created_at).add(data.tenor, "month").toDate(),
                  );
                  return `${year} Thn ${month} Bln ${day} Hr (${moment(data.created_at).add(data.tenor, "month").format("DD/MM/YYYY")})`;
                })()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row my-1 justify-between">
          <div className="flex-1">
            <div className="font-bold italic p-2 bg-red-600 text-gray-50 rounded my-2">
              Rincian Biaya
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between gap-2 border-b border-dashed">
                <span>Administrasi</span>
                <span>{IDRFormat(detail.administrasi)}</span>
              </div>
              <div className="flex justify-between gap-2 border-b border-dashed">
                <span>Asuransi</span>
                <span>{IDRFormat(detail.asuransi)}</span>
              </div>
              <div className="flex justify-between gap-2 border-b border-dashed">
                <span>Buka Rekening</span>
                <span>{IDRFormat(data.c_account_sumdan)}</span>
              </div>
              <div className="flex justify-between gap-2 border-b border-dashed">
                <span>Tatalaksana</span>
                <span>{IDRFormat(data.c_gov)}</span>
              </div>
              <div className="flex justify-between gap-2 border-b border-dashed">
                <span>Data Informasi</span>
                <span>{IDRFormat(data.c_infomation)}</span>
              </div>
              {/* <div className="flex justify-between gap-2 border-b border-dashed">
                <span>Materai</span>
                <span>{IDRFormat(data.c_stamp)}</span>
              </div> */}
              <div className="flex justify-between gap-2 border-b border-dashed">
                <span>Data Mutasi</span>
                <span>{IDRFormat(data.c_mutasi)}</span>
              </div>
              <div className="flex justify-between gap-2 font-bold text-red-500 border-t mt-2">
                <span>TOTAL BIAYA</span>
                <span>{IDRFormat(detail.biaya)}</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="italic mb-1 border-b rounded p-1">
              <div className="flex justify-between border-b border-dashed">
                <div>Angsuran</div>
                <div>{IDRFormat(detail.detail.angsuranrounded)}</div>
              </div>
              <div className="flex justify-between border-b border-dashed">
                <div>NED+Fee</div>
                <div>{IDRFormat(detail.detail.fee_banpot + data.c_ned)}</div>
              </div>
              <div className="flex justify-between border-b border-dashed">
                <div>Total Angsuran</div>
                <div>{IDRFormat(detail.angsuran)}</div>
              </div>
              <div className="flex justify-between border-b border-dashed">
                <div>Sisa Gaji</div>
                <div>{IDRFormat(data.Debitur.salary - detail.angsuran)}</div>
              </div>
              <div className="flex justify-between">
                <div>DBR (%)</div>
                <div>
                  {(
                    (detail.detail.angsuranrounded / data.Debitur.salary) *
                    100
                  ).toFixed(2)}
                  % / {data.Sumdan.dsr}%
                </div>
              </div>
            </div>
            <Descriptions
              bordered
              column={1}
              size="small"
              title="Analisa Akhir"
              styles={{ header: { marginBottom: 2 } }}
            >
              <Descriptions.Item label="Terima Kotor" style={{ padding: 5 }}>
                {IDRFormat(detail.tk)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Nominal Takeover"
                style={{ padding: 5 }}
              >
                {IDRFormat(data.c_takeover)}
              </Descriptions.Item>
              <Descriptions.Item
                label={`Blokir Angsuran ${data.c_blokir}X`}
                style={{ padding: 5 }}
              >
                {IDRFormat(data.c_blokir * detail.angsuran)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Terima Bersih"
                style={{ fontWeight: "bold", color: "green", padding: 5 }}
              >
                {IDRFormat(detail.tb)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handleDownloadImage}
        >
          Cetak
        </Button>
      </div>
    </Modal>
  );
};

interface IDapemSimulasi extends IDapem {
  Sumdan: Sumdan;
  angsuran_sumdan: number;
  max_plafond: number;
  max_tenor: number;
}
const defaultData: IDapemSimulasi = {
  nopen: "",
  Sumdan: { max_bpp: 3000000 } as Sumdan,
  Debitur: { birthdate: new Date(), salary: 0 } as Debitur,
  ProdukPembiayaan: {} as ProdukPembiayaan,
  JenisPembiayaan: {} as JenisPembiayaan,
  c_margin: 0,
  c_margin_sumdan: 0,
  c_adm_sumdan: 0,
  c_adm: 0,
  c_provisi: 0,
  c_insurance: 0,
  c_gov: 0,
  c_account_sumdan: 0,
  c_blokir: 0,
  c_mutasi: 0,
  c_stamp: 0,
  c_flagging: 0,
  c_infomation: 0,
  c_takeover: 0,
  max_plafond: 0,
  max_tenor: 0,
  c_fee_bpp: 0,
  c_ned: 0,
  fee_banpot: 0,
  margin_type: "ANUITAS",
  created_at: new Date(),
} as unknown as IDapemSimulasi;
