# 📘 FRONTEND INTEGRATION GUIDE

## EduInsight — Analitik Fasilitas Pendidikan Indonesia
### Web In Action (WIA) 2026 | Dokumen Versi: 1.0.0

> **Status:** 🟢 Siap Diimplementasikan  
> **Terakhir Diperbarui:** 26 Oktober 2026  
> **Penulis:** Senior Frontend System Architect  
> **Ditujukan Untuk:** Tim Frontend Developer EduInsight

---

## Daftar Isi

1. [Konteks Arsitektur & Tech Stack](#1-konteks-arsitektur--tech-stack)
2. [Bagian 1 — Rincian Halaman & Komponen UI](#bagian-1--rincian-halaman--komponen-ui-yang-wajib-dibuat)
3. [Bagian 2 — Katalog Fungsi `dataService.js`](#bagian-2--katalog-fungsi-dataservicejs--contoh-pemanggilan)
4. [Bagian 3 — Daftar Indikator Data Valid](#bagian-3--daftar-indikator-data-valid)
5. [Bagian 4 — Aturan Integrasi & Best Practices](#bagian-4--aturan-integrasi--best-practices)

---

## 1. Konteks Arsitektur & Tech Stack

### 1.1 Gambaran Umum Proyek

**EduInsight** adalah platform analitik data pendidikan berbasis web yang menampilkan kondisi fasilitas sekolah SMA/SMK/MA di 38 provinsi Indonesia berdasarkan data resmi **Satu Data Indonesia (SDI) 2023** dari Kemendikdasmen dan **BPS 2025**.

Platform ini dirancang untuk memvisualisasikan disparitas fasilitas antara sekolah Negeri dan Swasta, serta korelasinya dengan Indeks Pembangunan Manusia (IPM) dan Angka Partisipasi Sekolah (APS).

### 1.2 Stack Teknologi

| Kategori | Teknologi | Versi | Keterangan |
|---|---|---|---|
| **Core Framework** | React.js | `^19.3.1` | Via Vite build tool |
| **Build Tool** | Vite | `^8.3.4` | Dev server & bundler |
| **Styling** | Tailwind CSS | `^4.3.3` | Utility-first CSS |
| **Peta Interaktif** | Leaflet / React-Leaflet | `1.9.4 / 5.0.0` | Choropleth map |
| **Grafik & Chart** | Recharts / Chart.js | *Pilih salah satu* | Bar, Scatter Plot |
| **Icon Set** | Lucide React | `^1.59.0` | Ikon UI |
| **Data Engine** | `src/utils/dataService.js` | — | Client-side, In-Memory |

### 1.3 Arsitektur Data (Client-Side Data Engine)

Platform ini menggunakan arsitektur **Jamstack** murni — seluruh data di-*bundle* statis bersama aplikasi. Tidak ada API call ke server eksternal pada runtime.

```
src/
├── data/
│   └── provincesData.json     ← Sumber kebenaran tunggal (38 provinsi, ~27KB)
└── utils/
    └── dataService.js         ← Helper functions (synchronous, in-memory)
```

**Alur data:**
```
provincesData.json (Static JSON)
        ↓ import
dataService.js (Pure Functions, Synchronous)
        ↓ dipanggil
Page Component (state owner)
        ↓ props
UI Components (presentational)
```

> **⚠️ PENTING:** Semua fungsi di `dataService.js` bersifat **synchronous** (tidak ada `async/await`, tidak ada `fetch`). Data langsung tersedia saat komponen pertama kali di-render. Tidak diperlukan `useEffect` untuk fetching.

### 1.4 Struktur Objek Data Provinsi

Setiap entri dalam `provincesData.json` mengikuti skema berikut:

```json
{
  "code_kemdagri": "34",
  "code_bps": "34",
  "name": "DI Yogyakarta",
  "indicators": {
    "komputer": {
      "total": 64.76,
      "negeri": 86.45,
      "swasta": 45.42
    },
    "internet": {
      "total": 96.7,
      "negeri": 97.2,
      "swasta": 96.25
    },
    "listrik": { "total": 100, "negeri": 100, "swasta": 100 },
    "air_minum": { "total": 98.46, "negeri": 97.2, "swasta": 99.58 },
    "guru_d4s1": { "total": 98.72, "negeri": 99.42, "swasta": 97.48 },
    "ipm": { "total": 82.48 },
    "aps_13_15": { "total": 99.6 }
  }
}
```

> **⚠️ CATATAN KRITIS — Perbedaan Struktur Indikator:**
> - Indikator **fasilitas** (`komputer`, `internet`, `listrik`, `air_minum`, `guru_d4s1`) memiliki tiga sub-field: `total`, `negeri`, `swasta`.
> - Indikator **sosial** (`ipm`, `aps_13_15`) **HANYA** memiliki sub-field `total`. Memanggil `.negeri` atau `.swasta` pada indikator ini akan menghasilkan `undefined`. Tangani kondisi ini dengan guard yang tepat.

---

## BAGIAN 1 — Rincian Halaman & Komponen UI Yang Wajib Dibuat

### Struktur Direktori Target

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── dashboard/
│   │   ├── HeroSection.jsx
│   │   ├── KpiCardsGroup.jsx
│   │   ├── ChoroplethMapSection.jsx
│   │   └── LeaderboardTable.jsx
│   ├── compare/
│   │   ├── ProvinceSelector.jsx
│   │   ├── SideBySideChart.jsx
│   │   └── SectorGapCard.jsx
│   └── disparity/
│       ├── TopDisparityList.jsx
│       └── CorrelationPlot.jsx
└── pages/
    ├── Dashboard.jsx
    ├── Compare.jsx
    ├── DisparityInsight.jsx
    └── Methodology.jsx
```

---

### 1.1 Layout & Komponen Global (`src/components/common/`)

#### `Navbar.jsx`

**Fungsi:** Header navigasi sticky yang menjadi titik orientasi pengguna di seluruh halaman.

**Elemen yang Wajib Ada:**

| Elemen | Detail Implementasi |
|---|---|
| **Logo EduInsight** | Teks `EduInsight` dengan ikon `BookOpen` (Lucide), link ke `/` |
| **Menu Navigasi** | Tab links: Dashboard, Perbandingan, Disparitas, Metodologi |
| **Indikator Status Data** | Badge kecil yang menampilkan: `● Data SDI 2023 · 38 Provinsi` |

**Contoh Kode Dasar:**
```jsx
// src/components/common/Navbar.jsx
import { BookOpen, Database } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/' },
  { label: 'Perbandingan', to: '/compare' },
  { label: 'Disparitas', to: '/disparity' },
  { label: 'Metodologi', to: '/methodology' },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 text-sky-400 font-bold text-xl">
          <BookOpen size={22} />
          EduInsight
        </NavLink>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300'
                    : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <Database size={12} />
          <span>Data SDI 2023 · 38 Provinsi</span>
        </div>
      </div>
    </nav>
  );
}
```

---

#### `Footer.jsx`

**Fungsi:** Footer informasional di bagian bawah setiap halaman.

**Elemen yang Wajib Ada:**
- Teks hak cipta: `© 2026 EduInsight — WIA MIA 2026`
- Sumber data resmi: `Sumber: Katalog Kemendikdasmen SDI 2023 & BPS 2025`
- Link repositori GitHub tim
- Disclaimer: Data untuk keperluan analitik akademik

---

### 1.2 Halaman 1: Dashboard Utama (`src/pages/Dashboard.jsx`)

**Fungsi:** Halaman landing utama yang memberikan gambaran menyeluruh kondisi fasilitas pendidikan nasional.

**State Management di Level Halaman:**
```jsx
// src/pages/Dashboard.jsx
import { useState } from 'react';

export default function Dashboard() {
  // State utama yang dikelola di sini, lalu diturunkan via props
  const [selectedIndicator, setSelectedIndicator] = useState('komputer');

  return (
    <main>
      <HeroSection
        selectedIndicator={selectedIndicator}
        onIndicatorChange={setSelectedIndicator}
      />
      <KpiCardsGroup indicatorKey={selectedIndicator} />
      <ChoroplethMapSection indicatorKey={selectedIndicator} />
      <LeaderboardTable indicatorKey={selectedIndicator} />
    </main>
  );
}
```

---

#### `HeroSection.jsx`

**Fungsi:** Bagian pembuka halaman dengan penapis indikator utama.

**Props:**
```jsx
HeroSection.propTypes = {
  selectedIndicator: PropTypes.string.isRequired,   // Key indikator aktif
  onIndicatorChange: PropTypes.func.isRequired,      // Callback saat indikator diubah
}
```

**Elemen Wajib:**
- **Judul Platform:** `EduInsight — Analitik Fasilitas Pendidikan Indonesia`
- **Deskripsi Singkat:** Satu paragraf tentang tujuan platform
- **Filter Tabs / Pill Buttons** untuk memilih indikator:

```jsx
const INDICATORS = [
  { key: 'komputer',   label: 'Komputer',    icon: Monitor },
  { key: 'internet',   label: 'Internet',    icon: Wifi },
  { key: 'listrik',    label: 'Listrik',     icon: Zap },
  { key: 'air_minum',  label: 'Air Minum',   icon: Droplets },
  { key: 'guru_d4s1',  label: 'Guru D4/S1',  icon: GraduationCap },
];
```

---

#### `KpiCardsGroup.jsx`

**Fungsi:** Menampilkan 4 kartu metrik utama berdasarkan indikator yang dipilih.

**Props:**
```jsx
KpiCardsGroup.propTypes = {
  indicatorKey: PropTypes.string.isRequired,
}
```

**Data yang Dibutuhkan & Cara Mengambilnya:**
```jsx
import {
  getNationalAverage,
  getRankings,
  getIndicatorSummary, // Perlu ditambahkan ke dataService.js — lihat Bagian 2
} from '../utils/dataService';

function KpiCardsGroup({ indicatorKey }) {
  const nationalAvg = getNationalAverage(indicatorKey);
  const rankings     = getRankings(indicatorKey, false); // false = descending
  const highest      = rankings[0];                       // Provinsi teratas
  const lowest       = rankings[rankings.length - 1];    // Provinsi terbawah
  const nationalIpm  = getNationalAverage('ipm');
  const nationalAps  = getNationalAverage('aps_13_15');

  const cards = [
    {
      title: 'Rata-rata Nasional',
      value: `${nationalAvg}%`,
      icon: TrendingUp,
      color: 'sky',
    },
    {
      title: 'Provinsi Tertinggi',
      value: `${highest?.indicators[indicatorKey]?.total ?? 'N/A'}%`,
      subtitle: highest?.name,
      icon: Trophy,
      color: 'emerald',
    },
    {
      title: 'Provinsi Terendah',
      value: `${lowest?.indicators[indicatorKey]?.total ?? 'N/A'}%`,
      subtitle: lowest?.name,
      icon: AlertTriangle,
      color: 'rose',
    },
    {
      title: 'Rata-rata IPM / APS',
      value: `${nationalIpm} / ${nationalAps}`,
      icon: BarChart2,
      color: 'violet',
    },
  ];

  // render 4 card...
}
```

---

#### `ChoroplethMapSection.jsx`

**Fungsi:** Peta Indonesia interaktif berbasis Leaflet yang menampilkan graduasi warna tiap provinsi sesuai nilai indikator.

> **⚠️ PERHATIAN:** Komponen ini memerlukan **file GeoJSON wilayah Indonesia** (38 provinsi) yang harus ditempatkan di `public/indonesia-provinces.geojson`. File ini **belum tersedia** di repositori dan harus disiapkan oleh tim. Pastikan `code_bps` pada GeoJSON cocok dengan field `code_bps` di `provincesData.json`.

**Props:**
```jsx
ChoroplethMapSection.propTypes = {
  indicatorKey: PropTypes.string.isRequired,
}
```

**Cara Mengambil Data untuk Peta:**

Gunakan fungsi `getMapDataByIndicator` (perlu ditambahkan ke `dataService.js` — lihat Bagian 2):

```jsx
import { getMapDataByIndicator } from '../utils/dataService';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import indonesiaGeoJson from '../../public/indonesia-provinces.geojson';

function ChoroplethMapSection({ indicatorKey }) {
  // Ambil data dalam format Map: { "11": 27.74, "12": 25.27, ... }
  const mapData = getMapDataByIndicator(indicatorKey, 'total');

  // Fungsi warna berdasarkan nilai (0–100)
  const getColor = (value) => {
    if (value >= 80) return '#0ea5e9'; // sky-500
    if (value >= 60) return '#38bdf8'; // sky-400
    if (value >= 40) return '#7dd3fc'; // sky-300
    if (value >= 20) return '#bae6fd'; // sky-200
    return '#e0f2fe';                  // sky-100
  };

  // Style tiap feature GeoJSON
  const featureStyle = (feature) => {
    const code = feature.properties.kode_bps; // Sesuaikan dengan field di GeoJSON kamu
    const value = mapData[code] ?? 0;
    return {
      fillColor: getColor(value),
      fillOpacity: 0.85,
      color: '#1e293b',   // Border antar provinsi
      weight: 1.5,
    };
  };

  // Event handler per feature (hover tooltip)
  const onEachFeature = (feature, layer) => {
    const code  = feature.properties.kode_bps;
    const name  = feature.properties.name;
    const value = mapData[code] ?? 'N/A';
    layer.bindTooltip(
      `<div class="font-bold">${name}</div><div>${value}%</div>`,
      { sticky: true }
    );
  };

  return (
    <section className="my-8">
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        style={{ height: '500px', width: '100%', borderRadius: '1rem' }}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON
          key={indicatorKey}  // Key berubah → re-render saat indikator ganti
          data={indonesiaGeoJson}
          style={featureStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </section>
  );
}
```

---

#### `LeaderboardTable.jsx`

**Fungsi:** Tabel 38 provinsi dengan fitur pencarian, pengurutan, dan filter range nilai.

**Props:**
```jsx
LeaderboardTable.propTypes = {
  indicatorKey: PropTypes.string.isRequired,
}
```

**State Internal Komponen:**
```jsx
function LeaderboardTable({ indicatorKey }) {
  const [searchQuery,  setSearchQuery]  = useState('');
  const [sortAsc,      setSortAsc]      = useState(false);
  const [minValue,     setMinValue]     = useState(0);
  const [maxValue,     setMaxValue]     = useState(100);

  const allData = getRankings(indicatorKey, sortAsc);

  const filtered = allData.filter((prov) => {
    const val = prov.indicators[indicatorKey]?.total ?? 0;
    const matchSearch = prov.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRange  = val >= minValue && val <= maxValue;
    return matchSearch && matchRange;
  });

  // Render tabel dengan kolom: Peringkat, Nama Provinsi, Total, Negeri, Swasta, Gap
}
```

> **Catatan Kolom:** Untuk indikator `ipm` dan `aps_13_15`, kolom **Negeri** dan **Swasta** tidak tersedia — tampilkan tanda `-` atau `N/A`.

---

### 1.3 Halaman 2: Modul Perbandingan Wilayah (`src/pages/Compare.jsx`)

**State Management di Level Halaman:**
```jsx
// src/pages/Compare.jsx
export default function Compare() {
  const [selectedProvinces, setSelectedProvinces] = useState(['DKI Jakarta', 'DI Yogyakarta']);
  const [selectedIndicator, setSelectedIndicator] = useState('komputer');

  return (
    <main>
      <ProvinceSelector
        selected={selectedProvinces}
        onChange={setSelectedProvinces}
        maxSelect={3}
      />
      <SideBySideChart
        provinceNames={selectedProvinces}
        indicatorKey={selectedIndicator}
      />
      <SectorGapCard
        provinceNames={selectedProvinces}
        indicatorKey={selectedIndicator}
      />
    </main>
  );
}
```

---

#### `ProvinceSelector.jsx`

**Fungsi:** Komponen multi-select untuk memilih 2–3 provinsi yang akan dibandingkan.

**Props:**
```jsx
ProvinceSelector.propTypes = {
  selected:   PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange:   PropTypes.func.isRequired,
  maxSelect:  PropTypes.number,  // Default: 3
}
```

**Cara Mendapatkan Daftar Provinsi:**
```jsx
import { getAllProvinces } from '../utils/dataService';

const allProvinces = getAllProvinces(); // Array 38 objek provinsi
const provinceNames = allProvinces.map(p => p.name); // ["Aceh", "Sumatera Utara", ...]
```

---

#### `SideBySideChart.jsx`

**Fungsi:** Bar chart komparatif menggunakan Recharts, membandingkan nilai `total`, `negeri`, dan `swasta` dari indikator yang dipilih untuk provinsi terpilih.

**Props:**
```jsx
SideBySideChart.propTypes = {
  provinceNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  indicatorKey:  PropTypes.string.isRequired,
}
```

**Cara Menyiapkan Data Chart:**
```jsx
import { compareProvinces } from '../utils/dataService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function SideBySideChart({ provinceNames, indicatorKey }) {
  const rawData = compareProvinces(provinceNames, indicatorKey);

  // Transformasi untuk format Recharts
  const chartData = rawData.map((item) => ({
    name:    item.name,
    Total:   item.indicators?.total  ?? 0,
    Negeri:  item.indicators?.negeri ?? 0,
    Swasta:  item.indicators?.swasta ?? 0,
  }));

  // Guard: Jika indikator tidak punya negeri/swasta (ipm, aps_13_15)
  const hasSectorData = rawData[0]?.indicators?.negeri !== undefined;

  return (
    <BarChart width={700} height={400} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[0, 100]} />
      <Tooltip formatter={(val) => `${val}%`} />
      <Legend />
      <Bar dataKey="Total"  fill="#0ea5e9" />
      {hasSectorData && <Bar dataKey="Negeri" fill="#10b981" />}
      {hasSectorData && <Bar dataKey="Swasta" fill="#f59e0b" />}
    </BarChart>
  );
}
```

---

#### `SectorGapCard.jsx`

**Fungsi:** Kartu statistik yang menampilkan gap (selisih) Negeri vs Swasta untuk setiap provinsi yang dipilih.

**Props:**
```jsx
SectorGapCard.propTypes = {
  provinceNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  indicatorKey:  PropTypes.string.isRequired,
}
```

**Cara Mengambil Data:**
```jsx
import { getSectorGap } from '../utils/dataService';

function SectorGapCard({ provinceNames, indicatorKey }) {
  const gapData = provinceNames
    .map((name) => getSectorGap(name, indicatorKey))
    .filter(Boolean); // Buang hasil null (e.g., untuk ipm/aps_13_15)

  if (gapData.length === 0) {
    return (
      <div className="text-slate-400 text-center py-8">
        Data perbandingan sektor tidak tersedia untuk indikator ini.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {gapData.map((item) => (
        <div key={item.province} className="bg-slate-800 rounded-xl p-6">
          <h3 className="font-bold text-lg">{item.province}</h3>
          <div className="flex gap-8 mt-3">
            <div>
              <span className="text-xs text-slate-400">Negeri</span>
              <p className="text-emerald-400 font-bold text-xl">{item.negeri}%</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Swasta</span>
              <p className="text-amber-400 font-bold text-xl">{item.swasta}%</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Gap</span>
              <p className={`font-bold text-xl ${item.gap > 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                {item.gap > 0 ? '+' : ''}{item.gap}%
              </p>
              <span className="text-xs text-slate-500">({item.dominantSector} lebih unggul)</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### 1.4 Halaman 3: Insight Disparitas & Anomali (`src/pages/DisparityInsight.jsx`)

**State Management di Level Halaman:**
```jsx
export default function DisparityInsight() {
  const [disparityIndicator,    setDisparityIndicator]    = useState('komputer');
  const [correlationIndicatorX, setCorrelationIndicatorX] = useState('internet');

  return (
    <main>
      <TopDisparityList
        indicatorKey={disparityIndicator}
        onIndicatorChange={setDisparityIndicator}
      />
      <CorrelationPlot
        indicatorX={correlationIndicatorX}
        indicatorY="ipm"
        onIndicatorXChange={setCorrelationIndicatorX}
      />
    </main>
  );
}
```

---

#### `TopDisparityList.jsx`

**Fungsi:** Menampilkan 5 provinsi dengan gap Negeri vs Swasta terbesar (nilai absolut).

**Props:**
```jsx
TopDisparityList.propTypes = {
  indicatorKey:       PropTypes.string.isRequired,
  onIndicatorChange:  PropTypes.func,
}
```

**Cara Mengambil Data:**
```jsx
import { getTopDisparityProvinces } from '../utils/dataService';
// Perlu ditambahkan ke dataService.js — lihat Bagian 2, Fungsi #8

function TopDisparityList({ indicatorKey }) {
  const topDisparity = getTopDisparityProvinces(indicatorKey, 5);

  if (!topDisparity || topDisparity.length === 0) {
    return <p className="text-slate-400">Data disparitas tidak tersedia untuk indikator ini.</p>;
  }

  return (
    <ol className="space-y-3">
      {topDisparity.map((item, index) => (
        <li key={item.province} className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl">
          <span className="text-2xl font-black text-slate-600">#{index + 1}</span>
          <div className="flex-1">
            <p className="font-bold">{item.province}</p>
            <p className="text-sm text-slate-400">
              Negeri: {item.negeri}% | Swasta: {item.swasta}%
            </p>
          </div>
          <span className="text-rose-400 font-bold text-lg">
            ∆ {Math.abs(item.gap)}%
          </span>
        </li>
      ))}
    </ol>
  );
}
```

---

#### `CorrelationPlot.jsx`

**Fungsi:** Scatter plot yang memvisualisasikan korelasi antara dua indikator untuk 38 provinsi.

**Props:**
```jsx
CorrelationPlot.propTypes = {
  indicatorX:          PropTypes.string.isRequired,  // e.g., 'internet'
  indicatorY:          PropTypes.string.isRequired,  // e.g., 'ipm'
  onIndicatorXChange:  PropTypes.func,
}
```

**Cara Menyiapkan Data:**
```jsx
import { getCorrelationData } from '../utils/dataService';
// Perlu ditambahkan ke dataService.js — lihat Bagian 2, Fungsi #10
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function CorrelationPlot({ indicatorX, indicatorY }) {
  const data = getCorrelationData(indicatorX, indicatorY);
  // data = [{ name: "Aceh", x: 75.58, y: 76.23 }, ...]

  return (
    <ScatterChart width={700} height={450}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="x"
        name={indicatorX}
        label={{ value: `${indicatorX} (%)`, position: 'insideBottom', offset: -5 }}
        domain={['auto', 'auto']}
      />
      <YAxis
        dataKey="y"
        name={indicatorY}
        label={{ value: indicatorY.toUpperCase(), angle: -90, position: 'insideLeft' }}
        domain={['auto', 'auto']}
      />
      <Tooltip
        cursor={{ strokeDasharray: '3 3' }}
        content={({ payload }) => {
          if (!payload?.length) return null;
          const d = payload[0].payload;
          return (
            <div className="bg-slate-800 border border-slate-600 p-2 rounded-lg text-sm">
              <p className="font-bold">{d.name}</p>
              <p>{indicatorX}: {d.x}%</p>
              <p>{indicatorY}: {d.y}</p>
            </div>
          );
        }}
      />
      <Scatter data={data} fill="#0ea5e9" opacity={0.8} />
    </ScatterChart>
  );
}
```

---

### 1.5 Halaman 4: Transparansi Data & Metodologi (`src/pages/Methodology.jsx`)

**Fungsi:** Halaman statis yang menjelaskan sumber data dan metodologi kalkulasi gap.

**Konten yang Wajib Ada:**

```jsx
export default function Methodology() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      {/* Kartu 1: Sumber Data */}
      <section className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-sky-400 mb-4">Sumber Data Resmi</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-white">Kemendikdasmen — SDI 2023</h3>
            <p className="text-slate-400 mt-2">
              Data fasilitas sekolah (Komputer, Internet, Listrik, Air Minum, Guru D4/S1)
              diperoleh dari Katalog Satu Data Indonesia (SDI) Tahun 2023,
              dikelola oleh Kementerian Pendidikan Dasar dan Menengah.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white">BPS Indonesia — 2025</h3>
            <p className="text-slate-400 mt-2">
              Data Indeks Pembangunan Manusia (IPM) dan Angka Partisipasi Sekolah (APS)
              usia 13–15 tahun diperoleh dari publikasi resmi Badan Pusat Statistik
              Republik Indonesia edisi 2025.
            </p>
          </div>
        </div>
      </section>

      {/* Kartu 2: Metodologi Kalkulasi Gap */}
      <section className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-sky-400 mb-4">Metodologi Kalkulasi Gap</h2>
        <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm">
          <p className="text-emerald-400">// Formula Disparitas Sektor</p>
          <p className="mt-2 text-white">Gap = Nilai_Negeri − Nilai_Swasta</p>
          <p className="mt-3 text-slate-400">
            Nilai positif  → Sekolah Negeri lebih unggul<br />
            Nilai negatif  → Sekolah Swasta lebih unggul<br />
            Nilai nol      → Seimbang
          </p>
        </div>
        <p className="text-slate-400 mt-4">
          Semua nilai indikator fasilitas dinyatakan dalam persentase (%)
          dari total sekolah dalam kategori tersebut di setiap provinsi.
        </p>
      </section>
    </main>
  );
}
```

---

## BAGIAN 2 — Katalog Fungsi `dataService.js` & Contoh Pemanggilan

> **Lokasi File:** `src/utils/dataService.js`  
> **Cara Import:** `import { namaFungsi } from '../utils/dataService';`

> **⚠️ STATUS IMPLEMENTASI:**  
> Fungsi #1–#5 dan #7 sudah tersedia. Fungsi #6, #8, #9, #10 (ditandai 🔴) **belum ada** dan harus ditambahkan oleh tim ke `dataService.js`.

---

### Fungsi #1 — `getAllProvinces()`

**Status:** ✅ Sudah Ada  
**Deskripsi:** Mengambil seluruh data provinsi sebagai array.

**Signature:**
```js
getAllProvinces() → Array<ProvinceObject>
```

**Return Value:** Array 38 objek provinsi lengkap dengan semua indikator.

**Contoh Penggunaan:**
```jsx
import { getAllProvinces } from '../utils/dataService';

function ProvinceSelector() {
  const provinces = getAllProvinces();
  // provinces.length === 38
  // provinces[0] === { code_kemdagri: "11", code_bps: "11", name: "Aceh", indicators: {...} }

  return (
    <select>
      {provinces.map((p) => (
        <option key={p.code_bps} value={p.name}>{p.name}</option>
      ))}
    </select>
  );
}
```

---

### Fungsi #2 — `getProvinceByName(name)`

**Status:** ✅ Sudah Ada  
**Deskripsi:** Mencari dan mengambil data satu provinsi berdasarkan nama (case-insensitive).

**Signature:**
```js
getProvinceByName(name: string) → ProvinceObject | null
```

**Return Value:** Objek provinsi jika ditemukan, `null` jika tidak.

**Contoh Penggunaan:**
```jsx
import { getProvinceByName } from '../utils/dataService';

function ProvinceDetail({ provinceName }) {
  const province = getProvinceByName(provinceName);

  if (!province) {
    return <p className="text-rose-400">Provinsi "{provinceName}" tidak ditemukan.</p>;
  }

  return (
    <div>
      <h2>{province.name}</h2>
      <p>Kepemilikan Komputer: {province.indicators.komputer.total}%</p>
      <p>IPM: {province.indicators.ipm.total}</p>
    </div>
  );
}
```

---

### Fungsi #3 — `getNationalAverage(indicatorKey)`

**Status:** ✅ Sudah Ada  
**Deskripsi:** Menghitung rata-rata nasional dari nilai `total` untuk suatu indikator di seluruh 38 provinsi.

**Signature:**
```js
getNationalAverage(indicatorKey: string) → number
```

**Return Value:** Angka desimal 2 tempat (contoh: `42.31`). Mengembalikan `0` jika data kosong.

**Contoh Penggunaan:**
```jsx
import { getNationalAverage } from '../utils/dataService';

function NationalKpiCard({ indicatorKey }) {
  const avg = getNationalAverage(indicatorKey);

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <p className="text-slate-400 text-sm">Rata-rata Nasional</p>
      <p className="text-3xl font-black text-sky-400 mt-1">{avg}%</p>
    </div>
  );
}
```

> **Contoh Output Data Aktual:**
> - `getNationalAverage('komputer')` → sekitar `35.5%`
> - `getNationalAverage('ipm')` → sekitar `74.9`
> - `getNationalAverage('aps_13_15')` → sekitar `94.6%`

---

### Fungsi #4 — `getRankings(indicatorKey, ascending)`

**Status:** ✅ Sudah Ada  
**Deskripsi:** Mengurutkan seluruh 38 provinsi berdasarkan nilai `total` suatu indikator.

**Signature:**
```js
getRankings(indicatorKey: string, ascending?: boolean) → Array<ProvinceObject>
```

| Parameter | Tipe | Default | Keterangan |
|---|---|---|---|
| `indicatorKey` | `string` | — | Key indikator yang valid |
| `ascending` | `boolean` | `false` | `true` = terendah ke tertinggi, `false` = tertinggi ke terendah |

**Return Value:** Array ProvinceObject yang sudah diurutkan.

**Contoh Penggunaan di Leaderboard:**
```jsx
import { getRankings } from '../utils/dataService';

function LeaderboardTable({ indicatorKey }) {
  const [sortAsc, setSortAsc] = useState(false);
  const ranked = getRankings(indicatorKey, sortAsc);

  return (
    <table>
      <thead>
        <tr>
          <th>Peringkat</th>
          <th>Provinsi</th>
          <th onClick={() => setSortAsc(!sortAsc)} style={{ cursor: 'pointer' }}>
            Nilai {sortAsc ? '▲' : '▼'}
          </th>
        </tr>
      </thead>
      <tbody>
        {ranked.map((prov, idx) => (
          <tr key={prov.code_bps}>
            <td>#{idx + 1}</td>
            <td>{prov.name}</td>
            <td>{prov.indicators[indicatorKey]?.total ?? 'N/A'}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

### Fungsi #5 — `getSectorGap(provinceName, indicatorKey)`

**Status:** ✅ Sudah Ada  
**Deskripsi:** Menghitung selisih (gap) antara fasilitas sekolah Negeri dan Swasta di suatu provinsi untuk indikator tertentu.

**Signature:**
```js
getSectorGap(provinceName: string, indicatorKey: string) → GapObject | null
```

**Return Value:**
```js
// Jika berhasil:
{
  province:       "DI Yogyakarta",
  negeri:         86.45,
  swasta:         45.42,
  gap:            41.03,          // negeri - swasta, dibulatkan 2 desimal
  dominantSector: "Negeri"        // "Negeri" | "Swasta" | "Seimbang"
}

// Jika gagal (provinsi tidak ada, atau indikator tidak punya negeri/swasta):
null
```

> **⚠️ Catatan:** Fungsi ini mengembalikan `null` untuk indikator `ipm` dan `aps_13_15` karena data sektor tidak tersedia.

**Contoh Penggunaan:**
```jsx
import { getSectorGap } from '../utils/dataService';

function SectorGapBadge({ provinceName, indicatorKey }) {
  const gap = getSectorGap(provinceName, indicatorKey);

  if (!gap) {
    return <span className="text-slate-500">Data sektor N/A</span>;
  }

  return (
    <div>
      <span className={gap.gap > 0 ? 'text-sky-400' : 'text-rose-400'}>
        {gap.dominantSector} lebih unggul ({Math.abs(gap.gap)}% gap)
      </span>
    </div>
  );
}
```

---

### Fungsi #6 — `getMapDataByIndicator(indicatorKey, sector)` 🔴 Perlu Ditambahkan

**Status:** 🔴 Belum Ada — Harus Ditambahkan ke `dataService.js`  
**Deskripsi:** Menghasilkan objek peta `{ code_bps → nilai }` yang digunakan langsung untuk mewarnai GeoJSON Leaflet.

**Implementasi yang Harus Ditambahkan ke `src/utils/dataService.js`:**
```js
/**
 * Menghasilkan data peta dalam format { code_bps: value } untuk pewarnaan choropleth.
 * @param {string} indicatorKey - Key indikator yang valid
 * @param {'total'|'negeri'|'swasta'} sector - Sub-field yang diinginkan
 * @returns {Object} Map dari code_bps ke nilai numerik
 */
export const getMapDataByIndicator = (indicatorKey, sector = 'total') => {
  return provincesData.reduce((acc, prov) => {
    const value = prov.indicators[indicatorKey]?.[sector] ?? 0;
    acc[prov.code_bps] = value;
    return acc;
  }, {});
};
```

**Return Value:**
```js
// getMapDataByIndicator('komputer', 'total')
{
  "11": 27.74,   // Aceh
  "12": 25.27,   // Sumatera Utara
  "13": 35.2,    // Sumatera Barat
  // ... 38 entri total
  "97": 11.17    // Papua Pegunungan
}
```

**Cara Pasang ke GeoJSON Leaflet:**
```jsx
import { getMapDataByIndicator } from '../utils/dataService';

function ChoroplethMapSection({ indicatorKey }) {
  const mapData = getMapDataByIndicator(indicatorKey, 'total');

  const style = (feature) => {
    const code  = feature.properties.kode_bps; // sesuaikan field name di GeoJSON kamu
    const value = mapData[code] ?? 0;
    return {
      fillColor: getColorScale(value),
      fillOpacity: 0.8,
      color: '#0f172a',
      weight: 1,
    };
  };

  return (
    <GeoJSON
      key={indicatorKey}   // PENTING: key berubah → komponen re-render saat indikator ganti
      data={geoJsonData}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
}
```

> **Tip:** Tambahkan `key={indicatorKey}` pada `<GeoJSON>` agar React me-remount komponen setiap kali `indicatorKey` berubah. Ini adalah cara yang benar untuk memperbarui style peta di React-Leaflet karena Leaflet sendiri tidak reactive.

---

### Fungsi #7 — `compareProvinces(provinceNamesArray, indicatorKey)`

**Status:** ✅ Sudah Ada  
**Deskripsi:** Mengambil data indikator dari beberapa provinsi sekaligus untuk keperluan grafik komparatif.

**Signature:**
```js
compareProvinces(provinceNames: string[], indicatorKey: string) → Array<CompareResult>
```

**Return Value:**
```js
[
  {
    name: "DKI Jakarta",
    indicators: { total: 55.14, negeri: 79.86, swasta: 45.82 }
  },
  {
    name: "DI Yogyakarta",
    indicators: { total: 64.76, negeri: 86.45, swasta: 45.42 }
  },
  {
    name: "Nama Salah",   // Provinsi yang tidak ditemukan
    indicators: null      // → null jika nama tidak cocok
  }
]
```

**Contoh Penggunaan:**
```jsx
import { compareProvinces } from '../utils/dataService';

function SideBySideChart({ provinceNames, indicatorKey }) {
  const rawData = compareProvinces(provinceNames, indicatorKey);

  // Transformasi ke format Recharts
  const chartData = rawData.map((item) => ({
    name:   item.name,
    Total:  item.indicators?.total  ?? 0,
    Negeri: item.indicators?.negeri ?? 0,
    Swasta: item.indicators?.swasta ?? 0,
  }));

  // Cek apakah indikator punya data sektor
  const hasSectorData = rawData.some(
    (item) => item.indicators?.negeri !== undefined
  );

  // render BarChart...
}
```

---

### Fungsi #8 — `getTopDisparityProvinces(indicatorKey, limit)` 🔴 Perlu Ditambahkan

**Status:** 🔴 Belum Ada — Harus Ditambahkan ke `dataService.js`  
**Deskripsi:** Mengembalikan daftar provinsi dengan gap Negeri vs Swasta terbesar (nilai absolut), diurutkan dari terbesar.

**Implementasi yang Harus Ditambahkan ke `src/utils/dataService.js`:**
```js
/**
 * Mengembalikan provinsi dengan disparitas (gap |Negeri - Swasta|) terbesar.
 * @param {string} indicatorKey - Key indikator yang valid (harus punya negeri/swasta)
 * @param {number} limit - Jumlah provinsi yang dikembalikan (default: 5)
 * @returns {Array<GapObject>} Array hasil getSectorGap yang diurutkan by |gap| descending
 */
export const getTopDisparityProvinces = (indicatorKey, limit = 5) => {
  return provincesData
    .map((prov) => {
      const indicator = prov.indicators[indicatorKey];
      if (!indicator || indicator.negeri === undefined || indicator.swasta === undefined) {
        return null;
      }
      const gap = Number((indicator.negeri - indicator.swasta).toFixed(2));
      return {
        province:       prov.name,
        negeri:         indicator.negeri,
        swasta:         indicator.swasta,
        gap,
        dominantSector: gap > 0 ? 'Negeri' : gap < 0 ? 'Swasta' : 'Seimbang',
      };
    })
    .filter(Boolean)                                    // Buang null (ipm, aps_13_15)
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap)) // Urutkan by |gap| descending
    .slice(0, limit);
};
```

**Return Value:**
```js
// getTopDisparityProvinces('komputer', 5)
[
  { province: "DI Yogyakarta",  negeri: 86.45, swasta: 45.42, gap: 41.03,  dominantSector: "Negeri" },
  { province: "DKI Jakarta",    negeri: 79.86, swasta: 45.82, gap: 34.04,  dominantSector: "Negeri" },
  { province: "Jawa Tengah",    negeri: 76.86, swasta: 41.82, gap: 35.04,  dominantSector: "Negeri" },
  // ...
]
```

---

### Fungsi #9 — `getIndicatorSummary(indicatorKey, sector)` 🔴 Perlu Ditambahkan

**Status:** 🔴 Belum Ada — Harus Ditambahkan ke `dataService.js`  
**Deskripsi:** Menghitung statistik ringkasan (min, max, rata-rata, median) dari seluruh provinsi untuk indikator tertentu.

**Implementasi yang Harus Ditambahkan ke `src/utils/dataService.js`:**
```js
/**
 * Menghitung statistik ringkasan untuk suatu indikator.
 * @param {string} indicatorKey - Key indikator yang valid
 * @param {'total'|'negeri'|'swasta'} sector - Sub-field yang diinginkan
 * @returns {SummaryObject | null}
 */
export const getIndicatorSummary = (indicatorKey, sector = 'total') => {
  const values = provincesData
    .map((p) => p.indicators[indicatorKey]?.[sector])
    .filter((v) => v !== undefined && v !== null)
    .map(Number);

  if (values.length === 0) return null;

  values.sort((a, b) => a - b);
  const sum    = values.reduce((acc, v) => acc + v, 0);
  const mid    = Math.floor(values.length / 2);
  const median = values.length % 2 !== 0
    ? values[mid]
    : Number(((values[mid - 1] + values[mid]) / 2).toFixed(2));

  return {
    min:    Number(values[0].toFixed(2)),
    max:    Number(values[values.length - 1].toFixed(2)),
    avg:    Number((sum / values.length).toFixed(2)),
    median: median,
    count:  values.length,
  };
};
```

**Return Value:**
```js
// getIndicatorSummary('komputer', 'total')
{
  min:    11.17,   // Papua Pegunungan
  max:    67.33,   // Bali
  avg:    35.49,
  median: 33.46,
  count:  38
}
```

**Contoh Penggunaan di KpiCards:**
```jsx
import { getIndicatorSummary } from '../utils/dataService';

function IndicatorStats({ indicatorKey }) {
  const stats = getIndicatorSummary(indicatorKey, 'total');

  if (!stats) return <p>Data tidak tersedia.</p>;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div>Min: {stats.min}%</div>
      <div>Maks: {stats.max}%</div>
      <div>Rata-rata: {stats.avg}%</div>
      <div>Median: {stats.median}%</div>
    </div>
  );
}
```

---

### Fungsi #10 — `getCorrelationData(indicatorX, indicatorY)` 🔴 Perlu Ditambahkan

**Status:** 🔴 Belum Ada — Harus Ditambahkan ke `dataService.js`  
**Deskripsi:** Menyiapkan data titik-titik scatter plot dari dua indikator untuk 38 provinsi, dalam format yang langsung digunakan oleh Recharts `<ScatterChart>`.

**Implementasi yang Harus Ditambahkan ke `src/utils/dataService.js`:**
```js
/**
 * Menyiapkan data korelasi dua indikator untuk scatter plot (38 titik data).
 * @param {string} indicatorX - Key indikator untuk sumbu X
 * @param {string} indicatorY - Key indikator untuk sumbu Y
 * @returns {Array<{name, x, y}>}
 */
export const getCorrelationData = (indicatorX, indicatorY) => {
  return provincesData
    .map((prov) => {
      const x = prov.indicators[indicatorX]?.total;
      const y = prov.indicators[indicatorY]?.total;
      if (x === undefined || y === undefined) return null;
      return {
        name: prov.name,
        x:    Number(x),
        y:    Number(y),
      };
    })
    .filter(Boolean);
};
```

**Return Value:**
```js
// getCorrelationData('internet', 'ipm')
[
  { name: "Aceh",           x: 75.58, y: 76.23 },
  { name: "Sumatera Utara", x: 79.75, y: 76.47 },
  { name: "DKI Jakarta",    x: 95.98, y: 85.05 },
  { name: "Papua Pegunungan", x: 32.99, y: 54.91 },
  // ... 38 titik total
]
```

**Contoh Penggunaan di CorrelationPlot:**
```jsx
import { getCorrelationData } from '../utils/dataService';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip } from 'recharts';

function CorrelationPlot({ indicatorX, indicatorY }) {
  const data = getCorrelationData(indicatorX, indicatorY);

  if (!data || data.length === 0) {
    return <p className="text-slate-400">Data korelasi tidak tersedia untuk kombinasi ini.</p>;
  }

  return (
    <ScatterChart width={700} height={450}>
      <XAxis dataKey="x" name={indicatorX} />
      <YAxis dataKey="y" name={indicatorY} />
      <Tooltip content={/* custom tooltip */} />
      <Scatter data={data} fill="#0ea5e9" />
    </ScatterChart>
  );
}
```

---

## BAGIAN 3 — Daftar Indikator Data Valid

Gunakan tabel referensi ini sebagai acuan tunggal saat memanggil semua fungsi di `dataService.js`.

| Key Indikator | Label UI | Satuan | Memiliki `negeri`/`swasta` | Sumber Data |
|---|---|---|:---:|---|
| `komputer` | Kepemilikan Komputer | `%` sekolah | ✅ Ya | Kemendikdasmen SDI 2023 |
| `internet` | Akses Internet | `%` sekolah | ✅ Ya | Kemendikdasmen SDI 2023 |
| `listrik` | Akses Listrik | `%` sekolah | ✅ Ya | Kemendikdasmen SDI 2023 |
| `air_minum` | Akses Air Minum | `%` sekolah | ✅ Ya | Kemendikdasmen SDI 2023 |
| `guru_d4s1` | Guru Kualifikasi D4/S1 | `%` guru | ✅ Ya | Kemendikdasmen SDI 2023 |
| `ipm` | Indeks Pembangunan Manusia | Indeks (0–100) | ❌ Tidak | BPS 2025 |
| `aps_13_15` | Angka Partisipasi Sekolah (13–15 thn) | `%` | ❌ Tidak | BPS 2025 |

### Panduan Penggunaan Berdasarkan Konteks

```js
// ✅ Indikator yang valid untuk getSectorGap() dan getTopDisparityProvinces()
const FACILITY_INDICATORS = ['komputer', 'internet', 'listrik', 'air_minum', 'guru_d4s1'];

// ✅ Indikator yang valid untuk semua fungsi (hanya baca .total)
const ALL_INDICATORS = ['komputer', 'internet', 'listrik', 'air_minum', 'guru_d4s1', 'ipm', 'aps_13_15'];

// ✅ Indikator yang cocok sebagai sumbu Y di CorrelationPlot (variabel "output")
const OUTCOME_INDICATORS = ['ipm', 'aps_13_15'];

// ✅ Indikator yang cocok sebagai sumbu X di CorrelationPlot (variabel "input")
const INPUT_INDICATORS   = ['komputer', 'internet', 'listrik', 'air_minum', 'guru_d4s1'];
```

### Rentang Nilai Aktual (Referensi dari Data)

| Indikator | Nilai Terendah | Provinsi Terendah | Nilai Tertinggi | Provinsi Tertinggi |
|---|---|---|---|---|
| `komputer` | 11.17% | Papua Pegunungan | 67.33% | Bali |
| `internet` | 32.99% | Papua Pegunungan | 96.70% | DI Yogyakarta |
| `listrik` | 80.71% | Papua Pegunungan | 100% | (Banyak provinsi) |
| `air_minum` | 70.65% | Nusa Tenggara Timur | 98.46% | DI Yogyakarta |
| `guru_d4s1` | 88.03% | Papua Pegunungan | 99.15% | Bali |
| `ipm` | 54.91 | Papua Pegunungan | 85.05 | DKI Jakarta |
| `aps_13_15` | 67.86% | Papua Tengah | 99.60% | DI Yogyakarta |

---

## BAGIAN 4 — Aturan Integrasi & Best Practices

### 4.1 Aturan Manajemen State

**Prinsip Utama:** State pilihan indikator dan provinsi **selalu dikelola di tingkat Page** (komponen halaman), bukan di dalam komponen UI individual. Komponen UI bersifat *presentational* dan menerima data via *props*.

```
BENAR:
Dashboard.jsx  [state: selectedIndicator]
  └── ChoroplethMapSection.jsx [props: indicatorKey]
  └── LeaderboardTable.jsx     [props: indicatorKey]
  └── KpiCardsGroup.jsx        [props: indicatorKey]

SALAH:
ChoroplethMapSection.jsx [state: selectedIndicator di dalam komponen]
```

**Pola State yang Direkomendasikan:**
```jsx
// Pattern: Page sebagai "single source of truth"
export default function Dashboard() {
  const [selectedIndicator, setSelectedIndicator] = useState('komputer');

  // Satu state, diturunkan ke semua child via props
  // Ketika state berubah, SEMUA child otomatis re-render dengan data baru
  return (
    <>
      <HeroSection onIndicatorChange={setSelectedIndicator} selectedIndicator={selectedIndicator} />
      <KpiCardsGroup indicatorKey={selectedIndicator} />
      <ChoroplethMapSection indicatorKey={selectedIndicator} />
      <LeaderboardTable indicatorKey={selectedIndicator} />
    </>
  );
}
```

### 4.2 Penanganan Empty State & Fallback

Setiap komponen yang menampilkan data **wajib** memiliki penanganan state kosong. Berikut pola yang disarankan:

```jsx
// Pattern: Guard clause untuk null/empty data
function DataComponent({ indicatorKey, provinceName }) {
  const data = getSomeData(provinceName, indicatorKey);

  // Guard 1: Data tidak ada
  if (!data) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-500">
        <p>Data tidak tersedia untuk kombinasi ini.</p>
      </div>
    );
  }

  // Guard 2: Array kosong
  if (Array.isArray(data) && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-500">
        <p>Tidak ada data yang cocok dengan filter.</p>
      </div>
    );
  }

  // Render normal
  return <div>{/* konten */}</div>;
}
```

**Daftar Situasi yang Harus Ditangani:**

| Situasi | Sumber | Penanganan |
|---|---|---|
| `getProvinceByName()` mengembalikan `null` | Nama provinsi salah eja | Tampilkan pesan "Provinsi tidak ditemukan" |
| `getSectorGap()` mengembalikan `null` | Indikator `ipm`/`aps_13_15` dipilih | Sembunyikan kartu gap atau tampilkan "N/A" |
| `getTopDisparityProvinces()` array kosong | Indikator `ipm`/`aps_13_15` dipilih | Tampilkan info bahwa data sektor tidak tersedia |
| Nilai `indicators[key]?.total` adalah `undefined` | Key indikator tidak valid | Gunakan `?? 0` atau `?? 'N/A'` sebagai fallback |
| Array `compareProvinces` mengandung `null` dalam `indicators` | Nama provinsi tidak cocok | Filter dengan `.filter(item => item.indicators !== null)` |

### 4.3 Performa & Optimasi

```jsx
// Gunakan useMemo untuk kalkulasi berat yang bergantung pada props
import { useMemo } from 'react';
import { getRankings } from '../utils/dataService';

function LeaderboardTable({ indicatorKey, sortAsc }) {
  // Hanya re-kalkulasi jika indicatorKey atau sortAsc berubah
  const rankedData = useMemo(
    () => getRankings(indicatorKey, sortAsc),
    [indicatorKey, sortAsc]
  );

  // ...render
}
```

```jsx
// Gunakan key yang tepat pada komponen GeoJSON Leaflet
// Tanpa key yang berubah, peta tidak akan update saat indikator berganti
<GeoJSON
  key={indicatorKey}   // WAJIB ADA
  data={geoJsonData}
  style={featureStyle}
/>
```

### 4.4 Konvensi Penamaan

| Elemen | Konvensi | Contoh |
|---|---|---|
| Komponen React | PascalCase | `KpiCardsGroup`, `ChoroplethMapSection` |
| Props fungsi callback | `on` + PascalCase | `onIndicatorChange`, `onChange` |
| State variables | camelCase | `selectedIndicator`, `sortAsc` |
| Key indikator | snake_case | `komputer`, `air_minum`, `guru_d4s1` |
| File komponen | PascalCase + `.jsx` | `LeaderboardTable.jsx` |

### 4.5 Routing (React Router DOM)

Instal terlebih dahulu jika belum ada:
```bash
npm install react-router-dom
```

Setup routing di `src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Dashboard        from './pages/Dashboard';
import Compare          from './pages/Compare';
import DisparityInsight from './pages/DisparityInsight';
import Methodology      from './pages/Methodology';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-white flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/compare"     element={<Compare />} />
            <Route path="/disparity"   element={<DisparityInsight />} />
            <Route path="/methodology" element={<Methodology />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
```

### 4.6 Checklist Sebelum Merge / PR

Gunakan checklist berikut sebelum mengirimkan Pull Request:

- [ ] Semua komponen telah diuji dengan minimal 3 skenario indikator berbeda
- [ ] Empty state dan fallback sudah diimplementasikan di setiap komponen data
- [ ] Tidak ada hardcoded string nama provinsi (selalu gunakan data dari `getAllProvinces()`)
- [ ] Tidak ada pemanggilan API eksternal — semua data dari `dataService.js`
- [ ] `<GeoJSON key={indicatorKey}>` sudah menggunakan prop `key` yang dinamis
- [ ] `useMemo` sudah digunakan untuk kalkulasi berat di komponen tabel/chart
- [ ] Fungsi #6, #8, #9, #10 sudah ditambahkan ke `dataService.js`
- [ ] Penanganan perbedaan struktur `ipm`/`aps_13_15` (hanya punya `.total`) sudah ada
- [ ] Routing sudah dikonfigurasi dengan benar menggunakan `react-router-dom`

---

## Ringkasan Cepat — Quick Reference Card

```
FUNGSI TERSEDIA (✅)           | FUNGSI YANG PERLU DITAMBAHKAN (🔴)
-------------------------------|------------------------------
getAllProvinces()               | getMapDataByIndicator(key, sector)
getProvinceByName(name)        | getTopDisparityProvinces(key, limit)
getNationalAverage(key)        | getIndicatorSummary(key, sector)
getRankings(key, asc)          | getCorrelationData(keyX, keyY)
getSectorGap(name, key)        |
compareProvinces(names, key)   |

INDIKATOR DENGAN SEKTOR        | INDIKATOR TANPA SEKTOR
(negeri + swasta tersedia)     | (hanya total)
-------------------------------|------------------------------
komputer, internet, listrik    | ipm, aps_13_15
air_minum, guru_d4s1           |
```

---

*Dokumen ini dihasilkan berdasarkan analisis langsung terhadap `src/utils/dataService.js` (73 baris, 6 fungsi) dan `src/data/provincesData.json` (1446 baris, 38 provinsi) pada tanggal 26 Oktober 2026.*

*Untuk pertanyaan teknis atau pembaruan dokumen, hubungi Senior Frontend System Architect melalui saluran tim.*
