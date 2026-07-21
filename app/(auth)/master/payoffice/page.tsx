"use client";

import { FormInput } from "@/components";
import { IActionTable, IPageProps, IPayOffice } from "@/libs/IInterfaces";
import { useAccess } from "@/libs/Permission";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleFilled,
  SaveOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Table,
  TableProps,
} from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Page() {
  const [upsert, setUpsert] = useState<IActionTable<IPayOffice>>({
    upsert: false,
    delete: false,
    proses: false,
    selected: undefined,
  });
  const [pageProps, setPageProps] = useState<IPageProps<IPayOffice>>({
    page: 1,
    limit: 10,
    total: 0,
    data: [],
    search: "",
    mitra: undefined,
  });
  const [loading, setLoading] = useState(false);
  const { modal } = App.useApp();
  const { hasAccess } = useAccess(window.location.pathname);

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pageProps.page.toString(),
      limit: pageProps.limit.toString(),
      ...(pageProps.search && { search: pageProps.search }),
      ...(pageProps.mitra && { mitra: pageProps.mitra }),
    });

    const res = await fetch(`/api/payoffice?${params.toString()}`);
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

  const columns: TableProps<IPayOffice>["columns"] = [
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
      title: "Kantor Bayar",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render(value, record, index) {
        return (
          <div>
            <div>{record.name}</div>
            <div className="text-xs opacity-70">@{record.code}</div>
          </div>
        );
      },
    },
    {
      title: "Status Mitra",
      dataIndex: "mitra",
      key: "mitra",
      render(value, record, index) {
        return (
          <div>
            {record.mitra ? (
              <span className="text-green-600">Mitra Koperasi</span>
            ) : (
              <span className="text-red-600">Bukan Mitra</span>
            )}
          </div>
        );
      },
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
          <TagOutlined /> Kantor Bayar
        </div>
      }
      styles={{ body: { padding: 5 } }}
    >
      <div className="flex justify-between my-1">
        {hasAccess("write") && (
          <Button
            size="small"
            type="primary"
            icon={<PlusCircleFilled />}
            onClick={() =>
              setUpsert({ ...upsert, upsert: true, selected: undefined })
            }
          >
            Add New
          </Button>
        )}
        <Select
          size="small"
          style={{ width: 100 }}
          value={pageProps.mitra}
          onChange={(value) =>
            setPageProps({ ...pageProps, mitra: value, page: 1 })
          }
          options={[
            { label: "Semua", value: undefined },
            { label: "Mitra Koperasi", value: true },
            { label: "Bukan Mitra", value: false },
          ]}
        />
        <Input.Search
          size="small"
          style={{ width: 170 }}
          placeholder="Cari nama..."
          onChange={(e) =>
            setPageProps({ ...pageProps, search: e.target.value, page: 1 })
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
      <UpsertJenis
        open={upsert.upsert}
        record={upsert.selected}
        setOpen={(v: boolean) => setUpsert({ ...upsert, upsert: v })}
        getData={getData}
        modal={modal}
        key={upsert.selected ? upsert.selected.id : "create"}
      />
      <DeleteJenis
        open={upsert.delete}
        setOpen={(v: boolean) => setUpsert({ ...upsert, delete: v })}
        getData={getData}
        record={upsert.selected}
        key={upsert.selected ? upsert.selected.id : "delete"}
        modal={modal}
      />
    </Card>
  );
}

function UpsertJenis({
  record,
  open,
  setOpen,
  getData,
  modal,
}: {
  record?: IPayOffice;
  open: boolean;
  setOpen: Function;
  getData?: Function;
  modal: HookAPI;
}) {
  const [data, setData] = useState<IPayOffice>(record ? record : defaultData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await fetch("/api/payoffice", {
      method: record ? "PUT" : "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.status === 201 || res.status === 200) {
          modal.success({
            title: "BERHASIL",
            content: `Data berhasil ${record ? "di Update" : "ditambahkan"}!`,
          });
          setOpen(false);
          getData && (await getData());
        } else {
          modal.error({
            title: "ERROR",
            content: res.msg,
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
      title={
        record ? "Update Kantor Bayar " + record.name : "Add New Kantor Bayar"
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={[]}
      loading={loading}
      style={{ top: 20 }}
      destroyOnHidden
    >
      <div className="flex flex-col gap-3">
        <div className="hidden">
          <FormInput
            data={{
              label: "Jenis ID",
              mode: "horizontal",
              type: "text",
              value: data.id,
              onChange: (e: string) => setData({ ...data, id: e }),
            }}
          />
        </div>
        <FormInput
          data={{
            label: "Kantor Bayar",
            mode: "horizontal",
            required: true,
            type: "text",
            value: data.name,
            onChange: (e: string) => setData({ ...data, name: e }),
          }}
        />
        <FormInput
          data={{
            label: "Kode Nama",
            mode: "horizontal",
            required: true,
            type: "text",
            value: data.code,
            onChange: (e: string) => setData({ ...data, code: e }),
          }}
        />
        <FormInput
          data={{
            label: "Status Mitra",
            mode: "horizontal",
            type: "select",
            options: [
              { label: "Mitra Koperasi", value: true },
              { label: "Bukan Mitra", value: false },
            ],
            value: data.mitra,
            onChange: (e: boolean) => setData({ ...data, mitra: e }),
          }}
        />
        <FormInput
          data={{
            label: "Nomor PKS",
            mode: "horizontal",
            type: "text",
            value: data.no_contract,
            onChange: (e: string) => setData({ ...data, no_contract: e }),
            hidden: !data.mitra,
          }}
        />
        <FormInput
          data={{
            label: "Tanggal PKS",
            mode: "horizontal",
            type: "date",
            value: data.date_contract,
            onChange: (e: string) =>
              setData({ ...data, date_contract: e ? new Date(e) : null }),
            hidden: !data.mitra,
          }}
        />

        <FormInput
          data={{
            label: "Logo Mitra",
            mode: "horizontal",
            type: "upload",
            accept: "image/png,image/jpg,image/jpeg",
            value: data.logo,
            onChange: (e: string) => setData({ ...data, logo: e }),
          }}
        />
        <div className="flex justify-end gap-4">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            icon={<SaveOutlined />}
            type="primary"
            onClick={() => handleSave()}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function DeleteJenis({
  record,
  open,
  setOpen,
  getData,
  modal,
}: {
  record?: IPayOffice;
  open: boolean;
  setOpen: Function;
  getData?: Function;
  modal: HookAPI;
}) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await fetch(`/api/payoffice?id=${record?.id}`, {
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
      title={"Delete Kantor Bayar " + record?.name}
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

const defaultData: IPayOffice = {
  id: "",
  name: "",
  code: "",
  no_contract: null,
  date_contract: null,
  pic: null,
  description: null,
  file: null,
  logo: null,
  mitra: false,
  Dapems: [],

  status: true,
  created_at: new Date(),
  updated_at: new Date(),
};
