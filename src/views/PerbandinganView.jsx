import { useState, useMemo, useRef, useEffect } from 'react';
import {
  getEnrichedProvinces,
  exportDatasetToCSV
} from '../utils/dataService';

// Exact Figma assets from steps/47/output.txt
const imgContainer = '/assets/figma/7a67336c-38eb-41c0-9db8-73319e4d3543.svg';
const imgButtonHapusDkiJakarta = '/assets/figma/ad592ed0-4bd2-4f95-9ada-2414d4ba7f05.svg';
const imgContainer1 = '/assets/figma/163c68c2-cc35-4101-b67e-e527c5743312.svg';
const imgContainer2 = '/assets/figma/a6bf7200-567f-4c55-a007-df727d53ef2d.svg';
const imgBackground = '/assets/figma/ffff8ad6-c7d0-418b-97ae-7ad75acbb41a.svg';
const imgBackground1 = '/assets/figma/8b19d879-f0a3-4d20-9da8-6167a34be837.svg';

const CARD_THEMES = [
  {
    dot: '#4bd7f3',
    shadow: 'shadow-[0px_0px_16px_-2px_rgba(75,215,243,0.35)]',
    cardBorder: 'shadow-[0px_0px_24px_-4px_rgba(13,184,211,0.35)]',
    badgeBg: 'bg-[rgba(75,215,243,0.2)]',
    badgeText: 'text-[#4bd7f3]',
    scoreText: 'text-[#4bd7f3]',
    barGradient: 'bg-gradient-to-r from-[#0076d2] to-[#4bd7f3]',
    splitBar: 'bg-[#4bd7f3]',
    rankTag: 'text-[#4bd7f3]'
  },
  {
    dot: '#a4c9ff',
    shadow: 'shadow-[0px_0px_16px_-2px_rgba(164,201,255,0.25)]',
    cardBorder: 'shadow-[0px_0px_24px_-4px_rgba(164,201,255,0.25)]',
    badgeBg: 'bg-[rgba(164,201,255,0.2)]',
    badgeText: 'text-[#a4c9ff]',
    scoreText: 'text-[#a4c9ff]',
    barGradient: 'bg-gradient-to-r from-[#0076d2] to-[#a4c9ff]',
    splitBar: 'bg-[#a4c9ff]',
    rankTag: 'text-[#a4c9ff]'
  },
  {
    dot: '#ffb4ab',
    shadow: 'shadow-[0px_0px_16px_-2px_rgba(255,180,171,0.2)]',
    cardBorder: 'shadow-[0px_0px_24px_-4px_rgba(255,180,171,0.2)]',
    badgeBg: 'bg-[#93000a]',
    badgeText: 'text-[#ffdad6]',
    scoreText: 'text-[#ffb4ab]',
    barGradient: 'bg-[#ffb4ab]',
    splitBar: 'bg-[#ffb4ab]',
    rankTag: 'text-[#ffb4ab]'
  }
];

const INDICATOR_ROWS = [
  { key: 'komputer', label: 'Akses Komputer Lab TIK' },
  { key: 'internet', label: 'Koneksi Internet Stabil' },
  { key: 'listrik', label: 'Pasokan Listrik 24 Jam' },
  { key: 'air_minum', label: 'Sanitasi & Air Bersih' },
  { key: 'guru_d4s1', label: 'Guru D4/S1 Bersertifikasi' }
];

const CHART_ITEMS = [
  { key: 'komputer', label: 'Komputer Lab' },
  { key: 'internet', label: 'Internet Sekolah', isHighlighted: true },
  { key: 'listrik', label: 'Pasokan Listrik' },
  { key: 'air_minum', label: 'Sanitasi & Air' },
  { key: 'guru_d4s1', label: 'Guru D4/S1' },
  { key: 'ruang_layak', label: 'Ruang Layak' },
  { key: 'perpus_digital', label: 'Perpus Digital' }
];

