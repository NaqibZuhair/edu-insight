/**
 * @file constants.js
 * @description Konstanta terpusat untuk aplikasi EduInsight.
 *
 * Berkas ini menyediakan definisi standar untuk:
 * - Metadata indikator pendidikan dan capaian pembangunan
 * - Konfigurasi geografis dasar untuk visualisasi peta
 * - Definisi rute navigasi aplikasi
 * - Konstanta batas dan parameter data
 *
 * Catatan untuk Frontend:
 * Penentuan palet warna, tema, dan styling visual sepenuhnya diserahkan
 * kepada tim UI/UX dan diatur pada layer presentasi (Tailwind CSS / design system).
 */

// ─────────────────────────────────────────────────────────────
// METADATA INDIKATOR DATA
// ─────────────────────────────────────────────────────────────

/**
 * @typedef {Object} IndicatorMetadata
 * @property {string}  key           - Kunci pengenal indikator (harus sesuai dengan field di provincesData.json)
 * @property {string}  label         - Label judul untuk tampilan UI
 * @property {string}  unit          - Satuan metrik (% atau indeks)
 * @property {boolean} hasSectorData - True jika indikator memiliki data rincian Negeri vs Swasta
 * @property {string}  description   - Penjelasan teknis singkat indikator
 * @property {string}  source        - Sumber resmi data
 */

/**
 * Daftar lengkap definisi indikator dalam aplikasi.
 * @type {Array<IndicatorMetadata>}
 */
export const INDICATORS = [
  {
    key: 'komputer',
    label: 'Komputer',
    unit: '%',
    hasSectorData: true,
    description: 'Persentase sekolah dengan ketersediaan fasilitas laboratorium/perangkat komputer',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'internet',
    label: 'Internet',
    unit: '%',
    hasSectorData: true,
    description: 'Persentase sekolah dengan ketersediaan akses jaringan internet',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'listrik',
    label: 'Listrik',
    unit: '%',
    hasSectorData: true,
    description: 'Persentase sekolah dengan ketersediaan sambungan sumber listrik',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'air_minum',
    label: 'Air Minum',
    unit: '%',
    hasSectorData: true,
    description: 'Persentase sekolah dengan ketersediaan akses air minum bersih dan layak',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'guru_d4s1',
    label: 'Guru D4/S1',
    unit: '%',
    hasSectorData: true,
    description: 'Persentase tenaga pendidik dengan kualifikasi pendidikan minimal D4 atau S1',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'ipm',
    label: 'IPM',
    unit: 'indeks',
    hasSectorData: false,
    description: 'Indeks Pembangunan Manusia skala 0 sampai 100',
    source: 'Badan Pusat Statistik 2025',
  },
  {
    key: 'aps_13_15',
    label: 'APS 13-15 Tahun',
    unit: '%',
    hasSectorData: false,
    description: 'Angka Partisipasi Sekolah kelompok usia 13 sampai 15 tahun (SMP/sederajat)',
    source: 'Badan Pusat Statistik 2025',
  },
];

/**
 * Daftar indikator fasilitas yang memiliki pembagian sektor Negeri dan Swasta.
 * Digunakan untuk visualisasi gap disparitas dan perbandingan antar sektor.
 */
export const FACILITY_INDICATORS = INDICATORS.filter((item) => item.hasSectorData);

/**
 * Daftar indikator capaian/output yang tidak memiliki rincian sektor.
 * Cocok dipetakan sebagai variabel terikat pada scatter plot atau korelasi.
 */
export const OUTCOME_INDICATORS = INDICATORS.filter((item) => !item.hasSectorData);

/**
 * Helper untuk mengambil metadata satu indikator berdasarkan kuncinya.
 * @param {string} key - Kunci indikator (contoh: 'komputer')
 * @returns {IndicatorMetadata | undefined}
 */
export const getIndicatorMeta = (key) => INDICATORS.find((item) => item.key === key);

// ─────────────────────────────────────────────────────────────
// KONFIGURASI PETA DASAR
// ─────────────────────────────────────────────────────────────

/**
 * Konfigurasi koordinat dan batas view peta Leaflet.
 *
 * Panduan Frontend:
 * Styling fitur GeoJSON (fillColor, weight, opacity) dapat didefinisikan secara
 * fleksibel pada komponen peta sesuai panduan tema visual UI/UX.
 */
export const MAP_CONFIG = {
  /** Koordinat titik tengah geografis Indonesia [latitude, longitude] */
  center: [-2.5, 118.0],
  /** Zoom level default */
  defaultZoom: 5,
  /** Batas minimum zoom */
  minZoom: 4,
  /** Batas maksimum zoom */
  maxZoom: 10,
  /** Menonaktifkan scroll wheel zoom default agar tidak mengganggu scroll halaman */
  scrollWheelZoom: false,
};

/**
 * Template konfigurasi style GeoJSON netral tanpa warna spesifik.
 * Frontend Developer dapat menambahkan fungsi pewarnaan dinamis
 * sesuai skala warna yang ditetapkan oleh tim UI/UX.
 */
export const DEFAULT_GEOJSON_STYLE = {
  weight: 1,
  opacity: 0.8,
  fillOpacity: 0.8,
};

// ─────────────────────────────────────────────────────────────
// RUTE NAVIGASI APLIKASI
// ─────────────────────────────────────────────────────────────

/**
 * Struktur rute untuk navigasi aplikasi dan konfigurasi React Router.
 */
export const NAV_ROUTES = [
  {
    path: '/',
    label: 'Dashboard',
    description: 'Ringkasan nasional dan visualisasi peta interaktif',
  },
  {
    path: '/compare',
    label: 'Perbandingan',
    description: 'Komparasi indikator antar 2 sampai 3 provinsi',
  },
  {
    path: '/disparity',
    label: 'Disparitas',
    description: 'Analisis kesenjangan fasilitas sekolah Negeri vs Swasta',
  },
  {
    path: '/methodology',
    label: 'Metodologi',
    description: 'Informasi sumber data dan metode kalkulasi agregat',
  },
];

// ─────────────────────────────────────────────────────────────
// KONSTANTA DATA UMUM
// ─────────────────────────────────────────────────────────────

/**
 * Jumlah total provinsi dalam dataset resmi.
 */
export const TOTAL_PROVINCES = 38;

/**
 * Indikator default untuk tampilan awal visualisasi.
 */
export const DEFAULT_INDICATOR = 'komputer';

/**
 * Daftar default nama provinsi pada modul perbandingan awal.
 */
export const DEFAULT_COMPARE_PROVINCES = ['DKI Jakarta', 'DI Yogyakarta', 'Papua Pegunungan'];

/**
 * Batas jumlah data teratas untuk daftar peringkat disparitas.
 */
export const TOP_DISPARITY_LIMIT = 5;

/**
 * Metadata referensi sumber data primer.
 */
export const DATA_SOURCES = [
  {
    name: 'Kemendikdasmen - Satu Data Indonesia',
    year: 2023,
    url: 'https://data.kemdikbud.go.id',
    description: 'Data fasilitas sekolah tingkat menengah (komputer, internet, listrik, air minum, kualifikasi guru) per provinsi.',
  },
  {
    name: 'Badan Pusat Statistik (BPS)',
    year: 2025,
    url: 'https://www.bps.go.id',
    description: 'Data Indeks Pembangunan Manusia (IPM) dan Angka Partisipasi Sekolah (APS 13-15 tahun) per provinsi.',
  },
];
