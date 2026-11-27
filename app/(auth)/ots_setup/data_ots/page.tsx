"use client";

import { FormInput } from "@/components";
import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { defaultApp, IOTSDefault, IOTSDetail } from "@/libs/IInterfaces";
import {
  CalculatorOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { App, Button, Modal, Popover, Table, Tabs, Tag } from "antd";
import { HookAPI } from "antd/lib/modal/useModal";
import { TableProps } from "antd/lib/table";
import { CalendarArrowDown, CalendarArrowUp } from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { SimulasiAutomation } from "./util";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [datastatus, setDataStatus] = useState<string | null>(null);
  const [data, setData] = useState<IOTSDetail[]>([]);
  const [app, setApp] = useState<IOTSDefault>(defaultApp);
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

  const columns: TableProps<IOTSDetail>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (value, record, index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "Nama Lengkap",
      dataIndex: "fullname",
      key: "fullname",
      render: (_, record) => (
        <div>
          <div>{record.Debitur.fullname}</div>
          <div className="opacity-70 ">@{record.debiturNopen}</div>
        </div>
      ),
    },
    {
      title: "Info",
      dataIndex: "salary",
      key: "salary",
      render: (_, record) => (
        <div>
          <div>
            <DollarCircleOutlined /> {IDRFormat(record.Debitur.salary)}
          </div>
          <div className="opacity-70">
            Tgl Lunas {moment(record.Debitur.end_date).format("MM/YYYY")}
          </div>
        </div>
      ),
    },
    {
      title: "Status Proses",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <div className="flex justify-center">
          <Tag
            variant="solid"
            color={
              record.ots_status === "PENDING"
                ? "orange"
                : record.ots_status === "AKTIF"
                  ? "green"
                  : "blue"
            }
          >
            {record.ots_status}
          </Tag>
        </div>
      ),
    },
    {
      title: "Waktu",
      dataIndex: "time",
      key: "time",
      render: (_, record) => (
        <div className="opacity-80">
          <div className="flex gap-2">
            <CalendarArrowUp size={12} />{" "}
            {moment(record.OTSData.get_date).format("DD/MM/YYYY")}
          </div>
          <div className="flex gap-2 text-red-500">
            <CalendarArrowDown size={12} />{" "}
            {moment(record.OTSData.reset_date).format("DD/MM/YYYY")}
          </div>
        </div>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      hidden: datastatus !== null,
      width: 100,
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="small"
            icon={<CalculatorOutlined />}
            onClick={() => setOpenSimulasi({ record: record, open: true })}
          ></Button>
          {record.ots_status === "PENDING" && (
            <Popover
              title="Konfirmasi proses data ini?"
              trigger="click"
              placement="left"
              content={
                <div className="flex gap-3 justify-end">
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleUpdate(record.id, "PROSES")}
                  >
                    Proses
                  </Button>
                </div>
              }
            >
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
              ></Button>
            </Popover>
          )}
          {record.ots_status === "PENDING" && (
            <Popover
              title="Konfirmasi hapus data ini?"
              trigger="click"
              placement="left"
              content={
                <div className="flex gap-3 justify-end">
                  <Button
                    size="small"
                    danger
                    onClick={() => handleUpdate(record.id, "HAPUS")}
                  >
                    Hapus
                  </Button>
                </div>
              }
            >
              <Button size="small" danger icon={<DeleteOutlined />}></Button>
            </Popover>
          )}
        </div>
      ),
    },
  ];
  return (
    <div className="p-2">
      <div className="flex gap-2 text-xl px-2 justify-between items-center">
        <div>
          <UserOutlined /> <span>Data OTS</span>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setOpenGetData(true)}
          >
            Tarik Data
          </Button>
          <div className="text-center text-xs opacity-80">
            {data.length}/{app.pagesize}
          </div>
        </div>
      </div>

      <div>
        <Tabs
          items={[
            {
              key: "daily-avtivity",
              label: "Daily Avtivity",
              children: (
                <Table
                  columns={columns}
                  dataSource={data}
                  size="small"
                  loading={loading}
                  rowKey="id"
                  scroll={{ x: "max-content" }}
                  pagination={false}
                />
              ),
            },
            {
              key: "PROSES",
              label: "Sedang Proses",
              children: (
                <Table
                  columns={columns}
                  dataSource={data}
                  size="small"
                  loading={loading}
                  rowKey="id"
                  scroll={{ x: "max-content" }}
                  pagination={false}
                />
              ),
            },
            {
              key: "AKTIF",
              label: "Aktif",
              children: (
                <Table
                  columns={columns}
                  dataSource={data}
                  size="small"
                  loading={loading}
                  rowKey="id"
                  scroll={{ x: "max-content", y: "none" }}
                  pagination={false}
                />
              ),
            },
          ]}
          defaultActiveKey="daily-avtivity"
          onChange={(e: string) =>
            setDataStatus(e === "daily-avtivity" ? null : e)
          }
        />
      </div>
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

  const handleOK = async () => {
    setLoading(true);

    const res = await fetch(`/api/ots_setup/data`, {
      method: "POST",
      body: JSON.stringify({
        province: data.province,
        city: data.city,
        district: data.district,
        ward: data.ward,
      }),
    });
    const json = await res.json();
    if (json.status === 200) {
      hook.success({ content: json.msg });
      setOpen(false);
      await getData();
    } else {
      hook.error({ content: json.msg });
    }
    setLoading(false);
  };

  return (
    <Modal
      title="Tarik Data Baru"
      open={open}
      onCancel={() => setOpen(false)}
      onOk={handleOK}
      loading={loading}
      destroyOnHidden
    >
      <div className="flex flex-col gap-2">
        <FormInput
          data={{
            label: "Provinsi",
            class: "flex-1",
            type: "text",
            value: data.province,
            onChange: (e: string) =>
              setdata((prev) => ({ ...prev, province: e })),
          }}
        />
        <FormInput
          data={{
            label: "Kota/Kabupaten",
            class: "flex-1",
            type: "text",
            value: data.city,
            onChange: (e: string) => setdata((prev) => ({ ...prev, city: e })),
          }}
        />
        <FormInput
          data={{
            label: "Kecamatan",
            class: "flex-1",
            type: "text",
            value: data.district,
            onChange: (e: string) =>
              setdata((prev) => ({ ...prev, district: e })),
          }}
        />
        <FormInput
          data={{
            label: "Kelurahan",
            class: "flex-1",
            type: "text",
            value: data.ward,
            onChange: (e: string) => setdata((prev) => ({ ...prev, ward: e })),
          }}
        />
      </div>
    </Modal>
  );
};
