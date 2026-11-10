# EduInsight — Transparansi Data untuk Pemerataan Infrastruktur Pendidikan

**Final Submission | Web In Action — Multimedia In Action (MIA) 2026**

> **Making Education Gaps Visible, Making Better Decisions Possible.**

EduInsight adalah platform analisis dan visualisasi data berbasis web yang membantu masyarakat, akademisi, dan pemangku kebijakan memahami ketimpangan sarana dan prasarana pendidikan antarwilayah di **38 provinsi Indonesia**. EduInsight mengubah data pendidikan menjadi dashboard, peta tematik, perbandingan indikator, serta analisis disparitas yang dapat dieksplorasi secara interaktif.

### Akses aplikasi

- **Demo aplikasi:** https://myeduinsight.vercel.app/

## Latar Belakang

Ketersediaan data pendidikan belum selalu diikuti kemudahan untuk membaca dan membandingkannya. Perbedaan fasilitas antarprovinsi, antarsektor sekolah, dan antarindikator sering tersembunyi dalam tabel yang panjang. EduInsight dirancang sebagai sarana eksplorasi data publik agar kesenjangan lebih mudah terlihat, dipahami, dan didiskusikan secara berbasis bukti.

Dalam visualisasi aplikasi, **indeks komposit kesiapan sarana dan prasarana dasar** menunjukkan nilai **94,8% di DKI Jakarta**, dibandingkan **23,1% di Papua Pegunungan**. Perbedaan **71,7 poin persentase** ini menggambarkan alasan pentingnya pemetaan kondisi infrastruktur pendidikan secara transparan. Angka tersebut merupakan hasil pengolahan indikator pada aplikasi, bukan satu indikator tunggal.

## Fitur Utama

### 1. Dashboard Nasional dan Peta Interaktif

- Ringkasan KPI: skor komposit rata-rata nasional, provinsi tertinggi, provinsi terendah, dan median.
- Peta tematik Indonesia dengan cakupan 38 provinsi.
- Eksplorasi indikator fasilitas, termasuk komputer sekolah, internet, listrik, sanitasi/air bersih, dan kualifikasi pendidik.
- Filter sektor sesuai pilihan yang tersedia pada antarmuka.
- Daftar **5 provinsi tertinggi** dan **5 provinsi terendah** untuk membantu identifikasi wilayah prioritas.
- Akses ekspor data melalui tombol unduh yang tersedia pada aplikasi.

### 2. Perbandingan Antarprovinsi

- Membandingkan **2–3 provinsi** secara berdampingan.
- Menampilkan skor komposit dan indikator fasilitas setiap provinsi.
- Grafik komparatif **5 indikator** dan tabel pembanding.
- Garis acuan nasional untuk membantu membaca perbedaan capaian.
- Fitur tambah/hapus provinsi dan atur ulang pilihan.

**Contoh eksplorasi:** perbandingan DKI Jakarta, DI Yogyakarta, dan Papua Pegunungan memperlihatkan indeks komposit masing-masing **94,8%**, **91,3%**, dan **23,1%** pada tampilan aplikasi.

### 3. Analisis Disparitas Negeri vs Swasta

- Mengukur selisih capaian fasilitas sekolah negeri dan swasta menurut provinsi.
- Mengurutkan provinsi dengan kesenjangan terbesar pada indikator yang dipilih.
- Menampilkan nilai per sektor dan besaran selisih dalam **poin persentase**.
- Menyediakan visualisasi hubungan kesiapan fasilitas TIK dengan **Indeks Pembangunan Manusia (IPM)**.
- Menampilkan analisis regional dan ringkasan statistik korelasi/regresi.
- Menyediakan opsi cetak ringkasan dan ekspor data.

**Contoh temuan:** pada indikator laboratorium komputer, tampilan analisis menunjukkan selisih **41,03 poin persentase** antara sekolah negeri dan swasta di Maluku. Korelasi TIK–IPM yang ditampilkan adalah **r = 0,782**. Korelasi tidak membuktikan hubungan sebab-akibat.

### 4. Metodologi dan Transparansi Data

- Penjelasan sumber data, standardisasi wilayah, dan pengolahan indikator.
- Penjelasan skor komposit, disparitas antarsektor, serta korelasi dan koefisien determinasi.
- Informasi mengenai keterbatasan data dan prinsip interpretasi hasil analisis.

## Sumber dan Pengolahan Data

Aplikasi menggunakan dataset pendidikan dari **Satu Data Indonesia / Kemendikdasmen (referensi 2023)** dan data statistik pendukung dari **Badan Pusat Statistik (BPS)** sebagaimana dinyatakan dalam dokumentasi proyek. Berkas sumber yang disertakan pada repositori berada di folder `raw_data/`, antara lain:

- `komputer.xlsx`, `internet.xlsx`, `listrik.xlsx`, `air_minum.xlsx`, `guru.xlsx`
- `ipm.csv` dan `aps.csv`

