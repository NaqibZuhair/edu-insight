import provincesData from '../data/provincesData.json';

/**
 * Metadata definisi seluruh indikator yang tersedia.
 */
export const INDICATORS = [
  {
    key: 'komputer',
    label: 'Komputer',
    unit: '%',
    hasSectorData: true,
    description: 'Persentase sekolah dengan ketersediaan fasilitas komputer',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'internet',
    label: 'Internet',
    unit: '%',
    hasSectorData: true,
    description: 'Persentase sekolah dengan akses internet',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'listrik',
    label: 'Listrik',
    unit: '%',
    hasSectorData: true,
    description: 'Persentase sekolah dengan sambungan listrik',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'air_minum',
    label: 'Air Minum',
    unit: '%',
    hasSectorData: true,
    description: 'Persentase sekolah dengan akses air minum layak',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'guru_d4s1',
    label: 'Guru D4/S1',
    unit: '%',
    hasSectorData: true,
    description: 'Persentase guru dengan kualifikasi minimal D4/S1',
    source: 'Kemendikdasmen SDI 2023',
  },
  {
    key: 'ipm',
    label: 'IPM',
    unit: 'indeks',
    hasSectorData: false,
    description: 'Indeks Pembangunan Manusia (skala 0-100)',
    source: 'BPS 2025',
  },
  {
    key: 'aps_13_15',
    label: 'APS 13-15 Tahun',
    unit: '%',
    hasSectorData: false,
    description: 'Angka Partisipasi Sekolah usia 13-15 tahun',
    source: 'BPS 2025',
  },
];

export const FACILITY_INDICATORS = INDICATORS.filter((i) => i.hasSectorData);
export const OUTCOME_INDICATORS = INDICATORS.filter((i) => !i.hasSectorData);

/**
 * Mengambil metadata indikator berdasarkan key.
 * @param {string} key
 * @returns {object | undefined}
 */
export const getIndicatorMeta = (key) => INDICATORS.find((i) => i.key === key);

/**
 * Konfigurasi view dasar peta Leaflet.
 */
export const MAP_CONFIG = {
  center: [-2.5, 118.0],
  defaultZoom: 5,
  minZoom: 4,
  maxZoom: 10,
  scrollWheelZoom: false,
};

/**
 * Style default netral layer GeoJSON.
 */
export const DEFAULT_GEOJSON_STYLE = {
  weight: 1,
  opacity: 0.8,
  fillOpacity: 0.8,
};

/**
 * Konfigurasi rute navigasi aplikasi.
 */
export const NAV_ROUTES = [
  {
    path: '/',
    label: 'Dashboard',
    description: 'Peta interaktif dan ringkasan nasional',
  },
  {
    path: '/compare',
    label: 'Perbandingan',
    description: 'Perbandingan multi-provinsi',
  },
  {
    path: '/disparity',
    label: 'Disparitas',
    description: 'Analisis kesenjangan Negeri vs Swasta',
  },
  {
    path: '/methodology',
    label: 'Metodologi',
    description: 'Dokumentasi sumber data dan kalkulasi',
  },
];

export const TOTAL_PROVINCES = provincesData.length;
export const DEFAULT_INDICATOR = 'komputer';
export const DEFAULT_COMPARE_PROVINCES = ['DKI Jakarta', 'DI Yogyakarta', 'Papua Pegunungan'];
export const TOP_DISPARITY_LIMIT = 5;

export const DATA_SOURCES = [
  {
    name: 'Kemendikdasmen - Satu Data Indonesia',
    year: 2023,
    url: 'https://data.kemdikbud.go.id',
    description: 'Data fasilitas sekolah tingkat menengah per provinsi.',
  },
  {
    name: 'Badan Pusat Statistik (BPS)',
    year: 2025,
    url: 'https://www.bps.go.id',
    description: 'Data IPM dan APS usia 13-15 tahun per provinsi.',
  },
];
