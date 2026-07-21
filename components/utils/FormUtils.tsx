"use client";

import { CloudUploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Input, Select, Upload, UploadProps } from "antd";
import { useState } from "react";

export interface IFormInput {
  label: string;
  value?: any;
  onChange?: Function;
  prefix?: any;
  suffix?: any;
  mode?: "vertical" | "horizontal";
  type?:
    | "text"
    | "number"
    | "select"
    | "date"
    | "textarea"
    | "password"
    | "upload";
  options?: Array<{
    label: string;
    value: any;
    children?: Array<{ label: string; value: any }>;
  }>;
  disabled?: boolean;
  required?: boolean;
  labelIcon?: any;
  class?: any;
  accept?: string;
  hidden?: boolean;
}

export const FormInput = ({ data }: { data: IFormInput }) => {
  return (
    <div
      className={`flex ${
        data.mode === "vertical" ? "flex-col" : "items-center gap-2"
      }  ${data.class}`}
      hidden={data.hidden}
    >
      <p className="w-52">
        {data.labelIcon && <span className="mr-1">{data.labelIcon}</span>}
        {data.label}
        {data.required && <span style={{ color: "red" }}>*</span>}
      </p>
      {data.type === "text" && (
        <Input
          value={data.value}
          onChange={(e) => data.onChange && data.onChange(e.target.value)}
          prefix={data.prefix}
          suffix={data.suffix}
          disabled={data.disabled}
          required={data.required}
          style={{ color: "black" }}
          allowClear
        />
      )}
      {data.type === "date" && (
        <Input
          type={"date"}
          value={data.value}
          onChange={(e) => data.onChange && data.onChange(e.target.value)}
          prefix={data.prefix}
          suffix={data.suffix}
          disabled={data.disabled}
          required={data.required}
          style={{ color: "black" }}
          allowClear
        />
      )}
      {data.type === "number" && (
        <Input
          type={"number"}
          value={data.value}
          onChange={(e) => data.onChange && data.onChange(e.target.value)}
          prefix={data.prefix}
          suffix={data.suffix}
          disabled={data.disabled}
          required={data.required}
          style={{ color: "black" }}
          allowClear
        />
      )}
      {data.type === "textarea" && (
        <Input.TextArea
          value={data.value}
          onChange={(e) => data.onChange && data.onChange(e.target.value)}
          prefix={data.prefix}
          disabled={data.disabled}
          required={data.required}
          style={{ color: "black" }}
          allowClear
        />
      )}
      {data.type === "select" && (
        <Select
          options={data.options}
          value={data.value}
          onChange={(e) => data.onChange && data.onChange(e)}
          prefix={data.prefix}
          suffix={data.suffix}
          disabled={data.disabled}
          allowClear
          style={{ width: "100%" }}
          showSearch
          optionFilterProp="label"
        />
      )}
      {data.type === "password" && (
        <Input.Password
          value={data.value}
          onChange={(e) => data.onChange && data.onChange(e.target.value)}
          prefix={data.prefix}
          suffix={data.suffix}
          disabled={data.disabled}
          required={data.required}
          style={{ color: "black" }}
        />
      )}
      {data.type === "upload" && (
        <UploadComponents
          accept={data.accept || ""}
          file={data.value}
          setFile={(e: string) => data.onChange && data.onChange(e)}
          disable={data.disabled}
        />
      )}
    </div>
  );
};

const UploadComponents = ({
  file,
  setFile,
  accept,
  disable,
}: {
  file: string | undefined;
  setFile: Function;
  accept: string;
  disable?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleUpload = async (fileObj: File) => {
    setError(undefined); // Reset error status

    try {
      // Langkah 1: Minta URL SAS khusus dari API backend Anda
      const resSas = await fetch(`/api/upload/sas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: fileObj.name,
          filetype: fileObj.type,
        }),
      });

      const sasData = await resSas.json();

      if (!resSas.ok || !sasData.uploadUrl) {
        setError(
          sasData.message || "Gagal mendapatkan izin upload (SAS Token)",
        );
        return;
      }

      // Langkah 2: Upload file mentah langsung ke Azure Storage menggunakan PUT
      const resAzure = await fetch(sasData.uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "x-ms-blob-content-type": fileObj.type || "application/octet-stream",
          "x-ms-blob-content-disposition": "inline",
          "Content-Type": fileObj.type || "application/octet-stream",
        },
        body: fileObj,
      });

      if (resAzure.ok) {
        // Simpan secure_url bersih (tanpa token) ke state/database Anda
        setFile(sasData.secure_url);
      } else {
        setError("Gagal mengunggah berkas langsung ke Azure Storage.");
      }
    } catch (err) {
      console.error(err);
      setError("Internal Server Error saat proses upload.");
    }
  };

  const handleDeleteFiles = async () => {
    setLoading(true);
    setFile(undefined);
    setLoading(false);
  };

  const props: UploadProps = {
    beforeUpload: async (file) => {
      setLoading(true);
      // Antd melemparkan objek file di sini
      await handleUpload(file as File);
      setLoading(false);
      return false; // Mencegah Antd melakukan upload otomatis bawaan mereka
    },
    showUploadList: false,
    accept: accept,
  };

  return (
    <div>
      {file ? (
        <div className="flex gap-2 items-center">
          <p>{file.substring(0, 30) + "..."}</p>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteFiles()}
            loading={loading}
            disabled={disable}
          ></Button>
        </div>
      ) : (
        <div>
          <Upload {...props}>
            <Button
              size="small"
              icon={<CloudUploadOutlined />}
              loading={loading}
              disabled={disable}
            >
              Upload Berkas
            </Button>
          </Upload>
          {error && <p className="italic text-red-500 text-xs mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
};
