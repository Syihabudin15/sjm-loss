"use client";

import { AppstoreOutlined, SaveOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, InputNumber, Select, Spin } from "antd";
import { useEffect, useState } from "react";

interface OTSSetupValues {
  pagesize: number;
  reset_day: number;
  max_dev: number;
  max_daily_get: number;
  produkPembiayaanId: string;
  jenisPembiayaanId: string;
}

interface OTSSetupResponse {
  data: (OTSSetupValues & { id: string }) | null;
  jenis: { id: string; name: string }[];
  sumdan: {
    name: string;
    ProdukPembiayaans: { id: string; name: string }[];
  }[];
  msg?: string;
}

export default function Page() {
  const [form] = Form.useForm<OTSSetupValues>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [jenis, setJenis] = useState<{ value: string; label: string }[]>([]);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const loadSetup = async () => {
      try {
        const response = await fetch("/api/ots_setup");
        const result: OTSSetupResponse = await response.json();
        if (!response.ok) {
          throw new Error(result.msg || "Gagal memuat konfigurasi OTS.");
        }

        setProducts(
          result.sumdan.flatMap((sumdan) =>
            sumdan.ProdukPembiayaans.map((product) => ({
              value: product.id,
              label: `${product.name} - ${sumdan.name}`,
            })),
          ),
        );
        setJenis(
          result.jenis.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        );
        form.setFieldsValue(
          result.data ?? {
            pagesize: 0,
            reset_day: 7,
            max_dev: 2,
            max_daily_get: 3,
          },
        );
      } catch (error) {
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Gagal memuat konfigurasi OTS.",
        });
      } finally {
        setLoading(false);
      }
    };

    void loadSetup();
  }, [form]);

  const saveSetup = async (values: OTSSetupValues) => {
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/ots_setup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.msg || "Gagal menyimpan konfigurasi OTS.");
      }

      form.setFieldsValue(result.data);
      setFeedback({
        type: "success",
        message: "Konfigurasi OTS berhasil disimpan.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan konfigurasi OTS.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2 text-xl font-bold">
          <AppstoreOutlined /> OTS Setup
        </div>
      }
    >
      {feedback && (
        <Alert
          className="mb-4"
          message={feedback.message}
          type={feedback.type}
          showIcon
        />
      )}
      {loading ? (
        <div className="flex justify-center p-8">
          <Spin />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={saveSetup}
          className="max-w-2xl"
        >
          <Form.Item
            label="Produk Pembiayaan"
            name="produkPembiayaanId"
            rules={[{ required: true, message: "Pilih produk pembiayaan." }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Pilih produk pembiayaan"
              options={products}
            />
          </Form.Item>
          <Form.Item
            label="Jenis Pembiayaan"
            name="jenisPembiayaanId"
            rules={[{ required: true, message: "Pilih jenis pembiayaan." }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Pilih jenis pembiayaan"
              options={jenis}
            />
          </Form.Item>
          <Form.Item
            label="Ukuran Halaman"
            name="pagesize"
            rules={[{ required: true, message: "Isi ukuran halaman." }]}
          >
            <InputNumber min={0} precision={0} className="w-full" />
          </Form.Item>
          <Form.Item
            label="Maksimal Get Harian"
            name="max_daily_get"
            rules={[
              { required: true, message: "Isi maksimal get harian." },
              {
                type: "number",
                min: 1,
                message: "Maksimal get harian minimal 1.",
              },
            ]}
          >
            <InputNumber min={1} precision={0} className="w-full" />
          </Form.Item>
          <Form.Item
            label="Hari Reset"
            name="reset_day"
            rules={[
              { required: true, message: "Isi hari reset." },
              {
                type: "number",
                min: 1,
                max: 31,
                message: "Hari reset harus antara 1 dan 31.",
              },
            ]}
          >
            <InputNumber min={1} max={31} precision={0} className="w-full" />
          </Form.Item>
          <Form.Item
            label="Deviasi Maksimum"
            name="max_dev"
            rules={[
              { required: true, message: "Isi deviasi maksimum." },
              {
                type: "number",
                min: 0,
                message: "Deviasi maksimum tidak boleh kurang dari 0.",
              },
            ]}
          >
            <InputNumber min={0} precision={2} className="w-full" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={saving}
          >
            Simpan Konfigurasi
          </Button>
        </Form>
      )}
    </Card>
  );
}
