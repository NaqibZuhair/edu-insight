import { useState, useMemo } from 'react';
import {
  INDICATORS_META,
  getEnrichedProvinces,
  exportDatasetToCSV
} from '../utils/dataService';
import { Database, BookOpen, Calculator, Search, ArrowUpDown, Download } from 'lucide-react';

export default function MetodologiView({ onNavigate, onAddProvinceToCompare }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('rank');
  const [sortAsc, setSortAsc] = useState(true);

  const provinces = useMemo(() => getEnrichedProvinces('composite', 'total'), []);

  const filteredProvinces = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? provinces.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.geo.region.toLowerCase().includes(q) ||
            p.code_kemdagri.includes(q)
        )
      : [...provinces];

    return list.sort((a, b) => {
      let valA, valB;
      if (sortKey === 'rank') {
        valA = a.rank;
        valB = b.rank;
      } else if (sortKey === 'name') {
        return sortAsc
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortKey === 'composite') {
        valA = a.composite.total;
        valB = b.composite.total;
      } else {
        valA = a.indicators[sortKey]?.total || 0;
        valB = b.indicators[sortKey]?.total || 0;
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [provinces, search, sortKey, sortAsc]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortAsc((a) => !a);
    } else {
      setSortKey(key);
      setSortAsc(key === 'rank' || key === 'name');
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 pb-12 flex flex-col gap-10">
      {/* Page Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-2 max-w-[780px]">
          <div className="bg-[rgba(15,45,61,0.8)] border border-white/10 inline-flex items-center gap-2 px-3 py-1 rounded-full self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0db8d3]" />
            <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[1px] uppercase">
              DOKUMENTASI TEKNIS · SATU DATA INDONESIA (SDI)
            </span>
          </div>
          <h1 className="font-space font-bold text-[#cae6fc] text-[30px] sm:text-[44px] leading-[1.14] tracking-[1.4px] uppercase">
            METODOLOGI &amp; DATASET 38 PROVINSI
          </h1>
          <p className="font-geist text-[#bcc9cd] text-[15px] sm:text-[16px] leading-[26px]">
            Transparansi sumber data, standarisasi kode wilayah Kemendagri &amp; BPS (38 Provinsi
            termasuk Daerah Otonom Baru Papua), serta perumusan indeks kesiapan infrastruktur.
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportDatasetToCSV('eduinsight-dataset-38-provinsi.csv')}
          className="bg-[#0db8d3] hover:bg-[#4bd7f3] text-[#00444f] font-geist font-semibold text-[15px] px-5 py-2.5 rounded-full flex items-center gap-2 shadow-[0_0_16px_rgba(13,184,211,0.35)] cursor-pointer self-start lg:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Dataset Lengkap (.CSV)</span>
        </button>
      </section>

      {/* 3 Pillars of Methodology */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.45)] border border-white/10 rounded-[16px] p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0db8d3]/15 border border-[#4bd7f3]/30 flex items-center justify-center text-[#4bd7f3]">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="font-space font-bold text-[#cae6fc] text-[20px]">
            1. Akuisisi &amp; Validasi Data
          </h2>
          <p className="font-geist text-[#bcc9cd] text-[13.5px] leading-[21px]">
            Dataset diolah melalui pipeline otomatis (<code className="text-[#4bd7f3]">scripts/buildData.js</code>)
            dari repositori resmi Satu Data Indonesia (SDI) Kemendikdasmen &amp; Badan Pusat
            Statistik (BPS) mencakup 38 provinsi dengan pemetaan tunggal Kode Kemendagri (11 s.d. 96).
          </p>
        </div>

        <div className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.45)] border border-white/10 rounded-[16px] p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0db8d3]/15 border border-[#4bd7f3]/30 flex items-center justify-center text-[#4bd7f3]">
            <Calculator className="w-5 h-5" />
          </div>
          <h2 className="font-space font-bold text-[#cae6fc] text-[20px]">
            2. Indeks Kesiapan &amp; Gap Sektoral
          </h2>
          <p className="font-geist text-[#bcc9cd] text-[13.5px] leading-[21px]">
            Skor Komposit dihitung dari rata-rata 5 indikator SPM fasilitas &amp; SDM: Laboratorium
            Komputer TIK, Internet Sekolah, Pasokan Listrik, Sanitasi &amp; Air Minum, serta Guru
            Kualifikasi D4/S1. Disparitas sektoral mengukur selisih <code className="text-[#4bd7f3]">Negeri - Swasta</code>.
          </p>
        </div>

        <div className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.45)] border border-white/10 rounded-[16px] p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0db8d3]/15 border border-[#4bd7f3]/30 flex items-center justify-center text-[#4bd7f3]">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="font-space font-bold text-[#cae6fc] text-[20px]">
            3. Pemodelan Regresi IPM
          </h2>
          <p className="font-geist text-[#bcc9cd] text-[13.5px] leading-[21px]">
            Hubungan antara ketersediaan infrastruktur sekolah terhadap Indeks Pembangunan Manusia
            (IPM) dan Angka Partisipasi Sekolah (APS 13-15 Tahun) diuji menggunakan Koefisien
            Korelasi Pearson (<code className="text-[#4bd7f3]">r</code>) dan Determinasi (<code className="text-[#4bd7f3]">R²</code>).
          </p>
        </div>
      </section>

      {/* Dictionary of 7 Indicators */}
      <section className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.4)] border border-white/10 rounded-[20px] p-6 flex flex-col gap-4">
        <h2 className="font-space font-bold text-[#cae6fc] text-[22px]">
          Kamus Indikator Satu Data Indonesia (SDI)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(INDICATORS_META).map((meta) => (
            <div
              key={meta.key}
              className="bg-[#00101b]/50 border border-white/5 rounded-xl p-4 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-tech font-bold text-[#4bd7f3] text-[11px] uppercase">
                  {meta.shortLabel}
                </span>
                <span className="font-mono-tech text-[#869397] text-[10px]">
                  Satuan: {meta.unit}
                </span>
              </div>
              <span className="font-geist font-semibold text-[#cae6fc] text-[14px]">
                {meta.label}
              </span>
              <p className="font-geist text-[#bcc9cd] text-[12px] leading-[18px]">
                {meta.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Full 38-Province Master Data Table */}
      <section className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.4)] border border-white/10 rounded-[20px] p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-space font-bold text-[#cae6fc] text-[22px]">
              Tabel Master Data 38 Provinsi Indonesia
            </h2>
            <p className="font-geist text-[#bcc9cd] text-[13px]">
              Klik header kolom untuk mengurutkan, atau klik baris provinsi untuk membandingkan.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#00101b]/80 border border-white/10 rounded-full px-4 py-2 w-full sm:w-72">
            <Search className="w-4 h-4 text-[#869397]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari provinsi atau wilayah..."
              className="bg-transparent text-[13px] text-[#cae6fc] placeholder-[#869397] focus:outline-none w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#00101b]/90 border-b border-white/10 font-mono-tech text-[10px] text-[#869397] uppercase">
                {[
                  { key: 'rank', label: 'Rank' },
                  { key: 'name', label: 'Provinsi' },
                  { key: 'composite', label: 'Komposit' },
                  { key: 'komputer', label: 'Lab TIK' },
                  { key: 'internet', label: 'Internet' },
                  { key: 'listrik', label: 'Listrik' },
                  { key: 'air_minum', label: 'Air Bersih' },
                  { key: 'guru_d4s1', label: 'Guru D4/S1' },
                  { key: 'ipm', label: 'IPM' },
                  { key: 'aps_13_15', label: 'APS 13-15' }
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="py-3 px-3 cursor-pointer hover:text-[#4bd7f3] whitespace-nowrap select-none"
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>{col.label}</span>
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-geist text-[13px]">
              {filteredProvinces.map((p) => (
                <tr
                  key={p.code_kemdagri}
                  onClick={() => {
                    if (onAddProvinceToCompare) onAddProvinceToCompare(p.name);
                    if (onNavigate) onNavigate('perbandingan');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-mono-tech font-bold text-[#4bd7f3]">
                    #{String(p.rank).padStart(2, '0')}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#cae6fc] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{p.name}</span>
                      <span className="bg-[#1c3849] px-2 py-0.5 rounded-full font-mono-tech text-[9px] text-[#bcc9cd]">
                        {p.geo.badge}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono-tech font-bold text-[#4bd7f3]">
                    {p.composite.total.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 font-mono-tech text-[#cae6fc]">
                    {p.indicators.komputer?.total?.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 font-mono-tech text-[#cae6fc]">
                    {p.indicators.internet?.total?.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 font-mono-tech text-[#cae6fc]">
                    {p.indicators.listrik?.total?.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 font-mono-tech text-[#cae6fc]">
                    {p.indicators.air_minum?.total?.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 font-mono-tech text-[#cae6fc]">
                    {p.indicators.guru_d4s1?.total?.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 font-mono-tech text-[#a4c9ff]">
                    {p.indicators.ipm?.total?.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono-tech text-[#bcc9cd]">
                    {p.indicators.aps_13_15?.total?.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
