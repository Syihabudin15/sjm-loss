"use client";

import { FormInput } from "@/components";
import { FilterData } from "@/components/utils/CompUtils";
import { IDRFormat, IDRToNumber } from "@/components/utils/PembiayaanUtil";
import { IActionTable, IArea, IPageProps, UserType } from "@/libs/IInterfaces";
import { useAccess } from "@/libs/Permission";
import {
  BankOutlined,
  BranchesOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusCircleFilled,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type {
  AgentFronting,
  Cabang,
  Role,
  Sumdan,
  User,
} from "../../../../generated/prisma/client";
import {
  App,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Table,
  TableProps,
  Tag,
} from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import { CalendarArrowDown, CalendarArrowUp } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Page() {
  const [upsert, setUpsert] = useState<IActionTable<UserType>>({
    upsert: false,
    delete: false,
    proses: false,
    selected: undefined,
  });
  const [pageProps, setPageProps] = useState<IPageProps<UserType>>({
    page: 1,
    limit: 10,
    total: 0,
    data: [],
    search: "",
    roleId: null,
    areaId: null,
    cabangId: null,
    agentFrontingId: null,
    sumdanId: null,
    pkwt_status: null,
  });
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [areas, setAreas] = useState<IArea[]>([]);
  const [cabangs, setCabangs] = useState<Cabang[]>([]);
  const [sumdans, setSumdans] = useState<Sumdan[]>([]);
  const [agents, setAgents] = useState<AgentFronting[]>([]);
  const { modal } = App.useApp();
  const { hasAccess } = useAccess("/master/users");

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pageProps.page.toString(),
      limit: pageProps.limit.toString(),
      ...(pageProps.roleId && { roleId: pageProps.roleId }),
      ...(pageProps.areaId && { areaId: pageProps.areaId }),
      ...(pageProps.cabangId && { cabangId: pageProps.cabangId }),
      ...(pageProps.agentFrontingId && {
        agentFrontingId: pageProps.agentFrontingId,
      }),
      ...(pageProps.sumdanId && { sumdanId: pageProps.sumdanId }),
      ...(pageProps.pkwt_status && { pkwt_status: pageProps.pkwt_status }),
      ...(pageProps.search && { search: pageProps.search }),
    });

    const res = await fetch(`/api/user?${params.toString()}`);
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
  }, [
    pageProps.page,
    pageProps.limit,
    pageProps.search,
    pageProps.roleId,
    pageProps.areaId,
    pageProps.cabangId,
    pageProps.agentFrontingId,
    pageProps.sumdanId,
    pageProps.pkwt_status,
  ]);

  useEffect(() => {
    (async () => {
      await Promise.all([
        fetch("/api/roles")
          .then((res) => res.json())
          .then((res) => setRoles(res.data)),
        fetch("/api/cabang")
          .then((res) => res.json())
          .then((res) => setCabangs(res.data)),
        fetch("/api/area")
          .then((res) => res.json())
          .then((res) => setAreas(res.data)),
        fetch("/api/sumdan")
          .then((res) => res.json())
          .then((res) => setSumdans(res.data)),
        fetch("/api/agent")
          .then((res) => res.json())
          .then((res) => setAgents(res.data)),
      ]);
    })();
  }, []);

  const columns: TableProps<UserType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render(value, record, index) {
        return (
          <div>
            <div>{(pageProps.page - 1) * pageProps.limit + index + 1}</div>
            <div className="opacity-80 text-xs">{record.id}</div>
          </div>
        );
      },
    },
    {
      title: "Nama Lengkap",
      dataIndex: "fullname",
      key: "fullname",
      // sorter: (a, b) => a.fullname.localeCompare(b.fullname),
      render(value, record, index) {
        return (
          <div>
            <p>{record.fullname}</p>
            <div className="text-xs">@{record.username}</div>
          </div>
        );
      },
    },
    {
      title: "Kontak",
      dataIndex: "kontak",
      key: "kontak",
      className: "text-xs",
      render(value, record, index) {
        return (
          <div>
            <div>
              <MailOutlined /> {record.email}
            </div>
            <div>
              <PhoneOutlined /> {record.phone}
            </div>
          </div>
        );
      },
    },
    {
      title: "Unit Pelayanan",
      dataIndex: "tambahan",
      key: "tambahan",
      className: "text-xs",
      // sorter: (a, b) => a.fullname.localeCompare(b.fullname),
      render(value, record, index) {
        return (
          <div>
            <div>
              <EnvironmentOutlined /> {record.Cabang.name}
            </div>
            <div>
              <EnvironmentOutlined /> {record.Cabang.Area.name}
            </div>
          </div>
        );
      },
    },
    {
      title: "Posisi & Target",
      dataIndex: "position",
      key: "position",
      className: "text-xs",
      render(value, record, index) {
        return (
          <div>
            <div className="flex gap-2">
              <Tag color={"blue"}>{record.position}</Tag>
              <Tag color={"blue"}>{record.Role.name}</Tag>
            </div>
            <div className="text-blue-500">
              <DollarCircleOutlined /> {IDRFormat(record.target)}
            </div>
          </div>
        );
      },
    },
    {
      title: "PKWT Status",
      dataIndex: "expiredAt",
      key: "pkwt",
      render: (_, record) => (
        <div className="flex gap-2">
          <div>
            <Tag color={"blue"}>{record.pkwt_status || "NOT SET"}</Tag>
            <div className="text-xs opacity-80 flex gap-1">
              <CalendarArrowUp size={14} />{" "}
              {record.start_pkwt
                ? moment(record.start_pkwt).format("DD/MM/YYYY")
                : "-"}
            </div>
            <div className="text-xs opacity-80 flex gap-1">
              <CalendarArrowDown size={14} />{" "}
              {record.end_pkwt
                ? moment(record.end_pkwt).format("DD/MM/YYYY")
                : "-"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Data Mitra",
      dataIndex: "mitra",
      key: "mitra",
      render: (_, record) => (
        <div className="">
          <div className="text-xs opacity-80 flex gap-1">
            <BankOutlined size={14} /> {record.Sumdan?.code || "-"}
          </div>
          <div className="text-xs opacity-80 flex gap-1">
            <BranchesOutlined size={14} /> {record.AgentFronting?.code || "-"}
          </div>
        </div>
      ),
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
          <UserOutlined /> Users Management
        </div>
      }
      styles={{ body: { padding: 5 } }}
    >
      <div className="flex justify-between my-1">
        <div className="flex gap-2">
          {hasAccess("write") && (
            <Button
              size="small"
              type="primary"
              icon={<PlusCircleFilled />}
              onClick={() =>
                setUpsert({ ...upsert, upsert: true, selected: undefined })
              }
            >
              Add User
            </Button>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <Input.Search
            size="small"
            style={{ width: 170 }}
            placeholder="Cari user..."
            onChange={(e) =>
              setPageProps((prev) => ({ ...prev, search: e.target.value }))
            }
          />
          <FilterData
            clearfilter={() =>
              setPageProps((prev) => ({
                ...prev,
                roleId: "",
                areaId: "",
                cabangId: "",
                sumdanId: "",
                agentFrontingId: "",
                pkwt_status: "",
              }))
            }
            children={
              <>
                <div className="my-2 flex gap-2 items-center">
                  <p className="w-42">Role User </p>
                  <Select
                    style={{ width: "100%" }}
                    value={pageProps.roleId}
                    options={roles.map((r) => ({ label: r.name, value: r.id }))}
                    onChange={(e) =>
                      setPageProps((prev) => ({ ...prev, roleId: e }))
                    }
                    placeholder="role..."
                    size="small"
                    allowClear
                  />
                </div>
                <div className="my-2 flex gap-2 items-center">
                  <p className="w-42">Status PKWT </p>
                  <Select
                    style={{ width: "100%" }}
                    value={pageProps.pkwt_status}
                    options={[
                      { label: "TIERING", value: "TIERING" },
                      { label: "BARU", value: "BARU" },
                      { label: "LANJUT", value: "LANJUT" },
                      { label: "TETAP", value: "TETAP" },
                      { label: "EXPIRED", value: "EXPIRED" },
                      { label: "NOT SET", value: "NOT SET" },
                    ]}
                    onChange={(e) =>
                      setPageProps((prev) => ({ ...prev, pkwt_status: e }))
                    }
                    placeholder="status pkwt..."
                    size="small"
                    allowClear
                  />
                </div>
                <div className="my-2 flex gap-2 items-center">
                  <p className="w-42">Area </p>
                  <Select
                    style={{ width: "100%" }}
                    value={pageProps.areaId}
                    options={areas.map((a) => ({ label: a.name, value: a.id }))}
                    onChange={(e) =>
                      setPageProps((prev) => ({ ...prev, areaId: e }))
                    }
                    placeholder="Area..."
                    size="small"
                    allowClear
                  />
                </div>
                <div className="my-2 flex gap-2 items-center">
                  <p className="w-42">Cabang </p>
                  <Select
                    style={{ width: "100%" }}
                    value={pageProps.cabangId}
                    options={
                      pageProps.areaId
                        ? areas
                            .filter((a) => a.id === pageProps.areaId)
                            .flatMap((a) => a.Cabangs)
                            .map((a) => ({ label: a.name, value: a.id }))
                        : cabangs.map((c) => ({ label: c.name, value: c.id }))
                    }
                    onChange={(e) =>
                      setPageProps((prev) => ({ ...prev, cabangId: e }))
                    }
                    placeholder="Cabang ..."
                    size="small"
                    allowClear
                  />
                </div>
                <div className="my-2 flex gap-2 items-center">
                  <p className="w-42">Agent Fronting </p>
                  <Select
                    style={{ width: "100%" }}
                    value={pageProps.agentFrontingId}
                    options={agents.map((a) => ({
                      label: a.code || a.name,
                      value: a.id,
                    }))}
                    onChange={(e) =>
                      setPageProps((prev) => ({ ...prev, agentFrontingId: e }))
                    }
                    placeholder="Agent Fronting..."
                    size="small"
                    allowClear
                  />
                </div>
                <div className="my-2 flex gap-2 items-center">
                  <p className="w-42">Sumdan </p>
                  <Select
                    style={{ width: "100%" }}
                    value={pageProps.sumdanId}
                    options={sumdans.map((a) => ({
                      label: a.code || a.name,
                      value: a.id,
                    }))}
                    onChange={(e) =>
                      setPageProps((prev) => ({ ...prev, sumdanId: e }))
                    }
                    placeholder="Mitra Pembiayaan..."
                    size="small"
                    allowClear
                  />
                </div>
              </>
            }
          />
        </div>
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
      <UpsertUser
        open={upsert.upsert}
        record={upsert.selected}
        setOpen={(v: boolean) => setUpsert({ ...upsert, upsert: v })}
        getData={getData}
        modal={modal}
        roles={roles}
        cabangs={cabangs}
        sumdans={sumdans}
        agents={agents}
        key={upsert.selected ? "upsert" + upsert.selected.id : "create"}
      />
      <DeleteUser
        open={upsert.delete}
        setOpen={(v: boolean) => setUpsert({ ...upsert, delete: v })}
        getData={getData}
        record={upsert.selected}
        key={upsert.selected ? "delete" + upsert.selected.id : "delete"}
        modal={modal}
      />
    </Card>
  );
}

function UpsertUser({
  record,
  open,
  setOpen,
  getData,
  modal,
  roles,
  cabangs,
  sumdans,
  agents,
}: {
  record?: User;
  open: boolean;
  setOpen: Function;
  getData?: Function;
  modal: HookAPI;
  roles: Role[];
  cabangs: Cabang[];
  sumdans: Sumdan[];
  agents: AgentFronting[];
}) {
  const [data, setData] = useState(
    record ? { ...record, password: null } : defaultUser,
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    if ("Cabang" in data) {
      delete data.Cabang;
    }
    if ("Role" in data) {
      delete data.Role;
    }
    if ("Sumdan" in data) {
      delete data.Sumdan;
    }
    await fetch("/api/user", {
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
      title={record ? "Update User " + record.fullname : "Add New User"}
      open={open}
      onCancel={() => setOpen(false)}
      footer={[]}
      loading={loading}
      style={{ top: 20 }}
      width={1200}
      destroyOnHidden
    >
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 flex flex-col gap-3">
            <div className="hidden">
              <FormInput
                data={{
                  label: "USER ID",
                  mode: "horizontal",
                  type: "text",
                  value: data.id,
                  onChange: (e: string) => setData({ ...data, id: e }),
                }}
              />
            </div>
            <FormInput
              data={{
                label: "Role User",
                mode: "horizontal",
                required: true,
                type: "select",
                value: data.roleId,
                onChange: (e: string) => setData({ ...data, roleId: e }),
                options: roles.map((r) => ({ label: r.name, value: r.id })),
              }}
            />
            <FormInput
              data={{
                label: "Cabang",
                mode: "horizontal",
                required: true,
                type: "select",
                value: data.cabangId,
                onChange: (e: string) => setData({ ...data, cabangId: e }),
                options: cabangs.map((r) => ({ label: r.name, value: r.id })),
              }}
            />
            <FormInput
              data={{
                label: "Mitra",
                mode: "horizontal",
                type: "select",
                value: data.sumdanId,
                onChange: (e: string) => setData({ ...data, sumdanId: e }),
                options: sumdans.map((r) => ({ label: r.name, value: r.id })),
              }}
            />
            <FormInput
              data={{
                label: "Agent Fronting",
                mode: "horizontal",
                type: "select",
                value: data.agentFrontingId,
                onChange: (e: string) =>
                  setData({ ...data, agentFrontingId: e }),
                options: agents.map((r) => ({ label: r.name, value: r.id })),
              }}
            />
            <FormInput
              data={{
                label: "Nama Lengkap",
                mode: "horizontal",
                required: true,
                type: "text",
                value: data.fullname,
                onChange: (e: string) => setData({ ...data, fullname: e }),
              }}
            />
            <FormInput
              data={{
                label: "Nomor NIK",
                mode: "horizontal",
                type: "text",
                value: data.nik,
                onChange: (e: string) => setData({ ...data, nik: e }),
              }}
            />
            <FormInput
              data={{
                label: "Username",
                mode: "horizontal",
                required: true,
                type: "text",
                value: data.username,
                onChange: (e: string) => setData({ ...data, username: e }),
              }}
            />
            <FormInput
              data={{
                label: "Email",
                mode: "horizontal",
                type: "text",
                value: data.email,
                onChange: (e: string) => setData({ ...data, email: e }),
              }}
            />
            <FormInput
              data={{
                label: "Password",
                mode: "horizontal",
                type: "password",
                required: true,
                value: data.password,
                onChange: (e: string) => setData({ ...data, password: e }),
              }}
            />
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <FormInput
              data={{
                label: "No Telepon",
                mode: "horizontal",
                type: "text",
                value: data.phone,
                onChange: (e: string) => setData({ ...data, phone: e }),
              }}
            />
            <FormInput
              data={{
                label: "Posisi",
                mode: "horizontal",
                type: "text",
                value: data.position,
                onChange: (e: string) => setData({ ...data, position: e }),
                // options: [
                //   { label: "MOC", value: "MOC" },
                //   { label: "SPV", value: "SPV" },
                //   { label: "KORWIL", value: "KORWIL" },
                //   { label: "ADMIN", value: "ADMIN" },
                //   { label: "KEPALA OPERASIONAL", value: "KEPALA OPERASIONAL" },
                //   { label: "STAFF OPERASIONAL", value: "STAFF OPERASIONAL" },
                //   { label: "KEPALA BISNIS", value: "KEPALA BISNIS" },
                //   { label: "STAFF BISNIS", value: "STAFF BISNIS" },
                //   { label: "MANAJER KEUANGAN", value: "MANAJER KEUANGAN" },
                //   { label: "STAFF KEUANGAN", value: "STAFF KEUANGAN" },
                //   { label: "KEPALA VERIFIKASI", value: "KEPALA VERIFIKASI" },
                //   { label: "STAFF VERIFIKASI", value: "STAFF VERIFIKASI" },
                //   { label: "KEPALA DOKUMEN", value: "KEPALA DOKUMEN" },
                //   { label: "STAFF DOKUMEN", value: "STAFF DOKUMEN" },
                //   { label: "KEPALA IT", value: "KEPALA IT" },
                //   { label: "STAFF IT", value: "STAFF IT" },
                //   { label: "FUNDING", value: "FUNDING" },
                //   { label: "GENERAL AFFAIRS", value: "GENERAL AFFAIRS" },
                // ],
              }}
            />
            <FormInput
              data={{
                label: "Target Perbulan",
                mode: "horizontal",
                type: "text",
                value: IDRFormat(data.target),
                onChange: (e: string) =>
                  setData({ ...data, target: IDRToNumber(e || "0") }),
              }}
            />
            <FormInput
              data={{
                label: "Status PKWT",
                mode: "horizontal",
                type: "select",
                options: [
                  { label: "TIERING", value: "TIERING" },
                  { label: "BARU", value: "BARU" },
                  { label: "LANJUT", value: "LANJUT" },
                  { label: "TETAP", value: "TETAP" },
                ],
                value: data.pkwt_status,
                onChange: (e: string) => setData({ ...data, pkwt_status: e }),
              }}
            />
            <FormInput
              data={{
                label: "Awal PKWT",
                mode: "horizontal",
                type: "date",
                value: moment(data.start_pkwt).format("YYYY-MM-DD"),
                onChange: (e: string) =>
                  setData({ ...data, start_pkwt: new Date(e) }),
              }}
            />
            <FormInput
              data={{
                label: "Akhir PKWT",
                mode: "horizontal",
                type: "date",
                value: moment(data.end_pkwt).format("YYYY-MM-DD"),
                onChange: (e: string) =>
                  setData({ ...data, end_pkwt: new Date(e) }),
              }}
            />
          </div>
        </div>
      </form>
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
    </Modal>
  );
}

export function DeleteUser({
  record,
  open,
  setOpen,
  getData,
  modal,
}: {
  record?: User;
  open: boolean;
  setOpen: Function;
  getData?: Function;
  modal: HookAPI;
}) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await fetch(`/api/user?id=${record?.id}`, {
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
      title={"Delete User " + record?.fullname}
      destroyOnHidden
    >
      <p>Are you sure you want to delete this user?</p>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button danger onClick={handleDelete} loading={loading}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

const defaultUser: User = {
  id: "",
  fullname: "",
  username: "",
  email: null,
  phone: null,
  password: "",
  cabangId: "",
  roleId: "",
  sumdanId: null,
  nip: "",
  target: 0,
  position: null,
  start_pkwt: new Date(),
  end_pkwt: new Date(),
  pkwt_status: "BARU",
  nik: null,
  agentFrontingId: null,

  status: true,
  created_at: new Date(),
  updated_at: new Date(),
};
