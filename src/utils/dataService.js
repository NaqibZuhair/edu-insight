import provincesData from '../data/provincesData.json';

/**
 * Mengambil seluruh data provinsi.
 * @returns {Array<object>}
 */
export const getAllProvinces = () => provincesData;

/**
 * Mengambil data provinsi berdasarkan nama (case-insensitive).
 * @param {string} name
 * @returns {object | null}
 */
export const getProvinceByName = (name) => {
  if (!name) return null;
  const target = name.toLowerCase().trim();
  return provincesData.find((p) => p.name.toLowerCase().trim() === target) ?? null;
};

/**
 * Menghitung rata-rata nasional untuk nilai total suatu indikator.
 * @param {string} indicatorKey
 * @returns {number}
 */
export const getNationalAverage = (indicatorKey) => {
  if (!provincesData.length) return 0;
  const sum = provincesData.reduce((acc, prov) => {
    return acc + (prov.indicators[indicatorKey]?.total ?? 0);
  }, 0);
  return Number((sum / provincesData.length).toFixed(2));
};

/**
 * Menghitung ringkasan statistik (min, max, avg, median) dari suatu indikator dan sektor.
 * @param {string} indicatorKey
 * @param {'total' | 'negeri' | 'swasta'} [sector='total']
 * @returns {{ min: number, max: number, avg: number, median: number, count: number } | null}
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
    min: Number(values[0].toFixed(2)),
    max: Number(values[values.length - 1].toFixed(2)),
    avg: Number((sum / values.length).toFixed(2)),
    median,
    count: values.length,
  };
};

/**
 * Mengurutkan provinsi berdasarkan nilai total indikator.
 * @param {string} indicatorKey
 * @param {boolean} [ascending=false]
 * @returns {Array<object>}
 */
export const getRankings = (indicatorKey, ascending = false) => {
  return [...provincesData].sort((a, b) => {
    const valA = a.indicators[indicatorKey]?.total ?? 0;
    const valB = b.indicators[indicatorKey]?.total ?? 0;
    return ascending ? valA - valB : valB - valA;
  });
};

/**
 * Menghitung selisih (gap) antara sekolah Negeri dan Swasta pada suatu provinsi.
 * @param {string} provinceName
 * @param {string} indicatorKey
 * @returns {{ province: string, negeri: number, swasta: number, gap: number, dominantSector: string } | null}
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
 * Mengambil daftar provinsi dengan disparitas (|gap| Negeri vs Swasta) tertinggi.
 * @param {string} indicatorKey
 * @param {number} [limit=5]
 * @returns {Array<{ province: string, negeri: number, swasta: number, gap: number, dominantSector: string }>}
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

/**
 * Mengambil data indikator untuk komparasi beberapa provinsi.
 * @param {string[]} provinceNames
 * @param {string} indicatorKey
 * @returns {Array<{ name: string, indicators: object | null }>}
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
 * Menghasilkan map lookup { code_bps: value } untuk choropleth peta.
 * @param {string} indicatorKey
 * @param {'total' | 'negeri' | 'swasta'} [sector='total']
 * @returns {Record<string, number>}
 */
export const getMapDataByIndicator = (indicatorKey, sector = 'total') => {
  return provincesData.reduce((acc, prov) => {
    acc[prov.code_bps] = prov.indicators[indicatorKey]?.[sector] ?? 0;
    return acc;
  }, {});
};

/**
 * Menyiapkan pasangan data titik koordinat untuk grafik korelasi (scatter plot).
 * @param {string} indicatorX
 * @param {string} indicatorY
 * @returns {Array<{ name: string, x: number, y: number }>}
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