Dataset terstandardisasi aplikasi berada pada `src/data/provincesData.json`, sementara data spasial 38 provinsi berada pada `src/data/indonesia-38-provinces.json`.

**Indeks komposit** pada antarmuka menggunakan lima komponen utama dengan bobot: komputer/laboratorium TIK **25%**, internet stabil **25%**, listrik 24 jam **20%**, sanitasi dan air bersih **15%**, serta guru D4/S1 bersertifikasi **15%**. Ketujuh indikator pada halaman Perbandingan adalah cakupan eksplorasi yang lebih luas; tidak seluruhnya masuk ke perhitungan skor komposit.

**Catatan interpretasi:** skor komposit adalah indeks olahan aplikasi, bukan angka resmi tunggal yang diterbitkan pemerintah. Tahun referensi setiap dataset harus dibaca sesuai sumber aslinya; tampilan tidak dimaksudkan sebagai pemantauan real-time.

## Teknologi

| Komponen | Implementasi |
| --- | --- |
| Frontend | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 dan CSS |
| Routing | React Router DOM 7 (dependensi proyek) |
| Peta | Leaflet, React-Leaflet, GeoJSON |
| Ikon | Lucide React |
| Pemrosesan dataset | JavaScript client-side, JSON, XLSX |
| Pembacaan spreadsheet | `xlsx` |
| Deployment demo | Vercel |

Pengolahan dan agregasi data dijalankan di sisi klien melalui utilitas proyek, termasuk `src/utils/dataService.js`. Repositori yang diperiksa tidak memerlukan konfigurasi database server untuk menjalankan demo lokal.

## Menjalankan Secara Lokal

**Prasyarat:** Node.js dan npm yang kompatibel dengan versi Vite pada proyek (disarankan Node.js versi LTS terbaru).

```bash
git clone https://github.com/NaqibZuhair/edu-insight.git
cd edu-insight
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di terminal (umumnya `http://localhost:5173`).

Untuk build produksi:

```bash
npm run build
npm run preview
```

Untuk menjalankan pemeriksaan lint:

```bash
npm run lint
```

## Struktur Proyek

```text
edu-insight/
├── public/                 # Aset publik
├── raw_data/               # Dataset sumber XLSX/CSV
├── src/
│   ├── components/         # Komponen antarmuka dan peta
│   ├── config/             # Konfigurasi
│   ├── constants/          # Label dan token tampilan
│   ├── data/               # Data provinsi dan GeoJSON
│   ├── pages/              # Komponen halaman
│   ├── utils/
│   │   └── dataService.js  # Pengolahan dan analisis data
│   ├── views/              # Dashboard, Perbandingan,
│   │                       # Disparitas, Metodologi
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

## Alur Penggunaan

1. Buka demo aplikasi dan amati ringkasan nasional di **Dasbor**.
2. Eksplorasi peta dengan memilih indikator atau filter yang tersedia.
3. Buka **Perbandingan** untuk memilih dua hingga tiga provinsi dan membaca matriks tujuh indikator.
4. Buka **Disparitas** untuk membandingkan fasilitas negeri–swasta, mengeksplorasi hubungan TIK–IPM, dan melihat klaster regional.
5. Buka **Metodologi** untuk memeriksa definisi, pendekatan pengukuran, dan sumber data.

## Nilai Manfaat

- **Masyarakat:** akses yang lebih mudah terhadap gambaran kesenjangan fasilitas pendidikan.
- **Akademisi dan pelajar:** eksplorasi indikator dan perbandingan wilayah untuk diskusi serta kajian awal.
- **Pemangku kebijakan:** dukungan informasi untuk mengidentifikasi persoalan dan mendiskusikan prioritas, dengan tetap memerlukan verifikasi dan analisis lanjutan sebelum pengambilan keputusan.

## Batasan dan Rencana Pengembangan

**Batasan:** cakupan utama saat ini tingkat provinsi; beberapa indikator menggunakan tahun referensi yang berbeda; skor dan rekomendasi bersifat analitis; korelasi statistik bukan bukti kausalitas.

**Rencana pengembangan:** perluasan analisis ke kabupaten/kota, pembaruan data lintas tahun, penyempurnaan rekomendasi prioritas, dan penguatan validasi kualitas data.

## Tim dan Kompetisi

**EduInsight — Final Submission, Web In Action, Multimedia In Action 2026**  
**Institusi:** Politeknik Negeri Jakarta  
**Anggota Tim:** Naqib, Sulthon dan Najwa  
**Nama tim:** Disuruh Isi Nama Tim

## Penutup

EduInsight dikembangkan dengan keyakinan bahwa **data publik seharusnya bukan hanya tersedia, tetapi juga dapat dipahami dan dimanfaatkan**. Dengan memperjelas perbedaan kondisi antarwilayah, EduInsight diharapkan menjadi salah satu sarana pendukung diskusi menuju pemerataan infrastruktur pendidikan Indonesia.

**EduInsight — Making Education Gaps Visible, Making Better Decisions Possible.**
