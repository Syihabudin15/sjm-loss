"use client";

import { IMenu, listMenuUI } from "@/components/IMenu";
import { IActionTable, IPageProps, IPermission } from "@/libs/IInterfaces";
import { useAccess } from "@/libs/Permission";
import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import { EDataStatus, Role } from "../../../../generated/prisma/client";
import {
  App,
  Button,
  Card,
  Checkbox,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TableProps,
  Tag,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Page() {
  const [upsert, setUpsert] = useState<IActionTable<Role>>({
    upsert: false,
    delete: false,
    proses: false,
    selected: undefined,
  });
  const [pageProps, setPageProps] = useState<IPageProps<Role>>({
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
    const res = await fetch(`/api/roles?${params.toString()}`);
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

  const columns: TableProps<Role>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Nama Role",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Data Status",
      dataIndex: "data_status",
      key: "data_status",
      render: (status) => <Tag>{status}</Tag>,
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => moment(date).format("DD-MM-YYYY HH:mm:ss"),
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

  const nestedColumns = [
    { title: "Menu", dataIndex: "path", key: "path" },
    {
      title: "Hak Akses",
      dataIndex: "access",
      key: "access",
      render: (akses: string[]) => (
        <Space size={[0, 8]} wrap>
          {akses.map((a) => (
            <Tag key={a} color="blue">
              {a}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex gap-2 font-bold text-xl">
          <KeyOutlined /> Role Management
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
            Add Role
          </Button>
        )}
        <Input.Search
          size="small"
          style={{ width: 170 }}
          placeholder="Cari role..."
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
        expandable={{
          expandedRowRender: (record) => {
            return (
              <Table
                columns={nestedColumns}
                dataSource={JSON.parse(record.permission)}
                pagination={false}
                size="small"
                rowKey={"path"}
              />
            );
          },
        }}
      />

      <UpsertRole
        open={upsert.upsert}
        setOpen={(v: boolean) => setUpsert((prev) => ({ ...prev, upsert: v }))}
        record={upsert.selected}
        key={upsert.selected ? "upsert" + upsert.selected.id : "create"}
        getData={getData}
      />
      <DeleteRole
        open={upsert.delete}
        setOpen={(v: boolean) => setUpsert((prev) => ({ ...prev, delete: v }))}
        record={upsert.selected}
        getData={getData}
        key={upsert.selected ? "delete" + upsert.selected.id : "delete"}
      />
    </Card>
  );
}

interface IMenuAccess extends IMenu {
  access: string[];
}
export function UpsertRole({
  record,
  open,
  setOpen,
  getData,
}: {
  record?: Role;
  open: boolean;
  setOpen: Function;
  getData?: Function;
}) {
  const [data, setData] = useState(record ? record : defaultRole);
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState<IMenuAccess[]>(
    record
      ? MergeMenu(defaultMenu, JSON.parse(record.permission))
      : defaultMenu,
  );
  const { modal } = App.useApp();

  useEffect(() => {
    const newMenu = menus
      .filter((m) => m.access.length !== 0)
      .map((m) => ({ ...m }));

    setData((prev: Role) => ({
      ...prev,
      permission: JSON.stringify(newMenu),
    }));
  }, [menus]);

  const handleSubmit = async () => {
    if (!data.name) {
      modal.error({
        title: "ERROR",
        content: "Mohon lengkapi data terlebih dahulu!",
      });
      return;
    }
    setLoading(true);
    await fetch("/api/roles", {
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

  const columns: TableProps<IMenuAccess>["columns"] = [
    {
      title: "Menu",
      dataIndex: "menu",
      key: "menu",
      width: 100,
      className: "text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return <>{record.key}</>;
      },
    },
    {
      title: "Access",
      dataIndex: "access",
      key: "access",
      width: 200,
      className: "text-xs",
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 12,
          },
        };
      },
      render(value, record, index) {
        return (
          <>
            <Checkbox.Group
              options={record.availableAccess}
              value={record.access}
              onChange={(e) => {
                setMenus((prev: IMenuAccess[]) => {
                  const filter = prev.map((p) => {
                    if (p.key === record.key) {
                      p.access = e;
                    }
                    return p;
                  });
                  return filter;
                });
              }}
            />
          </>
        );
      },
    },
  ];
  return (
    <Modal
      loading={loading}
      footer={[]}
      open={open}
      onCancel={() => setOpen(false)}
      width={800}
      style={{ top: 20 }}
      title={record ? "Update Role " + record.name : "Add New Role"}
      destroyOnHidden
    >
      <div className="p-2">
        <div className="flex gap-5 my-3 items-center">
          <p className="w-32">
            <span className="text-red-500">*</span>Nama Role
          </p>
          <Input
            required
            value={data.name}
            onChange={(e) =>
              setData((prev: Role) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-5 my-3 items-center">
          <p className="w-32">
            <span className="text-red-500">*</span>Data Status
          </p>
          <Select
            options={[
              { label: EDataStatus.SEMUA, value: EDataStatus.SEMUA },
              { label: EDataStatus.AREA, value: EDataStatus.AREA },
              { label: EDataStatus.CABANG, value: EDataStatus.CABANG },
              { label: EDataStatus.USER, value: EDataStatus.USER },
            ]}
            style={{ width: "100%" }}
            value={data.data_status}
            onChange={(e) =>
              setData((prev: Role) => ({
                ...prev,
                data_status: e as EDataStatus,
              }))
            }
          />
        </div>
        <div className="my-2">
          <p>Role Permissions</p>
          <Table
            rowKey={"path"}
            columns={columns}
            dataSource={menus}
            size="small"
            pagination={false}
            scroll={{ x: "max-content", y: "45vh" }}
            loading={loading}
            bordered
          />
        </div>
        <div className="flex justify-end mt-2">
          <Button
            type="primary"
            onClick={() => handleSubmit()}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function DeleteRole({
  record,
  open,
  setOpen,
  getData,
}: {
  record?: Role;
  open: boolean;
  setOpen: Function;
  getData?: Function;
}) {
  const [loading, setLoading] = useState(false);
  const { modal } = App.useApp();
  const handleDelete = async () => {
    setLoading(true);
    await fetch(`/api/roles?id=${record?.id}`, {
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
      title={"Delete Role " + record?.name}
      destroyOnHidden
    >
      <p>Are you sure you want to delete this role?</p>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button danger onClick={handleDelete} loading={loading}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

const defaultRole: Role = {
  id: "",
  name: "",
  data_status: "SEMUA",
  permission: "",
  status: true,
  created_at: new Date(),
  updated_at: new Date(),
};

const defaultMenu: IMenuAccess[] = listMenuUI
  .filter((u) => u.needaccess)
  .flatMap((m) => {
    if (m.children && m.children.length > 0) {
      return m.children.map((c) => ({
        path: c.key,
        access: [],
        ...c,
      }));
    } else {
      return {
        path: m.key,
        access: [],
        ...m,
      };
    }
  });

function MergeMenu(menuItems: IMenu[], data: IPermission[]) {
  const mergedMenu = menuItems.map((item) => {
    const found = data.find((r) => r.path === item.key);
    return {
      ...item,
      access: found ? found.access : [],
    };
  });
  return mergedMenu;
}