function getIndicatorVal(prov, key) {
  let val = prov?.indicators?.[key]?.total;
  if (val === undefined) {
    val =
      key === 'ruang_layak'
        ? Math.round(prov.overallScore * 0.96)
        : key === 'perpus_digital'
        ? Math.round(prov.overallScore * 0.9)
        : prov.overallScore;
  }
  return val;
}

export default function PerbandinganView({
  selectedProvinceNames,
  setSelectedProvinceNames
}) {
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  const allProvinces = useMemo(() => getEnrichedProvinces('composite', 'total'), []);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPickerOpen(false);
      }
    };
    if (pickerOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
      return () => document.removeEventListener('pointerdown', handleClickOutside);
    }
  }, [pickerOpen]);

  const selectedProvinces = useMemo(() => {
    return selectedProvinceNames
      .map((name) => allProvinces.find((p) => p.name.toLowerCase() === name.toLowerCase()))
      .filter(Boolean);
  }, [allProvinces, selectedProvinceNames]);

  const handleRemove = (name) => {
    if (selectedProvinceNames.length <= 1) return;
    setSelectedProvinceNames((prev) => prev.filter((n) => n !== name));
  };

  const handleSelectProvince = (name) => {
    setSelectedProvinceNames((prev) => {
      if (prev.includes(name)) return prev;
      if (prev.length < 3) return [...prev, name];
      return [prev[0], prev[1], name];
    });
    setPickerOpen(false);
  };

  return (
    <div
      data-node-id="117:531"
      className="flex flex-col gap-[40px] items-center max-w-[1280px] mx-auto px-4 sm:px-6 py-[24px] w-full"
    >
      {/* Header Section (Figma node 117:536) */}
      <section data-node-id="117:536" className="flex flex-col gap-[16px] w-full relative z-30">
        {/* Breadcrumb telemetry */}
        <div className="flex gap-[8px] items-center">
          <div className="bg-[#0db8d3] rounded-full size-[8px] animate-pulse" />
          <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[0.5px] uppercase">
            ANALYTICS &amp; BENCHMARKING · DATA RESMI SDI 2023
          </span>
        </div>

        {/* Title and Active Entities Badge */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 w-full">
          <div className="flex flex-col gap-[3.5px]">
            <h1 className="font-space font-bold text-[#cae6fc] text-[28px] sm:text-[44px] lg:text-[56px] leading-[1.14] tracking-[1.5px] uppercase">
              PERBANDINGAN ANTAR-PROVINSI
            </h1>
            <p className="font-geist font-normal text-[#bcc9cd] text-[15px] sm:text-[16px] leading-[26px] max-w-[768px]">
              Bandingkan capaian fasilitas pendidikan antara 2 hingga 3 provinsi secara berdampingan
              untuk mengidentifikasi disparitas struktural dan kebutuhan intervensi DAK Fisik.
            </p>
          </div>

          <div className="backdrop-blur-[12px] bg-[rgba(15,45,61,0.8)] border border-white/10 flex gap-[8px] items-center px-[16px] py-[8px] rounded-full self-start lg:self-auto">
            <img src={imgContainer} alt="" className="size-[14px]" />
            <span className="font-mono-tech font-medium text-[#cae6fc] text-[12px] tracking-[0.72px]">
              Mode: {selectedProvinces.length} Entitas Aktif
            </span>
          </div>
        </div>

        {/* Control Bar with Selected Province Chips and Benchmark Toggle (Figma node 117:551) */}
        <div
          data-node-id="117:551"
          className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.6)] border border-white/10 flex flex-col gap-[16px] p-[16px] rounded-[16px] shadow-lg w-full relative z-30 overflow-visible"
        >
          {/* Row 1: Selected Chips */}
          <div className="flex flex-wrap gap-[12px] items-center">
            {selectedProvinces.map((prov, idx) => {
              const theme = CARD_THEMES[idx % CARD_THEMES.length];
              return (
                <div
                  key={prov.name}
                  className={`bg-[rgba(28,56,73,0.8)] flex gap-[8px] items-center px-[16px] py-[6px] rounded-full ${theme.shadow} border border-white/10`}
                >
                  <div
                    className="rounded-full size-[10px]"
                    style={{ backgroundColor: theme.dot }}
                  />
                  <span className="font-geist font-semibold text-[#cae6fc] text-[16px] tracking-[0.16px]">
                    {prov.name}
                  </span>
                  <div className="bg-[#0f2d3d] px-[8px] py-[2px] rounded-full">
                    <span
                      className="font-mono-tech font-medium text-[10px] tracking-[0.8px]"
                      style={{ color: theme.dot }}
                    >
                      {prov.geo?.region || 'Wilayah'} · Rank #{prov.rank}
                    </span>
                  </div>
                  {selectedProvinces.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemove(prov.name)}
                      className="cursor-pointer hover:opacity-80 transition-opacity p-0.5 ml-1"
                      title={`Hapus ${prov.name}`}
                    >
                      <img src={imgButtonHapusDkiJakarta} alt="Hapus" className="size-[9px]" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Add Province Button */}
            <div ref={pickerRef} className="relative z-40">
              <button
                type="button"
                onClick={() => setPickerOpen((prev) => !prev)}
                className="bg-[rgba(15,45,61,0.6)] hover:bg-[rgba(15,45,61,0.9)] transition-colors border border-white/10 flex gap-[6px] items-center px-[16px] py-[6px] rounded-full shadow-[0px_0px_12px_0px_rgba(75,215,243,0.15)] cursor-pointer"
              >
                <img src={imgContainer1} alt="" className="size-[11px]" />
                <span className="font-geist font-normal text-[#4bd7f3] text-[12px]">
                  + Tambah Provinsi
                </span>
              </button>

              {pickerOpen && (
                <div className="absolute left-0 top-full mt-2 w-[280px] max-h-[320px] overflow-y-auto bg-[#001e2e] border border-white/20 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 backdrop-blur-xl">
                  {allProvinces.map((p) => {
                    const isAlready = selectedProvinceNames.includes(p.name);
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => handleSelectProvince(p.name)}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-geist flex items-center justify-between cursor-pointer transition-colors ${
                          isAlready
                            ? 'bg-[#0db8d3]/20 text-[#4bd7f3] font-semibold'
                            : 'text-[#cae6fc] hover:bg-white/5'
                        }`}
                      >
                        <span>{p.name}</span>
                        <span className="font-mono-tech text-[10px] text-[#869397]">
                          #{p.rank}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Benchmark Toggle Switch */}
          <div className="bg-[rgba(0,30,46,0.7)] flex gap-[12px] items-center px-[16px] py-[6px] rounded-full w-fit border border-white/5">
            <button
              type="button"
              onClick={() => setShowBenchmark((prev) => !prev)}
              className="relative cursor-pointer"
            >
              <div
                className={`h-[24px] w-[44px] rounded-full transition-colors ${
                  showBenchmark ? 'bg-[#0db8d3]' : 'bg-[#1c3849]'
                }`}
              />
              <div
                className={`absolute top-[2px] size-[20px] rounded-full transition-transform ${
                  showBenchmark
                    ? 'left-[22px] bg-[#00444f]'
                    : 'left-[2px] bg-[#869397]'
                }`}
              />
            </button>
            <span className="font-mono-tech font-medium text-[#cae6fc] text-[12px] tracking-[0.72px]">
              Rata-Rata Nasional{' '}
              <strong className="font-mono-tech font-bold text-[#4bd7f3]">(68.4%)</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Section - Side-by-Side Comparison Matrix (3 Columns Grid) (Figma node 117:592) */}
      <section
        data-node-id="117:592"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] w-full relative z-10"
      >
        {selectedProvinces.map((prov, idx) => {
          const theme = CARD_THEMES[idx % CARD_THEMES.length];
          const subregionTag =
            prov.name === 'DKI Jakarta'
              ? 'METROPOLITAN BARAT · RANK 1/38'
              : prov.name === 'DI Yogyakarta'
              ? 'JAWA TENGAH-SELATAN · RANK 2/38'
              : prov.name === 'Papua Pegunungan'
              ? 'WILAYAH ADAT LAPAGO · RANK 38/38'
              : `${prov.geo?.region?.toUpperCase() || 'WILAYAH'} · RANK ${prov.rank}/38`;

          const statusBadge =
            prov.overallScore >= 90
              ? 'PARIPURNA'
              : prov.overallScore >= 80
              ? 'SANGAT BAIK'
              : prov.overallScore >= 65
              ? 'BAIK'
              : prov.overallScore >= 45
              ? 'TERBATAS'
              : 'PRIORITAS 3T';

          return (
            <div
              key={prov.name}
              className={`backdrop-blur-[24px] bg-[rgba(15,45,61,0.4)] flex flex-col justify-between overflow-hidden p-[24px] rounded-[16px] border border-white/10 ${theme.cardBorder}`}
            >
              <div className="flex flex-col gap-[16px] w-full">
                {/* Header Subregion & Status Badge */}
                <div className="flex items-start justify-between w-full">
                  <div className="flex flex-col gap-[4.5px] pt-[5.5px]">
                    <span className="font-mono-tech font-medium text-[#bcc9cd] text-[10px] tracking-[1px] uppercase">
                      {subregionTag}
                    </span>
                    <h2 className="font-space font-bold text-[#cae6fc] text-[24px] leading-[32px] tracking-[0.48px] uppercase">
                      {prov.name}
                    </h2>
                  </div>
                  <div className={`${theme.badgeBg} px-[10px] py-[4px] rounded-full`}>
                    <span
                      className={`font-mono-tech font-medium text-[12px] tracking-[0.6px] uppercase ${theme.badgeText}`}
                    >
                      {statusBadge}
                    </span>
                  </div>
                </div>

                {/* Big Score Box */}
                <div className="bg-[rgba(0,16,27,0.5)] flex gap-[8px] items-baseline p-[16px] rounded-[48px] w-full border border-white/5">
                  <span
                    className={`font-space font-bold text-[36px] leading-[36px] tracking-[1.44px] ${theme.scoreText}`}
                  >
                    {prov.overallScore}%
                  </span>
                  <span className="font-geist font-normal text-[#bcc9cd] text-[12px]">
                    Indeks Kesiapan Sarpras Dasar
                  </span>
                </div>

                {/* Metric Breakdown Bars */}
                <div className="flex flex-col gap-[8px] pt-[8px] w-full">
                  {INDICATOR_ROWS.map((ind) => {
                    const val = prov.indicators?.[ind.key]?.total ?? 0;
                    return (
                      <div key={ind.key} className="flex flex-col gap-[4px] w-full">
                        <div className="flex items-start justify-between w-full">
                          <span className="font-mono-tech font-medium text-[#cae6fc] text-[10px] tracking-[0.8px]">
                            {ind.label}
                          </span>
                          <span
                            className={`font-mono-tech font-bold text-[10px] tracking-[0.8px] ${theme.scoreText}`}
                          >
                            {val}%
                          </span>
                        </div>
                        <div className="bg-[#1c3849] h-[8px] rounded-full overflow-hidden w-full">
                          <div
                            className={`h-full rounded-full ${theme.barGradient}`}
                            style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Split Segment: Negeri vs Swasta (Figma node 117:647) */}
              <div className="pt-[16px] w-full">
                <div className="bg-[rgba(0,30,46,0.6)] flex flex-col gap-[4px] pb-[12px] pt-[8px] px-[12px] rounded-[48px] w-full border border-white/5">
                  <div className="flex items-center justify-between pb-[2px] w-full">
                    <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.8px] uppercase">
                      KESIAPAN: NEGERI VS SWASTA
                    </span>
                    <span className="font-mono-tech font-medium text-[#cae6fc] text-[10px] tracking-[0.8px]">
                      {prov.indicators?.komputer?.negeri ?? 0}% ·{' '}
                      {prov.indicators?.komputer?.swasta ?? 0}%
                    </span>
                  </div>
                  <div className="flex gap-[4px] items-center w-full">
                    <div className="bg-[#00101b] flex-1 h-[6px] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${theme.splitBar}`}
                        style={{
                          width: `${prov.indicators?.komputer?.negeri ?? 50}%`
                        }}
                      />
                    </div>
                    <div className="bg-[#00101b] flex-1 h-[6px] rounded-full overflow-hidden">
                      <div
                        className="bg-[#0076d2] h-full rounded-full"
                        style={{
                          width: `${prov.indicators?.komputer?.swasta ?? 50}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Section - Comparative Grouped Bar Chart (Figma node 117:811) */}
      <section
        data-node-id="117:811"
        className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] border border-white/10 flex flex-col gap-[24px] p-[32px] rounded-[24px] shadow-xl w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[1px] uppercase">
              VISUALISASI MATRIKS 7 INDIKATOR
            </span>
            <h3 className="font-space font-bold text-[#cae6fc] text-[24px] tracking-[-0.4px]">
              GRAFIK PERBANDINGAN KOMPARATIF INDIKATOR
            </h3>
          </div>
          <button
            type="button"
            onClick={() => exportDatasetToCSV('perbandingan-antar-provinsi-sdi.csv')}
            className="bg-[rgba(28,56,73,0.6)] hover:bg-[#0db8d3] hover:text-[#00363f] transition-all border border-white/10 flex items-center gap-2 px-[16px] py-[8px] rounded-full cursor-pointer text-xs font-mono-tech text-[#cae6fc]"
          >
            <img src={imgContainer2} alt="" className="size-[12px]" />
            <span>Ekspor Dataset (.CSV)</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-[20px] items-center pt-2">
          {selectedProvinces.map((prov, idx) => {
            const theme = CARD_THEMES[idx % CARD_THEMES.length];
            return (
              <div key={prov.name} className="flex items-center gap-2">
                <div
                  className="rounded-full size-[10px]"
                  style={{ backgroundColor: theme.dot }}
                />
                <span className="font-mono-tech text-xs text-[#cae6fc]">{prov.name}</span>
              </div>
            );
          })}
          {showBenchmark && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-0.5 border-t border-dashed border-[#4bd7f3]" />
              <span className="font-mono-tech text-xs text-[#4bd7f3]">
                Garis Benchmark SDI (68.4%)
              </span>
            </div>
          )}
        </div>

        {/* 7 Grouped Bar Columns Container */}
        <div className="relative pt-6 pb-2 w-full overflow-x-auto">
          {/* Dashed Benchmark Line */}
          {showBenchmark && (
            <div
              className="absolute inset-x-0 border-t border-dashed border-[#4bd7f3]/50 pointer-events-none z-10"
              style={{ bottom: '124px' }}
            >
              <span className="absolute right-0 -top-5 font-mono-tech text-[10px] text-[#4bd7f3] bg-[#001e2e]/90 px-2 py-0.5 rounded">
                Benchmark SDI: 68.4%
              </span>
            </div>
          )}

          <div className="grid grid-cols-7 gap-3 sm:gap-4 min-w-[800px] h-[260px] items-end pb-8">
            {CHART_ITEMS.map((item) => {
              return (
                <div
                  key={item.key}
                  className={`flex flex-col items-center justify-end h-full p-2 rounded-xl transition-all ${
                    item.isHighlighted
                      ? 'bg-[rgba(13,184,211,0.08)] border border-[rgba(75,215,243,0.3)] shadow-[0_0_16px_rgba(13,184,211,0.15)]'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Bars grouped per active province with generous spacing & anti-collision vertical stagger */}
                  <div className="flex items-end justify-center gap-3 sm:gap-3.5 w-full h-[175px] pb-2 px-1">
                    {selectedProvinces.map((prov, pIdx) => {
                      const theme = CARD_THEMES[pIdx % CARD_THEMES.length];
                      const val = getIndicatorVal(prov, item.key);
                      const displayVal = Number.isInteger(val) ? val : Number(val.toFixed(1));
                      const heightPercent = Math.min(100, Math.max(8, val));

                      // Check if any neighboring bar in this group has a close value (< 4%)
                      const hasCloseSibling = selectedProvinces.some((other, oIdx) => {
                        if (oIdx === pIdx) return false;
                        const otherVal = getIndicatorVal(other, item.key);
                        return Math.abs(val - otherVal) < 4;
                      });

                      // When values are very close, elevate the middle/staggered label so they never collide
                      const labelElevated = hasCloseSibling && pIdx % 2 === 1;

                      return (
                        <div
                          key={prov.name}
                          className="flex flex-col items-center h-full justify-end w-[24px] sm:w-[26px] relative"
                        >
                          <span
                            className={`font-mono-tech text-[9.5px] font-semibold leading-none whitespace-nowrap transition-all duration-200 z-10 ${
                              labelElevated ? 'mb-3.5' : 'mb-1'
                            }`}
                            style={{ color: theme.dot }}
                          >
                            {displayVal}%
                          </span>
                          <div
                            className="w-full rounded-t-md transition-all duration-300 shadow-sm"
                            style={{
                              height: `${heightPercent}%`,
                              backgroundColor: theme.dot
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <span className="font-geist font-medium text-[11px] text-[#cae6fc] text-center truncate w-full pt-1">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Two Bottom Insight Cards (Figma nodes 117:945 & 117:959) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
        {/* Card 1 */}
        <div
          data-node-id="117:945"
          className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.5)] border border-white/10 flex items-start gap-4 p-[24px] rounded-[20px] shadow-lg"
        >
          <div className="bg-[rgba(147,0,10,0.2)] rounded-full size-[44px] flex items-center justify-center shrink-0">
            <img src={imgBackground} alt="" className="size-[20px]" />
          </div>
          <div>
            <h4 className="font-space font-semibold text-[#cae6fc] text-[16px] leading-[24px]">
              Anomali Pasokan Daya &amp; Laboratorium TIK di Wilayah 3T
            </h4>
            <p className="font-geist text-[#bcc9cd] text-[13px] leading-[20px] mt-1">
              Papua Pegunungan mencatat kesenjangan ketersediaan listrik 81.6 poin di bawah DKI
              Jakarta, yang secara langsung membatasi pemanfaatan perangkat laboratorium komputer
              sekolah meskipun bantuan chromebook telah disalurkan.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div
          data-node-id="117:959"
          className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.5)] border border-white/10 flex items-start gap-4 p-[24px] rounded-[20px] shadow-lg"
        >
          <div className="bg-[rgba(13,184,211,0.2)] rounded-full size-[44px] flex items-center justify-center shrink-0">
            <img src={imgBackground1} alt="" className="size-[20px]" />
          </div>
          <div>
            <h4 className="font-space font-semibold text-[#cae6fc] text-[16px] leading-[24px]">
              Sinergi DAK Fisik Afirmasi &amp; Penetrasi Terminal Satelit
            </h4>
            <p className="font-geist text-[#bcc9cd] text-[13px] leading-[20px] mt-1">
              Akselerasi digitalisasi sekolah di wilayah terpencil memerlukan integrasi program DAK
              Fisik penyediaan panel surya off-grid dan penempatan terminal internet satelit
              Orbit/Starlink sebelum program pengadaan TIK digulirkan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
