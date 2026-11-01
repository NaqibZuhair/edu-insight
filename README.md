# EduInsight

EduInsight adalah platform berbasis web untuk memantau, menganalisis, dan memvisualisasikan ketimpangan fasilitas pendidikan antardaerah di 38 provinsi Indonesia. Platform ini mengolah data resmi Satu Data Indonesia (Kemendikdasmen 2023) dan Badan Pusat Statistik (2025) guna mendukung transparansi publik serta pengambilan kebijakan berbasis data.

---

## Tech Stack

- **Framework:** React.js (Vite)
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS v4
- **Visualisasi Peta:** Leaflet.js, React-Leaflet, GeoJSON (Batas Administrasi 38 Provinsi)
- **Visualisasi Grafik:** Recharts / Chart.js
- **Ikonografi:** Lucide React
- **Pengolahan Data:** In-Memory Client-Side Data Engine (Dataset 38 Provinsi, JSON/XLSX)

---

## Cara Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan project di lingkungan lokal:

1. **Clone Repositori**
   ```bash
   git clone https://github.com/NaqibZuhair/edu-insight.git
   cd edu-insight
   ```

2. **Instalasi Dependensi**
   ```bash
   npm install
   ```

3. **Menjalankan Server Pengembangan**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan secara lokal pada `http://localhost:5173`.

4. **Build untuk Produksi**
   ```bash
   npm run build
   ```

---

## Progress Saat Ini

Tahap pengerjaan aplikasi per First Draft Submission:

1. **Pipeline & Logika Data:**
   - Ekstraksi dan standardisasi dataset resmi 38 provinsi mencakup 7 indikator utama (fasilitas TIK, internet, listrik, air bersih, kualifikasi pendidik, IPM, dan APS 13-15 tahun).
   - Engine data sinkron terpusat (`src/utils/dataService.js`) untuk kalkulasi agregat nasional, gap disparitas Negeri vs Swasta, perangkingan wilayah, dan korelasi indikator.
   - Dataset spasial GeoJSON 38 provinsi (termasuk 4 Daerah Otonom Baru Papua) yang telah terhubung 1:1 dengan kode referensi BPS.

2. **Navigasi & Arsitektur Halaman:**
   - Konfigurasi rute navigasi terpadu menggunakan React Router DOM.
   - Shell layout konsisten (`Navbar` dan `Footer`).

3. **Halaman Dashboard & Peta Interaktif:**
   - Hero section informasional mengenai disparitas infrastruktur pendidikan nusantara.
   - Kartu metrik KPI nasional (Rata-rata Nasional, Provinsi Tertinggi, Provinsi Terendah, dan Median).
   - Komponen peta interaktif tematik (Choropleth Map) berbasis Leaflet dengan filter indikator dan sektor (Negeri/Swasta).

4. **Halaman Perbandingan Multi-Provinsi:**
   - Matriks perbandingan fasilitas berdampingan untuk 2 hingga 3 provinsi terpilih.
   - Grafik batang komparatif antar-indikator terhadap benchmark nasional.

5. **Halaman Analisis Disparitas & Rekomendasi:**
   - Tabel peringkat kesiapan fasilitas (Top 5 vs Bottom 5 Provinsi).
   - Analisis kesenjangan sarana prasarana sekolah Negeri vs Swasta serta korelasi terhadap capaian pembangunan manusia (IPM).