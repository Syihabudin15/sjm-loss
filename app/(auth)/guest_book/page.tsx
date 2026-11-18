"use client";

import { FormInput } from "@/components";
import { GuestBook, GBookParticipant } from "../../../generated/prisma/client";
import { useAccess } from "@/libs/Permission";
import {
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  SaveOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  TableProps,
  Tag,
} from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

type GuestBookRecord = GuestBook & {
  GbookParticipants: GBookParticipant[];
};

type ParticipantForm = {
  name: string;
  phone: string;
  desc: string;
};

type GuestBookForm = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  date_come: string;
  status_come: boolean;
  desc: string;
  result_desc: string;
  file: string | null;
  GbookParticipants: ParticipantForm[];
};

const emptyForm: GuestBookForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  date_come: moment().format("YYYY-MM-DD"),
  status_come: true,
  desc: "",
  result_desc: "",
  file: null,
  GbookParticipants: [],
};

function toForm(record?: GuestBookRecord): GuestBookForm {
  if (!record) return { ...emptyForm, GbookParticipants: [] };
  return {
    id: record.id,
    name: record.name,
    phone: record.phone || "",
    email: record.email || "",
    address: record.address || "",
    date_come: moment(record.date_come).format("YYYY-MM-DD"),
    status_come: record.status_come,
    desc: record.desc || "",
    result_desc: record.result_desc || "",
    file: record.file,
    GbookParticipants: record.GbookParticipants.map((participant) => ({
      name: participant.name,
      phone: participant.phone || "",
      desc: participant.desc || "",
    })),
  };
}

