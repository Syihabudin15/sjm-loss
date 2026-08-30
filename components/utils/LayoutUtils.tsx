"use client";

import { Descriptions, Modal, Steps, StepsProps, Tabs } from "antd";
import Link from "next/link";
import moment from "moment";
import { IDapem, IViewFiles } from "@/libs/IInterfaces";
import { GetDetailDapem, GetFullAge, IDRFormat } from "./PembiayaanUtil";
import {
  BranchesOutlined,
  CalculatorOutlined,
  DollarCircleOutlined,
  FolderOpenOutlined,
  KeyOutlined,
  LoadingOutlined,
  MoneyCollectOutlined,
  PayCircleOutlined,
  SecurityScanOutlined,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const MAUKStandar = dynamic(
  () =>
    import("@/components/pdfutils/etc/MAUKStandar").then((d) => d.MAUKStandar),
  { ssr: false, loading: () => <>Load...</> },
);

export const NotifItem = ({
  name,
  count,
  link,
}: {
  name: string;
  count: number;
  link: string;
}) => {
  return (
    <Link href={link}>
      <div className="border px-2 py-1 text-xs rounded flex justify-between gap-2 hover:bg-gray-200">
        <span className="text-gray-700">{name}</span>
        <span className="text-red-500">{count}</span>
      </div>
    </Link>
  );
};

export const ViewFiles = ({
  data,
  setOpen,
}: {
  data: IViewFiles;
  setOpen: Function;
}) => {
  const items = data.data.map((d, i) => ({
    key: d.url + i,
    label: d.name,
    children: (
      <div style={{ width: "100%", height: "76vh" }}>
        {d.url ? (
          <>
            {d.url.toLowerCase().endsWith(".pdf") ? (
              <iframe src={d.url} width="100%" height="100%" />
            ) : (
              <video
                src={d.url}
                controls
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <span className="text-gray-500 italic">
              Tidak ada berkas untuk ditampilkan.
            </span>
          </div>
        )}
      </div>
    ),
  }));

  return (
    <Modal
      open={data.open}
      onCancel={() => setOpen(false)}
      style={{ top: 10 }}
      width={1200}
      footer={[]}
    >
      <Tabs items={items} destroyOnHidden />
    </Modal>
  );
};

export const TabsFiles = ({
  data,
  allowprogres,
  dapem,
}: {
  data: IViewFiles;
  allowprogres?: boolean;
  dapem?: IDapem;
}) => {
  const items = data.data.map((d, i) => ({
    key: d.url + i,
    label: d.name,
    children: (
      <div style={{ width: "100%", height: "73vh" }}>
        {d.url ? (
          <>
            {d.url.toLowerCase().endsWith(".pdf") ? (
              <iframe src={d.url} width="100%" height="100%" />
            ) : (
              <video
                src={d.url}
                controls
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <span className="text-gray-500 italic">
              Tidak ada berkas untuk ditampilkan.
            </span>
          </div>
        )}
      </div>
    ),
  }));

  return (
    <Tabs
      items={[
        ...items,
        ...(dapem && dapem.geolocation
          ? [
              {
                key: "maps",
                label: "MAPS",
                children: (
                  <iframe
                    width="100%"
                    height="450"
                    src={`https://maps.google.com/maps?q=${dapem.geolocation.split(",")[0]},${dapem.geolocation.split(",")[1]}&z=15&output=embed`}
                  ></iframe>
                ),
              },
            ]
          : []),
        ...(dapem
          ? [
              {
                key: "mauk",
                label: "MAUK",
                children: (
                  <div className="w-full h-112.5">
                    <MAUKStandar data={dapem} />
                  </div>
                ),
              },
            ]
          : []),
        ...(allowprogres && dapem
          ? [
              {
                key: "progress",
                label: "PROGRESS",
                children: <ProgressDapem dapem={dapem} />,
              },
            ]
          : []),
      ]}
      destroyOnHidden
    />
  );
};

export const DetailDapem = ({
  open,
  setOpen,
  record,
  allowprogres,
}: {
  open: boolean;
  setOpen: Function;
  record: IDapem;
  allowprogres?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IDapem | undefined>();
  const detail = GetDetailDapem(record);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/dapem?id=" + record.id, {
        method: "PATCH",
      });
      const result = await res.json();
      setData(result.data);
      setLoading(false);
    })();
  }, []);

  return (
    <Modal
      open={open}
      onCancel={() => {
        setData(undefined);
        setOpen(false);
      }}
      title={"Detail Data Pembiayaan " + record.id}
      footer={[]}
      width={1300}
      style={{ top: 10 }}
      loading={loading}
      destroyOnHidden
    >
      {data ? (
        <div className="flex flex-col sm:flex-row gap-4 sm:h-[80vh]">
          <div className="w-full sm:w-[42%] min-h-[300] h-full overflow-auto">
            <div className="p-2 rounded-lg border">
              <Descriptions
                title={
                  <div>
                    <UserOutlined /> Data Debitur
                  </div>
                }
                bordered
                size="small"
                column={1}
                styles={{
                  label: { width: 180, fontSize: 13 },
                  content: { fontSize: 12 },
                }}
              >
                <Descriptions.Item label="Nama Pemohon">
                  {data.Debitur.fullname}
                </Descriptions.Item>
                <Descriptions.Item label="NIK">
                  {data.Debitur.nik}
                </Descriptions.Item>
                <Descriptions.Item label="Nopen">
                  {data.Debitur.nopen}
                </Descriptions.Item>
                <Descriptions.Item label="Tempat Tgl Lahir">
                  {data.Debitur.birthplace},{" "}
                  {moment(data.Debitur.birthdate).format("DD-MM-YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Jenis Kelamin">
                  {data.Debitur.gender}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat KTP">
                  {data.Debitur.address}, KELURAHAN {data.Debitur.ward},
                  KECAMATAN {data.Debitur.district}, {data.Debitur.city},{" "}
                  {data.Debitur.province} {data.Debitur.pos_code}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat Domisili">
                  {data.address || data.Debitur.address}, KELURAHAN{" "}
                  {data.ward || data.Debitur.ward}, KECAMATAN{" "}
                  {data.district || data.Debitur.district},{" "}
                  {data.city || data.Debitur.city},{" "}
                  {data.province || data.Debitur.province}{" "}
                  {data.pos_code || data.Debitur.pos_code}
                </Descriptions.Item>
                <Descriptions.Item label="Agama">
                  {data.Debitur.religion}
                </Descriptions.Item>
                <Descriptions.Item label="Status Kawin">
                  {data.marriage_status.replace("_", " ")}
                </Descriptions.Item>
                <Descriptions.Item label="Pekerjaan">
                  {data.job}
                </Descriptions.Item>
                <Descriptions.Item label="Pendidikan">
                  {data.Debitur.education}
                </Descriptions.Item>
                <Descriptions.Item label="Nama Ibu Kandung">
                  {data.Debitur.mother_name}
                </Descriptions.Item>
                <Descriptions.Item label="NPWP">
                  {data.Debitur.npwp}
                </Descriptions.Item>
                <Descriptions.Item label="Telepon">
                  {data.Debitur.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Geo Location">
                  {data.geolocation}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div className="p-2 rounded-lg border mt-2">
              <Descriptions
                title={
                  <div>
                    <TeamOutlined /> Data Rumah dan Keluarga
                  </div>
                }
                bordered
                size="small"
                column={1}
                styles={{
                  label: { width: 180, fontSize: 13 },
                  content: { fontSize: 12 },
                }}
              >
                <Descriptions.Item label="Status Rumah">
                  {data.house_status}
                </Descriptions.Item>
                <Descriptions.Item label="Lama Menempati">
                  {data.house_year} Tahun
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                title={
                  <div className="mt-4 text-center text-gray-500 border-b border-gray-400">
                    Ahliwaris
                  </div>
                }
                bordered
                size="small"
                column={1}
                styles={{
                  label: { width: 180, fontSize: 13 },
                  content: { fontSize: 12 },
                }}
              >
                <Descriptions.Item label="Nama Lengkap">
                  {data.aw_name}
                </Descriptions.Item>
                <Descriptions.Item label="NIK">{data.aw_nik}</Descriptions.Item>
                <Descriptions.Item label="Tempat, Tgl Lahir">
                  {data.aw_birthplace},{" "}
                  {moment(data.aw_birthdate).format("DD-MM-YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat">
                  {data.aw_address}, KELURAHAN {data.aw_ward}, KECAMATAN{" "}
                  {data.aw_district}, {data.aw_city}, {data.aw_province}{" "}
                  {data.aw_pos_code}
                </Descriptions.Item>
                <Descriptions.Item label="Pekerjaan">
                  {data.aw_job}
                </Descriptions.Item>
                <Descriptions.Item label="No Telepon">
                  {data.aw_phone}
                </Descriptions.Item>
                <Descriptions.Item label="Hubungan">
                  {data.aw_relate}
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                title={
                  <div className="mt-4 text-center text-gray-500 border-b border-gray-400">
                    Kontak Darurat
                  </div>
                }
                bordered
                size="small"
                column={1}
                styles={{
                  label: { width: 180, fontSize: 13 },
                  content: { fontSize: 12 },
                }}
              >
                <Descriptions.Item label="Nama Lengkap">
                  {data.f_name}
                </Descriptions.Item>
                <Descriptions.Item label="Alamat">
                  {data.f_address}, KELURAHAN {data.f_ward}, KECAMATAN{" "}
                  {data.f_district}, {data.f_city}, {data.f_province}{" "}
                  {data.f_pos_code}
                </Descriptions.Item>
                <Descriptions.Item label="No Telepon">
                  {data.f_phone}
                </Descriptions.Item>
                <Descriptions.Item label="Hubungan">
                  {data.f_relate}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div className="p-2 rounded-lg border mt-2">
              <Descriptions
                title={
                  <div>
                    <SecurityScanOutlined /> Data Pensiun
                  </div>
                }
                bordered
                size="small"
                column={1}
                styles={{
                  label: { width: 180, fontSize: 13 },
                  content: { fontSize: 12 },
                }}
              >
                <Descriptions.Item label="Kelompok Pensiun">
                  {data.Debitur.group_skep}
                </Descriptions.Item>
                <Descriptions.Item label="Nomor Pensiun">
                  {data.nopen}
                </Descriptions.Item>
                <Descriptions.Item label="Nama SKEP">
                  {data.Debitur.name_skep}
                </Descriptions.Item>
                <Descriptions.Item label="Nomor SKEP">
                  {data.Debitur.no_skep}
                </Descriptions.Item>
                <Descriptions.Item label="Kode Jiwa">
                  {data.Debitur.soul_code}
                </Descriptions.Item>
                <Descriptions.Item label="Masa Kerja">
                  {data.Debitur.job_year}
                </Descriptions.Item>
                <Descriptions.Item label="Pangkat">
                  {data.Debitur.rank_skep}
                </Descriptions.Item>
                <Descriptions.Item label="Tanggal SKEP">
                  {moment(data.Debitur.date_skep).format("DD-MM-YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="TMT Pensiun">
                  {moment(data.Debitur.tmt_skep).format("DD-MM-YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Penerbit SKEP">
                  {data.Debitur.publisher_skep}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div className="p-2 rounded-lg border mt-2">
              <Descriptions
                title={
                  <div>
                    <BranchesOutlined /> Data AO & Agent
                  </div>
                }
                bordered
                size="small"
                column={1}
                styles={{
                  label: { width: 180, fontSize: 13 },
                  content: { fontSize: 12 },
                }}
              >
                <Descriptions.Item label="Agent Fronting">
                  {data.AgentFronting && data.AgentFronting.code}{" "}
                  {data.AgentFronting && `(${data.AgentFronting.pic})`}
                </Descriptions.Item>
                <Descriptions.Item label="AO">
                  {data.AO?.fullname} ({data.AO?.phone})
                </Descriptions.Item>
                <Descriptions.Item label="SPV">
                  {data.AOCabang?.fullname} ({data.AOCabang?.phone})
                </Descriptions.Item>
                <Descriptions.Item label="Area">
                  {data.AOArea?.fullname} ({data.AOArea?.phone})
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div className="p-2 rounded-lg border mt-2">
              <Descriptions
                title={
                  <div>
                    <CalculatorOutlined /> Data Pembiayaan
                  </div>
                }
                bordered
                size="small"
                column={1}
                styles={{
                  label: { width: 180, fontSize: 13 },
                  content: { fontSize: 12 },
                }}
              >
                <Descriptions.Item label="Tanggal Permohonan">
                  {moment(data.created_at).format("DD-MM-YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Usia Pengajuan">
                  {(() => {
                    const { year, month, day } = GetFullAge(
                      data.Debitur.birthdate,
                      data.created_at,
                    );
                    return `${year} Thn ${month} Bln ${day} Hr`;
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label="Gaji/Pendapatan">
                  {IDRFormat(data.salary || data.Debitur.salary)}
                </Descriptions.Item>
                <Descriptions.Item label="Plafond Pinjaman">
                  {IDRFormat(data.plafond)}
                </Descriptions.Item>
                <Descriptions.Item label="Jangka Waktu">
                  {data.tenor} Bulan
                </Descriptions.Item>
                <Descriptions.Item label="Suku Bunga">
                  <div className="flex justify-between">
                    <span>
                      {(data.c_margin + data.c_margin_sumdan).toFixed(2)}%/Tahun
                    </span>{" "}
                    <span className="text-gray-400" style={{ fontSize: 10 }}>
                      ({data.c_margin_sumdan.toFixed(2)}% +{" "}
                      {data.c_margin.toFixed(2)}%)
                    </span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Angsuran">
                  <div className="flex justify-between">
                    <span>{IDRFormat(detail.detail.angsuran)}</span>{" "}
                    <span className="text-gray-400" style={{ fontSize: 10 }}>
                      ({IDRFormat(detail.detail.angsuran_sumdan)} +{" "}
                      {IDRFormat(detail.angsuran - detail.detail.angsuran)})
                    </span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="NED + Fee Tagihan">
                  <div className="flex justify-between">
                    <span>
                      {IDRFormat(data.c_ned + detail.detail.fee_banpot)}
                    </span>{" "}
                    <span className="text-gray-400" style={{ fontSize: 10 }}>
                      ({IDRFormat(data.c_ned)} +{" "}
                      {IDRFormat(detail.detail.fee_banpot)})
                    </span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Total Angsuran">
                  {IDRFormat(detail.angsuran)}
                </Descriptions.Item>
                <Descriptions.Item label="Sisa Gaji">
                  <div className="flex justify-between">
                    <span>
                      {IDRFormat(
                        (data.salary || data.Debitur.salary) - detail.angsuran,
                      )}
                    </span>{" "}
                    <span className="text-gray-400" style={{ fontSize: 10 }}>
                      ( A
                      {(
                        (detail.detail.angsuran /
                          (data.salary || data.Debitur.salary)) *
                        100
                      ).toFixed(2)}
                      % / B
                      {(
                        (detail.angsuran /
                          (data.salary || data.Debitur.salary)) *
                        100
                      ).toFixed(2)}
                      % )
                    </span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Produk Pembiayaan">
                  {data.ProdukPembiayaan.name} (
                  {data.ProdukPembiayaan.Sumdan.code})
                </Descriptions.Item>
                <Descriptions.Item label="Jenis Pembiayaan">
                  {data.JenisPembiayaan.name}
                </Descriptions.Item>
                <Descriptions.Item label="Kantor Bayar">
                  {data.PrevPayOffice.code}{" "}
                  {data.JenisPembiayaan.status_mutasi && (
                    <>
                      <SwapOutlined /> {data.PayOffice.code}
                    </>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Takeover">
                  {data.takeover_from ? (
                    <>
                      {data.takeover_from}{" "}
                      <span style={{ fontSize: 10 }} className="text-gray-400">
                        (
                        {data.takeover_date
                          ? moment(data.takeover_date).format("DD/MM/YYYY")
                          : ""}
                        )
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Rekening">
                  {data.Debitur.account_number} ({data.Debitur.account_name})
                </Descriptions.Item>
              </Descriptions>

              <p className="mt-4 mx-2 font-bold">Rincian Biaya</p>
              <div className="p-2 flex flex-col gap-2">
                <div className="flex justify-between border-b border-gray-400 border-dashed">
                  <div className="w-48">
                    Adm Sumdan{" "}
                    <span className="text-gray-400" style={{ fontSize: 10 }}>
                      ({data.c_adm_sumdan.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="flex-1 text-right">
                    {IDRFormat(detail.detail.adm_sumdan)}
                  </div>
                </div>
                <div className="flex justify-between border-b border-gray-400 border-dashed">
                  <div className="w-48">Buka Rekening</div>
                  <div className="flex-1 text-right">
                    {IDRFormat(data.c_account_sumdan)}
                  </div>
                </div>
                <div className="flex justify-between border-b border-gray-400 border-dashed">
                  <div className="w-48">
                    Adm Koperasi{" "}
                    <span className="text-gray-400" style={{ fontSize: 10 }}>
                      ({data.c_adm.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="flex-1 text-right">
                    {IDRFormat(detail.detail.adm)}
                  </div>
                </div>
                <div className="flex justify-between border-b border-gray-400 border-dashed">
                  <div className="w-48">
                    Asuransi{" "}
                    <span className="text-gray-400" style={{ fontSize: 10 }}>
                      ({data.c_insurance.toFixed(2)}% +{" "}
                      {IDRFormat(data.c_flagging)})
                    </span>
                  </div>
                  <div className="flex-1 text-right">
                    {IDRFormat(detail.asuransi)}
                  </div>
                </div>
                <div className="flex justify-between border-b border-gray-400 border-dashed">
                  <div className="w-48">Tatalaksana</div>
                  <div className="flex-1 text-right">
                    {IDRFormat(data.c_gov)}
                  </div>
                </div>
                <div className="flex justify-between border-b border-gray-400 border-dashed">
                  <div className="w-48">Data Informasi</div>
                  <div className="flex-1 text-right">
                    {IDRFormat(data.c_infomation)}
                  </div>
                </div>
                <div className="flex justify-between border-b border-gray-400 border-dashed">
                  <div className="w-48">Mutasi & Flagging</div>
                  <div className="flex-1 text-right">
                    {IDRFormat(data.c_mutasi)}
                  </div>
                </div>
                <div className="flex justify-between  text-red-400 font-bold">
                  <div className="w-48">Total Biaya</div>
                  <div className="flex-1 text-right">
                    {IDRFormat(detail.biaya)}
                  </div>
                </div>
                <div className="flex justify-between  text-blue-400 font-bold">
                  <div className="w-48">Terima Kotor</div>
                  <div className="flex-1 text-right">
                    {IDRFormat(detail.tk)}
                  </div>
                </div>
              </div>

              <div className="p-2 flex flex-col gap-2 mt-2">
                <div className="flex justify-between border-b border-gray-400 border-dashed">
                  <div className="w-48">Nominal Takeover</div>
                  <div className="flex-1 text-right">
                    {IDRFormat(data.c_takeover)}
                  </div>
                </div>
                <div className="flex justify-between border-b border-gray-400 border-dashed">
                  <div className="w-48">
                    Blokir Angsuran{" "}
                    <span className="text-gray-400" style={{ fontSize: 10 }}>
                      ({data.c_blokir}x)
                    </span>
                  </div>
                  <div className="flex-1 text-right">
                    {IDRFormat(detail.angsuran * data.c_blokir)}
                  </div>
                </div>
                <div className="flex justify-between border-b border-gray-400 border-dashed text-green-400 font-bold">
                  <div className="w-48">Terima Bersih</div>
                  <div className="flex-1 text-right">
                    {IDRFormat(detail.tb)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <TabsFiles
              data={{
                open: true,
                data: [
                  { name: "SLIK", url: data.file_slik || "" },
                  { name: "PENGAJUAN", url: data.file_submission || "" },
                  { name: "WAWANCARA", url: data.video_interview || "" },
                  { name: "ASURANSI", url: data.video_insurance || "" },
                  { name: "AKAD", url: data.file_contract || "" },
                  // { name: "VIDEO AKAD", url: data.video_contract || "" },
                  { name: "BANK", url: data.file_proses || "" },
                ],
              }}
              allowprogres={allowprogres}
              dapem={data}
            />
          </div>
        </div>
      ) : (
        <div>
          Mengambil data ...
          <LoadingOutlined />
        </div>
      )}
    </Modal>
  );
};

const ProgressDapem = ({ dapem }: { dapem: IDapem }) => {
  const items: StepsProps["items"] = [
    {
      title: (
        <div>
          Dropping{" "}
          {["PENDING", "PROSES"].includes(dapem.dropping_status) && (
            <LoadingOutlined />
          )}
        </div>
      ),
      icon: <DollarCircleOutlined />,
      content: `Status Data Pembiayaan ${dapem.id} ${dapem.dropping_status}`,
      status: ["DISETUJUI", "LUNAS"].includes(dapem.dropping_status)
        ? "finish"
        : ["DITOLAK", "BATAL"].includes(dapem.dropping_status)
          ? "error"
          : dapem.dropping_status === "DRAFT"
            ? "wait"
            : "process",
    },
    {
      title: (
        <div>
          Takeover{" "}
          {["PENDING", "PROSES"].includes(dapem.takeover_status) && (
            <LoadingOutlined />
          )}
        </div>
      ),
      icon: <PayCircleOutlined />,
      content: `Status Takeover Data Pembiayaan ${dapem.id} ${dapem.takeover_status}`,
      status: ["DISETUJUI", "LUNAS"].includes(dapem.takeover_status)
        ? "finish"
        : ["DITOLAK", "BATAL"].includes(dapem.takeover_status)
          ? "error"
          : dapem.takeover_status === "DRAFT"
            ? "wait"
            : "process",
    },
    {
      title: (
        <div>
          Mutasi{" "}
          {["PENDING", "PROSES"].includes(dapem.mutasi_status) && (
            <LoadingOutlined />
          )}
        </div>
      ),
      icon: <SwapOutlined />,
      content: `Status Mutasi Data Pembiayaan ${dapem.id} ${dapem.mutasi_status}`,
      status: ["DISETUJUI", "LUNAS"].includes(dapem.mutasi_status)
        ? "finish"
        : ["DITOLAK", "BATAL"].includes(dapem.mutasi_status)
          ? "error"
          : dapem.mutasi_status === "DRAFT"
            ? "wait"
            : "process",
    },
    {
      title: (
        <div>
          Flagging{" "}
          {["PENDING", "PROSES"].includes(dapem.flagging_status) && (
            <LoadingOutlined />
          )}
        </div>
      ),
      icon: <KeyOutlined />,
      content: `Status Flagging Data Pembiayaan ${dapem.id} ${dapem.flagging_status}`,
      status: ["DISETUJUI", "LUNAS"].includes(dapem.flagging_status)
        ? "finish"
        : ["DITOLAK", "BATAL"].includes(dapem.flagging_status)
          ? "error"
          : dapem.flagging_status === "DRAFT"
            ? "wait"
            : "process",
    },
    {
      title: (
        <div>
          Terima Bersih{" "}
          {["PENDING", "PROSES"].includes(dapem.cash_status) && (
            <LoadingOutlined />
          )}
        </div>
      ),
      icon: <MoneyCollectOutlined />,
      content: `Status Terima Bersih Data Pembiayaan ${dapem.id} ${dapem.cash_status}`,
      status: ["DISETUJUI", "LUNAS"].includes(dapem.cash_status)
        ? "finish"
        : ["DITOLAK", "BATAL"].includes(dapem.cash_status)
          ? "error"
          : dapem.cash_status === "DRAFT"
            ? "wait"
            : "process",
    },
    {
      title: (
        <div>
          Penyerahan Berkas{" "}
          {["DELIVERY"].includes(dapem.document_status) && <LoadingOutlined />}
        </div>
      ),
      icon: <FolderOpenOutlined />,
      content: `Status Penyerahan Berkas Data Pembiayaan ${dapem.id} ${dapem.document_status}`,
      status:
        dapem.document_status === "MITRA"
          ? "finish"
          : dapem.document_status === "DELIVERY"
            ? "process"
            : "wait",
    },
    {
      title: (
        <div>
          Penyerahan Jaminan{" "}
          {["DELIVERY"].includes(dapem.guarantee_status) && <LoadingOutlined />}
        </div>
      ),
      icon: <SecurityScanOutlined />,
      content: `Status Penyerahan Jaminan Data Pembiayaan ${dapem.id} ${dapem.guarantee_status} | TBO ${moment(dapem.date_contract).add(dapem.tbo, "month").format("DD/MM/YYYY")}`,
      status:
        dapem.guarantee_status === "MITRA"
          ? "finish"
          : dapem.guarantee_status === "DELIVERY"
            ? "process"
            : "wait",
    },
  ];
  return <Steps items={items} size="small" orientation="vertical" />;
};
