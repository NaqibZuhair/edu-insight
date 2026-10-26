/**
 * @file constants.js
 * @description Konstanta terpusat untuk seluruh aplikasi EduInsight.
 *
 * File ini menjadi satu-satunya sumber kebenaran untuk:
 * - Definisi indikator (key, label, satuan, warna)
 * - Konfigurasi peta choropleth (skala warna, center, zoom)
 * - Metadata rute halaman
 * - Konstanta UI lainnya
 *
 * Cara import:
 *   import { INDICATORS, MAP_CONFIG } from '../config/constants';
 */

// ─────────────────────────────────────────────────────────────
// INDIKATOR DATA
// ─────────────────────────────────────────────────────────────

/**
 * Daftar lengkap indikator yang tersedia dalam aplikasi.
 *
 * Setiap objek memiliki:
 * @property {string}  key           - Kunci indikator (sesuai provincesData.json)
 * @property {string}  label         - Label untuk ditampilkan di UI
 * @property {string}  unit          - Satuan nilai (% atau indeks)
 * @property {boolean} hasSectorData - true jika indikator memiliki data negeri/swasta
 * @property {string}  color         - Warna aksen utama (Tailwind hex equivalent)
 * @property {string}  description   - Deskripsi singkat untuk tooltip/UI
 * @property {string}  source        - Sumber data resmi
 */
export const INDICATORS = [
  {
    key: 'komputer',
    label: 'Komputer',
    unit: '%',
    hasSectorData: true,
    color: '#0ea5e9',       // sky-500
    description: 'Persentase sekolah yang memiliki fasilitas komputer',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'internet',
    label: 'Internet',
    unit: '%',
    hasSectorData: true,
    color: '#8b5cf6',       // violet-500
    description: 'Persentase sekolah yang memiliki akses internet',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'listrik',
    label: 'Listrik',
    unit: '%',
    hasSectorData: true,
    color: '#f59e0b',       // amber-500
    description: 'Persentase sekolah yang memiliki akses listrik',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'air_minum',
    label: 'Air Minum',
    unit: '%',
    hasSectorData: true,
    color: '#06b6d4',       // cyan-500
    description: 'Persentase sekolah yang memiliki akses air minum bersih',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'guru_d4s1',
    label: 'Guru D4/S1',
    unit: '%',
    hasSectorData: true,
    color: '#10b981',       // emerald-500
    description: 'Persentase guru dengan kualifikasi pendidikan minimal D4/S1',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'ipm',
    label: 'IPM',
    unit: 'indeks',
    hasSectorData: false,
    color: '#f43f5e',       // rose-500
    description: 'Indeks Pembangunan Manusia (skala 0–100)',
    source: 'BPS 2025',
  },
  {
    key: 'aps_13_15',
    label: 'APS 13–15 Thn',
    unit: '%',
    hasSectorData: false,
    color: '#84cc16',       // lime-500
    description: 'Angka Partisipasi Sekolah usia 13–15 tahun',
    source: 'BPS 2025',
  },
];

/**
 * Hanya indikator yang memiliki data negeri/swasta (untuk fitur gap & disparitas).
 */
export const FACILITY_INDICATORS = INDICATORS.filter((i) => i.hasSectorData);

/**
 * Indikator yang cocok digunakan sebagai variabel output pada scatter plot.
 */
export const OUTCOME_INDICATORS = INDICATORS.filter((i) => !i.hasSectorData);

/**
 * Helper: ambil metadata satu indikator berdasarkan key-nya.
 * @param {string} key
 * @returns {object | undefined}
 */
export const getIndicatorMeta = (key) => INDICATORS.find((i) => i.key === key);

// ─────────────────────────────────────────────────────────────
// KONFIGURASI PETA CHOROPLETH
// ─────────────────────────────────────────────────────────────

/**
 * Konfigurasi default peta Leaflet.
 */
export const MAP_CONFIG = {
  /** Koordinat center peta Indonesia */
  center: [-2.5, 118.0],
  /** Zoom level default */
  defaultZoom: 5,
  /** Zoom minimum yang diizinkan */
  minZoom: 4,
  /** Zoom maksimum yang diizinkan */
  maxZoom: 10,
  /** Nonaktifkan scroll wheel zoom by default agar UX lebih baik */
  scrollWheelZoom: false,
};

