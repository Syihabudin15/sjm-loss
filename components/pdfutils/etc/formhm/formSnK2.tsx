import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";

export const FormSnK2 = (record: IDapem) => {
  return `
  <div class="mt-4">

    <div class="flex justify-between gap-8 text-justify" style="line-height: 11px">
      <div class="flex-1">
        <div class="ml-4">
          <p class="font-bold">II. TabunganKu/ Tabungan SIMPEL</p>
          <ul class="list list-outside list-disc ml-6">
            <li>Tabunganku/Tabungan SIMPEL merupakan produk tabungan yang diterbitkan secara bersama oleh bank-bank di Indonesia guna menumbuhkan budaya menabung serta meningkatkan kesejahteraan masyarakat.</li>
            <li>Ketentuan Setoran dan Saldo Pengendapan
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Setoran awal minimal Rp. 10.000.-</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Setoran selanjutnya minimal Rp. 10.000,-</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Saldo minimal pengendapan Rp. 1O.000,-</p>
              </div>
            </li>
            <li>Ketentuan Biaya
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Tidak dikenakan Biaya Administrasi</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Biaya Tabungan Pasif Rp 5.000,- per bulan</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Biaya Pergantian Buku dan Biaya Penutupan Rekening menjadi tanggungjawab Bank.</p>
              </div>
            </li>
            <li>Resiko
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Apabila rekening tabungan tidak ada transaksi selama 6 (enam) bulan berturut-turut maka rekening tabungan otomatis menjadi Tabungan Pasif.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Apabila rekening tabungan sudah menjadi Tabungan Pasif dan saldo pengendapan pada rekening tabungan sebesar Rp O,- maka rekening tabungan otomatis akan ditutup oleh system.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Maksimal penarikan dalam satu bulan sebanyak 2 kali transaksi.</p>
              </div>
            </li>
            <li>Manfaat
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Simpanan/tabungan ini dapat ditarik sewaktu-waktu sesuai dengan keperluan nasabah.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Sebagai tanda bukti atas transaksi tersebut pihak bank mengeluarkan Buku Tabunganku/Tabungan SIMPEL PT. BPR Harta Mulia.</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="ml-4">
          <p class="font-bold">III. Tabungan Berencana Gentamas</p>
          <ul class="list list-outside list-disc ml-6">
            <li>Tabungan Berencana Gentamas merupakan produk tabungan berjangka yang diterbitkan PT BPR Harta Mulia guna menumbuhkan budaya menabung dan investasi dengan pilihan jangka waktu yang fleksibel sesuai kebutuhan Nasabah.</li>
            <li>Ketentuan Setoran dan Jangka Waktu
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Setoran per bulan mulai dari Rp 50.000,-</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Jangka Waktu mulai dari 6 (enam) bulan</p>
              </div>
            </li>
            <li>Ketentuan Biaya
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Biaya Materai menjadi tanggungjawab Nasabah.</p>
              </div>
            </li>
            <li>Resiko
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Apabila Nasabah tidak melakukan pembayaran setoran per bulan selama 3 (tiga) kali berturut-turut maka rekening Tabungan Berencana Gentamas akan dicairkan ke Tabungan Umum.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Apabila Nasabah tidak memiliki Tabungan Umum maka Bank akan membukakan rekening Tabungan Umum.</p>
              </div>
            </li>
            <li>Manfaat
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Simpanan/tabungan ini dapat dijadikan Jaminan kredit sesuai dengan ketentuan Bank.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Sebagai tanda bukti atas transaksi tersebut pihak bank mengeluarkan Bilyet Tabungan Berencana Gentamas PT. BPR Harta Mulia.</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="ml-4">
          <p class="font-bold">IV. Deposito</p>
          <ul class="list list-outside list-disc ml-6">
            <li>Deposito merupakan produk simpanan dana masyarakat dengan suku bunga kompetitif dan dengan pilihan jangka waktu yang fleksibel sesuai kebutuhan Nasabah.</li>
            <li>Ketentuan Penempatan dan Jangka Waktu
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Penempatan mulai dari Rp. 1.000.000,-</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Jangka Waktu mulai dari 6 (enam) bulan</p>
              </div>
            </li>
            <li>Ketentuan Biaya
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Biaya Materai menjadi tanggungjawab Nasabah.</p>
              </div>
            </li>
            <li>Resiko
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Deposito hanya dapat dicairkan pada saat Jatuh tempo dengan menyerahkan Bilyet asli.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Bunga deposito dibayarkan pada tanggal yang sama dengan tanggal penerbitan bilyet pada bulan berikutnya, apabila pada tanggal hak atas bunga jatuh pada hari libur maka system akan menghitung bunga tersebut pada hari kerja berikutnya.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Apabila Deposito dicairkan sebelum Jatuh tempo maka bunga tidak akan dibayarkan.</p>
              </div>
            </li>
            <li>Manfaat
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Deposito ini dapat dijadikan Jaminan kredit sesuai dengan ketentuan Bank.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Sebagai tanda bukti atas transaksi tersebut pihak bank mengeluarkan Bilyet Deposito PT. BPR Harta Mulia.</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="ml-4">
          <p class="font-bold">V. Kredit</p>
          <ul class="list list-outside list-disc ml-6">
            <li>Kredit merupakan Produk pinJaman kepada masyarakat dengan suku bunga kompetitif dan proses yang mudah serta dapat disesuaikan dengan kebutuhan nasabah dimana terdapat 2 Jenis Kredit yaitu Kredit Umum dan Kredit Usaha Mikro atau Kredit Kecil.</li>
            <li>Tujuan Kredit
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Kredit Modal Kerja</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Kredit Investasi</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Kredit Konsumtif</p>
              </div>
            </li>
            <li>Ketentuan Plafond Pinjaman dan Jangka Waktu
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Plafond Pinjaman mulai dari Rp 1.000.000,-</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Jangka Waktu mulai dari 12 (dua belas) bulan</p>
              </div>
            </li>
            <li>Ketentuan Suku Bunga
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Terdapat jenis pembayaran bunga yang dapat disesuaikan dengan kebutuhan Nasabah yaitu Menurun, Tetap dan Anuitas..</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Rate Suku bunga mulai dari 0.75% s.d 2.00%</p>
              </div>
            </li>
            <li>Ketentuan Biaya
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Biaya Administrasi 1.50% s.d 2.W% dari besarnya plafond.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Biaya Provisi 1.50% s.d 2.00% dari besarnya plafond.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Biaya Materai menjadi tanggungjawab Nasabah.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Biaya Pemeriksaan Jaminan atau Survey.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Biaya Asuransi.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Biaya Pengikatan.</p>
              </div>
              <div class="ml-3 flex gap-2">
                <p>-</p>
                <p>Biaya Lainnya (sesuai kondisi Nasabah).</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex-1">
        <div class="mt-1 ml-4">
          <li>Agunan yang dapat dipergunakan
            <div class="ml-3 flex gap-2">
              <p>-</p>
              <p>Simpanan.</p>
            </div>
            <div class="ml-3 flex gap-2">
              <p>-</p>
              <p>Kendaraan/BPKB.</p>
            </div>
            <div class="ml-3 flex gap-2">
              <p>-</p>
              <p>Rumah/Tanah/SHM</p>
            </div>
          </li>
          <li>Resiko
            <div class="ml-3 flex gap-2">
              <p>-</p>
              <p>Apabila nasabah menggunakan agunan atau jaminan berupa simpanan, maka simpanan nasabah baik berupa tabungan maupun deposito akan dilakukan blokir oleh Bank.</p>
            </div>
            <div class="ml-3 flex gap-2">
              <p>-</p>
              <p>Apabila nasabah telat melakukan pembayaran angsuran maka akan diperhitungkan denda sesuai dengan ketentuan Bank sebesar 5% dari tunggakan pokok dan tunggakan bunga</p>
            </div>
          </li>
          <li>Manfaat
            <div class="ml-3 flex gap-2">
              <p>-</p>
              <p>Proses Pengajuan cepat dan mudah.</p>
            </div>
            <div class="ml-3 flex gap-2">
              <p>-</p>
              <p>Sebagai tanda bukti atas transaksi tersebut pihak bank mengeluarkan Perjanjian Kredit PT. BPR Harta Mulia.</p>
            </div>
          </li>
        </div>
        <p>Ringkasan produk dan/atau layanan ini hanya sebagai sarana informasi dan tidak dimaksudkan sebagai resmi, dan apabila terdapat perbedaan ringkasan produk dan/atau layanan ini dengan perjanjian produk dan/atau layanan, maka yang berlaku adalah perjanjian produk dan/atau layanan.</p>
        <p>Produk PT BPR Harta Mulia. yang dipilih dan disetujui oleh Nasabah :</p>
        <div class="flex gap-4 mt-2">
          <div class="flex-1 flex gap-2">
            ${FormCheck(true, "w-10 h-5")} Tabungan Umum
          </div>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-10 h-5")} Deposito
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-10 h-5")} TabunganKu/ Tabungan SIMPEL
          </div>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-10 h-5")} Kredit Umum
          </div>
        </div>
        <div class="flex gap-4 mb-2">
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-10 h-5")} Tabungan Berencana Gentamas
          </div>
          <div class="flex-1 flex gap-2">
            ${FormCheck(false, "w-10 h-5")} Kredit Kecil / KUM
          </div>
        </div>
        <p>Dengan menandatangani ketentuan umum dan persyaratan pembukaan rekening ini, saya/kami menyatakan dengan ini menerima dan setuju mengikatkan diri pada semua syarat dan ketentuan umum Bank setta ketentuan lain yang merupakan satu kesatuan dan bagian yang tak terpisahkan dengan ketentuan umum dan persyaratan pembukaan rekening di Bank.</p>
        <div class="flex justify-end text-center mt-10">
          <div class="flex flex-col gap-20 items-center justify-center">
            <div class="w-full border-b border-gray-800 border-dashed">${record.Debitur.city?.toLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.created_at).format("DD-MM-YYYY")}</div>
            <div>
              <p>${record.Debitur.fullname}</p>
              <p class="border-t border-dashed border-gray-800">Tanda Tangan Nasabah dan Nama Jelas</p>
            </div>
          </div>
        </div>

        <div class="bg-blue-700 text-center font-bold py-1 text-white mt-10">VALIDASI BANK</div>
        <div class="flex text-center">
          <div class="flex-1 border border-gray-800 flex flex-col gap-20">
            <p class="border-b border-gray-800">Petugas Pelaksana</p>
            <div>
              <p></p>
              <p class="border-t border-gray-800">Tanda Tangan dan Nama</p>
            </div>
          </div>
          <div class="flex-1 border border-gray-800 flex flex-col gap-20">
            <p class="border-b border-gray-800">Diperiksa</p>
            <div>
              <p></p>
              <p class="border-t border-gray-800">Tanda Tangan dan Nama</p>
            </div>
          </div>
          <div class="flex-1 border border-gray-800 flex flex-col gap-20">
            <p class="border-b border-gray-800">Disetujui</p>
            <div>
              <p></p>
              <p class="border-t border-gray-800">Tanda Tangan dan Nama</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  `;
};

const FormCheck = (
  check: boolean,
  w?: string,
  val?: string | undefined | null,
  classstyle?: string,
) => {
  return `
    <div class="${w ? w : "w-4"} h-4 text-xs border border-gray-800 ${check ? "flex items-center justify-center" : classstyle ? classstyle : ""}">
      ${check ? "✓" : val ? val : ""}
    </div>
  `;
};
