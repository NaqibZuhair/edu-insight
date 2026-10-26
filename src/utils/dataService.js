/**
 * @file dataService.js
 * @description Client-side data engine untuk EduInsight.
 *
 * Seluruh fungsi bersifat SYNCHRONOUS dan pure — tidak ada side effects,
 * tidak ada API call. Data diambil langsung dari bundle JSON statis.
 *
 * Cara import:
 *   import { getAllProvinces, getNationalAverage } from '../utils/dataService';
 */

import provincesData from '../data/provincesData.json';

// ─────────────────────────────────────────────────────────────
// QUERY DASAR
// ─────────────────────────────────────────────────────────────

/**
 * Mengambil seluruh data provinsi sebagai array.
 *
 * @returns {Array<ProvinceObject>} Array 38 objek provinsi.
 *
 * @example
 * const provinces = getAllProvinces();
 * // [{ code_bps: "11", name: "Aceh", indicators: {...} }, ...]
 */
export const getAllProvinces = () => provincesData;

/**
 * Mengambil data satu provinsi berdasarkan nama (case-insensitive).
 *
 * @param {string} name - Nama provinsi (e.g., "DI Yogyakarta")
 * @returns {ProvinceObject | null} Objek provinsi, atau null jika tidak ditemukan.
 *
 * @example
 * const prov = getProvinceByName('bali');
 * // { code_bps: "51", name: "Bali", indicators: {...} }
 */
export const getProvinceByName = (name) => {
  if (!name) return null;
  return (
    provincesData.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    ) ?? null
  );
};

// ─────────────────────────────────────────────────────────────
// STATISTIK AGREGAT
// ─────────────────────────────────────────────────────────────

/**
 * Menghitung rata-rata nasional dari nilai `total` suatu indikator
 * di seluruh 38 provinsi.
 *
 * @param {string} indicatorKey - Key indikator yang valid.
 * @returns {number} Rata-rata dibulatkan 2 desimal, atau 0 jika data kosong.
 *
 * @example
 * getNationalAverage('internet'); // 79.52
 * getNationalAverage('ipm');      // 74.93
 */
export const getNationalAverage = (indicatorKey) => {
  if (!provincesData.length) return 0;
  const sum = provincesData.reduce((acc, prov) => {
    return acc + (prov.indicators[indicatorKey]?.total ?? 0);
  }, 0);
  return Number((sum / provincesData.length).toFixed(2));
};

/**
 * Menghitung statistik ringkasan lengkap (min, max, rata-rata, median)
 * dari seluruh provinsi untuk indikator dan sektor tertentu.
 *
 * @param {string} indicatorKey        - Key indikator yang valid.
 * @param {'total'|'negeri'|'swasta'} [sector='total'] - Sub-field yang dikalkulasi.
 * @returns {{ min: number, max: number, avg: number, median: number, count: number } | null}
 *   Objek statistik, atau null jika tidak ada data yang valid.
 *
 * @example
 * getIndicatorSummary('komputer', 'total');
 * // { min: 11.17, max: 67.33, avg: 35.49, median: 33.46, count: 38 }
 *
 * getIndicatorSummary('ipm', 'negeri'); // null (ipm tidak punya data sektor)
 */
export const getIndicatorSummary = (indicatorKey, sector = 'total') => {
  const values = provincesData
    .map((p) => p.indicators[indicatorKey]?.[sector])
    .filter((v) => v !== undefined && v !== null)
    .map(Number)
    .sort((a, b) => a - b);

  if (values.length === 0) return null;

  const sum = values.reduce((acc, v) => acc + v, 0);
  const mid = Math.floor(values.length / 2);
  const median =
    values.length % 2 !== 0
      ? values[mid]
      : Number(((values[mid - 1] + values[mid]) / 2).toFixed(2));

  return {
    min:    Number(values[0].toFixed(2)),
    max:    Number(values[values.length - 1].toFixed(2)),
    avg:    Number((sum / values.length).toFixed(2)),
    median,
    count:  values.length,
  };
};

// ─────────────────────────────────────────────────────────────
// RANKING & SORTING
// ─────────────────────────────────────────────────────────────

/**
 * Mengembalikan seluruh 38 provinsi diurutkan berdasarkan nilai `total`
 * suatu indikator.
 *
 * @param {string}  indicatorKey        - Key indikator yang valid.
 * @param {boolean} [ascending=false]   - true = terendah ke tertinggi.
 * @returns {Array<ProvinceObject>} Array terurut (tidak mengubah data asli).
 *
 * @example
 * const top5 = getRankings('internet', false).slice(0, 5);
 */
export const getRankings = (indicatorKey, ascending = false) => {
  return [...provincesData].sort((a, b) => {
    const valA = a.indicators[indicatorKey]?.total ?? 0;
    const valB = b.indicators[indicatorKey]?.total ?? 0;
    return ascending ? valA - valB : valB - valA;
  });
};

// ─────────────────────────────────────────────────────────────
// ANALISIS SEKTOR (NEGERI vs SWASTA)
// ─────────────────────────────────────────────────────────────

/**
 * Menghitung selisih (gap) antara sekolah Negeri dan Swasta
 * di suatu provinsi untuk indikator tertentu.
 *
 * @param {string} provinceName  - Nama provinsi.
 * @param {string} indicatorKey  - Key indikator yang valid (harus punya data sektor).
 * @returns {{ province: string, negeri: number, swasta: number, gap: number, dominantSector: string } | null}
 *   Objek gap, atau null jika provinsi/indikator tidak valid.
 *
 * @note Mengembalikan null untuk indikator `ipm` dan `aps_13_15`
 *       karena tidak memiliki data sektor negeri/swasta.
 *
 * @example
 * getSectorGap('DI Yogyakarta', 'komputer');
 * // { province: 'DI Yogyakarta', negeri: 86.45, swasta: 45.42, gap: 41.03, dominantSector: 'Negeri' }
 *
 * getSectorGap('Aceh', 'ipm'); // null
 */