/**
 * Definisi skala warna untuk peta choropleth.
 * Setiap threshold menentukan batas bawah nilai dan warna yang diberikan.
 * Nilai yang lebih tinggi = warna yang lebih saturated/gelap.
 *
 * Digunakan oleh helper `getChoroplethColor` di bawah.
 */
export const CHOROPLETH_COLOR_SCALE = [
  { threshold: 90, color: '#0c4a6e' }, // sky-950
  { threshold: 80, color: '#075985' }, // sky-900
  { threshold: 70, color: '#0369a1' }, // sky-700
  { threshold: 60, color: '#0284c7' }, // sky-600
  { threshold: 50, color: '#0ea5e9' }, // sky-500
  { threshold: 40, color: '#38bdf8' }, // sky-400
  { threshold: 30, color: '#7dd3fc' }, // sky-300
  { threshold: 20, color: '#bae6fd' }, // sky-200
  { threshold: 0,  color: '#e0f2fe' }, // sky-100
];

/**
 * Mengembalikan warna hex untuk nilai numerik berdasarkan skala choropleth.
 * @param {number} value - Nilai indikator (0–100)
 * @returns {string} Warna hex
 */
export const getChoroplethColor = (value) => {
  for (const { threshold, color } of CHOROPLETH_COLOR_SCALE) {
    if (value >= threshold) return color;
  }
  return CHOROPLETH_COLOR_SCALE[CHOROPLETH_COLOR_SCALE.length - 1].color;
};

/**
 * Style dasar untuk layer GeoJSON (border provinsi).
 */
export const GEOJSON_BASE_STYLE = {
  color: '#0f172a',       // slate-950 — border gelap
  weight: 1,
  opacity: 0.8,
  fillOpacity: 0.82,
};

// ─────────────────────────────────────────────────────────────
// METADATA RUTE HALAMAN
// ─────────────────────────────────────────────────────────────

/**
 * Daftar rute navigasi aplikasi.
 * Digunakan oleh komponen Navbar dan konfigurasi React Router.
 */
export const NAV_ROUTES = [
  {
    path: '/',
    label: 'Dashboard',
    description: 'Peta interaktif & ringkasan nasional',
  },
  {
    path: '/compare',
    label: 'Perbandingan',
    description: 'Bandingkan 2–3 provinsi secara langsung',
  },
  {
    path: '/disparity',
    label: 'Disparitas',
    description: 'Analisis ketimpangan Negeri vs Swasta',
  },
  {
    path: '/methodology',
    label: 'Metodologi',
    description: 'Sumber data & metode kalkulasi',
  },
];

// ─────────────────────────────────────────────────────────────
// KONSTANTA APLIKASI UMUM
// ─────────────────────────────────────────────────────────────

/**
 * Jumlah provinsi yang tercakup dalam dataset.
 */
export const TOTAL_PROVINCES = 38;

/**
 * Indikator default yang ditampilkan saat aplikasi pertama kali dibuka.
 */
export const DEFAULT_INDICATOR = 'komputer';

/**
 * Provinsi default yang dipilih di halaman Perbandingan.
 */
export const DEFAULT_COMPARE_PROVINCES = ['DKI Jakarta', 'DI Yogyakarta', 'Papua Pegunungan'];

/**
 * Jumlah provinsi yang ditampilkan di daftar disparitas teratas.
 */
export const TOP_DISPARITY_LIMIT = 5;

/**
 * Metadata sumber data resmi.
 */
export const DATA_SOURCES = [
  {
    name: 'Kemendikdasmen — Satu Data Indonesia',
    year: 2023,
    url: 'https://data.kemdikbud.go.id',
    description:
      'Data fasilitas sekolah (Komputer, Internet, Listrik, Air Minum, Guru D4/S1) tingkat SMA/SMK/MA per provinsi.',
  },
  {
    name: 'Badan Pusat Statistik (BPS)',
    year: 2025,
    url: 'https://www.bps.go.id',
    description:
      'Indeks Pembangunan Manusia (IPM) dan Angka Partisipasi Sekolah (APS) usia 13–15 tahun per provinsi.',
  },
];
