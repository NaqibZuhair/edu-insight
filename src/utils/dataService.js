import provincesData from '../data/provincesData.json';

/**
 * Mendapatkan seluruh daftar data provinsi.
 */
export const getAllProvinces = () => provincesData;

/**
 * Mendapatkan data provinsi spesifik berdasarkan kode atau nama.
 */
export const getProvinceByName = (name) => {
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
 * Mendapatkan peringkat provinsi tertinggi dan terendah berdasarkan indikator.
 */
export const getProvinceRankings = (indicatorKey, asc = false) => {
  return [...provincesData].sort((a, b) => {
    const valA = a.indicators[indicatorKey]?.total || 0;
    const valB = b.indicators[indicatorKey]?.total || 0;
    return asc ? valA - valB : valB - valA;
  });
};

/**
 * Menghitung gap (selisih) antara fasilitas sekolah Negeri vs Swasta di suatu provinsi.
 */
export const getSectorGap = (provinceName, indicatorKey) => {
  const prov = getProvinceByName(provinceName);
  if (!prov || !prov.indicators[indicatorKey]) return null;

  const { negeri, swasta } = prov.indicators[indicatorKey];
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
 * Membandingkan 2 atau lebih provinsi secara komparatif.
 */
export const compareProvinces = (provinceNames = [], indicatorKey) => {
  return provinceNames.map((name) => {
    const prov = getProvinceByName(name);
    return {
      name,
      data: prov ? prov.indicators[indicatorKey] || null : null
    };
  });
};