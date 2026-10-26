# Panduan Integrasi Frontend - EduInsight

Dokumen ini merupakan panduan teknis bagi Frontend Developer untuk menghubungkan komponen antarmuka pengguna (UI) dengan layer data dan logika aplikasi EduInsight.

Spesifikasi tampilan, tema, tipografi, dan palet warna sepenuhnya mengacu pada desain UI/UX yang telah disepakati. Panduan ini berfokus pada integrasi logika, struktur data, rute halaman, dan API modul yang tersedia.

---

## 1. Arsitektur dan Alur Data

Aplikasi ini menggunakan pendekatan **Client-Side Data Engine (Jamstack)**:
- Tidak ada panggilan API jaringan (HTTP request) runtime untuk kalkulasi data.
- Seluruh data 38 provinsi dimuat dari `src/data/provincesData.json` secara in-memory.
- Seluruh fungsi pada `src/utils/dataService.js` bersifat **murni dan sinkron** (*pure and synchronous*).
- Komponen UI cukup memanggil fungsi terkait dan mengelola state presentasi secara lokal.

---

## 2. Struktur Modul dan Berkas Tersedia

```text
src/
├── config/
│   └── constants.js             # Metadata indikator, rute, konfigurasi peta dasar
├── data/
│   ├── provincesData.json       # Dataset 38 provinsi dan indikator pendidikan
│   └── indonesia-38-provinces.json # GeoJSON 38 provinsi (importable modul)
├── utils/
│   └── dataService.js           # 10 fungsi logika data dan agregasi
├── components/
│   └── layout/
│       ├── Navbar.jsx           # Navigasi utama
│       ├── Footer.jsx           # Informasi sumber data
│       └── Layout.jsx           # Shell pembungkus halaman
└── pages/
    ├── DashboardPage.jsx        # Halaman Peta & Ringkasan Nasional (/)
    ├── ComparePage.jsx          # Halaman Komparasi Antar-Provinsi (/compare)
    ├── DisparityPage.jsx        # Halaman Analisis Disparitas Sektor (/disparity)
    └── MethodologyPage.jsx      # Halaman Metodologi (/methodology)

public/
└── indonesia-38-provinces.geojson # Berkas GeoJSON publik (untuk direct fetch Leaflet)
```

---

## 3. Metadata Konfigurasi (`src/config/constants.js`)

Impor konstanta pendukung melalui:
```javascript
import {
  INDICATORS,
  FACILITY_INDICATORS,
  OUTCOME_INDICATORS,
  MAP_CONFIG,
  DEFAULT_GEOJSON_STYLE,
  NAV_ROUTES,
  TOTAL_PROVINCES,
  DEFAULT_INDICATOR,
  DEFAULT_COMPARE_PROVINCES,
  TOP_DISPARITY_LIMIT,
  DATA_SOURCES,
  getIndicatorMeta,
} from '../config/constants';
```

### Keterangan Objek `INDICATORS`
Setiap indikator memiliki properti:
- `key`: string pengenal (`'komputer'`, `'internet'`, `'listrik'`, `'air_minum'`, `'guru_d4s1'`, `'ipm'`, `'aps_13_15'`).
- `label`: teks label untuk tampilan dropdown/tab.
- `unit`: satuan metrik (`'%'` atau `'indeks'`).
- `hasSectorData`: boolean (`true` jika memiliki data rincian Negeri vs Swasta).
- `description`: penjelasan singkat indikator.
- `source`: sumber resmi data.

---

## 4. Referensi Logika Data (`src/utils/dataService.js`)

Seluruh fungsi di bawah ini siap dipanggil di dalam komponen React atau custom hooks:

### 1. `getAllProvinces()`
Mengambil seluruh data mentah 38 provinsi.
- **Return:** `Array<object>`

### 2. `getProvinceByName(name)`
Mencari data satu provinsi berdasarkan nama (case-insensitive).
- **Parameter:** `name` (string)
- **Return:** `object | null`

### 3. `getNationalAverage(indicatorKey)`
Menghitung rata-rata nasional nilai `total` untuk suatu indikator.
- **Parameter:** `indicatorKey` (string)
- **Return:** `number` (dibulatkan 2 desimal)

### 4. `getIndicatorSummary(indicatorKey, sector = 'total')`
Menghitung ringkasan statistik (min, max, rata-rata, median, count).
- **Parameter:** 
  - `indicatorKey` (string)
  - `sector` (opsional: `'total'` | `'negeri'` | `'swasta'`)
- **Return:** `{ min: number, max: number, avg: number, median: number, count: number } | null`

### 5. `getRankings(indicatorKey, ascending = false)`
Mengurutkan 38 provinsi berdasarkan nilai total indikator.
- **Parameter:**
  - `indicatorKey` (string)
  - `ascending` (boolean: default `false` untuk nilai tertinggi ke terendah)
- **Return:** `Array<object>`

### 6. `getSectorGap(provinceName, indicatorKey)`
Menghitung selisih persentase antara sekolah Negeri dan Swasta pada suatu provinsi.
- **Parameter:**
  - `provinceName` (string)
  - `indicatorKey` (string, indikator fasilitas)
- **Return:** `{ province: string, negeri: number, swasta: number, gap: number, dominantSector: 'Negeri' | 'Swasta' | 'Seimbang' } | null`

### 7. `getTopDisparityProvinces(indicatorKey, limit = 5)`
Mengambil daftar provinsi dengan disparitas absolut (|gap| Negeri vs Swasta) tertinggi.
- **Parameter:**
  - `indicatorKey` (string)
  - `limit` (number, default 5)
