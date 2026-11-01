import { useState, useMemo } from 'react';
import {
  getDisparityAnalytics,
  exportDatasetToCSV
} from '../utils/dataService';
import { ArrowUpRight } from 'lucide-react';

// Exact Figma assets from steps/82, steps/48, steps/84, steps/85
const ICON_PRINT = '/assets/figma/ade45507-9220-4557-8bed-a5050e6caabf.svg';
const ICON_EXPORT = '/assets/figma/f1e29547-55d3-4bf6-a72f-16e5dfd415f4.svg';
const TAB_ICON_KOMPUTER = '/assets/figma/101a8675-d97b-4993-abb4-1c45fa4bef2c.svg';
const TAB_ICON_INTERNET = '/assets/figma/1b2e594e-77e7-4407-99f1-5c42e384bd8d.svg';
const TAB_ICON_LISTRIK = '/assets/figma/bb4d8b7e-3db0-4c86-96a3-d49857d8fa5d.svg';
const TAB_ICON_AIR = '/assets/figma/29153214-f12e-43b4-a8db-4d376ca2692e.svg';
const TAB_ICON_GURU = '/assets/figma/a6333d3c-c85d-480e-9202-9feee380d8ec.svg';
const ICON_CSV_MATRIX = '/assets/figma/aef11978-4beb-4c31-858d-3fd4bb147ace.svg';
const ICON_TAKEAWAY_1 = '/assets/figma/a6e552e5-3ac2-4d70-95b2-b5c76eddfa27.svg';
const ICON_TAKEAWAY_2 = '/assets/figma/1d3e4972-155f-43c0-a1eb-df238d2adb96.svg';

const INDICATOR_TABS = [
  { key: 'komputer', label: 'Laboratorium Komputer (TIK)', icon: TAB_ICON_KOMPUTER },
  { key: 'internet', label: 'Koneksi Internet', icon: TAB_ICON_INTERNET },
  { key: 'listrik', label: 'Pasokan Listrik 24 Jam', icon: TAB_ICON_LISTRIK },
  { key: 'air_minum', label: 'Sanitasi & Air Bersih', icon: TAB_ICON_AIR },
  { key: 'guru_d4s1', label: 'Guru D4/S1 Bersertifikasi', icon: TAB_ICON_GURU }
];

const REGION_PILLS = [
  'Semua Wilayah',
  'Jawa-Bali',
  'Sumatera',
  'Kalimantan',
  'Sulawesi',
  'Maluku & Papua',
  'Nusa Tenggara'
];

