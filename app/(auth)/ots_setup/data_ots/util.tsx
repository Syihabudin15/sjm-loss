"use client";

import { GetFullAge, IDRFormat } from "@/components/utils/PembiayaanUtil";
import { IOTSDefault, IOTSDetail } from "@/libs/IInterfaces";
import { calculateOtsSimulation } from "@/libs/OtsSimulation";
import { Alert, Button, Descriptions, Modal } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import moment from "moment";
import { useRef } from "react";

export const SimulasiAutomation = ({
  open,
  setOpen,
  record,
  appData,
}: {
  open: boolean;
  setOpen: Function;
  record: IOTSDetail;
  appData: IOTSDefault;
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const jenis = appData.JenisPembiayaan;
  const simulationDate = record.OTSData.get_date;
  const configuredProduct = appData.ProdukPembiayaan;
  const sumdan = appData.Sumdan;
  const {
    age,
    product,
    maxTenor,
    plafond,
    calculation,
  } = calculateOtsSimulation({
    birthdate: record.Debitur.birthdate,
    simulationDate,
    salary: record.Debitur.salary,
    sumdan: appData.Sumdan,
    jenis,
    configuredProduct,
  });

  const handleDownloadImage = async () => {
    if (!printRef.current) return;

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(printRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      const safeName = record.Debitur.fullname.replace(/[<>:"/\\|?*]+/g, "-");
      link.download = `Analisa-${safeName || "Pembiayaan"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Gagal mendownload gambar simulasi otomatis", error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen({ record: undefined, open: false })}
      footer={null}
      destroyOnHidden
      style={{ top: 20 }}
      width={1100}
    >
      {!calculation ? (
        <Alert
          type="warning"
          showIcon
          message={
            product
              ? "Simulasi otomatis belum dapat dihitung."
              : "Produk sesuai usia belum tersedia."
          }
          description={
            product
              ? "Pastikan jenis pembiayaan tersedia dan usia debitur masih memenuhi tenor maksimum."
              : `Tidak ada produk aktif pada Sumdan ${appData.Sumdan?.name || ""} dengan rentang usia yang mencakup ${age.year} tahun. Periksa produk dan rentang usianya pada master Sumdan.`
          }
        />
      ) : (
        <>
          {configuredProduct?.id !== product.id && (
            <Alert
              className="mb-3"
              type="info"
              showIcon
              message={`Produk ${product.name} dipilih otomatis`}
              description={`Produk pada Sumdan ${sumdan?.name} sesuai rentang usia ${product.min_age}-${product.max_age} tahun.`}
            />
          )}
          <div ref={printRef} style={{ padding: 10, backgroundColor: "#fff" }}>
            <p className="font-bold text-lg mb-1">PERHITUNGAN PEMBIAYAAN</p>
            <div className="flex gap-2 flex-col sm:flex-row justify-between">
              <div className="flex-1">
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item
                    label="Tanggal Simulasi"
                    style={{ padding: 5 }}
                  >
                    {moment(simulationDate).format("DD/MM/YYYY")}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Nomor Pensiun"
                    style={{ padding: 5 }}
                  >
                    {record.Debitur.nopen}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Nama Lengkap"
                    style={{ padding: 5 }}
                  >
                    {record.Debitur.fullname}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Gaji Pensiun"
                    style={{ padding: 5 }}
                  >
                    {IDRFormat(record.Debitur.salary)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Tanggal Lahir"
                    style={{ padding: 5 }}
                  >
                    {moment(record.Debitur.birthdate).format("DD/MM/YYYY")}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Usia Pemohon"
                    style={{ padding: 5 }}
                  >
                    {`${age.year} Thn ${age.month} Bln ${age.day} Hr`}
                  </Descriptions.Item>
                </Descriptions>
              </div>
              <div className="flex-1">
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item
                    label="Jenis Pembiayaan"
                    style={{ padding: 5 }}
                  >
                    {jenis.name}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Produk Pembiayaan"
                    style={{ padding: 5 }}
                  >
                    {product.name} ({sumdan.code})
                  </Descriptions.Item>
                  <Descriptions.Item label="Plafond" style={{ padding: 5 }}>
                    {IDRFormat(plafond)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tenor" style={{ padding: 5 }}>
                    {maxTenor} Bulan
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Usia/Tanggal Lunas"
                    style={{ padding: 5 }}
                  >
                    {(() => {
                      const payoffDate = moment(simulationDate).add(
                        maxTenor,
                        "month",
                      );
                      const payoffAge = GetFullAge(
                        record.Debitur.birthdate,
                        payoffDate.toDate(),
                      );
                      return `${payoffAge.year} Thn ${payoffAge.month} Bln ${payoffAge.day} Hr (${payoffDate.format("DD/MM/YYYY")})`;
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
                    <span>
                      {IDRFormat(
                        calculation.administrasi +
                          calculation.detail.provisi_sumdan,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 border-b border-dashed">
                    <span>Asuransi</span>
                    <span>{IDRFormat(calculation.asuransi)}</span>
                  </div>
                  <div className="flex justify-between gap-2 border-b border-dashed">
                    <span>Buka Rekening</span>
                    <span>{IDRFormat(sumdan.c_account_sumdan)}</span>
                  </div>
                  <div className="flex justify-between gap-2 border-b border-dashed">
                    <span>Tatalaksana</span>
                    <span>{IDRFormat(sumdan.c_gov)}</span>
                  </div>
                  <div className="flex justify-between gap-2 border-b border-dashed">
                    <span>Data Informasi</span>
                    <span>{IDRFormat(sumdan.c_information)}</span>
                  </div>
                  <div className="flex justify-between gap-2 border-b border-dashed">
                    <span>Mutasi &amp; Flagging</span>
                    <span>{IDRFormat(jenis.c_mutasi)}</span>
                  </div>
                  <div className="flex justify-between gap-2 font-bold text-red-500 border-t mt-2">
                    <span>TOTAL BIAYA</span>
                    <span>{IDRFormat(calculation.biaya)}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="italic mb-1 border-b rounded p-1">
                  <div className="flex justify-between border-b border-dashed">
                    <div>Angsuran</div>
                    <div>{IDRFormat(calculation.detail.angsuranrounded)}</div>
                  </div>
                  <div className="flex justify-between border-b border-dashed">
                    <div>NED+Fee</div>
                    <div>
                      {IDRFormat(calculation.detail.fee_banpot + sumdan.c_ned)}
                    </div>
                  </div>
                  <div className="flex justify-between border-b border-dashed">
                    <div>Total Angsuran</div>
                    <div>{IDRFormat(calculation.angsuran)}</div>
                  </div>
                  <div className="flex justify-between border-b border-dashed">
                    <div>Sisa Gaji</div>
                    <div>
                      {IDRFormat(record.Debitur.salary - calculation.angsuran)}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>DBR (%)</div>
                    <div>
                      {(
                        (calculation.detail.angsuranrounded /
                          record.Debitur.salary) *
                          100 || 0
                      ).toFixed(2)}
                      % / {sumdan.dsr}%
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
                  <Descriptions.Item
                    label="Terima Kotor"
                    style={{ padding: 5 }}
                  >
                    {IDRFormat(calculation.tk)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Nominal Takeover"
                    style={{ padding: 5 }}
                  >
                    {IDRFormat(0)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={`Blokir Angsuran ${jenis.c_blokir}X`}
                    style={{ padding: 5 }}
                  >
                    {IDRFormat(jenis.c_blokir * calculation.angsuran)}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label="Terima Bersih"
                    style={{ fontWeight: "bold", color: "green", padding: 5 }}
                  >
                    {IDRFormat(calculation.tb)}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={handleDownloadImage}
            >
              Cetak
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
