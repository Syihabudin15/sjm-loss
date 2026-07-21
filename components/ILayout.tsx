"use client";

import {
  BellOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Badge, Button, Drawer, Dropdown, Layout, Menu, Modal } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";
import { listMenuUI, MenuPermission } from "./IMenu";
import { useAccess } from "@/libs/Permission";
import Link from "next/link";

const { Header, Content, Sider } = Layout;

export default function ILayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const router = useRouter();
  const user = useUser();
  const { crossAccess } = useAccess("/");

  const [notif, setNotif] = useState({
    draft: 0,
    verif: 0,
    slik: 0,
    approv: 0,
    akad: 0,
    printSI: 0,
    SI: 0,
    printSD: 0,
    SD: 0,
    printTTPJ: 0,
    TTPJ: 0,
    count: 0,
    pelunasan: 0,
  });

  // 1. Bungkus getNotif dengan useCallback agar referensi fungsinya stabil
  const getNotif = useCallback(async () => {
    if (!user) return; // Jangan panggil API jika user belum termuat/null

    try {
      const res = await fetch("/api/notif");
      const result = await res.json();

      if (result.data) {
        let c = 0;
        if (crossAccess("update", "/monitoring"))
          c += result.data.draft + result.data.akad;
        if (crossAccess("read", "/proses/verif")) c += result.data.verif;
        if (crossAccess("read", "/proses/slik")) c += result.data.slik;
        if (crossAccess("read", "/proses/approv")) c += result.data.approv;
        if (crossAccess("read", "/pencairan/print")) c += result.data.printSI;
        if (crossAccess("read", "/pencairan/dropping")) c += result.data.SI;
        if (crossAccess("read", "/ttpb/print")) c += result.data.printSD;
        if (crossAccess("read", "/ttpb/dropping")) c += result.data.SD;
        if (crossAccess("read", "/ttpj/print")) c += result.data.printTTPJ;
        if (crossAccess("read", "/ttpj/dropping")) c += result.data.TTPJ;
        if (crossAccess("read", "/pelunasan")) c += result.data.pelunasan;

        setNotif({ ...result.data, count: c });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [user, crossAccess]); // Hanya dibuat ulang jika user atau hak akses berubah

  // 2. Misahkan window resize listener agar tidak terganggu oleh perubahan state user
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // 3. Efek khusus untuk pooling notifikasi (Sangat aman dari penumpukan/looping)
  useEffect(() => {
    if (!user) return;

    getNotif(); // Panggil sekali saat user pertama kali siap

    // Naikkan interval menjadi 10 atau 15 detik agar meringankan beban server database Anda
    const interval = setInterval(getNotif, 1000 * 60 * 5);

    return () => clearInterval(interval);
  }, [user, getNotif]);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth", { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        window.location.replace("/");
      });
    setLoading(false);
  };

  const isMobile = windowWidth < 600;

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      {/* ... kode komponen Anda tetap dipertahankan ... */}
      <Sider
        breakpoint="xs"
        collapsedWidth={isMobile ? 0 : 80}
        collapsed={collapsed}
        onCollapse={(value: boolean) => setCollapsed(value)}
        width={260}
        hidden={isMobile}
        theme="light"
        style={{
          margin: "12px 0 12px 12px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          height: "calc(100vh - 24px)",
          position: "sticky",
          top: 12,
          left: 0,
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        <div
          style={{
            margin: "12px",
            padding: collapsed ? "12px 4px" : "16px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "#fff",
            boxShadow: "0 8px 16px rgba(15, 23, 42, 0.2)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: collapsed ? "column" : "row",
            alignItems: "center",
            gap: collapsed ? 8 : 12,
            transition: "all 0.3s",
          }}
        >
          <div
            style={{
              width: collapsed ? 40 : 52,
              height: collapsed ? 40 : 52,
              borderRadius: "50%",
              padding: 2,
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              flexShrink: 0,
            }}
          >
            <img
              src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
              alt="profile"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                background: "#fff",
              }}
            />
          </div>

          {!collapsed && (
            <div
              style={{
                textAlign: "left",
                lineHeight: 1.4,
                zIndex: 1,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.fullname}
              </div>
              <div style={{ opacity: 0.65, fontSize: 11, marginBottom: 4 }}>
                @{user?.username}
              </div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: "6px",
                  padding: "2px 8px",
                  fontSize: 10,
                  fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {user?.sumdan
                  ? user.sumdan
                  : `${user?.position} · ${user?.cabang}`}
              </div>
            </div>
          )}

          {!collapsed && (
            <Button
              size="small"
              type="text"
              icon={
                <DoubleLeftOutlined
                  style={{ color: "rgba(255,255,255,0.6)" }}
                />
              }
              onClick={() => setCollapsed(true)}
              style={{ position: "absolute", top: 8, right: 4 }}
            />
          )}
        </div>

        {collapsed && (
          <div className="flex justify-center w-full my-2">
            <Button
              size="small"
              type="text"
              icon={<DoubleRightOutlined />}
              onClick={() => setCollapsed(false)}
            />
          </div>
        )}

        {user && (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingBottom: 24,
              height: 470,
            }}
            className="custom-scrollbar"
          >
            <Menu
              theme="dark"
              mode="inline"
              style={{ borderRight: "none" }}
              items={MenuPermission(
                listMenuUI,
                JSON.parse(user.Role.permission || "").map((p: any) => p.path),
              )}
              onClick={(e) => router.push(e.key)}
            />
          </div>
        )}
      </Sider>

      <Layout style={{ background: "transparent" }}>
        <Header
          style={{
            margin: "12px 12px 0 12px",
            padding: "0 20px",
            height: 56,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          }}
        >
          <div className="flex items-center gap-3">
            {process.env.NEXT_PUBLIC_APP_LOGO && (
              <img
                width={32}
                height={32}
                src={process.env.NEXT_PUBLIC_APP_LOGO}
                alt="Logo"
                style={{ objectFit: "contain" }}
              />
            )}
            <span
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: "#0f172a",
                letterSpacing: "-0.5px",
              }}
            >
              {process.env.NEXT_PUBLIC_APP_SHORTNAME}
            </span>
          </div>

          <div className="flex gap-3 items-center">
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              popupRender={() => (
                <div
                  style={{
                    width: 280,
                    maxHeight: 350,
                    overflowY: "auto",
                    padding: "12px",
                    background: "white",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: "#64748b",
                      marginBottom: 4,
                      paddingBottom: 4,
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    Pusat Notifikasi Aplikasi
                  </div>
                  <Notify
                    crossAccess={crossAccess("update", "/monitoring")}
                    url="/monitoring"
                    name="DRAFT"
                    count={notif.draft}
                  />
                  <Notify
                    crossAccess={crossAccess("update", "/monitoring")}
                    url="/monitoring"
                    name="AKAD"
                    count={notif.akad}
                  />
                  <Notify
                    crossAccess={crossAccess("read", "/proses/verif")}
                    url="/proses/verif"
                    name="VERIF"
                    count={notif.verif}
                  />
                  <Notify
                    crossAccess={crossAccess("read", "/proses/slik")}
                    url="/proses/slik"
                    name="SLIK"
                    count={notif.slik}
                  />
                  <Notify
                    crossAccess={crossAccess("read", "/proses/approv")}
                    url="/proses/approv"
                    name="APPROV"
                    count={notif.approv}
                  />
                  <Notify
                    crossAccess={crossAccess("read", "/pencairan/print")}
                    url="/pencairan/print"
                    name="CETAK SI"
                    count={notif.printSI}
                  />
                  <Notify
                    crossAccess={crossAccess("read", "/pencairan/dropping")}
                    url="/pencairan/dropping"
                    name="DROPPING"
                    count={notif.SI}
                  />
                  <Notify
                    crossAccess={crossAccess("read", "/ttpb/print")}
                    url="/ttpb/print"
                    name="CETAK SD"
                    count={notif.printSD}
                  />
                  <Notify
                    crossAccess={crossAccess("read", "/ttpb/dropping")}
                    url="/ttpb/dropping"
                    name="Penyerahan Document"
                    count={notif.SD}
                  />
                  <Notify
                    crossAccess={crossAccess("read", "/ttpj/print")}
                    url="/ttpj/print"
                    name="CETAK TTPJ"
                    count={notif.printTTPJ}
                  />
                  <Notify
                    crossAccess={crossAccess("read", "/ttpj/dropping")}
                    url="/ttpj/dropping"
                    name="Penyerahan Jaminan"
                    count={notif.TTPJ}
                  />
                  <Notify
                    crossAccess={crossAccess("read", "/pelunasan")}
                    url="/pelunasan"
                    name="Pelunasan"
                    count={notif.pelunasan}
                  />
                </div>
              )}
            >
              <Button
                type="text"
                shape="circle"
                style={{ background: "#f8fafc" }}
                icon={
                  <Badge count={notif.count} size="small" overflowCount={99}>
                    <BellOutlined style={{ fontSize: 18, color: "#64748b" }} />
                  </Badge>
                }
              />
            </Dropdown>

            <Button
              type="text"
              danger
              shape="circle"
              style={{ background: "#fef2f2" }}
              icon={<LogoutOutlined style={{ fontSize: 16 }} />}
              onClick={() => setOpen(true)}
            />

            {isMobile && (
              <Button
                type="text"
                shape="circle"
                icon={<MenuOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
          </div>
        </Header>

        <Content
          style={{
            margin: "12px",
            background: "#fff",
            borderRadius: "16px",
            padding: "15px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
          }}
          className="custom-scrollbar"
        >
          <div style={{ minHeight: 360 }}>{children}</div>
        </Content>
      </Layout>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="Konfirmasi Keluar Aplikasi"
        onOk={handleLogout}
        confirmLoading={loading}
        okText="Ya, Keluar"
        cancelText="Batal"
        okButtonProps={{ danger: true, style: { borderRadius: "8px" } }}
        cancelButtonProps={{ style: { borderRadius: "8px" } }}
      >
        <p style={{ color: "#64748b" }}>
          Apakah Anda yakin ingin mengakhiri sesi ini? Anda harus login kembali
          untuk mengakses data.
        </p>
      </Modal>

      {isMobile && (
        <Drawer
          placement="left"
          size="75vw"
          open={!collapsed}
          onClose={() => setCollapsed(true)}
          title={
            <div className="flex items-center gap-2">
              <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                MENU UTAMA
              </span>
            </div>
          }
          styles={{ body: { padding: "8px 0" } }}
        >
          {user && (
            <Menu
              mode="inline"
              style={{ borderRight: "none" }}
              items={MenuPermission(
                listMenuUI,
                JSON.parse(user.Role.permission || "").map((p: any) => p.path),
              )}
              onClick={(e) => {
                router.push(e.key);
                setCollapsed(true);
              }}
            />
          )}
        </Drawer>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </Layout>
  );
}

// Komponen Notify dipisah ke bawah tetap dipertahankan seperti semula
const Notify = ({
  url,
  name,
  count,
  crossAccess,
}: {
  url: string;
  name: string;
  count: number;
  crossAccess: boolean;
}) => {
  if (!crossAccess) return null;
  return (
    <Link
      href={url}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: "8px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        textDecoration: "none",
        transition: "all 0.2s",
      }}
      className="hover:bg-slate-100"
    >
      <span style={{ color: "#334155", fontSize: "12px", fontWeight: 500 }}>
        {name}
      </span>
      {count > 0 ? (
        <span
          style={{
            background: "#ef4444",
            color: "#fff",
            padding: "1px 8px",
            borderRadius: "10px",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          {count}
        </span>
      ) : (
        <span style={{ color: "#94a3b8", fontSize: "11px" }}>0</span>
      )}
    </Link>
  );
};