export const getSectorGap = (provinceName, indicatorKey) => {
  const prov = getProvinceByName(provinceName);
  if (!prov) return null;

  const indicator = prov.indicators[indicatorKey];
  if (!indicator || indicator.negeri === undefined || indicator.swasta === undefined) {
    return null;
  }

  const gap = Number((indicator.negeri - indicator.swasta).toFixed(2));

  return {
    province: prov.name,
    negeri: indicator.negeri,
    swasta: indicator.swasta,
    gap,
    dominantSector: gap > 0 ? 'Negeri' : gap < 0 ? 'Swasta' : 'Seimbang',
  };
};

/**
 * Mengembalikan daftar provinsi dengan disparitas (|gap| Negeri−Swasta)
 * terbesar untuk suatu indikator, diurutkan dari terbesar.
 *
 * @param {string} indicatorKey  - Key indikator (harus punya data negeri/swasta).
 * @param {number} [limit=5]     - Jumlah provinsi yang dikembalikan.
 * @returns {Array<GapObject>} Array terurut by |gap| descending.
 *   Mengembalikan array kosong jika indikator tidak punya data sektor.
 *
 * @example
 * getTopDisparityProvinces('komputer', 5);
 * // [{ province: 'DI Yogyakarta', gap: 41.03, ... }, ...]
 */
export const getTopDisparityProvinces = (indicatorKey, limit = 5) => {
  return provincesData
    .map((prov) => {
      const indicator = prov.indicators[indicatorKey];
      if (
        !indicator ||
        indicator.negeri === undefined ||
        indicator.swasta === undefined
      ) {
        return null;
      }
      const gap = Number((indicator.negeri - indicator.swasta).toFixed(2));
      return {
        province: prov.name,
        negeri: indicator.negeri,
        swasta: indicator.swasta,
        gap,
        dominantSector: gap > 0 ? 'Negeri' : gap < 0 ? 'Swasta' : 'Seimbang',
      };
    })
    .filter(Boolean)
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    .slice(0, limit);
};

// ─────────────────────────────────────────────────────────────
// PERBANDINGAN & VISUALISASI
// ─────────────────────────────────────────────────────────────

/**
 * Mengambil data indikator dari beberapa provinsi sekaligus.
 * Digunakan untuk menyiapkan data grafik bar komparatif.
 *
 * @param {string[]} provinceNames  - Array nama provinsi (2–3 item).
 * @param {string}   indicatorKey   - Key indikator yang valid.
 * @returns {Array<{ name: string, indicators: object | null }>}
 *   `indicators` akan null jika nama provinsi tidak ditemukan.
 *
 * @example
 * compareProvinces(['DKI Jakarta', 'Bali'], 'komputer');
 * // [
 * //   { name: 'DKI Jakarta', indicators: { total: 55.14, negeri: 79.86, swasta: 45.82 } },
 * //   { name: 'Bali',        indicators: { total: 67.33, negeri: 71.48, swasta: 58.27 } },
 * // ]
 */
export const compareProvinces = (provinceNames = [], indicatorKey) => {
  return provinceNames.map((name) => {
    const prov = getProvinceByName(name);
    return {
      name,
      indicators: prov ? (prov.indicators[indicatorKey] ?? null) : null,
    };
  });
};

/**
 * Menghasilkan lookup map `{ code_bps → nilai }` untuk pewarnaan choropleth.
 * Digunakan oleh komponen peta Leaflet.
 *
 * @param {string} indicatorKey                     - Key indikator yang valid.
 * @param {'total'|'negeri'|'swasta'} [sector='total'] - Sub-field yang diambil.
 * @returns {Record<string, number>} Objek dengan code_bps sebagai key.
 *
 * @example
 * const mapData = getMapDataByIndicator('internet', 'total');
 * // { "11": 75.58, "12": 79.75, ..., "97": 32.99 }
 *
 * // Gunakan di GeoJSON style function:
 * const value = mapData[feature.properties.KODE_PROV] ?? 0;
 */
export const getMapDataByIndicator = (indicatorKey, sector = 'total') => {
  return provincesData.reduce((acc, prov) => {
    acc[prov.code_bps] = prov.indicators[indicatorKey]?.[sector] ?? 0;
    return acc;
  }, {});
};

/**
 * Menyiapkan data titik scatter plot dari dua indikator untuk 38 provinsi.
 * Format return langsung kompatibel dengan Recharts `<ScatterChart>`.
 *
 * @param {string} indicatorX - Key indikator untuk sumbu X.
 * @param {string} indicatorY - Key indikator untuk sumbu Y.
 * @returns {Array<{ name: string, x: number, y: number }>}
 *   Hanya provinsi yang memiliki nilai valid untuk kedua indikator.
 *
 * @example
 * getCorrelationData('internet', 'ipm');
 * // [
 * //   { name: 'Aceh',       x: 75.58, y: 76.23 },
 * //   { name: 'DKI Jakarta', x: 95.98, y: 85.05 },
 * //   ...
 * // ]
 */
export const getCorrelationData = (indicatorX, indicatorY) => {
  return provincesData
    .map((prov) => {
      const x = prov.indicators[indicatorX]?.total;
      const y = prov.indicators[indicatorY]?.total;
      if (x === undefined || y === undefined) return null;
      return {
        name: prov.name,
        x: Number(x),
        y: Number(y),
      };
    })
    .filter(Boolean);
};