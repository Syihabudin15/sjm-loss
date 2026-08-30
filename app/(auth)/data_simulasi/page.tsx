"use client";

import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import {
  IActionTable,
  IDataSimulasi,
  IInsurance,
  IPageProps,
} from "@/libs/IInterfaces";
import { useAccess } from "@/libs/Permission";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Input, Modal, Table, TableProps } from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import { Calculator } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Page() {
  const [upsert, setUpsert] = useState<IActionTable<IDataSimulasi>>({
    upsert: false,
    delete: false,
    proses: false,
    selected: undefined,
  });
  const [pageProps, setPageProps] = useState<IPageProps<IDataSimulasi>>({
    page: 1,
    limit: 10,
    total: 0,
    data: [],
    search: "",
  });
  const [loading, setLoading] = useState(false);
  const { hasAccess } = useAccess(window.location.pathname);

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pageProps.page.toString(),
      limit: pageProps.limit.toString(),
      ...(pageProps.search && { search: pageProps.search }),
    });

    const res = await fetch(`/api/simulasi?${params.toString()}`);
    const json = await res.json();
    setPageProps((prev) => ({
      ...prev,
      data: json.data,
      total: json.total,
    }));
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [pageProps.page, pageProps.limit, pageProps.search]);

  const columns: TableProps<IDataSimulasi>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render(value, record, index) {
        return (
          <>
            <div>{(pageProps.page - 1) * pageProps.limit + index + 1}</div>
            <div className="text-xs opacity-70">{record.id}</div>
          </>
        );
      },
    },
    {
      title: "Cadeb",
      dataIndex: "cadeb",
      key: "cadeb",
      render: (val, record) => (
        <div>
          <div className="font-bold">{record.fullname}</div>
          <div className="opacity-80">@{record.nopen}</div>
        </div>
      ),
    },
    {
      title: "Pembiayaan",
      dataIndex: "pembiayaan",
      key: "pembiayaan",
      render: (val, record) => (
        <div>
          <div className="font-bold">{IDRFormat(record.plafond)}</div>
          <div className="opacity-80">{record.tenor} Bulan</div>
        </div>
      ),
    },
    {
      title: "Produk",
      dataIndex: "produk",
      key: "produk",
      render: (val, record) => (
        <div>
          <div className="font-bold">
            {record.Product.name} ({record.Product.id})
          </div>
          <div className="opacity-80">{record.JenisPembiayaan.name}</div>
        </div>
      ),
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => moment(date).format("DD-MM-YYYY"),
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
              onClick={() =>
                setUpsert({ ...upsert, upsert: true, selected: record })
              }
              size="small"
              type="primary"
            ></Button>
          )}
          {hasAccess("delete") && (
            <Button
              icon={<DeleteOutlined />}
              onClick={() =>
                setUpsert({ ...upsert, delete: true, selected: record })
              }
              size="small"
              type="primary"
              danger
            ></Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex gap-2 font-bold text-xl">
          <Calculator /> Simulasi
        </div>
      }
      styles={{ body: { padding: 5 } }}
    >
      <div className="flex justify-between my-1">
        <Input.Search
          size="small"
          style={{ width: 170 }}
          placeholder="Cari nama..."
          onChange={(e) =>
            setPageProps({ ...pageProps, search: e.target.value })
          }
        />
      </div>

      <Table
        columns={columns}
        dataSource={pageProps.data}
        size="small"
        loading={loading}
        rowKey={"id"}
        bordered
        scroll={{ x: "max-content", y: "48vh" }}
        pagination={{
          current: pageProps.page,
          pageSize: pageProps.limit,
          total: pageProps.total,
          onChange: (page, pageSize) => {
            setPageProps((prev) => ({
              ...prev,
              page,
              limit: pageSize,
            }));
          },
          pageSizeOptions: [50, 100, 500, 1000],
          showSizeChanger: true,
        }}
      />
    </Card>
  );
}

export function DeleteJenis({
  record,
  open,
  setOpen,
  getData,
  modal,
}: {
  record?: IDataSimulasi;
  open: boolean;
  setOpen: Function;
  getData?: Function;
  modal: HookAPI;
}) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await fetch(`/api/simulasi?id=${record?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          modal.success({
            title: "SUCCESS",
            content: data.msg,
          });
          setOpen(false);
          getData && (await getData());
        } else {
          modal.error({
            title: "ERROR",
            content: data.msg,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        modal.error({
          title: "ERROR",
          content: "Internal Server Error",
        });
      });
    setLoading(false);
  };
  return (
    <Modal
      loading={loading}
      footer={[]}
      open={open}
      onCancel={() => setOpen(false)}
      width={400}
      style={{ top: 20 }}
      title={"Delete Simulasi " + record?.fullname}
      destroyOnHidden
    >
      <p>Are you sure you want to delete this data?</p>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button danger onClick={handleDelete} loading={loading}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

const defaultData: IInsurance = {
  id: "",
  name: "",
  code: "",
  no_contract: null,
  date_contract: null,
  pic: null,
  description: null,
  file: null,
  logo: null,
  Dapems: [],

  status: true,
  created_at: new Date(),
  updated_at: new Date(),
};
