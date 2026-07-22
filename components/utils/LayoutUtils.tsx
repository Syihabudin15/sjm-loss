"use client";

import { Divider, Modal, Steps, StepsProps, Tabs } from "antd";
import Link from "next/link";
import moment from "moment";
import { IDapem, IViewFiles } from "@/libs/IInterfaces";
import { FormInput } from "..";
import { GetDetailDapem, GetFullAge, IDRFormat } from "./PembiayaanUtil";
import {
  DollarCircleOutlined,
  FolderOpenOutlined,
  KeyOutlined,
  LoadingOutlined,
  MoneyCollectOutlined,
  PayCircleOutlined,
  SecurityScanOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
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
  data,
  allowprogres,
}: {
  open: boolean;
  setOpen: Function;
  data: IDapem;
  allowprogres?: boolean;
}) => {
  const detail = GetDetailDapem(data);

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title={"Detail Data Pembiayaan " + data.id}
      footer={[]}
      width={1300}
      style={{ top: 10 }}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:h-[80vh]">
        <div className="w-full sm:w-[42%] min-h-[300] h-full overflow-auto">
          {/* <div className="bg-white p-4 rounded-lg border">
            <Descriptions
              title={
                <div>
                  <UserOutlined /> Data Debitur
                </div>
              }
              bordered
              size="small"
              column={1}
              labelStyle={{ width: 180 }}
            >
              <Descriptions.Item label="Nama Pemohon">
                {data.Debitur.fullname}
              </Descriptions.Item>
              <Descriptions.Item label="NIK">
                {data.Debitur.nik}
              </Descriptions.Item>
              <Descriptions.Item label="Tempat Tgl Lahir">
                {data.Debitur.birthplace},{" "}
                {dayjs(data.Debitur.birthdate).format("DD-MM-YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Telepon">
                {data.Debitur.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Alamat">
                {data.Debitur.address}
              </Descriptions.Item>
            </Descriptions>
          </div> */}
          <div className="p-2 rounded bg-gray-800 text-gray-50 font-bold my-2">
            Data Debitur
          </div>
          <div className="flex gap-2 flex-wrap">
            <FormInput
              data={{
                mode: "vertical",
                type: "text",
                class: "flex-1",
                label: "Nama Pemohon",
                disabled: true,
                value: data.Debitur.fullname,
              }}
            />
            <FormInput
              data={{
                label: "Nomor NIK",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.nik,
              }}
            />
            <FormInput
              data={{
                label: "Tempat, Tgl Lahir",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: `${data.Debitur.birthplace}, ${moment(data.Debitur.birthdate).format("DD-MM-YYYY")}`,
              }}
            />
            <FormInput
              data={{
                label: "Jenis Kelamin",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.gender,
              }}
            />
            <FormInput
              data={{
                label: "Agama",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.religion,
              }}
            />
            <FormInput
              data={{
                label: "Pendidikan Terakhir",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.education,
              }}
            />
            <FormInput
              data={{
                label: "Nomor Telepon",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.phone,
              }}
            />
            <FormInput
              data={{
                label: "Nomor NPWP",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.npwp,
              }}
            />
            <FormInput
              data={{
                label: "Ibu Kandung",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.mother_name,
              }}
            />
            <Divider style={{ fontSize: 12 }}>Alamat Lengkap</Divider>
            <FormInput
              data={{
                label: "Alamat",
                mode: "vertical",
                type: "textarea",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.address,
              }}
            />
            <FormInput
              data={{
                label: "Kelurahan",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.ward,
              }}
            />
            <FormInput
              data={{
                label: "Kecamatan",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.district,
              }}
            />
            <FormInput
              data={{
                label: "Kota/Kab.",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.city,
              }}
            />
            <FormInput
              data={{
                label: "Provinsi",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.province,
              }}
            />
            <FormInput
              data={{
                label: "Kode Pos",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.pos_code,
              }}
            />
            <div className="w-full flex justify-between italic font-bold">
              <span>Status Alamat Domisili</span> <span>:</span>{" "}
              <span>
                {data.dom_status ? "Sama Dengan KTP" : "Berbeda Dengan KTP"}
              </span>
            </div>
            {!data.dom_status && (
              <Divider style={{ fontSize: 12 }} titlePlacement="left">
                Alamat Domisili
              </Divider>
            )}
            {!data.dom_status && (
              <FormInput
                data={{
                  label: "Alamat",
                  mode: "vertical",
                  type: "textarea",
                  class: "flex-1",
                  disabled: true,
                  value: data.address,
                }}
              />
            )}
            {!data.dom_status && (
              <FormInput
                data={{
                  label: "Kelurahan",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: data.ward,
                }}
              />
            )}
            {!data.dom_status && (
              <FormInput
                data={{
                  label: "Kecamatan",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: data.district,
                }}
              />
            )}
            {!data.dom_status && (
              <FormInput
                data={{
                  label: "Kota/Kab.",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: data.city,
                }}
              />
            )}
            {!data.dom_status && (
              <FormInput
                data={{
                  label: "Provinsi",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: data.province,
                }}
              />
            )}
            {!data.dom_status && (
              <FormInput
                data={{
                  label: "Kode Pos",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: data.pos_code,
                }}
              />
            )}
            <FormInput
              data={{
                label: "Geo Location",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.geolocation,
              }}
            />
          </div>
          <div className="p-2 rounded bg-gray-800 text-gray-50 font-bold my-2">
            Data Rumah & Pekerjaan
          </div>
          <div className="flex gap-2 flex-wrap">
            <FormInput
              data={{
                label: "Status Rumah",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.house_status,
              }}
            />
            <FormInput
              data={{
                label: "Tahun Menempati",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.house_year,
              }}
            />
            <FormInput
              data={{
                label: "Lama Menempati",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: `${
                  new Date(data.created_at).getFullYear() -
                  new Date(
                    data.house_year ? `${data.house_year}-11-11` : new Date(),
                  ).getFullYear()
                } Tahun`,
              }}
            />
            <FormInput
              data={{
                label: "Pekerjaan",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.job,
              }}
            />
            <FormInput
              data={{
                label: "Alamat Pekerjaan",
                mode: "vertical",
                type: "textarea",
                class: "flex-1",
                disabled: true,
                value: data.job_address,
              }}
            />
            <FormInput
              data={{
                label: "Jenis Usaha",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.business,
              }}
            />
          </div>

          <div className="p-2 rounded bg-gray-800 text-gray-50 font-bold my-2">
            Data Keluarga
          </div>
          <div className="">
            <FormInput
              data={{
                label: "Status Perkawinan",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.marriage_status,
              }}
            />
            <Divider style={{ fontSize: 12 }}>Ahli Waris</Divider>
            <div className="flex gap-2 flex-wrap">
              <FormInput
                data={{
                  label: "Nama Lengkap",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: data.aw_name,
                }}
              />

              <FormInput
                data={{
                  label: "Nomor NIK",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: data.aw_nik,
                }}
              />
              <FormInput
                data={{
                  label: "Tempat Tgl Lahir",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: `${data.aw_birthplace}, ${moment(data.aw_birthdate).format("DD-MM-YYYY")}`,
                }}
              />
              <FormInput
                data={{
                  label: "Pekerjaan",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: `${data.aw_job}`,
                }}
              />
              <FormInput
                data={{
                  label: "Nomor Telepon",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: data.aw_phone,
                }}
              />
              <FormInput
                data={{
                  label: "Hubungan",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: data.aw_relate,
                }}
              />
              <FormInput
                data={{
                  label: "Alamat",
                  mode: "vertical",
                  type: "textarea",
                  class: "flex-1",
                  disabled: true,
                  value: `${data.aw_address}`,
                }}
              />
            </div>
            <Divider style={{ fontSize: 12 }}>Keluarga Tidak Serumah</Divider>
            <div className="flex gap-2 flex-wrap">
              <FormInput
                data={{
                  label: "Nama Lengkap",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: data.f_name,
                }}
              />
              <FormInput
                data={{
                  label: "Nomor Telepon",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: data.f_phone,
                }}
              />
              <FormInput
                data={{
                  label: "Hubungan",
                  mode: "vertical",
                  type: "text",
                  class: "flex-1",
                  disabled: true,
                  value: data.f_relate,
                }}
              />
              <FormInput
                data={{
                  label: "Alamat",
                  mode: "vertical",
                  type: "textarea",
                  class: "flex-1",
                  disabled: true,
                  value: data.f_address,
                }}
              />
            </div>
          </div>

          <div className="p-2 rounded bg-gray-800 text-gray-50 font-bold my-2">
            Data Pensiun
          </div>
          <div className="flex gap-2 flex-wrap">
            <FormInput
              data={{
                label: "Nama SKEP",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.name_skep,
              }}
            />
            <FormInput
              data={{
                label: "Nomor Pensiun",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.nopen,
              }}
            />
            <FormInput
              data={{
                label: "Nomor SKEP",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.no_skep,
              }}
            />
            <FormInput
              data={{
                label: "Tanggal SKEP",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: moment(data.Debitur.date_skep).format("DD-MM-YYYY"),
              }}
            />
            <FormInput
              data={{
                label: "TMT SKEP",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: moment(data.Debitur.tmt_skep).format("DD-MM-YYYY"),
              }}
            />
            <FormInput
              data={{
                label: "Penerbit SKEP",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.publisher_skep,
              }}
            />
            <FormInput
              data={{
                label: "Kode Jiwa",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.soul_code,
              }}
            />
            <FormInput
              data={{
                label: "Masa Kerja",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.job_year,
              }}
            />
            <FormInput
              data={{
                label: "Pangkat Pensiun",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.rank_skep,
              }}
            />
            <FormInput
              data={{
                label: "Kelompok Pensiun",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.group_skep,
              }}
            />
          </div>

          <div className="p-2 rounded bg-gray-800 text-gray-50 font-bold my-2">
            Data Pembiayaan
          </div>
          <div className="flex gap-2 flex-wrap">
            <FormInput
              data={{
                label: "Tanggal Permohonan",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: moment(data.created_at).format("DD-MM-YYYY"),
              }}
            />
            <FormInput
              data={{
                label: "Tanggal Lahir",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: moment(data.Debitur.birthdate).format("DD-MM-YYYY"),
              }}
            />
            <FormInput
              data={{
                label: "Usia Pemohon",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: (() => {
                  const { year, month, day } = GetFullAge(
                    data.Debitur.birthdate,
                    data.created_at,
                  );
                  return `${year} Thn ${month} Bln ${day} Hr`;
                })(),
              }}
            />
            <FormInput
              data={{
                label: "Gaji Pensiun",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: IDRFormat(data.Debitur.salary),
              }}
            />
            <FormInput
              data={{
                label: "Jenis Pembiayaan",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.JenisPembiayaan.name,
              }}
            />
            <FormInput
              data={{
                label: "Kantor Bayar",
                mode: "vertical",
                type: "textarea",
                class: "flex-1",
                disabled: true,
                value: `${data.PrevPayOffice.code} ${data.JenisPembiayaan.status_mutasi ? "-> " + (data.PayOffice.code || data.PayOffice.name) : ""}`,
              }}
            />
            <FormInput
              data={{
                label: "Produk Pembiayaan",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: `${data.ProdukPembiayaan.name} (${data.ProdukPembiayaan.Sumdan.code})`,
              }}
            />

            <FormInput
              data={{
                label: "Instansi Takeover",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: `${data.takeover_from || ""} (${data.takeover_date ? moment(data.takeover_date).format("DD/MM/YYYY") : ""})`,
              }}
            />
            <FormInput
              data={{
                label: "Nomor Rekening",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.account_number,
              }}
            />
            <FormInput
              data={{
                label: "Nama Bank",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.Debitur.account_name,
              }}
            />
            <div className="w-full">
              <Divider dashed style={{ fontSize: 12 }}>
                Permohonan Pembiayaan
              </Divider>
              <div className="my-1 flex">
                <div className="w-[40%]">Tenor</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {data.tenor} Bulan
                </div>
              </div>
              <div className="my-1 flex">
                <div className="w-[40%]">Plafond</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(data.plafond)}
                </div>
              </div>
              <div className="my-1 flex">
                <div className="w-[40%]">Margin</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {data.c_margin + data.c_margin_sumdan}% ({data.margin_type})
                </div>
              </div>
              <div className="my-1 flex italic text-xs text-blue-500 opacity-70">
                <div className="w-[40%]"></div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-xs text-right">
                  Mitra: {data.c_margin_sumdan}% |: Selisih {data.c_margin}%
                </div>
              </div>
              <div className="my-1 flex">
                <div className="w-[40%]">Pembulatan</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(data.rounded)}
                </div>
              </div>
              <div className="my-1 flex">
                <div className="w-[40%]">Angsuran</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(detail.angsuran)}
                </div>
              </div>
              <div className="my-1 flex">
                <div className="w-[40%]">Angsuran Mitra</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(detail.detail.angsuran_sumdan)}
                </div>
              </div>
              <div className="my-1 flex italic text-xs text-blue-500 opacity-70">
                <div className="w-[40%]"></div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-xs text-right">
                  Selisih{" "}
                  {IDRFormat(detail.angsuran - detail.detail.angsuran_sumdan)}
                </div>
              </div>
              <div className="my-1 flex">
                <div className="w-[40%]">Debt Service Ratio</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {(
                    (detail.detail.angsuranrounded / data.Debitur.salary) *
                    100
                  ).toFixed(2)}
                  % / {data.ProdukPembiayaan.Sumdan.dsr}%
                </div>
              </div>
            </div>

            <div className="w-full">
              <Divider dashed style={{ fontSize: 12 }}>
                Rincian Biaya
              </Divider>
              <div className="my-1 flex">
                <div className="w-[40%]">Adm Sumdan ({data.c_adm_sumdan}%)</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(detail.detail.adm_sumdan)}
                </div>
              </div>
              {/* <div className="my-1 flex">
                <div className="w-[40%]">
                  Provisi Sumdan ({data.c_provisi_sumdan}%)
                </div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(detail.detail.provisi_sumdan)}
                </div>
              </div> */}
              <div className="my-1 flex">
                <div className="w-[40%]">Buka Rekening</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(data.c_account_sumdan)}
                </div>
              </div>
              <div className="my-1 flex border-b border-dashed">
                <div className="w-[40%]">
                  Asuransi ({data.c_insurance}% + {IDRFormat(data.c_flagging)})
                </div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(detail.asuransi)}
                </div>
              </div>
              <div className="my-1 flex">
                <div className="w-[40%]">Adm Koperasi ({data.c_adm}%)</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(detail.detail.adm)}
                </div>
              </div>
              <div className="my-1 flex border-b border-dashed">
                <div className="w-[40%]">Tatalaksana</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(data.c_gov)}
                </div>
              </div>
              <div className="my-1 flex border-b border-dashed">
                <div className="w-[40%]">Data Informasi</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(data.c_infomation)}
                </div>
              </div>
              <div className="my-1 flex border-b border-dashed">
                <div className="w-[40%]">Mutasi & Flagging</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(data.c_mutasi)}
                </div>
              </div>
              <div className="my-1 flex border-b border-dashed text-red-500 font-bold mt-2">
                <div className="w-[40%]">Total Biaya</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(detail.biaya)}
                </div>
              </div>
              <div className="my-1 flex border-b border-dashed text-blue-500 font-bold mt-5">
                <div className="w-[40%]">Terima Kotor</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(detail.tk)}
                </div>
              </div>
              <div className="my-1 flex border-b border-dashed">
                <div className="w-[40%]">Nominal Takeover</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(data.c_takeover)}
                </div>
              </div>
              <div className="my-1 flex border-b border-dashed">
                <div className="w-[40%]">
                  Blokir Angsuran ({data.c_blokir}x)
                </div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(detail.angsuran * data.c_blokir)}
                </div>
              </div>
              <div className="my-1 flex border-b border-dashed text-green-500 font-bold">
                <div className="w-[40%]">Terima Bersih</div>
                <div className="w-[5%]">:</div>
                <div className="flex-1 justify-end text-right">
                  {IDRFormat(detail.tb)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 rounded bg-gray-800 text-gray-50 font-bold my-2">
            Data Account Officer & Agent Fronting
          </div>
          <Divider
            size="small"
            style={{ opacity: 50, fontSize: 12 }}
            titlePlacement="left"
          >
            Agent Fronting
          </Divider>
          <div className="flex gap-2 flex-wrap">
            <FormInput
              data={{
                label: "Agent Fronting",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.AgentFronting?.name,
              }}
            />
            <FormInput
              data={{
                label: "Penanggun Jawab",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.AgentFronting?.pic,
              }}
            />
          </div>
          <Divider
            size="small"
            style={{ opacity: 50, fontSize: 12 }}
            titlePlacement="left"
          >
            AO
          </Divider>
          <div className="flex gap-2 flex-wrap">
            <FormInput
              data={{
                label: "Nama Lengkap",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: `${data.AO?.fullname || ""} (${data.AO?.Cabang.name || ""})`,
              }}
            />
            <FormInput
              data={{
                label: "Nomor Telepon",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.AO?.phone,
              }}
            />
          </div>
          <Divider
            size="small"
            style={{ opacity: 50, fontSize: 12 }}
            titlePlacement="left"
          >
            AO Cabang
          </Divider>
          <div className="flex gap-2 flex-wrap">
            <FormInput
              data={{
                label: "Nama Lengkap",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: `${data.AOCabang?.fullname || ""} (${data.AOCabang?.Cabang.name || ""})`,
              }}
            />
            <FormInput
              data={{
                label: "Nomor Telepon",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.AOCabang?.phone,
              }}
            />
          </div>
          <Divider
            size="small"
            style={{ opacity: 50, fontSize: 12 }}
            titlePlacement="left"
          >
            AO Area
          </Divider>
          <div className="flex gap-2 flex-wrap">
            <FormInput
              data={{
                label: "Nama Lengkap",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: `${data.AOArea?.fullname || ""} (${data.AOArea?.Cabang.name || ""})`,
              }}
            />
            <FormInput
              data={{
                label: "Nomor Telepon",
                mode: "vertical",
                type: "text",
                class: "flex-1",
                disabled: true,
                value: data.AOArea?.phone,
              }}
            />
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
