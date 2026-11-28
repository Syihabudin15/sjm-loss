"use client";

import {
  MessageCircle,
  RefreshCw,
  Search,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface WhatsAppGroup {
  id: string;
  subject: string;
  participantsCount: number;
}

interface WhatsAppGroupsResponse {
  ok: boolean;
  total?: number;
  groups?: WhatsAppGroup[];
  error?: string;
  message?: string;
}

export default function WhatsAppGroupsPage() {
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/whatsapp", { cache: "no-store" });
      const result = (await response.json()) as WhatsAppGroupsResponse;

      if (!response.ok || !result.ok || !Array.isArray(result.groups)) {
        throw new Error(
          result.error || result.message || "Daftar grup WhatsApp gagal dimuat.",
        );
      }

      setGroups(result.groups);
      setLastUpdated(new Date());
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Terjadi kesalahan saat mengambil daftar grup.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadGroups();
    }, 0);
    return () => clearTimeout(timeout);
  }, [loadGroups]);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id");
    if (!query) return groups;

    return groups.filter((group) =>
      (group.subject || "").toLocaleLowerCase("id").includes(query),
    );
  }, [groups, search]);

  const totalMembers = groups.reduce(
    (total, group) => total + group.participantsCount,
    0,
  );

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 px-6 py-7 text-white shadow-xl shadow-emerald-900/10 sm:px-9 sm:py-9">
          <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full border-[34px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-36 right-40 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-50 backdrop-blur">
                <MessageCircle size={15} />
                PUSAT GRUP WHATSAPP
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Temukan grup Anda
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/90 sm:text-base">
                Lihat grup WhatsApp yang terhubung dan cari grup dengan mudah
                berdasarkan nama.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur md:self-auto">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                {error ? <WifiOff size={20} /> : <Wifi size={20} />}
              </span>
              <div>
                <p className="text-xs text-emerald-50/75">Status koneksi</p>
                <p className="mt-0.5 text-sm font-semibold">
                  {loading ? "Memeriksa..." : error ? "Tidak terhubung" : "Terhubung"}
                </p>
              </div>
              <span
                className={`ml-2 h-2.5 w-2.5 rounded-full ${
                  loading
                    ? "animate-pulse bg-amber-300"
                    : error
                      ? "bg-rose-300"
                      : "bg-emerald-200"
                }`}
              />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <MessageCircle size={22} />
              </span>
              <div>
                <p className="text-sm text-slate-500">Total grup</p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                  {loading && groups.length === 0 ? "—" : groups.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Users size={22} />
              </span>
              <div>
                <p className="text-sm text-slate-500">Total anggota grup</p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                  {loading && groups.length === 0
                    ? "—"
                    : totalMembers.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Daftar grup
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? `${filteredGroups.length} grup ditemukan`
                  : lastUpdated
                    ? `Diperbarui ${lastUpdated.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "Grup WhatsApp yang terhubung"}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative block sm:w-72">
                <Search
                  aria-hidden="true"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
                <input
                  aria-label="Cari grup berdasarkan nama"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama grup..."
                  type="search"
                  value={search}
                />
              </label>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                onClick={() => void loadGroups()}
                type="button"
              >
                <RefreshCw
                  className={loading ? "animate-spin" : ""}
                  size={16}
                />
                Muat ulang
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {error ? (
              <div
                className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-8 text-center"
                role="alert"
              >
                <WifiOff className="mx-auto text-rose-500" size={28} />
                <h3 className="mt-3 font-semibold text-slate-900">
                  Grup belum dapat ditampilkan
                </h3>
                <p className="mx-auto mt-1 max-w-lg text-sm text-slate-600">
                  {error}
                </p>
                <button
                  className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                  onClick={() => void loadGroups()}
                  type="button"
                >
                  Coba lagi
                </button>
              </div>
            ) : loading && groups.length === 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    className="h-28 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
                    key={index}
                  />
                ))}
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-14 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Search size={24} />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">
                  {search ? "Grup tidak ditemukan" : "Belum ada grup"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {search
                    ? "Coba kata kunci lain atau periksa kembali nama grup."
                    : "Grup WhatsApp yang terhubung akan muncul di sini."}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredGroups.map((group, index) => {
                  const name = group.subject?.trim() || "Grup tanpa nama";
                  const initials = name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((word) => word.charAt(0))
                    .join("")
                    .toLocaleUpperCase("id");

                  return (
                    <article
                      className="group rounded-2xl border border-slate-200/80 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5"
                      key={group.id}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                            index % 3 === 0
                              ? "bg-emerald-100 text-emerald-700"
                              : index % 3 === 1
                                ? "bg-teal-100 text-teal-700"
                                : "bg-cyan-100 text-cyan-700"
                          }`}
                        >
                          {initials || "WA"}
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <h3 className="truncate font-semibold text-slate-900">
                            {name}
                          </h3>
                          <p className="mt-1 truncate text-xs text-slate-400">
                            {group.id}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <Users size={14} className="text-emerald-600" />
                          {group.participantsCount.toLocaleString("id-ID")} anggota
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                          WhatsApp
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}