export default function DisparitasView({ onNavigate, onAddProvinceToCompare }) {
  const [selectedIndicator, setSelectedIndicator] = useState('komputer');
  const [selectedRegion, setSelectedRegion] = useState('Semua Wilayah');
  const [selectedScatterProvince, setSelectedScatterProvince] = useState('Maluku');

  const analytics = useMemo(
    () => getDisparityAnalytics(selectedIndicator),
    [selectedIndicator]
  );

  const filteredScatterRows = useMemo(() => {
    if (selectedRegion === 'Semua Wilayah') return analytics.rows;
    return analytics.rows.filter((r) => r.geo?.scatterRegion === selectedRegion);
  }, [analytics.rows, selectedRegion]);

  const activeTooltipRow = useMemo(() => {
    return (
      analytics.rows.find(
        (r) => r.name.toLowerCase() === selectedScatterProvince.toLowerCase()
      ) || analytics.highestDisparity || analytics.rows[0]
    );
  }, [analytics, selectedScatterProvince]);

  // Exact 5 rows for Section 1 as in Figma node 117:1089
  const top5Rows = useMemo(() => {
    return analytics.top5Disparity.slice(0, 5);
  }, [analytics]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      data-node-id="117:998"
      className="flex flex-col gap-[48px] items-center max-w-[1280px] mx-auto px-4 sm:px-6 py-[24px] w-full"
    >
      {/* Top Breadcrumb & Page Header (Figma node 117:1003) */}
      <section data-node-id="117:1003" className="flex flex-col gap-[24px] w-full">
        {/* Breadcrumb */}
        <div className="flex gap-[8px] items-center">
          <div className="backdrop-blur-[12px] bg-[rgba(15,45,61,0.8)] border border-white/10 flex items-center gap-[8px] px-[12px] py-[4px] rounded-full">
            <div className="bg-[#0db8d3] rounded-full size-[6px] animate-pulse" />
            <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[0.5px] uppercase">
              ANALISIS DISPARITAS &amp; KORELASI SOSIO-EKONOMI · DATA SDI 2023
            </span>
          </div>
          <span className="font-mono-tech text-[#869397] text-[10px]">/</span>
          <span className="font-mono-tech font-medium text-[#bcc9cd] text-[10px] tracking-[0.5px] uppercase">
            38 PROVINSI
          </span>
        </div>

        {/* Title & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 w-full">
          <div className="flex flex-col gap-[8px]">
            <h1 className="font-space font-bold text-[#cae6fc] text-[28px] sm:text-[44px] lg:text-[56px] leading-[1.14] tracking-[1.5px] uppercase max-w-[800px]">
              DISPARITAS SEKOLAH NEGERI VS SWASTA
            </h1>
            <p className="font-geist font-normal text-[#bcc9cd] text-[15px] sm:text-[16px] leading-[26px] max-w-[740px]">
              Evaluasi kesenjangan pemenuhan sarana dan prasarana antara sekolah negeri dan swasta di
              38 provinsi, serta korelasinya terhadap Indeks Pembangunan Manusia (IPM).
            </p>
          </div>

          <div className="flex items-center gap-[12px] self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-[rgba(28,56,73,0.6)] hover:bg-[rgba(28,56,73,0.9)] transition-colors border border-white/10 flex items-center gap-[8px] px-[16px] py-[8px] rounded-full text-xs font-mono-tech text-[#cae6fc] cursor-pointer"
            >
              <img src={ICON_PRINT} alt="" className="size-[14px]" />
              <span>Cetak Ringkasan</span>
            </button>
            <button
              type="button"
              onClick={() => exportDatasetToCSV('disparitas-negeri-swasta-sdi.csv')}
              className="bg-[#0db8d3] hover:bg-[#4bd7f3] text-[#00444f] transition-colors flex items-center gap-[8px] px-[18px] py-[8px] rounded-full text-xs font-mono-tech font-bold cursor-pointer shadow-[0_0_12px_rgba(13,184,211,0.35)]"
            >
              <img src={ICON_EXPORT} alt="" className="size-[12px]" />
              <span>Ekspor Dataset</span>
            </button>
          </div>
        </div>

        {/* Filter / Indicator Selector Pill Tabs (Figma node 117:1029) */}
        <div
          data-node-id="117:1029"
          className="flex flex-wrap gap-[8px] items-center pt-2 w-full"
        >
          {INDICATOR_TABS.map((tab) => {
            const isActive = selectedIndicator === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedIndicator(tab.key)}
                className={`flex items-center gap-[8px] px-[16px] py-[8px] rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0db8d3] text-[#00444f] font-geist font-semibold text-[14px] shadow-[0_0_12px_rgba(13,184,211,0.3)]'
                    : 'bg-[rgba(15,45,61,0.5)] hover:bg-[rgba(15,45,61,0.8)] border border-white/5 text-[#bcc9cd] font-geist text-[13px]'
                }`}
              >
                <img src={tab.icon} alt="" className="size-[14px]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* KPI Telemetry Bar (Figma node 117:1055) */}
        <div
          data-node-id="117:1055"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] w-full pt-2"
        >
          {/* Card 1: Rata-Rata Gap Nasional */}
          <div className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.6)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg">
            <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
              RATA-RATA GAP NASIONAL
            </span>
            <div className="flex items-baseline gap-2 py-2">
              <span className="font-space font-bold text-[#4bd7f3] text-[28px] leading-tight">
                +{analytics.nationalGap}%
              </span>
              <span className="font-mono-tech font-medium text-[#bcc9cd] text-[11px]">
                Negeri Unggul
              </span>
            </div>
            <div className="bg-[#00101b] h-[6px] rounded-full overflow-hidden w-full">
              <div
                className="bg-gradient-to-r from-[#0076d2] to-[#4bd7f3] h-full rounded-full"
                style={{ width: `${Math.min(100, analytics.nationalGap * 2.5)}%` }}
              />
            </div>
          </div>

          {/* Card 2: Disparitas Tertinggi */}
          <div className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.6)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg">
            <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
              DISPARITAS TERTINGGI
            </span>
            <div className="flex items-baseline gap-2 py-2">
              <span className="font-space font-bold text-[#ffb4ab] text-[28px] leading-tight">
                +{analytics.highestDisparity?.gap}%
              </span>
              <span className="font-mono-tech font-medium text-[#cae6fc] text-[12px]">
                {analytics.highestDisparity?.name}
              </span>
            </div>
            <span className="font-mono-tech text-[#bcc9cd] text-[11px]">
              Negeri: {analytics.highestDisparity?.negeri}% · Swasta:{' '}
              {analytics.highestDisparity?.swasta}%
            </span>
          </div>

          {/* Card 3: Koefisien Korelasi IPM (r) */}
          <div className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.6)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg">
            <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
              KOEFISIEN KORELASI IPM (R)
            </span>
            <div className="flex items-baseline gap-2 py-2">
              <span className="font-space font-bold text-[#a4c9ff] text-[28px] leading-tight">
                {analytics.regression?.r}
              </span>
              <span className="font-mono-tech font-medium text-[#bcc9cd] text-[11px]">
                Kuat Positif
              </span>
            </div>
            <span className="font-mono-tech text-[#bcc9cd] text-[11px]">
              p-value &lt; 0.001 (Signifikan)
            </span>
          </div>

          {/* Card 4: Koefisien Determinasi (R²) */}
          <div className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.6)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg">
            <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
              KOEFISIEN DETERMINASI (R²)
            </span>
            <div className="flex items-baseline gap-2 py-2">
              <span className="font-space font-bold text-[#4bd7f3] text-[28px] leading-tight">
                {analytics.regression?.r2}
              </span>
              <span className="font-mono-tech font-medium text-[#bcc9cd] text-[11px]">
                Varians Terjelaskan
              </span>
            </div>
            <span className="font-mono-tech text-[#bcc9cd] text-[11px]">
              {Math.round(analytics.regression?.r2 * 100)}% IPM berkorelasi dgn TIK
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 1: Top 5 Disparity Ranking Cards (Figma node 117:1089) */}
      <section
        data-node-id="117:1089"
        className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] border border-white/10 flex flex-col gap-[24px] p-[32px] rounded-[24px] shadow-xl w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
          <div>
            <div className="bg-[#032232] inline-flex px-[10px] py-[3px] rounded-full border border-white/5 mb-2">
              <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[1px] uppercase">
                RANKING DISPARITAS
              </span>
            </div>
            <h2 className="font-space font-bold text-[#cae6fc] text-[28px] leading-[36px]">
              Top 5 Kesenjangan Tertinggi (|Negeri - Swasta|)
            </h2>
            <p className="font-geist text-[#bcc9cd] text-[14px] mt-1">
              Provinsi dengan disparitas paling lebar dalam ketersediaan fasilitas komputer sekolah
              antara satuan pendidikan negeri dan swasta.
            </p>
          </div>

          <div className="flex items-center gap-[20px] self-start md:self-auto shrink-0">
            <div className="flex items-center gap-2">
              <div className="size-[10px] rounded-sm bg-[#4bd7f3]" />
              <span className="font-mono-tech text-xs text-[#bcc9cd]">Negeri (SD/SMP/SMA)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-[10px] rounded-sm bg-[#0076d2]" />
              <span className="font-mono-tech text-xs text-[#bcc9cd]">Swasta</span>
            </div>
          </div>
        </div>

        {/* 5 Ranked Rows (Exact Figma node 117:1108) */}
        <div className="flex flex-col gap-[12px] w-full">
          {top5Rows.map((row, idx) => {
            const rankStr = `0${idx + 1}`;
            const kabKotaText =
              row.name === 'Maluku'
                ? 'MALUKU & PAPUA · 11 KAB/KOTA'
                : row.name === 'Papua Barat Daya'
                ? 'PAPUA · 6 KAB/KOTA'
                : row.name === 'Sulawesi Tengah'
                ? 'SULAWESI · 13 KAB/KOTA'
                : row.name === 'Nusa Tenggara Timur'
                ? 'NUSA TENGGARA · 22 KAB/KOTA'
                : 'KALIMANTAN · 14 KAB/KOTA';

            return (
              <div
                key={row.name}
                className="bg-[rgba(15,45,61,0.5)] border border-white/5 hover:border-[#4bd7f3]/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between p-[20px] rounded-[16px] gap-4"
              >
                {/* Left Rank & Province Name */}
                <div className="flex items-center gap-4 min-w-[240px]">
                  <div className="bg-[rgba(0,16,27,0.7)] border border-white/10 rounded-full size-[40px] flex items-center justify-center shrink-0">
                    <span className="font-mono-tech font-bold text-[#4bd7f3] text-[16px]">
                      {rankStr}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-space font-semibold text-[#cae6fc] text-[18px]">
                      {row.name}
                    </h3>
                    <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px]">
                      {kabKotaText}
                    </span>
                  </div>
                </div>

                {/* Center Stats & Divergence Track */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1 w-full max-w-[620px]">
                  {/* Negeri vs Swasta numbers */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex flex-col">
                      <span className="font-mono-tech text-[10px] text-[#869397]">Negeri</span>
                      <span className="font-mono-tech font-bold text-[#4bd7f3] text-[18px]">
                        {row.negeri.toFixed(2)}%
                      </span>
                    </div>
                    <span className="text-[#869397] text-sm">vs</span>
                    <div className="flex flex-col">
                      <span className="font-mono-tech text-[10px] text-[#869397]">Swasta</span>
                      <span className="font-mono-tech font-bold text-[#a4c9ff] text-[18px]">
                        {row.swasta.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Dual Divergence Bar */}
                  <div className="flex flex-col gap-1 w-full flex-1">
                    <div className="flex items-center justify-between text-[10px] font-mono-tech">
                      <span className="text-[#bcc9cd]">Divergensi Sarana</span>
                      <span className="text-[#4bd7f3]">Gap: {row.gap.toFixed(2)} pp</span>
                    </div>
                    <div className="h-[12px] bg-[rgba(0,16,27,0.8)] rounded-full overflow-hidden flex w-full p-0.5">
                      <div
                        className="bg-[#0076d2] h-full rounded-l-full"
                        style={{ width: `${Math.min(100, row.swasta)}%` }}
                        title={`Swasta: ${row.swasta}%`}
                      />
                      <div
                        className="bg-[#4bd7f3] h-full rounded-r-full shadow-[0_0_8px_#4bd7f3]"
                        style={{ width: `${Math.min(100, row.gap)}%` }}
                        title={`Gap Dominan: +${row.gap}%`}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Dominance Badge */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                  <div className="bg-[rgba(13,184,211,0.12)] border border-[rgba(75,215,243,0.3)] px-[12px] py-[6px] rounded-full flex items-center gap-1.5">
                    <span className="font-mono-tech font-bold text-[#4bd7f3] text-[11px] whitespace-nowrap">
                      ↗ +{row.gap.toFixed(2)}% Negeri Dominan
                    </span>
                  </div>
                  {onAddProvinceToCompare && (
                    <button
                      type="button"
                      onClick={() => {
                        onAddProvinceToCompare(row.name);
                        if (onNavigate) onNavigate('perbandingan');
                      }}
                      className="size-[36px] rounded-full bg-[rgba(15,45,61,0.8)] border border-white/10 flex items-center justify-center hover:bg-[#0db8d3] hover:text-[#00363f] transition-all cursor-pointer"
                      title={`Bandingkan ${row.name}`}
                    >
                      <ArrowUpRight className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Anomaly Card: DI Yogyakarta (Swasta Dominan) (Figma node 117:1309) */}
        <div
          data-node-id="117:1309"
          className="bg-[rgba(15,45,61,0.6)] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between p-[16px] rounded-[16px] gap-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-[#4bd7f3] text-base mt-0.5">ⓘ</span>
            <p className="font-geist text-xs text-[#bcc9cd] leading-relaxed max-w-[960px]">
              <strong className="text-[#4bd7f3]">Kontras Terbalik:</strong> DI Yogyakarta
              mencatatkan kesenjangan negatif di mana swasta justru mengungguli negeri (-0.45% Swasta
              Dominan; Negeri: 90.15% vs Swasta: 90.60%). DKI Jakarta berada pada selisih terendah
              (+2.10%).
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onAddProvinceToCompare) onAddProvinceToCompare('DI Yogyakarta');
              if (onNavigate) onNavigate('perbandingan');
            }}
            className="bg-[#1c3849] hover:bg-[#0db8d3] hover:text-[#00363f] transition-all px-4 py-1.5 rounded-full font-mono-tech text-xs text-[#cae6fc] whitespace-nowrap cursor-pointer border border-white/10 self-end md:self-auto"
          >
            Analisis Wilayah Jawa →
          </button>
        </div>
      </section>

      {/* SECTION 2: Correlation Scatter Plot Section (Figma node 117:1317) */}
      <section
        data-node-id="117:1317"
        className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] border border-white/10 flex flex-col gap-[24px] p-[32px] rounded-[24px] shadow-xl w-full"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 w-full">
          <div>
            <div className="bg-[#032232] inline-flex px-[10px] py-[3px] rounded-full border border-white/5 mb-2">
              <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[1px] uppercase">
                ANALISIS REGRESI &amp; KORELASI
              </span>
            </div>
            <h2 className="font-space font-bold text-[#cae6fc] text-[28px] leading-[36px]">
              Korelasi Kesiapan TIK Sekolah vs Indeks Pembangunan Manusia (IPM)
            </h2>
            <p className="font-geist text-[#bcc9cd] text-[14px] mt-1">
              Scatter plot 38 provinsi menunjukkan korelasi positif kuat (r = 0.782) antara fasilitas
              TIK dengan IPM daerah.
            </p>
          </div>

          <button
            type="button"
            onClick={() => exportDatasetToCSV('korelasi-tik-vs-ipm-sdi.csv')}
            className="bg-[rgba(28,56,73,0.6)] hover:bg-[#0db8d3] hover:text-[#00363f] transition-all border border-white/10 flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer text-xs font-mono-tech text-[#cae6fc] self-start lg:self-auto"
          >
            <img src={ICON_CSV_MATRIX} alt="" className="size-[12px]" />
            <span>Ekspor Matriks CSV</span>
          </button>
        </div>

        {/* Filter Region Pills & Legend */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap gap-2">
            {REGION_PILLS.map((reg) => {
              const isActive = selectedRegion === reg;
              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1.5 rounded-full text-xs font-geist transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0db8d3] text-[#00444f] font-semibold'
                      : 'bg-[rgba(15,45,61,0.5)] text-[#bcc9cd] hover:text-white border border-white/5'
                  }`}
                >
                  {reg}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-tech text-[#bcc9cd]">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-[#4bd7f3]" />
              <span>Titik Data Provinsi (38)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-0.5 bg-[#4bd7f3]" />
              <span>Garis Regresi (r = 0.782)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#869397]" />
              <span>Benchmark IPM 72.8</span>
            </div>
          </div>
        </div>

        {/* Interactive Scatter Plot Canvas with pinned Maluku Tooltip Card */}
        <div className="relative bg-[rgba(0,16,27,0.85)] border border-white/10 rounded-[16px] p-6 h-[440px] w-full overflow-hidden">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-white/20 w-full" />
            <div className="border-b border-white/20 w-full" />
            <div className="border-b border-white/20 w-full" />
            <div className="border-b border-white/20 w-full" />
            <div className="border-b border-white/20 w-full" />
          </div>

          {/* SVG Trendline */}
          <svg className="absolute inset-0 size-full pointer-events-none z-0">
            <line
              x1="8%"
              y1="82%"
              x2="92%"
              y2="18%"
              stroke="#4bd7f3"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.8"
            />
          </svg>

          {/* Scatter Points for filtered rows */}
          <div className="relative size-full z-10">
            {filteredScatterRows.map((p) => {
              // Map TIK value (20..100) to X (8%..92%) and IPM (60..85) to Y (85%..15%)
              const leftPercent = 8 + ((p.tikScore - 15) / 85) * 82;
              const bottomPercent = 15 + ((p.ipm - 60) / 25) * 70;
              const isSelected = p.name.toLowerCase() === selectedScatterProvince.toLowerCase();

              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setSelectedScatterProvince(p.name)}
                  className={`absolute rounded-full transition-transform cursor-pointer -translate-x-1/2 -translate-y-1/2 ${
                    isSelected
                      ? 'size-[14px] bg-[#ffb4ab] ring-4 ring-[#ffb4ab]/40 z-30 scale-125'
                      : 'size-[10px] bg-[#4bd7f3] hover:scale-150 hover:bg-white z-20'
                  }`}
                  style={{
                    left: `${Math.max(6, Math.min(94, leftPercent))}%`,
                    bottom: `${Math.max(8, Math.min(92, bottomPercent))}%`
                  }}
                  title={`${p.name} (TIK: ${p.tikScore}%, IPM: ${p.ipm})`}
                />
              );
            })}

            {/* Pinned Tooltip Card: Maluku / Selected Province */}
            <div className="absolute left-[38%] top-[24%] backdrop-blur-xl bg-[rgba(15,45,61,0.95)] border border-[#ffb4ab]/40 rounded-2xl p-4 shadow-2xl z-30 max-w-[280px]">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#ffb4ab]" />
                  <span className="font-space font-bold text-sm text-[#cae6fc]">
                    {activeTooltipRow.name}
                  </span>
                </div>
                <span className="bg-[#93000a] text-[#ffdad6] text-[9px] font-mono-tech px-2 py-0.5 rounded-full">
                  r-Outlier
                </span>
              </div>
              <div className="space-y-1.5 pt-2 text-xs font-mono-tech">
                <div className="flex justify-between">
                  <span className="text-[#869397]">Fasilitas TIK:</span>
                  <span className="text-[#cae6fc] font-semibold">
                    {activeTooltipRow.tikScore}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#869397]">IPM Daerah:</span>
                  <span className="text-[#a4c9ff] font-semibold">{activeTooltipRow.ipm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#869397]">Disparitas:</span>
                  <span className="text-[#ffb4ab] font-semibold">
                    +{activeTooltipRow.gap.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Bottom Takeaway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="bg-[rgba(15,45,61,0.4)] border border-white/5 rounded-2xl p-4 flex items-start gap-3">
            <img src={ICON_TAKEAWAY_1} alt="" className="size-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-space font-semibold text-sm text-[#cae6fc]">
                Korelasi Linier Kuat: TIK sebagai Akselerator IPM
              </h4>
              <p className="font-geist text-xs text-[#bcc9cd] leading-relaxed mt-1">
                Ketersediaan laboratorium komputer berkorelasi linear kuat dengan capaian IPM daerah
                (r = 0.782, p &lt; 0.001). Setiap peningkatan 10% fasilitas TIK diasosiasikan dengan
                kenaikan 1.8 poin IPM.
              </p>
            </div>
          </div>

          <div className="bg-[rgba(15,45,61,0.4)] border border-white/5 rounded-2xl p-4 flex items-start gap-3">
            <img src={ICON_TAKEAWAY_2} alt="" className="size-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-space font-semibold text-sm text-[#cae6fc]">
                Outlier Wilayah Timur: Anomali Maluku &amp; Papua Barat Daya
              </h4>
              <p className="font-geist text-xs text-[#bcc9cd] leading-relaxed mt-1">
                Provinsi Maluku dan Papua Barat Daya berada jauh di bawah garis tren regresi
                (outlier), menunjukkan perlunya afirmasi sarana digital sekolah swasta non-pemerintah
                di kepulauan terluar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Deep Dive Matrix Breakdown (38 Provinces Geographic Clusters) (Figma node 117:1517) */}
      <section
        data-node-id="117:1517"
        className="flex flex-col gap-[16px] pb-[24px] w-full"
      >
        <div className="flex items-center justify-between w-full">
          <div>
            <h2 className="font-space font-semibold text-[#cae6fc] text-[24px] tracking-[0.48px]">
              Matriks Klaster Disparitas Regional
            </h2>
            <p className="font-geist font-normal text-[#bcc9cd] text-[14px]">
              Perbandingan agregat kesenjangan per pulau/wilayah geografis
            </p>
          </div>
          <div className="bg-[rgba(15,45,61,0.6)] px-3 py-1 rounded-full border border-white/5">
            <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
              AGREGASI SDI 2023
            </span>
          </div>
        </div>

        {/* 3 Cluster Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] w-full">
          {/* Cluster 1: Maluku & Papua */}
          <div
            data-node-id="117:1527"
            className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.4)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg"
          >
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <h3 className="font-geist font-semibold text-[#cae6fc] text-[16px]">
                  Maluku &amp; Papua
                </h3>
                <div className="bg-[rgba(147,0,10,0.6)] px-[8px] py-[2px] rounded-full">
                  <span className="font-mono-tech font-medium text-[#ffb4ab] text-[10px]">
                    Kritis
                  </span>
                </div>
              </div>
              <p className="font-geist text-[#bcc9cd] text-[12px] leading-[18px]">
                Rata-rata kesenjangan negeri vs swasta tertinggi secara nasional.
              </p>
            </div>

            <div className="flex flex-col gap-[8px] pt-[16px]">
              <div className="flex justify-between text-[12px]">
                <span className="font-geist text-[#869397]">Rerata Disparitas:</span>
                <span className="font-geist font-bold text-[#4bd7f3]">+34.4%</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="font-geist text-[#869397]">Provinsi Terdampak:</span>
                <span className="font-geist font-medium text-[#cae6fc]">8 Provinsi</span>
              </div>
              <div className="bg-[rgba(0,16,27,0.8)] h-[6px] rounded-full overflow-hidden w-full mt-1">
                <div className="bg-[#ffb4ab] h-full rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
          </div>

          {/* Cluster 2: Nusa Tenggara & Sulawesi */}
          <div
            data-node-id="117:1550"
            className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.4)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg"
          >
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <h3 className="font-geist font-semibold text-[#cae6fc] text-[16px]">
                  Nusa Tenggara &amp; Sulawesi
                </h3>
                <div className="bg-[rgba(0,118,210,0.4)] px-[8px] py-[2px] rounded-full">
                  <span className="font-mono-tech font-medium text-[#a4c9ff] text-[10px]">
                    Menengah
                  </span>
                </div>
              </div>
              <p className="font-geist text-[#bcc9cd] text-[12px] leading-[18px]">
                Disparitas terpusat pada sekolah swasta pedalaman dan kepulauan.
              </p>
            </div>

            <div className="flex flex-col gap-[8px] pt-[16px]">
              <div className="flex justify-between text-[12px]">
                <span className="font-geist text-[#869397]">Rerata Disparitas:</span>
                <span className="font-geist font-bold text-[#4bd7f3]">+21.2%</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="font-geist text-[#869397]">Provinsi Terdampak:</span>
                <span className="font-geist font-medium text-[#cae6fc]">8 Provinsi</span>
              </div>
              <div className="bg-[rgba(0,16,27,0.8)] h-[6px] rounded-full overflow-hidden w-full mt-1">
                <div className="bg-[#a4c9ff] h-full rounded-full" style={{ width: '54%' }} />
              </div>
            </div>
          </div>

          {/* Cluster 3: Jawa, Bali & Sumatera */}
          <div
            data-node-id="117:1573"
            className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.4)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg"
          >
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <h3 className="font-geist font-semibold text-[#cae6fc] text-[16px]">
                  Jawa, Bali &amp; Sumatera
                </h3>
                <div className="bg-[rgba(75,215,243,0.2)] px-[8px] py-[2px] rounded-full">
                  <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px]">
                    Rendah / Seimbang
                  </span>
                </div>
              </div>
              <p className="font-geist text-[#bcc9cd] text-[12px] leading-[18px]">
                Kapasitas sekolah swasta mapan menyeimbangi atau melampaui negeri.
              </p>
            </div>

            <div className="flex flex-col gap-[8px] pt-[16px]">
              <div className="flex justify-between text-[12px]">
                <span className="font-geist text-[#869397]">Rerata Disparitas:</span>
                <span className="font-geist font-bold text-[#4bd7f3]">+4.6%</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="font-geist text-[#869397]">Provinsi Terdampak:</span>
                <span className="font-geist font-medium text-[#cae6fc]">22 Provinsi</span>
              </div>
              <div className="bg-[rgba(0,16,27,0.8)] h-[6px] rounded-full overflow-hidden w-full mt-1">
                <div className="bg-[#4bd7f3] h-full rounded-full" style={{ width: '14%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
