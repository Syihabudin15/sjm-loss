import moment from "moment";
import { IDropping } from "@/libs/IInterfaces";
import { Header } from "../utils";
import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";

moment.locale("id");

const generateSI = (record: IDropping) => {
  const hasProvisi = record.Dapems.some((d) => d.c_provisi_sumdan !== 0);

  // Pre-calculate data per dapem untuk efisiensi dan konsistensi perhitungan
  const dapemProcessed = record.Dapems.map((curr) => {
    const detailDapem = GetDetailDapem(curr).detail;
    const adm = curr.plafond * (curr.c_adm_sumdan / 100);
    const provisi = curr.plafond * (curr.c_provisi_sumdan / 100);
    const dropping = curr.plafond - (adm + provisi + curr.c_account_sumdan);

    return {
      ...curr,
      adm,
      provisi,
      dropping,
    };
  });

  // Total kalkulasi dari data yang sudah diproses
  const totalPlafond = dapemProcessed.reduce(
    (acc, curr) => acc + curr.plafond,
    0,
  );
  const totalAdm = dapemProcessed.reduce((acc, curr) => acc + curr.adm, 0);
  const totalProvisi = dapemProcessed.reduce(
    (acc, curr) => acc + curr.provisi,
    0,
  );
  const totalAccount = dapemProcessed.reduce(
    (acc, curr) => acc + curr.c_account_sumdan,
    0,
  );
  const totalDropping = dapemProcessed.reduce(
    (acc, curr) => acc + curr.dropping,
    0,
  );

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
              min-height: 95vh;
              padding-top: 80px;
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
    <body class="bg-white text-gray-800 leading-relaxed p-4 max-w-200">

    <div class="page" style="font-size: 12px;">
      ${Header("PERMOHONAN DROPPING DANA PENCAIRAN", record.id, undefined, process.env.NEXT_PUBLIC_APP_LOGO, record.Sumdan.logo)}

      <div class="my-4">
        <div class="flex gap-3">
          <p class="w-44">No</p>
          <p class="w-4">:</p>
          <p class="flex-1">${record.id}</p>
        </div>
        <div class="flex gap-3">
          <p class="w-44">Lampiran</p>
          <p class="w-4">:</p>
          <p class="flex-1">1 Lembar</p>
        </div>
        <div class="flex gap-3">
          <p class="w-44">Perihal</p>
          <p class="w-4">:</p>
          <p class="flex-1">Permohonan Dropping Dana Pencairan Pembiayaan Pensiun</p>
        </div>
      </div>

      <div class="mt-4">
        <p>Kepada Yth</p>
        <p class="font-bold">Direktur ${record.Sumdan.name}</p>
        <p>Di tempat</p>
      </div>
      <div class="mt-2">
        <p>Sehubungan dengan telah disetujuinya pembiayaan pensiun oleh Komite Bank, bersama ini kami menyampaikan permohonan kepada ${record.Sumdan.name} untuk melakukan dropping dana pencairan pembiayaan dengan rincian sebagai berikut :</p>
        
        <div class="mt-4 flex gap-2 ml-3">
          <p class="w-44">Jumlah Debitur</p>
          <p class="w-4">:</p>
          <p class="flex-1">${record.Dapems.length}</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-44">Jumlah Plafond</p>
          <p class="w-4">:</p>
          <p class="flex-1">Rp. ${IDRFormat(totalPlafond)}</p>
        </div>
        <div class="mb-4 flex gap-2 ml-3">
          <p class="w-44">Jumlah Dropping</p>
          <p class="w-4">:</p>
          <p class="flex-1">Rp. ${IDRFormat(totalDropping)}</p>
        </div>

        <p>Sehubungan dengan hal tersebut, kami menginstruksikan kepada ${record.Sumdan.name} untuk melakukan pencairan (dropping) dana sebesar tersebut di atas ke rekening berikut :</p>

        <div class="mt-4 flex gap-2 ml-3">
          <p class="w-44">Nama Rekening</p>
          <p class="w-4">:</p>
          <p class="flex-1">${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_NAME}</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-44">Nomor Rekening</p>
          <p class="w-4">:</p>
          <p class="flex-1">${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_NUMBER}</p>
        </div>
        <div class="mb-4 flex gap-2 ml-3">
          <p class="w-44">Bank</p>
          <p class="w-4">:</p>
          <p class="flex-1">${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_BANK}</p>
        </div>

        <p>Instruksi ini dibuat berdasarkan persetujuan Komite Bank dan menjadi dasar pelaksanaan pencairan dana.</p>
        <p>Demikian Standing Instruction ini kami sampaikan untuk dapat diproses sebagaimana mestinya. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.</p>
      </div>

      <div class="mt-20 flex justify-end">
        <div class="w-96 text-center">
          <p>${process.env.NEXT_PUBLIC_APP_COMPANY_CITY}, ${moment(record.created_at).format("DD-MM-YYYY")}</p>
          <p>${process.env.NEXT_PUBLIC_APP_COMPANY_NAME?.toUpperCase()}</p>
          <div class="h-28"></div>
          <p class="border-b">${process.env.NEXT_PUBLIC_APP_SI_NAME}</p>
          <p>${process.env.NEXT_PUBLIC_APP_SI_POSITION}</p>
        </div>
      </div>

    </div>

    <div class="page" style="font-size: 12px;">
      ${Header("LAMPIRAN PERMOHONAN DROPPING", record.id, undefined, process.env.NEXT_PUBLIC_APP_LOGO, record.Sumdan.logo)}

      <div class="mt-20">
        <table class="w-full border-collapse border border-gray-400 border-dashed text-sm mb-4">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-400 border-dashed p-1">NO</th>
              <th class="border border-gray-400 border-dashed p-1">Debitur</th>
              <th class="border border-gray-400 border-dashed p-1">Plafond</th>
              <th class="border border-gray-400 border-dashed p-1">Adm Bank</th>
              ${hasProvisi ? `<th class="border border-gray-400 border-dashed p-1">Provisi Bank</th>` : ""}
              <th class="border border-gray-400 border-dashed p-1">Buka Tabungan</th>
              <th class="border border-gray-400 border-dashed p-1">Dropping</th>
            </tr>
          </thead>
          <tbody>
            ${dapemProcessed
              .map(
                (r, i) => `
              <tr>
                <td class="border border-gray-400 border-dashed p-1 text-center">${i + 1}</td>
                <td class="border border-gray-400 border-dashed p-1">
                  <div>${r.Debitur.fullname}</div>
                  <div class="text-xs opacity-70">${r.Debitur.nopen}</div>
                </td>
                <td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.plafond)}</td>
                <td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.adm)}</td>
                ${hasProvisi ? `<td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.provisi)}</td>` : ""}
                <td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.c_account_sumdan)}</td>
                <td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.dropping)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr class="bg-gray-100 font-semibold italic">
              <td colspan="2" class="border border-gray-400 p-2 text-center border-dashed">
                JUMLAH
              </td>
              <td class="border border-gray-400 p-2 text-right border-dashed">
                ${IDRFormat(totalPlafond)}
              </td>
              <td class="border border-gray-400 p-2 text-right border-dashed">
                ${IDRFormat(totalAdm)}
              </td>
              ${
                hasProvisi
                  ? `<td class="border border-gray-400 p-2 text-right border-dashed">
                ${IDRFormat(totalProvisi)}
              </td>`
                  : ""
              }
              <td class="border border-gray-400 p-2 text-right border-dashed">
                ${IDRFormat(totalAccount)}
              </td>
              <td class="border border-gray-400 p-2 text-right border-dashed">
                ${IDRFormat(totalDropping)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="mt-20 flex justify-end">
        <div class="w-96 text-center">
          <p>${process.env.NEXT_PUBLIC_APP_COMPANY_CITY}, ${moment(record.created_at).format("DD-MM-YYYY")}</p>
          <p>${process.env.NEXT_PUBLIC_APP_COMPANY_NAME?.toUpperCase()}</p>
          <div class="h-28"></div>
          <p class="border-b">${process.env.NEXT_PUBLIC_APP_SI_NAME}</p>
          <p>${process.env.NEXT_PUBLIC_APP_SI_POSITION}</p>
        </div>
      </div>
    </div>

    </body>
  </html>
  `;

  return html;
};

export const printSIStandar = (record: IDropping) => {
  const htmlContent = generateSI(record);

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
