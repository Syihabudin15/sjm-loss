"use client";

import { FormInput } from "@/components";
import {
  IDRFormat,
  IDRToNumber,
  serializeForApi,
} from "@/components/utils/PembiayaanUtil";
import {
  IActionTable,
  IAgentFronting,
  IPageProps,
  ISumdanAgentFronting,
} from "@/libs/IInterfaces";
import { useAccess } from "@/libs/Permission";
import {
  DeleteOutlined,
  EditOutlined,
  GlobalOutlined,
  PlusCircleFilled,
  SaveOutlined,
} from "@ant-design/icons";
import { Sumdan } from "../../../../generated/prisma/client";
import {
  App,
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  Modal,
  Table,
  TableProps,
  Typography,
} from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import moment from "moment";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

export default function Page() {
  const [upsert, setUpsert] = useState<IActionTable<IAgentFronting>>({
    upsert: false,
    delete: false,
    proses: false,
    selected: undefined,
  });
  const [pageProps, setPageProps] = useState<IPageProps<IAgentFronting>>({
    page: 1,
    limit: 10,
    total: 0,
    data: [],
    search: "",
  });
  const [sumdans, setSumdans] = useState<Sumdan[]>([]);
  const [loading, setLoading] = useState(false);
  const { modal } = App.useApp();
  const { hasAccess } = useAccess(
    window ? window.location.pathname : "/master/agent",
  );

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pageProps.page.toString(),
      limit: pageProps.limit.toString(),
      includes: "true",
      ...(pageProps.search && { search: pageProps.search }),
    });
    const res = await fetch(`/api/agent?${params.toString()}`);
    const json = await res.json();
    setPageProps((prev) => ({
      ...prev,
      data: serializeForApi(json.data),
      total: json.total,
    }));
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await fetch("/api/sumdan?limit=100&front=true")
        .then((res) => res.json())
        .then((res) => setSumdans(res.data));
    })();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [pageProps.page, pageProps.limit, pageProps.search]);

  const columns: TableProps<IAgentFronting>["columns"] = [
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
      title: "Agent Fronting",
      dataIndex: "agent",
      key: "agent",
      render(value, record, index) {
        return (
          <div>
            <div>{record.name}</div>
            <div className="text-xs opacity-80">{record.code}</div>
          </div>
        );
      },
    },
    {
      title: "Penanggung Jawab",
      dataIndex: "up",
      key: "up",
    },
    {
      title: "Target Perbulan",
      dataIndex: "target",
      key: "target",
      render(value, record, index) {
        return <div>{IDRFormat(record.target)}</div>;
      },
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render(value, record, index) {
        return <div>{record.Users.length}</div>;
      },
    },
    {
      title: "Available Sumdan",
      dataIndex: "SumdanAgentFronting",
      key: "sumdan",
      render(value, record, index) {
        return (
          <Paragraph
            ellipsis={{
              rows: 2,
              expandable: "collapsible",
            }}
            style={{ fontSize: 11, width: 200 }}
          >
            {record.SumdanAgentFrontings.map((s) => s.Sumdan.code).join(", ")}
          </Paragraph>
        );
      },
    },
    {
      title: "Keterangan",
      dataIndex: "description",
      key: "desc",
      render(value, record, index) {
        return (
          <Paragraph
            ellipsis={{
              rows: 2,
              expandable: "collapsible",
            }}
            style={{ fontSize: 11 }}
          >
            {record.description}
          </Paragraph>
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
          <GlobalOutlined /> Agent Fronting
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
      <UpsertData
        open={upsert.upsert}
        record={upsert.selected}
        setOpen={(v: boolean) => setUpsert({ ...upsert, upsert: v })}
        getData={getData}
        modal={modal}
        sumdans={sumdans}
        key={upsert.selected ? "upsert" + upsert.selected.id : "create"}
      />
      <DeleteData
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

function UpsertData({
  record,
  open,
  setOpen,
  getData,
  modal,
  sumdans,
}: {
  record?: IAgentFronting;
  open: boolean;
  setOpen: Function;
  getData?: Function;
  modal: HookAPI;
  sumdans: Sumdan[];
}) {
  const [data, setData] = useState(record ? record : defaultJenis);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await fetch("/api/agent", {
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
        record
          ? "Update Jenis Pembiayaan " + record.name
          : "Add New Jenis Pembiayaan"
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={[]}
      loading={loading}
      style={{ top: 20 }}
      width={1000}
      destroyOnHidden
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-3">
          <div className="hidden">
            <FormInput
              data={{
                label: "ID",
                mode: "horizontal",
                type: "text",
                value: data.id,
                onChange: (e: string) => setData({ ...data, id: e }),
              }}
            />
          </div>
          <FormInput
            data={{
              label: "Nama Agent Fronting",
              mode: "horizontal",
              required: true,
              type: "text",
              value: data.name,
              onChange: (e: string) => setData({ ...data, name: e }),
            }}
          />
          <FormInput
            data={{
              label: "Kode Agent Fronting",
              mode: "horizontal",
              required: true,
              type: "text",
              value: data.code,
              onChange: (e: string) => setData({ ...data, code: e }),
            }}
          />
          <FormInput
            data={{
              label: "Penganggung Jawab",
              mode: "horizontal",
              required: true,
              type: "text",
              value: data.pic,
              onChange: (e: string) => setData({ ...data, pic: e }),
            }}
          />
          <FormInput
            data={{
              label: "Keterangan",
              mode: "horizontal",
              type: "textarea",
              value: data.description,
              onChange: (e: string) => setData({ ...data, description: e }),
            }}
          />
          <FormInput
            data={{
              label: "Target",
              mode: "horizontal",
              type: "text",
              value: IDRFormat(data.target),
              onChange: (e: string) =>
                setData({ ...data, target: IDRToNumber(e || "0") }),
            }}
          />
          <FormInput
            data={{
              label: "Tatalaksana",
              mode: "horizontal",
              type: "text",
              value: IDRFormat(data.c_gov),
              onChange: (e: string) =>
                setData({ ...data, c_gov: IDRToNumber(e || "0") }),
            }}
          />
          <FormInput
            data={{
              label: "File PKS",
              mode: "horizontal",
              required: true,
              type: "upload",
              value: data.file,
              onChange: (e: string) => setData({ ...data, file: e }),
            }}
          />
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <Divider size="small" style={{ fontSize: 12 }}>
            List mitra yang bisa digunakan
          </Divider>
          {sumdans.map((s, i) => (
            <div key={s.id || i}>
              <Checkbox
                title={s.name}
                // Look for the specific s.id in your data array
                checked={data.SumdanAgentFrontings.some(
                  (item) => item.sumdanId === s.id,
                )}
                onChange={(e) =>
                  setData({
                    ...data,
                    SumdanAgentFrontings: !e.target.checked
                      ? data.SumdanAgentFrontings.filter(
                          (item) => item.sumdanId !== s.id,
                        )
                      : ([
                          ...data.SumdanAgentFrontings,
                          { agentFrontingId: record?.id, sumdanId: s.id },
                        ] as ISumdanAgentFronting[]),
                  })
                }
              >
                {s.name}
              </Checkbox>
            </div>
          ))}
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
      </div>
    </Modal>
  );
}

export function DeleteData({
  record,
  open,
  setOpen,
  getData,
  modal,
}: {
  record?: IAgentFronting;
  open: boolean;
  setOpen: Function;
  getData?: Function;
  modal: HookAPI;
}) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await fetch(`/api/agent?id=${record?.id}`, {
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
      title={"Delete Jenis Pembiayaan " + record?.name}
      destroyOnHidden
    >
      <p>Are you sure you want to delete this agent fronting?</p>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button danger onClick={handleDelete} loading={loading}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

const defaultJenis: IAgentFronting = {
  id: "",
  name: "",
  code: "",
  pic: null,
  description: null,
  file: null,
  target: 0,
  contract_date: null,
  contract_no: null,
  c_fee: 0,
  c_gov: 0,
  Users: [],
  Dapems: [],
  SumdanAgentFrontings: [],

  status: true,
  created_at: new Date(),
  updated_at: new Date(),
};
