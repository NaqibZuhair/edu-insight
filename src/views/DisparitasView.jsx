import { useState, useMemo } from 'react';
import {
  getDisparityAnalytics,
  exportDatasetToCSV
} from '../utils/dataService';
import { formatNumberID, formatPercentID } from '../constants/labels';
import { Reveal, useCountUp, AnimatedBar } from '../components/MotionPrimitives';
import { MOTION_TOKENS } from '../constants/motionTokens';
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

  // Count-up untuk 4 kartu KPI Disparitas
  const { ref: kpiGapRef, value: kpiGapValue } = useCountUp(analytics.nationalGap, {
    decimals: 1,
    prefix: '+',
    suffix: '%',
    delay: 0
  });
  const { ref: kpiHighestRef, value: kpiHighestValue } = useCountUp(
    analytics.highestDisparity?.gap ?? 41.03,
    {
      decimals: 2,
      prefix: '+',
      suffix: '%',
      delay: 70
    }
  );
  const { ref: kpiRRef, value: kpiRValue } = useCountUp(analytics.regression?.r ?? 0.782, {
    decimals: 3,
    delay: 140
  });
  const { ref: kpiR2Ref, value: kpiR2Value } = useCountUp(analytics.regression?.r2 ?? 0.611, {
    decimals: 3,
    delay: 210
  });

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

  const top5Rows = useMemo(() => {
    return analytics.top5Disparity.slice(0, 5);
  }, [analytics]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      data-node-id="117:998"
      className="flex flex-col gap-[36px] sm:gap-[48px] items-center max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-[20px] sm:py-[24px] w-full"
    >
      {/* Top Breadcrumb & Page Header (Figma node 117:1003) */}
      <section data-node-id="117:1003" className="flex flex-col gap-[20px] sm:gap-[24px] w-full">
        {/* Breadcrumb */}
        <Reveal delay={0} className="flex flex-wrap gap-[8px] items-center">
          <div className="backdrop-blur-[12px] bg-[rgba(15,45,61,0.8)] border border-white/10 flex items-center gap-[8px] px-[12px] py-[4px] rounded-full">
            <div className="bg-[#0db8d3] rounded-full size-[6px] shrink-0" />
            <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[0.5px] uppercase">
              ANALISIS DISPARITAS &amp; KORELASI SOSIO-EKONOMI · DATA SDI 2023
            </span>
          </div>
          <span className="font-mono-tech text-[#869397] text-[10px]">/</span>
          <span className="font-mono-tech font-medium text-[#bcc9cd] text-[10px] tracking-[0.5px] uppercase">
            38 PROVINSI
          </span>
        </Reveal>

        {/* Title & Action Buttons */}
        <Reveal
          delay={60}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 w-full"
        >
          <div className="flex flex-col gap-[8px]">
            <h1 className="font-space font-bold text-[#cae6fc] text-2xl sm:text-4xl lg:text-[52px] leading-[1.14] tracking-[1px] sm:tracking-[1.5px] uppercase max-w-[800px]">
              DISPARITAS SEKOLAH NEGERI VS SWASTA
            </h1>
            <p className="font-geist font-normal text-[#bcc9cd] text-sm sm:text-base leading-[24px] sm:leading-[26px] max-w-[740px]">
              Evaluasi kesenjangan pemenuhan sarana dan prasarana antara sekolah negeri dan swasta di
              38 provinsi, serta korelasinya terhadap Indeks Pembangunan Manusia (IPM).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-[12px] w-full sm:w-auto self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="hover-lift bg-[rgba(28,56,73,0.6)] hover:bg-[rgba(28,56,73,0.9)] border border-white/10 flex items-center justify-center gap-[8px] px-[16px] py-[10px] min-h-[44px] rounded-full text-xs font-mono-tech text-[#cae6fc] cursor-pointer"
            >
              <img src={ICON_PRINT} alt="" className="size-[14px]" />
              <span>Cetak Ringkasan</span>
            </button>
            <button
              type="button"
              onClick={() => exportDatasetToCSV('disparitas-negeri-swasta-sdi.csv')}
              className="hover-lift bg-[#0db8d3] hover:bg-[#4bd7f3] text-[#00444f] flex items-center justify-center gap-[8px] px-[18px] py-[10px] min-h-[44px] rounded-full text-xs font-mono-tech font-bold cursor-pointer shadow-[0_0_12px_rgba(13,184,211,0.35)]"
            >
              <img src={ICON_EXPORT} alt="" className="size-[12px]" />
              <span>Unduh Data (.CSV)</span>
            </button>
          </div>
        </Reveal>

        {/* Filter / Indicator Selector Pill Tabs (Figma node 117:1029) */}
        <Reveal
          delay={120}
          data-node-id="117:1029"
          role="tablist"
          aria-label="Pilih indikator analisis disparitas"
          className="flex flex-wrap gap-2 items-center pt-1 w-full"
        >
          {INDICATOR_TABS.map((tab) => {
            const isActive = selectedIndicator === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedIndicator(tab.key)}
                className={`hover-lift flex items-center gap-[8px] px-[14px] sm:px-[16px] py-[10px] min-h-[44px] rounded-full cursor-pointer w-full sm:w-auto justify-start sm:justify-center ${
                  isActive
                    ? 'bg-[#0db8d3] text-[#00444f] font-geist font-semibold text-xs sm:text-[14px] shadow-[0_0_12px_rgba(13,184,211,0.3)]'
                    : 'bg-[rgba(15,45,61,0.5)] hover:bg-[rgba(15,45,61,0.8)] border border-white/5 text-[#bcc9cd] font-geist text-xs sm:text-[13px]'
                }`}
              >
                <img src={tab.icon} alt="" className="size-[14px] shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </Reveal>

        {/* KPI Telemetry Bar (Figma node 117:1055) */}
        <div
          data-node-id="117:1055"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-2"
        >
          {/* Card 1: Rata-Rata Kesenjangan Nasional */}
          <Reveal
            delay={0}
            className="hover-lift backdrop-blur-[24px] bg-[rgba(15,45,61,0.6)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg"
          >
            <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
              RATA-RATA KESENJANGAN NASIONAL
            </span>
            <div className="flex items-baseline gap-2 py-2">
              <span
                ref={kpiGapRef}
                className="font-space font-bold text-[#4bd7f3] text-[28px] leading-tight"
              >
                {kpiGapValue}
              </span>
              <span className="font-mono-tech font-medium text-[#bcc9cd] text-[11px]">
                Negeri Unggul
              </span>
            </div>
            <div className="bg-[#00101b] h-[6px] rounded-full overflow-hidden w-full">
              <AnimatedBar
                percent={Math.min(100, analytics.nationalGap * 2.5)}
                direction="horizontal"
                delay={120}
                className="bg-gradient-to-r from-[#0076d2] to-[#4bd7f3] rounded-full"
              />
            </div>
          </Reveal>

          {/* Card 2: Disparitas Tertinggi */}
          <Reveal
            delay={MOTION_TOKENS.stagger.card}
            className="hover-lift backdrop-blur-[24px] bg-[rgba(15,45,61,0.6)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg"
          >
            <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
              DISPARITAS TERTINGGI
            </span>
            <div className="flex items-baseline gap-2 py-2">
              <span
                ref={kpiHighestRef}
                className="font-space font-bold text-[#ffb4ab] text-[28px] leading-tight"
              >
                {kpiHighestValue}
              </span>
              <span className="font-mono-tech font-medium text-[#cae6fc] text-[12px] truncate">
                {analytics.highestDisparity?.name}
              </span>
            </div>
            <span className="font-mono-tech text-[#bcc9cd] text-[11px]">
              Negeri: {formatPercentID(analytics.highestDisparity?.negeri)} · Swasta:{' '}
              {formatPercentID(analytics.highestDisparity?.swasta)}
            </span>
          </Reveal>

          {/* Card 3: Koefisien Korelasi IPM (r) */}
          <Reveal
            delay={MOTION_TOKENS.stagger.card * 2}
            className="hover-lift backdrop-blur-[24px] bg-[rgba(15,45,61,0.6)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg"
          >
            <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
              KOEFISIEN KORELASI IPM (R)
            </span>
            <div className="flex items-baseline gap-2 py-2">
              <span
                ref={kpiRRef}
                className="font-space font-bold text-[#a4c9ff] text-[28px] leading-tight"
              >
                {kpiRValue}
              </span>
              <span className="font-mono-tech font-medium text-[#bcc9cd] text-[11px]">
                Kuat Positif
              </span>
            </div>
            <span className="font-mono-tech text-[#bcc9cd] text-[11px]">
              nilai-p &lt; 0,001 (Signifikan)
            </span>
          </Reveal>

          {/* Card 4: Koefisien Determinasi (R²) */}
          <Reveal
            delay={MOTION_TOKENS.stagger.card * 3}
            className="hover-lift backdrop-blur-[24px] bg-[rgba(15,45,61,0.6)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg"
          >
            <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
              KOEFISIEN DETERMINASI (R²)
            </span>
            <div className="flex items-baseline gap-2 py-2">
              <span
                ref={kpiR2Ref}
                className="font-space font-bold text-[#4bd7f3] text-[28px] leading-tight"
              >
                {kpiR2Value}
              </span>
              <span className="font-mono-tech font-medium text-[#bcc9cd] text-[11px]">
                Varians Terjelaskan
              </span>
            </div>
            <span className="font-mono-tech text-[#bcc9cd] text-[11px]">
              {Math.round(analytics.regression?.r2 * 100)}% IPM berkorelasi dengan TIK
            </span>
          </Reveal>
        </div>
      </section>

      {/* SECTION 1: 5 Provinsi Kesenjangan Tertinggi (Figma node 117:1089) */}
      <Reveal
        delay={80}
        data-node-id="117:1089"
        className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] border border-white/10 flex flex-col gap-[20px] sm:gap-[24px] p-4 sm:p-6 lg:p-[32px] rounded-[24px] shadow-xl w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
          <div>
            <div className="bg-[#032232] inline-flex px-[10px] py-[3px] rounded-full border border-white/5 mb-2">
              <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[1px] uppercase">
                PERINGKAT DISPARITAS
              </span>
            </div>
            <h2 className="font-space font-bold text-[#cae6fc] text-xl sm:text-[28px] leading-snug sm:leading-[36px]">
              5 Provinsi Kesenjangan Tertinggi (|Negeri - Swasta|)
            </h2>
            <p className="font-geist text-[#bcc9cd] text-xs sm:text-[14px] mt-1">
              Provinsi dengan disparitas paling lebar dalam ketersediaan fasilitas komputer sekolah
              antara satuan pendidikan negeri dan swasta.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-[20px] self-start md:self-auto shrink-0">
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

        {/* 5 Ranked Rows with Stagger & AnimatedBar (scaleX) */}
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
              <Reveal
                key={row.name}
                delay={idx * MOTION_TOKENS.stagger.tableRow}
                className="hover-lift bg-[rgba(15,45,61,0.5)] border border-white/5 hover:border-[#4bd7f3]/35 flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 sm:p-[20px] rounded-[16px] gap-4"
              >
                {/* Left Rank & Province Name */}
                <div className="flex items-center gap-3.5 sm:gap-4 w-full lg:w-auto lg:min-w-[230px]">
                  <div className="bg-[rgba(0,16,27,0.7)] border border-white/10 rounded-full size-[40px] flex items-center justify-center shrink-0">
                    <span className="font-mono-tech font-bold text-[#4bd7f3] text-[16px]">
                      {rankStr}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-space font-semibold text-[#cae6fc] text-base sm:text-[18px] truncate">
                      {row.name}
                    </h3>
                    <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px]">
                      {kabKotaText}
                    </span>
                  </div>
                </div>

                {/* Center Stats & Divergence Track */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1 w-full lg:max-w-[620px]">
                  {/* Negeri vs Swasta numbers */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex flex-col">
                      <span className="font-mono-tech text-[10px] text-[#869397]">Negeri</span>
                      <span className="font-mono-tech font-bold text-[#4bd7f3] text-base sm:text-[18px]">
                        {formatPercentID(row.negeri, 2)}
                      </span>
                    </div>
                    <span className="text-[#869397] text-xs font-mono-tech">vs</span>
                    <div className="flex flex-col">
                      <span className="font-mono-tech text-[10px] text-[#869397]">Swasta</span>
                      <span className="font-mono-tech font-bold text-[#a4c9ff] text-base sm:text-[18px]">
                        {formatPercentID(row.swasta, 2)}
                      </span>
                    </div>
                  </div>

                  {/* Dual Divergence Bar (scaleX animation) */}
                  <div className="flex flex-col gap-1 w-full flex-1">
                    <div className="flex items-center justify-between text-[10px] font-mono-tech">
                      <span className="text-[#bcc9cd]">Divergensi Sarana</span>
                      <span className="text-[#4bd7f3]">
                        Selisih: {formatNumberID(row.gap, 2)} poin
                      </span>
                    </div>
                    <div className="h-[12px] bg-[rgba(0,16,27,0.8)] rounded-full overflow-hidden flex w-full p-0.5 gap-0.5">
                      <div
                        className="h-full overflow-hidden rounded-l-full"
                        style={{ width: `${Math.min(100, row.swasta)}%` }}
                      >
                        <AnimatedBar
                          percent={100}
                          direction="horizontal"
                          delay={idx * 55 + 80}
                          className="bg-[#0076d2] rounded-l-full"
                          title={`Swasta: ${formatPercentID(row.swasta, 2)}`}
                        />
                      </div>
                      <div
                        className="h-full overflow-hidden rounded-r-full"
                        style={{ width: `${Math.min(100, row.gap)}%` }}
                      >
                        <AnimatedBar
                          percent={100}
                          direction="horizontal"
                          delay={idx * 55 + 160}
                          className="bg-[#4bd7f3] rounded-r-full shadow-[0_0_8px_#4bd7f3]"
                          title={`Selisih Dominan: +${formatPercentID(row.gap, 2)}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Dominance Badge */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full lg:w-auto shrink-0">
                  <div className="bg-[rgba(13,184,211,0.12)] border border-[rgba(75,215,243,0.3)] px-[12px] py-[6px] rounded-full flex items-center gap-1.5">
                    <span className="font-mono-tech font-bold text-[#4bd7f3] text-[11px] whitespace-nowrap">
                      ↗ +{formatPercentID(row.gap, 2)} Negeri Dominan
                    </span>
                  </div>
                  {onAddProvinceToCompare && (
                    <button
                      type="button"
                      onClick={() => {
                        onAddProvinceToCompare(row.name);
                        if (onNavigate) onNavigate('perbandingan');
                      }}
                      aria-label={`Bandingkan provinsi ${row.name}`}
                      title={`Bandingkan ${row.name}`}
                      className="min-w-[44px] min-h-[44px] rounded-full bg-[rgba(15,45,61,0.8)] border border-white/10 flex items-center justify-center hover:bg-[#0db8d3] hover:text-[#00363f] transition-colors cursor-pointer shrink-0"
                    >
                      <ArrowUpRight className="size-4" />
                    </button>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Anomaly Card: DI Yogyakarta (Swasta Dominan) (Figma node 117:1309) */}
        <div
          data-node-id="117:1309"
          className="bg-[rgba(15,45,61,0.6)] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-[16px] gap-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-[#4bd7f3] text-base mt-0.5 shrink-0">ⓘ</span>
            <p className="font-geist text-xs text-[#bcc9cd] leading-relaxed max-w-[960px]">
              <strong className="text-[#4bd7f3]">Kontras Terbalik:</strong> DI Yogyakarta
              mencatatkan kesenjangan negatif di mana swasta justru mengungguli negeri (-0,45% Swasta
              Dominan; Negeri: 90,15% vs Swasta: 90,60%). DKI Jakarta berada pada selisih terendah
              (+2,10%).
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onAddProvinceToCompare) onAddProvinceToCompare('DI Yogyakarta');
              if (onNavigate) onNavigate('perbandingan');
            }}
            className="hover-lift w-full md:w-auto min-h-[44px] bg-[#1c3849] hover:bg-[#0db8d3] hover:text-[#00363f] px-4 py-2 rounded-full font-mono-tech text-xs text-[#cae6fc] whitespace-nowrap cursor-pointer border border-white/10 text-center"
          >
            Analisis Wilayah Jawa →
          </button>
        </div>
      </Reveal>

      {/* SECTION 2: Correlation Scatter Plot Section (Figma node 117:1317) */}
      <Reveal
        delay={100}
        data-node-id="117:1317"
        className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] border border-white/10 flex flex-col gap-[20px] sm:gap-[24px] p-4 sm:p-6 lg:p-[32px] rounded-[24px] shadow-xl w-full"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 w-full">
          <div>
            <div className="bg-[#032232] inline-flex px-[10px] py-[3px] rounded-full border border-white/5 mb-2">
              <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[1px] uppercase">
                ANALISIS REGRESI &amp; KORELASI
              </span>
            </div>
            <h2 className="font-space font-bold text-[#cae6fc] text-xl sm:text-[28px] leading-snug sm:leading-[36px]">
              Korelasi Kesiapan TIK Sekolah vs Indeks Pembangunan Manusia (IPM)
            </h2>
            <p className="font-geist text-[#bcc9cd] text-xs sm:text-[14px] mt-1">
              Diagram sebar 38 provinsi menunjukkan korelasi positif kuat (r = 0,782) antara fasilitas
              TIK dengan IPM daerah.
            </p>
          </div>

          <button
            type="button"
            onClick={() => exportDatasetToCSV('korelasi-tik-vs-ipm-sdi.csv')}
            className="hover-lift w-full sm:w-auto min-h-[44px] bg-[rgba(28,56,73,0.6)] hover:bg-[#0db8d3] hover:text-[#00363f] border border-white/10 flex items-center justify-center gap-2 px-4 py-2 rounded-full cursor-pointer text-xs font-mono-tech text-[#cae6fc] self-start lg:self-auto"
          >
            <img src={ICON_CSV_MATRIX} alt="" className="size-[12px]" />
            <span>Unduh Matriks (.CSV)</span>
          </button>
        </div>

        {/* Filter Region Pills & Legend */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap gap-2">
            {REGION_PILLS.map((reg) => {
              const isActive = selectedRegion === reg;
              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setSelectedRegion(reg)}
                  className={`hover-lift px-3.5 py-2 min-h-[40px] rounded-full text-xs font-geist cursor-pointer ${
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
              <span>Garis Regresi (r = 0,782)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#869397]" />
              <span>Tolok Ukur IPM 72,8</span>
            </div>
          </div>
        </div>

        {/* Interactive Scatter Plot Canvas (Tanpa Card Mengambang yang Menghalangi Titik/Garis) */}
        <div className="relative bg-[rgba(0,16,27,0.85)] border border-white/10 rounded-[16px] p-4 sm:p-6 h-[320px] sm:h-[430px] w-full overflow-hidden">
          {/* Y-Axis Labels (IPM Daerah: Bawah = Rendah, Atas = Tinggi) */}
          <div className="absolute left-2 sm:left-3 top-6 bottom-8 flex flex-col justify-between pointer-events-none z-10 text-[9px] sm:text-[10px] font-mono-tech text-[#869397]">
            <span>IPM 85 ↑</span>
            <span>80</span>
            <span>75</span>
            <span>70</span>
            <span>65</span>
            <span>IPM 60 ↓</span>
          </div>

          {/* X-Axis Labels (Fasilitas TIK: Kiri = Rendah, Kanan = Tinggi) */}
          <div className="absolute left-12 sm:left-14 right-4 sm:right-6 bottom-2 flex items-center justify-between pointer-events-none z-10 text-[9px] sm:text-[10px] font-mono-tech text-[#869397]">
            <span>← 15% (TIK Rendah)</span>
            <span className="hidden sm:inline">35%</span>
            <span>55%</span>
            <span className="hidden sm:inline">75%</span>
            <span>95%+ (TIK Tinggi) →</span>
          </div>

          {/* Background Grid Lines */}
          <div className="absolute inset-0 left-10 sm:left-12 right-4 top-6 bottom-8 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-white/20 w-full" />
            <div className="border-b border-white/20 w-full" />
            <div className="border-b border-white/20 w-full" />
            <div className="border-b border-white/20 w-full" />
            <div className="border-b border-white/20 w-full" />
          </div>

          {/* SVG Trendline & Benchmark Line */}
          <svg className="absolute inset-0 size-full pointer-events-none z-0">
            {/* Garis Tolok Ukur IPM Nasional 72,8 */}
            <line
              x1="8%"
              y1="49%"
              x2="94%"
              y2="49%"
              stroke="#869397"
              strokeWidth="1"
              strokeDasharray="3 5"
              opacity="0.45"
            />
            {/* Garis Regresi Linier (r = 0,782) */}
            <line
              x1="8%"
              y1="82%"
              x2="92%"
              y2="18%"
              stroke="#4bd7f3"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.85"
            />
          </svg>

          {/* Scatter Points for filtered rows */}
          <div className="relative size-full z-10">
            {filteredScatterRows.map((p) => {
              const leftPercent = 8 + ((p.tikScore - 15) / 85) * 82;
              const bottomPercent = 15 + ((p.ipm - 60) / 25) * 70;
              const isSelected = p.name.toLowerCase() === selectedScatterProvince.toLowerCase();

              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setSelectedScatterProvince(p.name)}
                  aria-label={`Pilih titik data ${p.name} (TIK: ${formatPercentID(
                    p.tikScore
                  )}, IPM: ${formatNumberID(p.ipm, 2)})`}
                  className={`group absolute rounded-full transition-transform duration-200 cursor-pointer -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-2 ${
                    isSelected ? 'z-30 scale-125' : 'hover:scale-150 z-20'
                  }`}
                  style={{
                    left: `${Math.max(8, Math.min(94, leftPercent))}%`,
                    bottom: `${Math.max(10, Math.min(90, bottomPercent))}%`
                  }}
                  title={`${p.name} (TIK: ${formatPercentID(p.tikScore)}, IPM: ${formatNumberID(
                    p.ipm,
                    2
                  )})`}
                >
                  <span
                    className={`block rounded-full ${
                      isSelected
                        ? 'size-[14px] bg-[#ffb4ab] ring-4 ring-[#ffb4ab]/40'
                        : 'size-[10px] bg-[#4bd7f3] group-hover:bg-white'
                    }`}
                  />
                  {/* Label Nama Provinsi Ringkas hanya pada Titik yang Dipilih */}
                  {isSelected && (
                    <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#00101b]/90 border border-[#ffb4ab]/50 px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-[#cae6fc] shadow-md">
                      {p.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bar Detail Provinsi Terpilih di Luar Kanvas Grafik (Tidak Menghalangi Titik / Garis Regresi) */}
        {(() => {
          const expectedIpm = 61.2 + 0.18 * (activeTooltipRow?.tikScore || 0);
          const residual = (activeTooltipRow?.ipm || 0) - expectedIpm;
          const linePositionLabel =
            residual > 1.5
              ? 'Di Atas Garis Regresi (IPM Melampaui Prediksi TIK)'
              : residual < -1.5
              ? 'Di Bawah Garis Regresi (Pencilan / Perlu Afirmasi)'
              : 'Tepat / Dekat Garis Regresi (Sesuai Ekspektasi Tren)';
          const lineBadgeClass =
            residual > 1.5
              ? 'bg-[#0db8d3]/20 text-[#4bd7f3] border border-[#4bd7f3]/30'
              : residual < -1.5
              ? 'bg-[#93000a] text-[#ffdad6]'
              : 'bg-[#1c3849] text-[#a4c9ff] border border-[#a4c9ff]/30';

          return (
            <div className="backdrop-blur-xl bg-[rgba(15,45,61,0.85)] border border-[#4bd7f3]/30 rounded-2xl p-4 shadow-lg w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="size-3 rounded-full bg-[#ffb4ab] ring-4 ring-[#ffb4ab]/25 shrink-0" />
                <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#869397]">
                  TITIK TERPILIH:
                </span>
                <span className="font-space font-bold text-base text-[#cae6fc]">
                  {activeTooltipRow.name}
                </span>
                <span
                  className={`text-[10px] font-mono-tech px-2.5 py-0.5 rounded-full ${lineBadgeClass}`}
                >
                  {linePositionLabel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs font-mono-tech">
                <div className="bg-[rgba(0,16,27,0.6)] px-3 py-2 rounded-xl border border-white/5">
                  <span className="block text-[10px] text-[#869397]">Sumbu X (Fasilitas TIK)</span>
                  <span className="text-[#cae6fc] font-semibold text-sm">
                    {formatPercentID(activeTooltipRow.tikScore)}
                  </span>
                </div>
                <div className="bg-[rgba(0,16,27,0.6)] px-3 py-2 rounded-xl border border-white/5">
                  <span className="block text-[10px] text-[#869397]">Sumbu Y (IPM Daerah)</span>
                  <span className="text-[#a4c9ff] font-semibold text-sm">
                    {formatNumberID(activeTooltipRow.ipm, 2)}
                  </span>
                </div>
                <div className="bg-[rgba(0,16,27,0.6)] px-3 py-2 rounded-xl border border-white/5">
                  <span className="block text-[10px] text-[#869397]">Disparitas Negeri-Swasta</span>
                  <span className="text-[#ffb4ab] font-semibold text-sm">
                    +{formatPercentID(activeTooltipRow.gap, 2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}

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
                (r = 0,782, nilai-p &lt; 0,001). Setiap peningkatan 10% fasilitas TIK diasosiasikan
                dengan kenaikan 1,8 poin IPM.
              </p>
            </div>
          </div>

          <div className="bg-[rgba(15,45,61,0.4)] border border-white/5 rounded-2xl p-4 flex items-start gap-3">
            <img src={ICON_TAKEAWAY_2} alt="" className="size-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-space font-semibold text-sm text-[#cae6fc]">
                Pencilan Wilayah Timur: Anomali Maluku &amp; Papua Barat Daya
              </h4>
              <p className="font-geist text-xs text-[#bcc9cd] leading-relaxed mt-1">
                Provinsi Maluku dan Papua Barat Daya berada jauh di bawah garis tren regresi
                (pencilan), menunjukkan perlunya afirmasi sarana digital sekolah swasta
                non-pemerintah di kepulauan terluar.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* SECTION 3: Deep Dive Matrix Breakdown (38 Provinces Geographic Clusters) (Figma node 117:1517) */}
      <section
        data-node-id="117:1517"
        className="flex flex-col gap-[16px] pb-[16px] sm:pb-[24px] w-full"
      >
        <Reveal className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <div>
            <h2 className="font-space font-semibold text-[#cae6fc] text-xl sm:text-[24px] tracking-[0.48px]">
              Matriks Klaster Disparitas Regional
            </h2>
            <p className="font-geist font-normal text-[#bcc9cd] text-xs sm:text-[14px]">
              Perbandingan agregat kesenjangan per pulau/wilayah geografis
            </p>
          </div>
          <div className="bg-[rgba(15,45,61,0.6)] px-3 py-1 rounded-full border border-white/5 w-fit">
            <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
              AGREGASI SDI 2023
            </span>
          </div>
        </Reveal>

        {/* 3 Cluster Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] w-full">
          {/* Cluster 1: Maluku & Papua */}
          <Reveal
            delay={0}
            data-node-id="117:1527"
            className="hover-lift backdrop-blur-[24px] bg-[rgba(15,45,61,0.4)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg"
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
                <span className="font-geist font-bold text-[#4bd7f3]">+34,4%</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="font-geist text-[#869397]">Provinsi Terdampak:</span>
                <span className="font-geist font-medium text-[#cae6fc]">8 Provinsi</span>
              </div>
              <div className="bg-[rgba(0,16,27,0.8)] h-[6px] rounded-full overflow-hidden w-full mt-1">
                <AnimatedBar
                  percent={88}
                  direction="horizontal"
                  delay={100}
                  className="bg-[#ffb4ab] rounded-full"
                />
              </div>
            </div>
          </Reveal>

          {/* Cluster 2: Nusa Tenggara & Sulawesi */}
          <Reveal
            delay={MOTION_TOKENS.stagger.card}
            data-node-id="117:1550"
            className="hover-lift backdrop-blur-[24px] bg-[rgba(15,45,61,0.4)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg"
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
                <span className="font-geist font-bold text-[#4bd7f3]">+21,2%</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="font-geist text-[#869397]">Provinsi Terdampak:</span>
                <span className="font-geist font-medium text-[#cae6fc]">8 Provinsi</span>
              </div>
              <div className="bg-[rgba(0,16,27,0.8)] h-[6px] rounded-full overflow-hidden w-full mt-1">
                <AnimatedBar
                  percent={54}
                  direction="horizontal"
                  delay={170}
                  className="bg-[#a4c9ff] rounded-full"
                />
              </div>
            </div>
          </Reveal>

          {/* Cluster 3: Jawa, Bali & Sumatera */}
          <Reveal
            delay={MOTION_TOKENS.stagger.card * 2}
            data-node-id="117:1573"
            className="hover-lift backdrop-blur-[24px] bg-[rgba(15,45,61,0.4)] border border-white/10 flex flex-col justify-between p-[16px] rounded-[16px] shadow-lg"
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
                <span className="font-geist font-bold text-[#4bd7f3]">+4,6%</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="font-geist text-[#869397]">Provinsi Terdampak:</span>
                <span className="font-geist font-medium text-[#cae6fc]">22 Provinsi</span>
              </div>
              <div className="bg-[rgba(0,16,27,0.8)] h-[6px] rounded-full overflow-hidden w-full mt-1">
                <AnimatedBar
                  percent={14}
                  direction="horizontal"
                  delay={240}
                  className="bg-[#4bd7f3] rounded-full"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
