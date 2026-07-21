"use client";

import { FormInput } from "@/components";
import { TypeAccount } from "@/components/utils/CompUtils";
import { IDRFormat, IDRToNumber } from "@/components/utils/PembiayaanUtil";
import {
  IActionTable,
  IJournalDetail,
  IJournalEntry,
  IPageProps,
} from "@/libs/IInterfaces";
import { useAccess } from "@/libs/Permission";
import {
  AccountBookOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type {
  CategoryOfAccount,
  JournalEntry,
  User,
} from "../../../../generated/prisma/client";
import {
  Table,
  DatePicker,
  Input,
  Button,
  Select,
  Card,
  Modal,
  TableProps,
  App,
  Tag,
} from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import moment from "moment";
import { useEffect, useState } from "react";
const { RangePicker } = DatePicker;

export default function Page() {
  const [pageProps, setPageProps] = useState<IPageProps<IJournalEntry>>({
    page: 1,
    limit: 50,
    total: 0,
    data: [],
    search: "",
    backdate: "",
    coaId: "",
  });
  const [action, setAction] = useState<IActionTable<IJournalEntry>>({
    upsert: false,
    delete: false,
    proses: false,
    selected: undefined,
  });
  const [anggotas, setanggotas] = useState<User[]>([]);
  const [akuns, setAkuns] = useState<CategoryOfAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const { modal } = App.useApp();
  const { hasAccess } = useAccess("/lapkeu/jurnal");

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("page", pageProps.page.toString());
    params.append("limit", pageProps.limit.toString());
    if (pageProps.search) params.append("search", pageProps.search);
    if (pageProps.backdate) params.append("backdate", pageProps.backdate);
    if (pageProps.coaId) params.append("coaId", pageProps.coaId);

    const res = await fetch(`/api/journal?${params.toString()}`);
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
    pageProps.backdate,
    pageProps.coaId,
  ]);

  useEffect(() => {
    (async () => {
      await fetch("/api/user?limit=1000")
        .then((res) => res.json())
        .then((res) => setanggotas(res.data));
      await fetch("/api/coa?limit=1000")
        .then((res) => res.json())
        .then((res) => setAkuns(res.data));
    })();
  }, []);

  const columns: TableProps<IJournalEntry>["columns"] = [
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
      title: "Tanggal Transaksi",
      dataIndex: "date",
      key: "date",
      render(value, record, index) {
        return <div>{moment(record.date).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      title: "Jumlah Transaksi",
      dataIndex: "count",
      key: "count",
      render(value, record, index) {
        return <div>{record.JournalDetails.length}</div>;
      },
    },
    {
      title: "Debet / Kredit",
      dataIndex: "dc",
      key: "dc",
      render(value, record, index) {
        return (
          <div className="text-right">
            {IDRFormat(
              record.JournalDetails.reduce((acc, curr) => acc + curr.debit, 0),
            )}{" "}
            /{" "}
            {IDRFormat(
              record.JournalDetails.reduce((acc, curr) => acc + curr.credit, 0),
            )}
          </div>
        );
      },
    },
    {
      title: "Aksi",
      dataIndex: "action",
      key: "action",
      render(value, record, index) {
        return (
          <div className="flex gap-1 justify-center items-center">
            {hasAccess("update") && (
              <Button
                icon={<EditOutlined />}
                type="primary"
                size="small"
                onClick={() =>
                  setAction({ ...action, upsert: true, selected: record })
                }
              ></Button>
            )}
            {hasAccess("delete") && (
              <Button
                icon={<DeleteOutlined />}
                type="primary"
                danger
                size="small"
                onClick={() =>
                  setAction({ ...action, delete: true, selected: record })
                }
              ></Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Card
      title={
        <div className="flex gap-2 font-bold text-xl">
          <AccountBookOutlined /> JournalEntry
        </div>
      }
      styles={{ body: { padding: 5 } }}
    >
      <div className="flex justify-between my-1 gap-2 overflow-auto">
        <div className="flex gap-2">
          {hasAccess("write") && (
            <Button
              size="small"
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => setAction({ ...action, upsert: true })}
            >
              Add New
            </Button>
          )}
          <RangePicker
            style={{ width: 170 }}
            size="small"
            onChange={(date, dateStr) =>
              setPageProps({ ...pageProps, backdate: dateStr })
            }
          />
          <Select
            style={{ width: 170 }}
            placeholder="pilih akun..."
            size="small"
            options={akuns.map((a) => ({
              label: `(${a.id}) ${a.name}`,
              value: a.id,
            }))}
            onChange={(e) => setPageProps({ ...pageProps, coaId: e })}
            allowClear
          />
        </div>
        <Input.Search
          size="small"
          style={{ width: 170 }}
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
        scroll={{ x: "max-content", y: "60vh" }}
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
        }}
        expandable={{
          expandedRowRender: (record) => {
            return <ListJournalDetail records={record} />;
          },
        }}
      />
      <UpsertData
        open={action.upsert}
        setOpen={(val: boolean) => setAction({ ...action, upsert: val })}
        getData={getData}
        record={action.selected}
        key={action.selected ? "upsert" + action.selected.id : "create"}
        anggotas={anggotas}
        akuns={akuns}
        hook={modal}
      />
      {action.selected && (
        <DeleteData
          open={action.delete}
          setOpen={(val: boolean) => setAction({ ...action, delete: val })}
          getData={getData}
          record={action.selected}
          key={action.selected ? "delete" + action.selected.id : "del"}
          hook={modal}
        />
      )}
    </Card>
  );
}

const UpsertData = ({
  open,
  setOpen,
  getData,
  record,
  anggotas,
  akuns,
  hook,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  getData: () => Promise<void>;
  record?: IJournalEntry;
  anggotas: User[];
  akuns: CategoryOfAccount[];
  hook: HookAPI;
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IJournalEntry>(record || defaultData);

  // Kalkulasi total di luar render return agar lebih bersih
  const totalDebit = data.JournalDetails.reduce(
    (acc, curr) => acc + curr.debit,
    0,
  );
  const totalCredit = data.JournalDetails.reduce(
    (acc, curr) => acc + curr.credit,
    0,
  );
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSubmit = async () => {
    // 1. Validasi Dasar
    if (!isBalanced) {
      return hook.error({
        title: "TIDAK SEIMBANG",
        content: "Total Debit dan Kredit harus sama dan tidak boleh nol.",
      });
    }

    setLoading(true);

    // 2. Bersihkan baris kosong
    const payload = {
      ...data,
      JournalDetails: data.JournalDetails.filter(
        (d) => d.debit !== 0 || d.credit !== 0 || d.categoryOfAccountId,
      ),
    };

    try {
      const res = await fetch("/api/journal", {
        method: record ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.status === 200) {
        hook.success({
          title: "BERHASIL",
          content: "Journal berhasil disimpan",
        });
        setOpen(false);
        await getData();
      } else {
        hook.error({ title: "ERROR", content: json.msg });
      }
    } catch (err) {
      hook.error({ title: "ERROR", content: "Terjadi kesalahan pada server" });
    } finally {
      setLoading(false);
    }
  };

  const updateDetail = (index: number, fields: Partial<IJournalDetail>) => {
    setData((prev) => ({
      ...prev,
      JournalDetails: prev.JournalDetails.map((item, i) =>
        i === index ? { ...item, ...fields } : item,
      ),
    }));
  };

  const removeRow = (index: number) => {
    setData((prev) => ({
      ...prev,
      JournalDetails: prev.JournalDetails.filter((_, i) => i !== index),
    }));
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title={record ? "Ubah Journal Entry" : "Buat Journal Entry"}
      width={1200}
      style={{ top: 10 }}
      confirmLoading={loading}
      onOk={handleSubmit}
      okButtonProps={{ disabled: !isBalanced }} // Disable jika tidak balance
      okText="Simpan Jurnal"
    >
      <div className="flex gap-4 flex-wrap mt-4">
        <FormInput
          data={{
            label: "Tanggal Transaksi",
            type: "date",
            class: "w-full md:w-1/3",
            required: true,
            value: moment(data.date).format("YYYY-MM-DD"),
            onChange: (e: string) => setData({ ...data, date: new Date(e) }),
          }}
        />

        <div className="w-full border rounded-md p-4 bg-gray-50">
          <p className="font-bold text-gray-700 mb-4 border-b pb-2">
            Detail Transaksi
          </p>

          {/* Header */}
          <div className="hidden md:flex gap-4 mb-2 font-bold text-xs text-gray-500 px-2">
            <div className="flex-1">KETERANGAN</div>
            <div className="w-40">DEBIT</div>
            <div className="w-40">KREDIT</div>
            <div className="w-48">AKUN</div>
            <div className="w-48">ANGGOTA</div>
            <div className="w-10"></div>
          </div>

          {/* Rows */}
          <div className="space-y-3">
            {data.JournalDetails.map((d, i) => (
              <div
                className="flex gap-4 flex-wrap md:flex-nowrap items-start bg-white p-2 rounded shadow-sm"
                key={i}
              >
                <div className="flex-1 min-w-50">
                  <Input.TextArea
                    rows={1}
                    placeholder="Keterangan..."
                    value={d.desciption || ""}
                    onChange={(e) =>
                      updateDetail(i, { desciption: e.target.value })
                    }
                  />
                </div>
                <div className="w-40">
                  <Input
                    placeholder="Debit"
                    value={IDRFormat(d.debit)}
                    onChange={(e) =>
                      updateDetail(i, { debit: IDRToNumber(e.target.value) })
                    }
                    className="text-right"
                  />
                </div>
                <div className="w-40">
                  <Input
                    placeholder="Kredit"
                    value={IDRFormat(d.credit)}
                    onChange={(e) =>
                      updateDetail(i, { credit: IDRToNumber(e.target.value) })
                    }
                    className="text-right"
                  />
                </div>
                <div className="w-48">
                  <Select
                    className="w-full"
                    showSearch
                    placeholder="Pilih Akun"
                    options={akuns.map((a) => ({
                      label: `(${a.id}) ${a.name}`,
                      value: a.id,
                    }))}
                    value={d.categoryOfAccountId}
                    onChange={(v) =>
                      updateDetail(i, { categoryOfAccountId: v })
                    }
                  />
                </div>
                <div className="w-48">
                  <Select
                    className="w-full"
                    showSearch
                    placeholder="Pilih Anggota"
                    options={anggotas.map((a) => ({
                      label: a.fullname,
                      value: a.id,
                    }))}
                    value={d.userId}
                    onChange={(v) => updateDetail(i, { userId: v })}
                  />
                </div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeRow(i)}
                />
              </div>
            ))}
          </div>

          {/* Footer Summary */}
          <div className="mt-6 pt-4 border-t border-gray-300">
            <div className="flex justify-end gap-10 items-center">
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Total Debit
                </p>
                <p className="text-lg font-mono">{IDRFormat(totalDebit)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Total Kredit
                </p>
                <p className="text-lg font-mono">{IDRFormat(totalCredit)}</p>
              </div>
              <div className="min-w-37.5 text-right">
                {totalDebit !== totalCredit ? (
                  <Tag color="error" className="m-0">
                    Selisih: {IDRFormat(Math.abs(totalDebit - totalCredit))}
                  </Tag>
                ) : totalDebit > 0 ? (
                  <Tag color="success" className="m-0">
                    Seimbang (Balanced)
                  </Tag>
                ) : null}
              </div>
            </div>
          </div>

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            block
            className="mt-4"
            onClick={() =>
              setData({
                ...data,
                JournalDetails: [...data.JournalDetails, { ...defaultJournal }],
              })
            }
          >
            Tambah Baris Transaksi
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const ListJournalDetail = ({ records }: { records: IJournalEntry }) => {
  const columns: TableProps<IJournalDetail>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render(value, record, index) {
        return (
          <div>
            <div>{index + 1}</div>
            <div className="opacity-70 text-xs italic">{record.id}</div>
          </div>
        );
      },
    },
    {
      title: "Keterangan",
      dataIndex: "desciption",
      key: "desciption",
      className: "text-xs italic",
    },
    {
      title: "ID Akun & Anggota",
      dataIndex: "akun",
      key: "akun",
      render(value, record, index) {
        return (
          <div className="italic text-xs">
            <div>
              ({TypeAccount(record.CategoryOfAccount)}-
              {record.CategoryOfAccount.id}) {record.CategoryOfAccount.name}
            </div>
            <div className="opacity-80">
              {record.User && `${record.User.fullname} (${record.User.nip})`}
            </div>
          </div>
        );
      },
    },
    {
      title: "Debit",
      dataIndex: "db",
      key: "db",
      render(value, record, index) {
        return <div className="text-right">{IDRFormat(record.debit)}</div>;
      },
    },
    {
      title: "Kredit",
      dataIndex: "cr",
      key: "cr",
      render(value, record, index) {
        return <div className="text-right">{IDRFormat(record.credit)}</div>;
      },
    },
  ];

  return (
    <div className="ms-15">
      <Table
        columns={columns}
        dataSource={records.JournalDetails}
        rowKey={"id"}
        pagination={false}
        size="small"
        bordered
      />
    </div>
  );
};

const DeleteData = ({
  open,
  setOpen,
  record,
  getData,
  hook,
}: {
  open: boolean;
  setOpen: Function;
  record: IJournalEntry;
  getData: Function;
  hook: HookAPI;
}) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    await fetch("/api/journal?id=" + record.id, { method: "DELETE" })
      .then((res) => res.json())
      .then(async (res) => {
        const { msg, status } = res;
        if (status === 200) {
          await getData();
          setOpen(false);
        } else {
          hook.error({ content: msg });
        }
      })
      .catch((err) => {
        console.log(err);
        hook.error({
          content: `Internal Server Error!!. Hapus data COA ${record.id}) gagal`,
        });
      });
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title="Konfirmasi Hapus"
      loading={loading}
      onOk={handleDelete}
    >
      <p className="my-3">
        Konfirmasi penghapusan Transaksi ini *{record.id}*?
      </p>
    </Modal>
  );
};

const defaultJournal: IJournalDetail = {
  id: "1",
  debit: 0,
  credit: 0,
  desciption: "",
  categoryOfAccountId: "",
  journalEntryId: "1",
  userId: null,
  JournalEntry: {} as JournalEntry,
  CategoryOfAccount: {} as CategoryOfAccount,
  User: null,
};

const defaultData: IJournalEntry = {
  id: "1",
  date: new Date(),
  JournalDetails: [defaultJournal],
};