- **Return:** `Array<{ province: string, negeri: number, swasta: number, gap: number, dominantSector: string }>`

### 8. `compareProvinces(provinceNames, indicatorKey)`
Mengambil data indikator untuk 2 sampai 3 provinsi sekaligus (berguna untuk chart perbandingan).
- **Parameter:**
  - `provinceNames` (string[])
  - `indicatorKey` (string)
- **Return:** `Array<{ name: string, indicators: object | null }>`

### 9. `getMapDataByIndicator(indicatorKey, sector = 'total')`
Menghasilkan objek pemetaan `{ code_bps: nilai }` untuk kebutuhan pewarnaan peta choropleth.
- **Parameter:**
  - `indicatorKey` (string)
  - `sector` (opsional: `'total'` | `'negeri'` | `'swasta'`)
- **Return:** `Record<string, number>` (contoh: `{ "11": 75.58, "12": 79.75, ... }`)

### 10. `getCorrelationData(indicatorX, indicatorY)`
Menyiapkan pasangan koordinat titik untuk grafik korelasi (scatter plot) 38 provinsi.
- **Parameter:**
  - `indicatorX` (string, misal fasilitas: `'komputer'`)
  - `indicatorY` (string, misal capaian: `'ipm'`)
- **Return:** `Array<{ name: string, x: number, y: number }>`

---

## 5. Integrasi Peta Leaflet & GeoJSON

Data batas wilayah 38 provinsi Indonesia tersedia dalam dua cara pemuatan:
1. **Direct Import (Rekomendasi React):**
   ```javascript
   import geoJsonData from '../data/indonesia-38-provinces.json';
   ```
2. **Fetch URL:**
   ```javascript
   fetch('/indonesia-38-provinces.geojson').then((res) => res.json());
   ```

### Menghubungkan Nilai Indikator ke Fitur Peta
Setiap fitur GeoJSON memiliki properti standar:
- `feature.properties.code_bps` (string, contoh: `"11"`)
- `feature.properties.name` (string, contoh: `"Aceh"`)

Contoh pengikatan data ke callback style Leaflet:
```jsx
import { GeoJSON } from 'react-leaflet';
import { getMapDataByIndicator } from '../utils/dataService';
import geoJsonData from '../data/indonesia-38-provinces.json';

export function MapView({ indicatorKey, sector, resolveColor }) {
  const mapData = getMapDataByIndicator(indicatorKey, sector);

  const styleFeature = (feature) => {
    const code = feature.properties.code_bps;
    const value = mapData[code] ?? 0;

    return {
      fillColor: resolveColor(value), // Terapkan skala warna sesuai panduan UI/UX
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.8,
    };
  };

  return <GeoJSON data={geoJsonData} style={styleFeature} />;
}
```

---

## 6. Pembagian Halaman dan Kebutuhan State

### 1. Dashboard (`src/pages/DashboardPage.jsx`)
- **Tujuan:** Ringkasan statistik nasional dan visualisasi peta interaktif.
- **State Pengguna:**
  - `selectedIndicator`: string (default: `'komputer'`)
  - `selectedSector`: `'total'` | `'negeri'` | `'swasta'`
  - `activeProvince`: objek provinsi yang sedang dipilih pada peta untuk kartu detail.

### 2. Perbandingan (`src/pages/ComparePage.jsx`)
- **Tujuan:** Membandingkan beberapa provinsi secara berdampingan.
- **State Pengguna:**
  - `selectedProvinces`: string[] (contoh: `['DKI Jakarta', 'DI Yogyakarta', 'Papua Pegunungan']`)
  - `selectedIndicator`: string
- **Komponen Visual:** Grouped Bar Chart atau kartu komparasi matriks.

### 3. Disparitas (`src/pages/DisparityPage.jsx`)
- **Tujuan:** Menganalisis kesenjangan fasilitas antara sekolah Negeri dan Swasta.
- **State Pengguna:**
  - `selectedIndicator`: string (pilihan dari `FACILITY_INDICATORS`)
  - `outcomeIndicator`: string (opsional untuk sumbu korelasi, dari `OUTCOME_INDICATORS`)
- **Komponen Visual:** Bar chart disparitas (gap) dan Scatter Plot korelasi fasilitas terhadap capaian.

### 4. Metodologi (`src/pages/MethodologyPage.jsx`)
- **Tujuan:** Dokumentasi sumber rujukan dan metodologi data.
- **State Pengguna:** Statis. Data dapat dirender langsung dari array `DATA_SOURCES`.

---

## 7. Praktik Terbaik Implementasi

1. **Optimasi Performa (`useMemo`):**
   Meskipun dataset 38 provinsi relatif kecil, gunakan `useMemo` saat memanggil fungsi agregasi atau filter berulang agar proses render tetap optimal:
   ```javascript
   const mapData = useMemo(
     () => getMapDataByIndicator(indicatorKey, sector),
     [indicatorKey, sector]
   );
   ```
2. **Penanganan Nilai Kosong / Fallback:**
   Pastikan komponen menangani kondisi indikator yang tidak memiliki rincian sektor (seperti `ipm` dan `aps_13_15`) dengan menonaktifkan atau menyembunyikan toggle sektor Negeri/Swasta.
3. **Pemisahan Logika Presentasi:**
   Hindari penulisan kalkulasi manual di dalam JSX komponen. Gunakan fungsi-fungsi terpusat dari `dataService.js` untuk menjaga konsistensi nilai di seluruh tampilan.