export default function Page() {
  const { hasAccess } = useAccess("/guest_book");
  const { message } = App.useApp();
  const [data, setData] = useState<GuestBookRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusCome, setStatusCome] = useState("all");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<GuestBookRecord>();
  const [form, setForm] = useState<GuestBookForm>({ ...emptyForm });

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search.trim() && { search: search.trim() }),
        ...(statusCome !== "all" && { statusCome }),
      });
      const response = await fetch(`/api/guest_book?${params}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.msg || "Gagal mengambil data.");
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Gagal mengambil data buku tamu.",
      );
    } finally {
      setLoading(false);
    }
  }, [limit, message, page, search, statusCome]);

  useEffect(() => {
    const timeout = setTimeout(() => void getData(), 250);
    return () => clearTimeout(timeout);
  }, [getData]);

  const openForm = (record?: GuestBookRecord) => {
    setSelected(record);
    setForm(toForm(record));
    setFormOpen(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.date_come) {
      message.warning("Nama dan tanggal kunjungan wajib diisi.");
      return;
    }
    if (form.GbookParticipants.some((participant) => !participant.name.trim())) {
      message.warning("Nama setiap peserta wajib diisi atau hapus baris peserta.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/guest_book", {
        method: selected ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date_come: new Date(`${form.date_come}T00:00:00`).toISOString(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.msg || "Gagal menyimpan data.");
      message.success(result.msg);
      setFormOpen(false);
      await getData();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Gagal menyimpan data buku tamu.",
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (record: GuestBookRecord) => {
    try {
      const response = await fetch(
        `/api/guest_book?id=${encodeURIComponent(record.id)}`,
        { method: "DELETE" },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.msg || "Gagal mengarsipkan data.");
      message.success(result.msg);
      if (data.length === 1 && page > 1) setPage(page - 1);
      else await getData();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Gagal mengarsipkan data buku tamu.",
      );
    }
  };

  const columns: TableProps<GuestBookRecord>["columns"] = [
    {
      title: "No.",
      width: 55,
      render: (_, _record, index) => (page - 1) * limit + index + 1,
    },
    {
      title: "Tanggal Kunjungan",
      dataIndex: "date_come",
      width: 140,
      render: (date: string) => moment(date).format("DD-MM-YYYY"),
    },
    {
      title: "Tamu",
      dataIndex: "name",
      width: 220,
      render: (_: string, record) => (
        <div>
          <div className="font-semibold">{record.name}</div>
          {record.phone && <div className="text-xs">{record.phone}</div>}
          {record.email && <div className="text-xs">{record.email}</div>}
        </div>
      ),
    },
    {
      title: "Alamat",
      dataIndex: "address",
      width: 180,
      render: (value: string | null) => value || "-",
    },
    {
      title: "Peserta",
      dataIndex: "GbookParticipants",
      width: 180,
      render: (participants: GBookParticipant[]) =>
        participants.length ? (
          <div>
            <div>{participants.map((participant) => participant.name).join(", ")}</div>
            <div className="text-xs opacity-70">{participants.length} peserta</div>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Keperluan",
      dataIndex: "desc",
      width: 220,
      render: (value: string | null) => value || "-",
    },
    {
      title: "Hasil / Tindak Lanjut",
      dataIndex: "result_desc",
      width: 220,
      render: (value: string | null) => value || "-",
    },
    {
      title: "Status",
      dataIndex: "status_come",
      width: 110,
      render: (status: boolean) =>
        status ? <Tag color="green">Sudah datang</Tag> : <Tag>Belum datang</Tag>,
    },
    {
      title: "Lampiran",
      dataIndex: "file",
      width: 100,
      render: (file: string | null) =>
        file ? (
          <a href={file} target="_blank" rel="noreferrer">
            <LinkOutlined /> Buka
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space>
          {hasAccess("update") && (
            <Button
              aria-label="Ubah data tamu"
              icon={<EditOutlined />}
              onClick={() => openForm(record)}
              size="small"
              type="primary"
            />
          )}
          {hasAccess("delete") && (
            <Popconfirm
              title="Arsipkan data buku tamu ini?"
              onConfirm={() => void remove(record)}
              okText="Arsipkan"
              cancelText="Batal"
            >
              <Button
                aria-label="Arsipkan data tamu"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<div className="text-xl font-bold">Buku Tamu</div>}
      styles={{ body: { padding: 8 } }}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        {hasAccess("create") && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openForm()}
          >
            Tambah Tamu
          </Button>
        )}
        <Space wrap>
          <Input.Search
            allowClear
            placeholder="Cari nama, kontak, alamat..."
            style={{ width: 260 }}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
          />
          <Select
            value={statusCome}
            style={{ width: 150 }}
            onChange={(value) => {
              setPage(1);
              setStatusCome(value);
            }}
            options={[
              { label: "Semua status", value: "all" },
              { label: "Sudah datang", value: "true" },
              { label: "Belum datang", value: "false" },
            ]}
          />
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        size="small"
        bordered
        loading={loading}
        scroll={{ x: "max-content", y: "58vh" }}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
          onChange: (nextPage, nextLimit) => {
            setPage(nextPage);
            setLimit(nextLimit);
          },
        }}
      />

      <Modal
        title={selected ? `Ubah Data Tamu - ${selected.name}` : "Tambah Tamu"}
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        footer={null}
        width={850}
        style={{ top: 20 }}
        destroyOnHidden
      >
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <FormInput
              data={{
                label: "Nama Tamu",
                mode: "vertical",
                type: "text",
                required: true,
                value: form.name,
                onChange: (value: string) => setForm({ ...form, name: value }),
              }}
            />
            <FormInput
              data={{
                label: "Tanggal Kunjungan",
                mode: "vertical",
                type: "date",
                required: true,
                value: form.date_come,
                onChange: (value: string) => setForm({ ...form, date_come: value }),
              }}
            />
            <FormInput
              data={{
                label: "No. Telepon",
                mode: "vertical",
                type: "text",
                value: form.phone,
                onChange: (value: string) => setForm({ ...form, phone: value }),
              }}
            />
            <FormInput
              data={{
                label: "Email",
                mode: "vertical",
                type: "text",
                value: form.email,
                onChange: (value: string) => setForm({ ...form, email: value }),
              }}
            />
          </div>
          <FormInput
            data={{
              label: "Alamat / Instansi",
              mode: "vertical",
              type: "textarea",
              value: form.address,
              onChange: (value: string) => setForm({ ...form, address: value }),
            }}
          />
          <FormInput
            data={{
              label: "Keperluan",
              mode: "vertical",
              type: "textarea",
              value: form.desc,
              onChange: (value: string) => setForm({ ...form, desc: value }),
            }}
          />
          <FormInput
            data={{
              label: "Hasil / Tindak Lanjut",
              mode: "vertical",
              type: "textarea",
              value: form.result_desc,
              onChange: (value: string) => setForm({ ...form, result_desc: value }),
            }}
          />
          <div className="flex flex-wrap items-center gap-3">
            <span>Status kunjungan</span>
            <Switch
              checked={form.status_come}
              checkedChildren="Sudah datang"
              unCheckedChildren="Belum datang"
              onChange={(checked) => setForm({ ...form, status_come: checked })}
            />
          </div>
          <FormInput
            data={{
              label: "Lampiran",
              mode: "vertical",
              type: "upload",
              accept: ".pdf,image/*",
              value: form.file || undefined,
              onChange: (value: string | undefined) =>
                setForm({ ...form, file: value || null }),
            }}
          />

          <div className="rounded border p-3">
            <div className="mb-2 flex items-center justify-between">
              <strong>Peserta Kunjungan</strong>
              <Button
                size="small"
                icon={<UserAddOutlined />}
                onClick={() =>
                  setForm({
                    ...form,
                    GbookParticipants: [
                      ...form.GbookParticipants,
                      { name: "", phone: "", desc: "" },
                    ],
                  })
                }
              >
                Tambah Peserta
              </Button>
            </div>
            {form.GbookParticipants.map((participant, index) => (
              <div
                className="mb-2 grid items-start gap-2 md:grid-cols-[1fr_1fr_1fr_auto]"
                key={index}
              >
                <Input
                  aria-label={`Nama peserta ${index + 1}`}
                  placeholder="Nama peserta"
                  value={participant.name}
                  onChange={(event) => {
                    const participants = [...form.GbookParticipants];
                    participants[index] = {
                      ...participant,
                      name: event.target.value,
                    };
                    setForm({ ...form, GbookParticipants: participants });
                  }}
                />
                <Input
                  aria-label={`Telepon peserta ${index + 1}`}
                  placeholder="No. telepon"
                  value={participant.phone}
                  onChange={(event) => {
                    const participants = [...form.GbookParticipants];
                    participants[index] = {
                      ...participant,
                      phone: event.target.value,
                    };
                    setForm({ ...form, GbookParticipants: participants });
                  }}
                />
                <Input
                  aria-label={`Keterangan peserta ${index + 1}`}
                  placeholder="Keterangan"
                  value={participant.desc}
                  onChange={(event) => {
                    const participants = [...form.GbookParticipants];
                    participants[index] = {
                      ...participant,
                      desc: event.target.value,
                    };
                    setForm({ ...form, GbookParticipants: participants });
                  }}
                />
                <Button
                  aria-label={`Hapus peserta ${index + 1}`}
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    setForm({
                      ...form,
                      GbookParticipants: form.GbookParticipants.filter(
                        (_, participantIndex) => participantIndex !== index,
                      ),
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setFormOpen(false)}>Batal</Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={() => void save()}
            >
              Simpan
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}