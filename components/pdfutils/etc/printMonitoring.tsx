"use client";

import moment from "moment";
import { IDapem } from "@/libs/IInterfaces";
import { Header } from "../utils";
import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { Sumdan } from "../../../generated/prisma/client";

moment.locale("id");

const generateMonitoring = (
  records: IDapem[],
  sumdans: Sumdan[],
  periode?: string,
) => {
  const total = records.reduce((acc, curr) => acc + curr.plafond, 0);
  const drafts = records.filter((d) => d.dropping_status === "DRAFT");
  const draft = drafts.reduce((acc, curr) => acc + curr.plafond, 0);
  const pendings = records.filter((d) => d.dropping_status === "PENDING");
  const pending = pendings.reduce((acc, curr) => acc + curr.plafond, 0);
  const invalids = records.filter((d) =>
    ["DITOLAK", "BATAL"].includes(d.dropping_status),
  );
  const invalid = invalids.reduce((acc, curr) => acc + curr.plafond, 0);
  const finals = records.filter((d) =>
    ["PROSES", "DISETUJUI"].includes(d.dropping_status),
  );
  const final = finals.reduce((acc, curr) => acc + curr.plafond, 0);
  const droppings = finals.filter((d) => d.dropping_status === "DISETUJUI");
  const dropping = droppings.reduce((acc, curr) => acc + curr.plafond, 0);

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }

        html, body {
          height: 100%;
          font-family: Cambria, Georgia, 'Times New Roman', Times, serif;
          font-size: 14px;
          text-align: justify;
        }

        /* Pemisah halaman */
        .page-break {
          page-break-before: always;
          break-before: page;
          display: block;
          height: 0;
          border: none;
        }
          @media print {
            .page {
              position: relative;
              min-height: 95vh;    /* atau height A4 jika untuk print */
              padding-top: 80px;    /* ruang untuk header */
              page-break-after: always;
            }
    
            .page .page-header {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              padding: 10px;
              text-align: center;
              background: white;
              border-bottom: 1px solid #ccc;
            }
          }
      </style>
    </head>
    <body class="bg-white text-gray-800 leading-relaxed max-w-200">

    <div class="page" style="font-size: 11px;">
      ${Header("REKAP MONITORING PEMBIAYAAN", `${periode ? `${moment(periode[0]).format("DD MMMM YYYY")} - ${moment(periode[1]).format("DD MMMM YYYY")}` : ""}`, undefined, process.env.NEXT_PUBLIC_APP_LOGO, process.env.NEXT_PUBLIC_APP_LOGO)}
      
      <div class="my-4 flex justify-evenly gap-8 flex-wrap">
        <div class="font-bold flex-1 border border-gray-600 rounded p-4">
          <p class="opacity-70">TOTAL PERMOHONAN</p>
          <p class="text-lg">Rp. ${IDRFormat(records.reduce((acc, curr) => acc + curr.plafond, 0))}</p>
          <div class="border-t border-gray-100 my-1"></div>
          <p class="text-lg">NOA ${records.length}</p>
        </div>
        <div class="font-bold flex-1 text-purple-600 border border-gray-600 rounded p-4">
          <p class="opacity-70">DRAFT</p>
          <p class="text-lg">Rp. ${IDRFormat(draft)}</p>
          <div class="border-t border-gray-100 my-1"></div>
          <p class="text-lg">NOA ${drafts.length}</p>
        </div>
        <div class="font-bold text-red-600 flex-1 border border-gray-600 rounded p-4">
          <p class="opacity-70">BATAL/DITOLAK</p>
          <p class="text-lg">Rp. ${IDRFormat(invalid)}</p>
          <div class="border-t border-gray-100 my-1"></div>
          <p class="text-lg">NOA ${invalids.length}</p>
        </div>
      </div>

      <div class="my-4 flex justify-evenly gap-8 flex-wrap">
        <div class="font-bold text-yellow-600 flex-1 border border-gray-600 rounded p-4">
          <p class="opacity-70">PENDING</p>
          <p class="text-lg">Rp. ${IDRFormat(pending)}</p>
          <div class="border-t border-gray-100 my-1"></div>
          <p class="text-lg">NOA ${pendings.length}</p>
        </div>
        <div class="font-bold text-blue-600 flex-1 border border-gray-600 rounded p-4">
          <p class="opacity-70">FINAL APPROVED</p>
          <p class="text-lg">Rp. ${IDRFormat(final)}</p>
          <div class="border-t border-gray-100 my-1"></div>
          <p class="text-lg">NOA ${finals.length}</p>
        </div>
        <div class="font-bold text-green-600 flex-1 border border-gray-600 rounded p-4">
          <p class="opacity-70">DROPPING</p>
          <p class="text-lg">Rp. ${IDRFormat(dropping)}</p>
          <div class="border-t border-gray-100 my-1"></div>
          <p class="text-lg">NOA ${droppings.length}</p>
        </div>
      </div>

      <div>
        <div class="my-2 font-bold italic text-lg">
          <p>List Account :</p>
        </div>

        <table class="w-full border-collapse border border-gray-400">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-400 p-1">NO</th>
              <th class="border border-gray-400 p-1">NAMA PEMOHON</th>
              <th class="border border-gray-400 p-1">PLAFOND</th>
              <th class="border border-gray-400 p-1">JANGKA WAKTU</th>
              <th class="border border-gray-400 p-1">STATUS</th>
              <th class="border border-gray-400 p-1">MITRA</th>
              <th class="border border-gray-400 p-1">TGL PENGAJUAN</th>
            </tr>
          </thead>
          <tbody>
            ${records
              .sort((a, b) =>
                a.dropping_status.localeCompare(b.dropping_status),
              )
              .map(
                (r, i) => `
              <tr>
                <td class="border border-gray-400 p-1 text-center">${i + 1}</td>
                <td class="border border-gray-400 p-1">
                    <div>${r.Debitur.fullname}</div>
                </td>
                <td class="border border-gray-400 p-1">${IDRFormat(r.plafond)}</td>
                <td class="border border-gray-400 p-1">${r.tenor} Bln</td>
              <td class="border border-gray-400 p-1">${r.dropping_status}</td>
              <td class="border border-gray-400 p-1">${r.ProdukPembiayaan.Sumdan.code}</td>
                <td class="border border-gray-400 p-1">${moment(r.created_at).format("DD/MM/YYYY")}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="page" style="font-size: 12px;">

      <div class="my-4">
        ${sumdans
          .map(
            (s) => `
          <div class="page-break">
            <table class="w-full border-collapse border border-gray-400 mb-4">
              <caption class="caption-top text-left font-semibold text-lg mb-2">
                ${s.name} (${s.code})
              </caption>
              <thead>
                <tr class="bg-gray-200">
                  <th class="border border-gray-400 p-1">NO</th>
                  <th class="border border-gray-400 p-1">NAMA PEMOHON</th>
                  <th class="border border-gray-400 p-1">PLAFOND</th>
                  <th class="border border-gray-400 p-1">JANGKA WAKTU</th>
                  <th class="border border-gray-400 p-1">STATUS</th>
                  <th class="border border-gray-400 p-1">TGL PENGAJUAN</th>
                </tr>
              </thead>
              <tbody>
                ${records
                  .filter((r) => r.ProdukPembiayaan.sumdanId === s.id)
                  .sort((a, b) =>
                    a.dropping_status.localeCompare(b.dropping_status),
                  )
                  .map(
                    (r, i) => `
                  <tr>
                    <td class="border border-gray-400 p-1">${i + 1}</td>
                    <td class="border border-gray-400 p-1">
                        <div>${r.Debitur.fullname}</div>
                    </td>
                    <td class="border border-gray-400 p-1">${IDRFormat(r.plafond)}</td>
                    <td class="border border-gray-400 p-1">${r.tenor} Bln</td>
                    <td class="border border-gray-400 p-1">${r.dropping_status}</td>
                    <td class="border border-gray-400 p-1">
                      ${moment(r.created_at).format("DD/MM/YYYY")}
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
              <tfoot>
                <tr class="bg-gray-100 font-semibold italic">
                  <td
                    colspan="2"
                    class="border border-gray-400 p-2 text-right"
                  >
                    SUMMARY
                  </td>
                  <td class="border border-gray-400 p-2">
                    ${IDRFormat(records.filter((r) => r.ProdukPembiayaan.sumdanId === s.id).reduce((acc, curr) => acc + curr.plafond, 0))}
                  </td>
                  <td colspan="4" class="border border-gray-400 p-2"></td>
                </tr>
              </tfoot>
            </table>

            <div class="italic text-sm border-b border-gray-400">
              <div class="flex gap-4">
                <div class="w-32">DRAFT & PENDING</div>
                <div class="w-4">:</div>
                <div>${(() => {
                  const data = records.filter(
                    (r) =>
                      r.ProdukPembiayaan.sumdanId === s.id &&
                      ["DRAFT", "PENDING"].includes(r.dropping_status),
                  );
                  return `Rp. ${IDRFormat(data.reduce((acc, curr) => acc + curr.plafond, 0))} (NOA ${data.length})`;
                })()}</div>
              </div>
              <div class="flex gap-4">
                <div class="w-32">DITOLAK & BATAL</div>
                <div class="w-4">:</div>
                <div>${(() => {
                  const data = records.filter(
                    (r) =>
                      r.ProdukPembiayaan.sumdanId === s.id &&
                      ["BATAL", "DITOLAK"].includes(r.dropping_status),
                  );
                  return `Rp. ${IDRFormat(data.reduce((acc, curr) => acc + curr.plafond, 0))} (NOA ${data.length})`;
                })()}</div>
              </div>
              <div class="flex gap-4">
                <div class="w-32">FINAL</div>
                <div class="w-4">:</div>
                <div>${(() => {
                  const data = records.filter(
                    (r) =>
                      r.ProdukPembiayaan.sumdanId === s.id &&
                      ["PROSES", "DISETUJUI"].includes(r.dropping_status),
                  );
                  return `Rp. ${IDRFormat(data.reduce((acc, curr) => acc + curr.plafond, 0))} (NOA ${data.length})`;
                })()}</div>
              </div>
              <div class="flex gap-4">
                <div class="w-32">DROPPING</div>
                <div class="w-4">:</div>
                <div>${(() => {
                  const data = records.filter(
                    (r) =>
                      r.ProdukPembiayaan.sumdanId === s.id &&
                      r.dropping_status === "DISETUJUI",
                  );
                  return `Rp. ${IDRFormat(data.reduce((acc, curr) => acc + curr.plafond, 0))} (NOA ${data.length})`;
                })()}</div>
              </div>
            </div>

          </div>
          `,
          )
          .join("")}
      </div>

    </div>

    </body>
  </html>
  `;

  return html;
};

export const printMonitoring = (
  record: IDapem[],
  sumdans: Sumdan[],
  periode?: string,
) => {
  const htmlContent = generateMonitoring(record, sumdans, periode);

  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup diblokir. Mohon izinkan popup dari situs ini.");
    return;
  }

  w.document.open();
  w.document.write(htmlContent);
  w.document.close();
  w.onload = function () {
    setTimeout(() => {
      w.print();
    }, 200);
  };
};
