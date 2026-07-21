import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import { Header, ListNonStyle, ListStyle, NumberToWordsID } from "../utils";
import moment from "moment";
moment.locale("id");

export const PK = (record: IDapem) => {
  const detail = GetDetailDapem(record);
  const angsuran = detail.angsuran;
  const angsuranSumdan = detail.detail.angsuran_sumdan;
  const admAngsuran = angsuran - angsuranSumdan;
  const city = (record.city || record.Debitur.city)
    ?.toLocaleLowerCase()
    .replace("kabupaten", "")
    .replace("kota", "")
    .toUpperCase();
  const date_contract = moment(record.date_contract);

  return `
  ${Header("PERJANJIAN KREDIT", record.no_contract, undefined, undefined, undefined)}
  
  <p>Perjanjian Kredit ini (Selanjutnya disebut "PERJANJIAN") di buat di ${city} pada hari ${date_contract.format("dddd")}, tanggal ${date_contract.format("DD MMMM YYYY")} oleh dan antara sebagai berikut :</p>
  <div class="my-2 ml-2 flex gap-2">
    <div class="w-5">I.</div>
    <p>Nama <span class="font-bold">H ARIEF FIRMANSYAH</span>, dengan jabatan Ketua <span class="font-bold">${process.env.NEXT_PUBLIC_APP_COMPANY_NAME}</span> (<span class="font-bold">${process.env.NEXT_PUBLIC_APP_SHORTNAME || "-"}</span>), bertindak berdasarkan Surat Kuasa Substitusi No. ${record.ProdukPembiayaan.Sumdan.sk_no || "________________"} tanggal ${moment(record.ProdukPembiayaan.Sumdan.sk_date).format("DD-MM-YYYY") || "________________"} dalam perjanjian ini bertindak untuk dan atas nama <span class="font-bold">${record.ProdukPembiayaan.Sumdan.name}</span> yang berkedudukan di ${record.ProdukPembiayaan.Sumdan.address}, berdasarkan Perjanjian Kerjasama Penerusan Pinjaman Nomor ${record.ProdukPembiayaan.Sumdan.contract_no || "________________"} dan Nomor ${record.ProdukPembiayaan.Sumdan.contract_no2 || "________________"} tanggal ${moment(record.ProdukPembiayaan.Sumdan.contract_date).format("DD-MM-YYYY") || "________________"} (Selanjutnya disebut <span class="font-bold">"KREDITUR"</span>)</p>
  </div>
  <div class="my-2 ml-2 flex gap-2">
    <div class="w-5">II.</div>
    <p>Nama <span class="font-bold">${record.Debitur.fullname}</span>, Pemegang Kartu Tanda Penduduk (KTP) No. <span class="font-bold">${record.Debitur.nik}</span> bertempat di ${record.Debitur.address}, Kelurahan ${record.Debitur.ward}, Kecamatan ${record.Debitur.district}, Kota/Kabupaten ${city}, Provinsi ${record.Debitur.province} ${record.Debitur.pos_code} bertindak untuk dan atas nama diri sendiri. (Selanjutnya disebut <span class="font-bold">"DEBITUR"</span>)</p>
  </div>

  <p>Kreditur dan Debitur selanjutnya secara bersama-sama disebut 'PARA PIHAK'. Berdasarkan surat persetujuan pemberian kredit, Para Pihak telah sepakat untuk membuat perjanjian ini dengan syarat dan ketentuan sebagai berikut :</p>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 1</p>
      <p>FASILITAS KREDIT</p>
    </div>

    <p>Atas permintaan DEBITUR, KREDITUR dengan ini menyetujui memberikan suatu fasilitas kredit produk ${record.ProdukPembiayaan.name} (${record.JenisPembiayaan.name}) kepada DEBITUR dan DEBITUR menyetujui untuk menerima fasilitas kredit dengan Hutang Pokok sebesar <span class="font-bold">Rp. ${IDRFormat(record.plafond)},- (${NumberToWordsID(record.plafond)} Rupiah)</span>, dengan ketentuan sebagai berikut :</p>
    
    <div class="flex gap-2">
      <p class="w-4">a.</p>
      <p class="w-40">Jangka Waktu</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.tenor} Bulan</p>
    </div>
    <div class="flex gap-2">
      <p class="w-4">b.</p>
      <p class="w-40">Suku Bunga</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.c_margin + record.c_margin_sumdan} Efektif p.a</p>
    </div>
    <div class="flex gap-2">
      <p class="w-4">c.</p>
      <p class="w-40">Jenis Fasilitas</p>
      <p class="w-4">:</p>
      <p class="flex-1">KREDIT MULTIGUNA</p>
    </div>
    <div class="flex gap-2">
      <p class="w-4">d.</p>
      <p class="w-40">Bentuk Fasilitas</p>
      <p class="w-4">:</p>
      <p class="flex-1">INSTALLMENT</p>
    </div>
    <div class="flex gap-2">
      <p class="w-4">e.</p>
      <p class="w-40">Angsuran Bank</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4">
        <p>Rp.</p>
        <div class="text-right w-24">
          <p >${IDRFormat(angsuranSumdan)}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">f.</p>
      <p class="w-40">Adm Angsuran</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4">
        <p>Rp.</p>
        <div class="text-right w-24">
          <p >${IDRFormat(admAngsuran)}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">g.</p>
      <p class="w-40">Total Angsuran Perbulan</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4">
        <p>Rp.</p>
        <div class="text-right w-24">
          <p >${IDRFormat(angsuran)}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">h.</p>
      <p class="w-40 font-bold">Rincian Potongan Biaya</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4">
      </div>
    </div>
    <div class="flex gap-2 ml-6">
      <p class="w-4">1.</p>
      <p class="w-40">Administrasi</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4">
      <p>Rp.</p>
        <div class="text-right w-20">
          <p>${IDRFormat(detail.administrasi)}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-6">
      <p class="w-4">2.</p>
      <p class="w-40">Provisi</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4">
      <p>Rp.</p>
        <div class="text-right w-20">
          <p>${IDRFormat(detail.detail.adm_sumdan + detail.detail.provisi_sumdan)}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-6">
      <p class="w-4">3.</p>
      <p class="w-40">Tatalaksana</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4">
      <p>Rp.</p>
        <div class="text-right w-20">
          <p>${IDRFormat(record.c_gov)}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-6">
      <p class="w-4">4.</p>
      <p class="w-40">Asuransi</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4">
      <p>Rp.</p>
        <div class="text-right w-20">
          <p>${IDRFormat(detail.asuransi)}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-6">
      <p class="w-4">5.</p>
      <p class="w-40">Pembukaan Rekening</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4">
      <p>Rp.</p>
        <div class="text-right w-20">
          <p>${IDRFormat(record.c_account_sumdan)}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-6">
      <p class="w-4"></p>
      <p class="w-40 font-bold">Total Potongan Biaya</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4 font-bold">
      <p>Rp.</p>
        <div class="text-right w-20">
          <p>${IDRFormat(detail.biaya)}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">i.</p>
      <p class="w-40">Pelunasan</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4">
        <p>Rp.</p>
        <div class="text-right w-24">
          <p >${IDRFormat(record.c_takeover)}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">j.</p>
      <p class="w-40">Blokir Angsuran (${record.c_blokir}x)</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4">
        <p>Rp.</p>
        <div class="text-right w-24">
          <p >${IDRFormat(angsuran * record.c_blokir)}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 font-bold">
      <p class="w-4"></p>
      <p class="w-40">Total Penerimaan</p>
      <p class="w-4">:</p>
      <div class="flex-1 flex gap-4">
        <p>Rp.</p>
        <div class="text-right w-24">
          <p >${IDRFormat(detail.tb)}</p>
        </div>
      </div>
    </div>
    <p class="mt-2">Dalam hal terjadi perubahan suku bunya yang menambah biaya Debitur sebagaimana dimaksud pada pasal 1 di b diatas, maka perubahan tersebut akan disampaikan secara tertulis oleh Kreditur kepada Debitur.</p>
  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 2</p>
      <p>JANGKA WAKTU DAN JADWAL ANGSURAN</p>
    </div>

    <div>
      ${ListStyle(
        [
          `Jangka waktu fasilitas kredit <span class="font-bold">${record.tenor}</span> bulan terhitung sejak tanggal <span class="font-bold">${moment(record.date_contract).format("DD-MM-YYYY")}</span> sampai dengan berakhir <span class="font-bold">${moment(record.date_contract).add(record.tenor, "month").format("DD-MM-YYYY")}</span>.`,
          `Angsuran bulanan sebesar <span class="font-bold">Rp. ${IDRFormat(angsuran)} ( ${NumberToWordsID(angsuran)} Rupiah )</span> / bulan sesuai jadwal angsuran yang telah disepakati para pihak.`,
          `Pembayaran angsuran dilakukan dalam <span class="font-bold">${record.tenor}</span> kali angsuran yang harus di bayar tiap tanggal <span class="font-bold">${moment(record.date_contract).date()}</span> dan harus sudah lunas selambatlambatnya <span class="font-bold">${moment(record.date_contract).format("DD-MM-YYYY")}</span>`,
          `Denda keterlambatan pembayaran angsuran 4.00% perbulan dan harus di bayar dengan seketika dan sekaligus lunas bersamaan dengan pembayaran angsuran tertunggak.`,
          `Biaya administrasi pelunasan dipercepat dikenakan denda/pinalti sebesar 4x angsuran di kecualikan untuk TOP UP/REHAB kredit tidak dikenakan denda/pinalti`,
          `Apabila pembayaran kewajiban yang harus dilakukan Debitur kepada Kreditur jatuh tempo bukan pada hari kerja, maka pembayaran akan dilakukan 1 (Satu) hari kerja sebelumnya.`,
        ],
        "number",
      )}
    </div>
    
  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 3</p>
      <p>PENARIKAN FASILITAS KREDIT DAN PENGAKUAN HUTANG</p>
    </div>
    
    <div>
      ${ListStyle(
        [
          `Penarikan fasilitas kredit yang diberikan KREDITUR kepada DEBITUR yang dicairkan, yaitu sebesar <span class="font-bold">Rp. ${IDRFormat(detail.tb)} (${NumberToWordsID(detail.tb)})</span>, jumlah tersebut setelah dikurangi dengan biaya-biaya yang terkait dengan fasilitas kredit.`,
          `Debitur menyetujui bahwa Dropping fasilitas kredit akan di transaksikan paling lambat 5 (lima) hari kerja sejak Perjanjian Kredit ini ditandatangani.`,
          `Penandatanganan Perjanjian ini merupakan tanda penerimaan yang sah atas seluruh jumlah hutang pokok sebagaimana dimaksud pasal 1 Plafond Kredit sebesar <span class="font-bold">Rp. ${IDRFormat(record.plafond)},- (${NumberToWordsID(record.plafond)})</span>, Perjanjian dan DEBITUR dengan ini mengaku benarbenar secara sah telah berhutang kepada KREDITUR atas jumlah hutang pokok tersebut demikian berikut bunga, denda dan biayabiaya lain serta lain-lain jumlah yang wajib dibayar oleh DEBITUR kepada KREDITUR berdasarkan Perjanjian ini.`,
          `
            <div>
              <p>Debitur menyetujui bahwa jumlah yang terhutang oleh DEBITUR kepada KREDITUR berdasarkan Perjanjian ini pada waktu-waktu tertentu akan terbukti dari :</p>
              ${ListStyle(
                [
                  `Rekening DEBITUR yang dipegang dan dipelihara oleh KREDITUR; dan/atau`,
                  `Buku-buku, catatan-catatan yang dipegang dan dipelihara oleh KREDITUR; dan/atau`,
                  `Surat-surat dan Dokumen-dokumen lain yang dikeluarkan oleh KREDITUR; dan/atau`,
                  `Salinan/Kutipan rekening DEBITUR.`,
                ],
                "lower",
              )}
            </div>
          `,
        ],
        "number",
      )}
    </div>

  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 4</p>
      <p>PERISTIWA CIDERA JANJI</p>
    </div>

    <p>Dengan tetap memperhatikan ketentuan Pasal 2 ayat 1 Perjanjian ini, KREDITUR berhak untuk sewaktu-waktu dengan mengesampingkan ketentuan Pasal 1266 kitab Undang-Undang Hukum Perdata. khususnya ketentuan yang mengatur keharusan untuk mengajukan permohonan pembatalan perjanjian melalui pengadilan, sehingga tidak diperlukan suatu pemberitahuan (somasi) atau surat lain yang serupa dengan itu serta surat peringatan dari juru sita, menagih hutang DEBITUR berdasarkan Perjanjian ini atas sisanya, berikut bunga-bunga, denda-denda dan biaya lain yang timbul berdasarkan Perjanjian dan wajib dibayar oleh DEBITUR dengan seketika dan sekaligus lunas. Apabila terjadi salah satu atau lebih kejadian-kejadian tersebut di bawah ini :</p>

    <div>
    ${ListStyle(
      [
        `DEBITUR tidak atau lalai membayar lunas pada waktunya kepada KREDITUR baik angsuran pokok, bunga-bunga, denda-denda dan biaya lainnya yang sudah jatuh tempo berdasarkan Perjanjian;`,
        `DEBITUR meninggal dunia atau berada dibawah pengampunan;`,
        `DEBITUR dinyatakan pailit, diberikan penundaan membayar hutang-hutang atau bilamana DEBITUR dan/atau orang/pihak lain mengajukan permohonan kepada instansi yang berwenang agar DEBITUR dinyatakan keadaan pailit;`,
        `Kekayaan DEBITUR baik sebagian maupun seluruhnya disita dan dinyatakan dalam sitaan oleh instansi berwenang;`,
        `DEBITUR lalai atau tidak memenuhi syarat-syarat ketentuan/kewajiban dalam Perjanjian ini dan setiap perubahannya;`,
        `DEBITUR lalai atau tidak memenuhi kewajibannya kepada pihak lain berdasarkan Perjanjian dengan pihak lain sehingga DEBITUR dinyatakan cidera janji;`,
        `DEBITUR tersangkut dalam suatu perkara hukum yang dapat menghalangi DEBITUR memenuhi kewajiban berdasarkan Perjanjian ini sebagaimana mestinya;`,
        `Apabila ternyata suatu pernyataan-pernyataan atau dokumen-dokumen atau keterangan-keterangan yang diberikan DEBITUR kepada KREDITUR ternyata tidak benar atau tidak sesuai dengan kenyataan;`,
      ],
      "number",
    )}
    </div>

  </div>
  
  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 5</p>
      <p>JAMINAN</p>
    </div>

    <p>Untuk menjamin pembayaran hutang pokok, bunga dan pembayaran lainnya sebagaimana mestinya tercantum dalam Perjanjian ini, DEBITUR setuju memberikan jaminan kepada KREDITUR berupa uang pensiun DEBITUR setiap bulan, dan oleh karenanya DEBITUR dengan ini telah menyampaikan kepada KREDITUR dokumen jaminan berupa :</p>
    ${ListStyle(
      [
        `<div>
        <p>Menyerahkan Asli Surat Keputusan (SK) Pensiun :</p>
        ${ListNonStyle([
          {
            key: "Nama",
            value: record.Debitur.name_skep,
            valuStyle: "font-bold",
          },
          {
            key: "Nomor",
            value: record.Debitur.no_skep,
            valuStyle: "font-bold",
          },
          {
            key: "Tertanggal",
            value: moment(record.Debitur.date_skep).format("DD-MM-YYYY"),
            valuStyle: "font-bold",
          },
        ])}
      </div>`,
        `Menyerahkan Asli Surat Pernyataan Kuasa Potong Gaji Debitur atas nama <span class="font-bold">${record.Debitur.fullname}</span>.`,
        `Menyerahkan Asli Surat Asuransi Jiwa Kredit dengan Bankers Clause (Hak Preferensi atas Uang Pertanggungan) atas nama <span class="font-bold">${record.Debitur.fullname}</span>.`,
      ],
      "lower",
    )}
    
  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 6</p>
      <p>PERNYATAAN DAN JAMINAN</p>
    </div>

    <p>DEBITUR dengan ini menyatakan dan menjamin kepada KREDITUR hal-hal sebagai berikut :</p>
    <div>
      ${ListStyle(
        [
          `DEBITUR mempunyai wewenang untuk menandatangani Perjanjian ini.`,
          `DEBITUR dengan ini menyatakan dan menjamin bahwa Perjanjian ini tidak bertentangan dengan Perjanjian apapun yang dibuat oleh DEBITUR kepada pihak ketiga.`,
          `DEBITUR dengan ini menyatakan dan menjamin bahwa pada waktu ini tidak ada sesuatu hal atau peristiwa yang merupakan suatu kejadian kelalaian /pelanggaran sebagaimana dimaksudkan dalam pasal 4 Perjanjian ini.`,
          `DEBITUR dengan ini menyatakan dan menjamin akan mengganti segala kerugian yang diderita oleh KREDITUR sehubungan dengan adanya tuntutan atau gugatan dari pihak ketiga yang diakibatkan oleh karena adanya keterangan/pernyataan yang tidak benar yang disampaikan DEBITUR kepada KREDITUR.`,
          `DEBITUR dengan ini menyatakan dan menjamin bahwa apa yang dijaminkan dalam Perjanjian ini adalah benar merupakan hak DEBITUR sendiri dan tidak sedang terkait sebagai jaminan dan tidak akan diaihkan haknya pada pihak lain sampai dengan seluruh hutang DEBITUR dinyatakan lunas oleh KREDITUR.`,
          `DEBITUR dengan ini menyatakan bersedia untuk menyerahkan barang bergerak maupun tidak bergerak yang ada maupun yang akan ada kepada KREDITUR untuk pelunasan hutang DEBITUR, berikut bunga-bunga, denda-denda dan biaya lain yang timbul berdasarkan Perjanjian ini, apabila terjadi peristiwa cidera janji sebagaimana dimaksud Pasal 4 Perjanjian ini.`,
        ],
        "number",
      )}
    </div>
  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 7</p>
      <p>PEMBERIAN KUASA</p>
    </div>
    <div>
      ${ListStyle(
        [
          `DEBITUR dengan ini memberikan kuasa kepada KREDITUR untuk mendebet dan menggunakan dana yang tersimpan pada KREDITUR baik dari rekening tabungan/deposito milik DEBITUR guna pembayaran angsuran pokok maupun bunga, denda, premi asuransi jiwa, biaya-biaya lainnya yang mungkin timbul sehubungan dengan pemberian fasilitas kredit ini dan segala yang terhutang berkenaan dengan pemberian fasilitas kredit berdasarkan Perjanjian ini.`,
          `KREDITUR diberi kuasa oleh DEBITUR untuk menutup asuransi jiwa dan biaya premi menjadi beban DEBITUR, apabila DEBITUR meninggal dunia, maka uang klaim asuransi jiwa untuk menjamin pelunasan seluruh kewajiban DEBITUR.`,
          `Kuasa-kuasa yang diberikan DEBITUR kepada KREDITUR berdasarkan Perjanjian ini telah dianggap telah termaktub dalam Perjanjian ini dan merupakan satu kesatuan serta bagian yang tidak terpisahkan dengan Perjanjian ini yang tidak dibuat tanpa adanya kuasa tersebut, dan oleh karenanya kuasa-kuasa tersebut tidak akan dicabut dan tidak akan berakhir oleh karena sebab apapun juga, termasuk oleh sebab-sebab berakhirnya masa kuasa sebagaimana mestinya dimaksud pasal 1813, 1814 dan 1816 Undang-undang Perdata. Namun demikian, apabila ternyata terdapat suatu ketentuan hukum yang mengharuskan adanya suatu kuasa khusus untuk melaksanakan hak KREDITUR berdasarkan Perjanjian, maka DEBITUR atas permintaan pertama dan KREDITUR wajib memberikan kuasa khusus dimaksud kepada DEBITUR.`,
          `DEBITUR dengan ini menyatakan dan menjamin akan mengganti segala kerugian yang diderita oleh KREDITUR sehubungan dengan adanya tuntutan atau gugatan dari pihak ketiga yang diakibatkan oleh karena adanya keterangan/pernyataan yang tidak benar yang disampaikan DEBITUR kepada KREDITUR.`,
        ],
        "number",
      )}
    </div>
  </div>

  <div class="my-8">
    <div class="my-3 text-center font-bold">
      <p>PASAL 8</p>
      <p>LAIN-LAIN</p>
    </div>

    <div>
      ${ListStyle(
        [
          `DEBITUR menyetujui dan dengan ini memberi kuasa kepada KREDITUR untuk sewaktu-waktu menjual, mengalihkan, menjaminkan atau dengan cara apapun memindahkan piutang/tagihan-tagihan KREDITUR kepada DEBITUR berdasarkan Perjanjian ini kepada pihak ketiga lainnya dengan siapa KREDITUR membuat perjanjian kerjasama berikut semua hak, kekuasaan-kekuasaan dan jaminan-jaminan yang ada pada KREDITUR berdasarkan Perrjanjian ini atau Perjanjian Jaminan, dengan syarat-syarat dan ketentuan-ketentuan yang dianggap baik oleh KREDITUR.`,
          `DEBITUR tidak diperkenankan untuk mengalihkan hak-hak dan kewajibannya berdasarkan Perjanjian ini kepada pihak manapun tanpa persetujuan tertulis terlebih dahulu dari KREDITUR.`,
          `Selama fasilitas kredit belum lunas, DEBITUR tidak diperkenankan untuk menerima pinjaman dari bank/pihak ketiga lainnya tanpa persetujuan dari KREDITUR.`,
          `Selama fasilitas kredit belum lunas, DEBITUR tidak diperkenankan untuk menunda pengambilan gajinya setiap bulan untuk memenuhi pembayaran angsuran kepada KREDITUR dan mengalihkan lokasi pembayaran uang pensiun DEBITUR ketempat lain selain BPR VIMA yang telah menerima surat kuasa pemotongan uang pensiun DEBITUR.`,
          `DEBITUR wajib mengizinkan KREDITUR untuk melakukan pemeriksaan atas kekayaan dan/usaha DEBITUR serta dan memeriksa pembukuan, catatan-catatan dan administrasi DEBITUR dan membuat salinan-salinan atau foto copy atau catatan-catatan daripadanya.`,
          `Seluruh lampiran-lampiran Perjanjin ini termasuk namun tidak terbatas pada Perjanjian Kerjasama, surat kuasa pemotongan uang pensiun, merupakan suatu kesatuan dan bagian yang tidak terpisahkan dengan Perjanjian ini.`,
          `Hal-hal yang belum diatur dalam Perjanjian ini serta perubahan dan/atau penambahan akan ditentukan kemudian antara para pihak serta dituangkan secara tertulis dalam suatu ADDENDUM yang ditandatangani bersama oleh para pihak serta merupakan bagian dan satu kesatuan yang tidak dapat dipisahkan dan mempunyai Kekuatan Hukum yang sama dengan Perjanjian ini.`,
        ],
        "number",
      )}
    </div>
  </div>

  <div class="my-8">
    <div class="my-3 text-center font-bold">
      <p>PASAL 9</p>
      <p>HUKUM YANG BERLAKU DAN DOMISILI HUKUM</p>
    </div>

    <div>
      ${ListStyle(
        [
          `Perjanjian ini tunduk pada dan karenanya harus ditafsirkan berdasarkan Hukum Negara Kesatuan Republik Indonesia (NKRI).`,
          `Untuk pelaksanaan Perjanjian ini dan segala akibatnya para pihak memilih tempat tinggal yang tetap dan tidak berubah di kantor Panitera Pengadilan Negeri Pekalongan di <span class="font-bold">${record.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}</span>, dengan tidak mengurangi hak KREDITUR untuk memohon pelaksanaan dari Perjanjian ini atau mengajukan tuntutan hukum terhadap DEBITUR melalui Pengadilan-Pengadilan Negeri lainnya dalam Wilayah Negara Kesatuan Republik Indonesia (NKRI).`,
        ],
        "number",
      )}
    </div>

  </div>

  <div class="my-2">
    <p>Demikian Perjanjian ini dibuat dan ditandatangani oleh Para Pihak pada hari ini dan tanggal sebagaimana disebutkan diawal Perjanjian ini.</p>
  </div>

  <div class="mt-10">
    <div class="flex justify-between gap-6 items-end">
      <div class="flex-1 text-center">
        <p >${city}, ${date_contract.format("DD-MM-YYYY")}</p>
        <p class="font-bold">${process.env.NEXT_PUBLIC_APP_COMPANY_NAME}</p>
        <div class="h-28 flex items-center justify-center opacity-50">
        </div>
        <div>
          <p class="w-full border-b">H ARIEF FIRMANSYAH</p>
          <p>KETUA KOPERASI</p>
        </div>
      </div>
      <div class="flex-1 text-center">
        <p class="font-bold">DEBITUR</p>
        <div class="h-28 flex items-center justify-center opacity-50">
          <p >Materai 10.000</p>
        </div>
        <div>
          <p class="w-full border-b">${record.Debitur.fullname}</p>
          <p>PENERIMA PEMBIAYAAN</p>
        </div>
      </div>
      <div class="flex-1 text-center">
        <p class="font-bold">Saksi Keluarga,</p>
        <div class="h-28">
        </div>
        <div>
          <p class="w-full border-b">${record.aw_name}</p>
          <p>SUAMI/ISTRI/AHLI WARIS</p>
        </div>
      </div>
    </div>
  </div>
`;
};
