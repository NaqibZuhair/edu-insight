import provincesData from '../data/provincesData.json';

/**
 * Mengambil seluruh data provinsi.
 */
export const getAllProvinces = () => provincesData;

/**
 * Mengambil data satu provinsi berdasarkan nama.
 */
export const getProvinceByName = (name) => {
  if (!name) return null;
  return provincesData.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  ) || null;
};

/**
 * Menghitung rata-rata nasional untuk indikator tertentu.
 */
export const getNationalAverage = (indicatorKey) => {
  if (!provincesData.length) return 0;
  const sum = provincesData.reduce((acc, curr) => {
    const val = curr.indicators[indicatorKey]?.total || 0;
    return acc + val;
  }, 0);
  return Number((sum / provincesData.length).toFixed(2));
};

/**
 * Mendapatkan daftar peringkat provinsi berdasarkan indikator.
 */
export const getRankings = (indicatorKey, ascending = false) => {
  return [...provincesData].sort((a, b) => {
    const valA = a.indicators[indicatorKey]?.total || 0;
    const valB = b.indicators[indicatorKey]?.total || 0;
    return ascending ? valA - valB : valB - valA;
  });
};

/**
 * Menghitung selisih (gap) antara sekolah Negeri dan Swasta.
 */
export const getSectorGap = (provinceName, indicatorKey) => {
  const prov = getProvinceByName(provinceName);
  if (!prov || !prov.indicators[indicatorKey]) return null;

  const { negeri, swasta } = prov.indicators[indicatorKey];
  if (negeri === undefined || swasta === undefined) return null;

  const gap = Number((negeri - swasta).toFixed(2));

  return {
    province: prov.name,
    negeri,
    swasta,
    gap,
    dominantSector: gap > 0 ? 'Negeri' : gap < 0 ? 'Swasta' : 'Seimbang'
  };
};

/**
 * Membandingkan beberapa provinsi sekaligus untuk grafik perbandingan.
 */
export const compareProvinces = (provinceNames = [], indicatorKey) => {
  return provinceNames.map((name) => {
    const prov = getProvinceByName(name);
    return {
      name,
      indicators: prov ? prov.indicators[indicatorKey] || null : null
    };
  });
};