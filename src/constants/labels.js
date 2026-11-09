/**
 * Kamus Istilah Baku Bahasa Indonesia & Pemformat Angka (Locale id-ID)
 * Digunakan secara konsisten di seluruh antarmuka EduInsight.
 */

export const UI_LABELS = {
  brandName: 'EduInsight',
  nav: {
    dashboard: 'Dasbor',
    perbandingan: 'Bandingkan',
    disparitas: 'Disparitas',
    metodologi: 'Metodologi',
    openMenu: 'Buka menu navigasi',
    closeMenu: 'Tutup menu navigasi',
    mainNavAria: 'Navigasi Utama'
  },
  common: {
    province: 'Provinsi',
    provinces38: '38 Provinsi',
    negeri: 'Negeri',
    swasta: 'Swasta',
    negeriSwasta: 'Negeri/Swasta',
    ranking: 'Peringkat',
    gap: 'Kesenjangan',
    selisih: 'Selisih',
    median: 'Median',
    average: 'Rata-rata',
    highest: 'Tertinggi',
    lowest: 'Terendah',
    loading: 'Memuat…',
    search: 'Cari',
    searchProvincePlaceholder: 'Cari provinsi…',
    filter: 'Filter',
    reset: 'Atur Ulang',
    benchmark: 'Tolok Ukur',
    outlier: 'Pencilan',
    yoy: 'Tahunan',
    split5050: 'Proporsi 50:50',
    close: 'Tutup',
    compareThisProvince: 'Bandingkan Provinsi Ini',
    addProvince: '+ Tambah Provinsi',
    downloadCSV: 'Unduh Data (.CSV)',
    printSummary: 'Cetak Ringkasan'
  }
};

/**
 * Memformat angka sesuai kaidah Bahasa Indonesia (id-ID):
 * pemisah ribuan titik (.) dan pemisah desimal koma (,).
 *
 * @param {number|string} value - Nilai angka yang akan diformat
 * @param {number} [decimals] - Jumlah angka di belakang koma (opsional)
 * @returns {string}
 */
export function formatNumberID(value, decimals = undefined) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '0';
  }
  const num = Number(value);
  if (typeof decimals === 'number') {
    return num.toLocaleString('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
  return num.toLocaleString('id-ID', {
    maximumFractionDigits: 3
  });
}

/**
 * Memformat persentase sesuai kaidah Bahasa Indonesia (id-ID), contoh: "87,5%".
 *
 * @param {number|string} value - Nilai persentase
 * @param {number} [decimals] - Jumlah desimal (opsional, otomatis mempertahankan desimal asli jika tidak diisi)
 * @returns {string}
 */
export function formatPercentID(value, decimals = undefined) {
  return `${formatNumberID(value, decimals)}%`;
}
