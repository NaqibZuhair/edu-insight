import { useState } from 'react';
import IndonesiaMapSection from '../components/IndonesiaMapSection';
import { exportDatasetToCSV } from '../utils/dataService';
import { Reveal, useCountUp, AnimatedBar } from '../components/MotionPrimitives';
import { MOTION_TOKENS } from '../constants/motionTokens';

// Exact Figma assets from steps/46/output.txt
const imgContainer = '/assets/figma/26c9645e-815d-4d27-8fa0-3b95a5ea47cb.svg';
const imgContainer1 = '/assets/figma/2ff36ed8-a828-4b0f-bfa5-d632a4ece2e6.svg';
const imgContainer2 = '/assets/figma/dced3b49-051b-49d5-a875-6ae3e4837ed6.svg';
const imgContainer3 = '/assets/figma/3cc342b2-aaa0-46eb-86dc-161b9c97a5cf.svg';
const imgContainer4 = '/assets/figma/aa442eb2-e732-41a2-993d-d845a20718ae.svg';
const imgContainer5 = '/assets/figma/6cd7aee9-f949-41f7-bbdf-299721a41b01.svg';
const imgContainer6 = '/assets/figma/2fa744e0-b202-4d0d-af4a-ff9148558746.svg';
const imgContainer8 = '/assets/figma/d0b59f2d-1f6e-442f-8958-fdf7f923a164.svg';
const imgContainer9 = '/assets/figma/f07a5334-5248-4a9c-a110-4cf4ba1c76c7.svg';
const imgContainer10 = '/assets/figma/3688e48f-0661-4917-b087-a753aba09434.svg';
const imgContainer11 = '/assets/figma/767d118a-2155-4b34-9fbd-640961e6c0fb.svg';

const TOP_5_ITEMS = [
  {
    rank: '#01',
    name: 'DKI Jakarta',
    region: 'Jawa',
    regionBadgeClass: 'bg-[rgba(75,215,243,0.1)] text-[#4bd7f3]',
    scoreStr: '94,8%',
    scoreNum: 94.8,
    barColorClass: 'bg-[#4bd7f3]',
    subtext: 'Lab TIK: 98,4% · Internet: 99,1%',
    status: 'Paripurna'
  },
  {
    rank: '#02',
    name: 'DI Yogyakarta',
    region: 'Jawa',
    regionBadgeClass: 'bg-[rgba(75,215,243,0.1)] text-[#4bd7f3]',
    scoreStr: '91,3%',
    scoreNum: 91.3,
    barColorClass: 'bg-[#4bd7f3]',
    subtext: 'Lab TIK: 93,2% · Internet: 95,8%',
    status: 'Sangat Baik'
  },
  {
    rank: '#03',
    name: 'Bali',
    region: 'Nusa Tenggara',
    regionBadgeClass: 'bg-[rgba(0,118,210,0.2)] text-[#a4c9ff]',
    scoreStr: '87,6%',
    scoreNum: 87.6,
    barColorClass: 'bg-[#0076d2]',
    subtext: 'Lab TIK: 88,0% · Internet: 92,4%',
    status: 'Baik'
  },
  {
    rank: '#04',
    name: 'Kepulauan Riau',
    region: 'Sumatera',
    regionBadgeClass: 'bg-[rgba(75,215,243,0.1)] text-[#4bd7f3]',
    scoreStr: '84,2%',
    scoreNum: 84.2,
    barColorClass: 'bg-[#0076d2]',
    subtext: 'Lab TIK: 82,5% · Internet: 89,0%',
    status: 'Baik'
  },
  {
    rank: '#05',
    name: 'Jawa Timur',
    region: 'Jawa',
    regionBadgeClass: 'bg-[rgba(75,215,243,0.1)] text-[#4bd7f3]',
    scoreStr: '81,9%',
    scoreNum: 81.9,
    barColorClass: 'bg-[#0076d2]',
    subtext: 'Lab TIK: 76,5% · Internet: 81,2%',
    status: 'Baik'
  }
];

const BOTTOM_5_ITEMS = [
  {
    rank: '#34',
    rankColor: 'text-[#cae6fc]',
    name: 'Nusa Tenggara Timur',
    region: 'Nusa Tenggara',
    regionBadgeClass: 'bg-[rgba(0,118,210,0.2)] text-[#a4c9ff]',
    scoreStr: '44,6%',
    scoreNum: 44.6,
    scoreColor: 'text-[#bcc9cd]',
    barColorClass: 'bg-[#3c494c]',
    subtext: 'Lab TIK: 41,2% · Listrik: 52,0%',
    status: 'Terbatas',
    statusColor: 'text-[#bcc9cd]'
  },
  {
    rank: '#35',
    rankColor: 'text-[#cae6fc]',
    name: 'Papua Barat Daya',
    region: 'Papua',
    regionBadgeClass: 'bg-[rgba(147,0,10,0.2)] text-[#ffdad6]',
    scoreStr: '38,9%',
    scoreNum: 38.9,
    scoreColor: 'text-[#bcc9cd]',
    barColorClass: 'bg-[#3c494c]',
    subtext: 'Lab TIK: 34,0% · Listrik: 45,8%',
    status: 'Rendah',
    statusColor: 'text-[#bcc9cd]'
  },
  {
    rank: '#36',
    rankColor: 'text-[#ffb4ab]',
    name: 'Papua Tengah',
    region: 'Papua',
    regionBadgeClass: 'bg-[rgba(147,0,10,0.2)] text-[#ffdad6]',
    scoreStr: '31,2%',
    scoreNum: 31.2,
    scoreColor: 'text-[#ffb4ab]',
    barColorClass: 'bg-[#93000a]',
    subtext: 'Lab TIK: 25,1% · Internet: 29,4%',
    status: 'Kritis',
    statusColor: 'text-[#ffb4ab]'
  },
  {
    rank: '#37',
    rankColor: 'text-[#ffb4ab]',
    name: 'Papua Selatan',
    region: 'Papua',
    regionBadgeClass: 'bg-[rgba(147,0,10,0.2)] text-[#ffdad6]',
    scoreStr: '28,4%',
    scoreNum: 28.4,
    scoreColor: 'text-[#ffb4ab]',
    barColorClass: 'bg-[#93000a]',
    subtext: 'Lab TIK: 21,0% · Listrik: 32,5%',
    status: 'Kritis',
    statusColor: 'text-[#ffb4ab]'
  },
  {
    rank: '#38',
    rankColor: 'text-[#ffb4ab]',
    name: 'Papua Pegunungan',
    region: 'Papua',
    regionBadgeClass: 'bg-[rgba(147,0,10,0.2)] text-[#ffdad6]',
    scoreStr: '23,1%',
    scoreNum: 23.1,
    scoreColor: 'text-[#ffb4ab]',
    barColorClass: 'bg-[#ffb4ab]',
    subtext: 'Lab TIK: 14,8% · Listrik: 18,4%',
    status: 'Darurat',
    statusColor: 'text-[#ffb4ab]'
  }
];

export default function DashboardView({ onNavigate, onAddProvinceToCompare, onOpenMethodology }) {
  const [selectedIndicator, setSelectedIndicator] = useState('komputer');
  const [selectedSector, setSelectedSector] = useState('total');

  // Count-up hooks (500–900 ms ease-out, locale id-ID)
  const { ref: heroProvRef, value: heroProvValue } = useCountUp(38, {
    decimals: 0,
    suffix: ' Provinsi',
    duration: 750
  });
  const { ref: kpiAvgRef, value: kpiAvgValue } = useCountUp(68.4, {
    decimals: 1,
    suffix: '%',
    delay: 0
  });
  const { ref: kpiHighRef, value: kpiHighValue } = useCountUp(94.8, {
    decimals: 1,
    suffix: '%',
    delay: 70
  });
  const { ref: kpiLowRef, value: kpiLowValue } = useCountUp(23.1, {
    decimals: 1,
    suffix: '%',
    delay: 140
  });
  const { ref: kpiGapRef, value: kpiGapValue } = useCountUp(71.7, {
    decimals: 1,
    prefix: 'Selisih: ',
    suffix: ' poin',
    delay: 140
  });
  const { ref: kpiMedianRef, value: kpiMedianValue } = useCountUp(64.9, {
    decimals: 1,
    suffix: '%',
    delay: 210
  });

  return (
    <div className="flex flex-col gap-[36px] sm:gap-[48px] items-center pt-[24px] sm:pt-[44px] relative w-full max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
      {/* SECTION 1: HERO SECTION (Figma node 117:32) */}
      <section
        data-node-id="117:32"
        className="flex flex-col items-center max-w-[1040px] w-full text-center"
      >
        {/* Live Data Telemetry Badge */}
        <Reveal delay={0} className="flex flex-col items-center pb-[20px] sm:pb-[28px] w-full">
          <div
            data-node-id="117:34"
            className="backdrop-blur-[12px] bg-[rgba(15,45,61,0.7)] flex flex-wrap justify-center gap-x-[10px] gap-y-1 items-center px-[14px] sm:px-[16px] py-[6px] rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-white/10 max-w-full"
          >
            <div className="bg-[#4bd7f3] rounded-full size-[8px] shrink-0" />
            <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[0.8px] sm:tracking-[1px] uppercase">
              SATU DATA INDONESIA · TERVALIDASI SDI 2023
            </span>
            <span className="hidden sm:inline font-mono-tech text-[#cae6fc] text-[10px] opacity-40">
              |
            </span>
            <span
              ref={heroProvRef}
              className="font-mono-tech font-medium text-[#bcc9cd] text-[10px] tracking-[1px]"
            >
              {heroProvValue}
            </span>
          </div>
        </Reveal>

        {/* Display Headline */}
        <Reveal delay={MOTION_TOKENS.stagger.heroItem} className="w-full">
          <h1 className="font-space font-bold text-[#cae6fc] text-2xl sm:text-4xl lg:text-[48px] leading-[1.2] tracking-[0.8px] sm:tracking-[1.5px] uppercase max-w-[1024px] mx-auto text-center">
            MENDORONG TRANSPARANSI PUBLIK UNTUK MENJEMBATANI KESENJANGAN INFRASTRUKTUR PENDIDIKAN
            ANTARWILAYAH DI INDONESIA
          </h1>
        </Reveal>

        {/* Subtitle */}
        <Reveal
          delay={MOTION_TOKENS.stagger.heroItem * 2}
          className="flex flex-col font-geist font-normal text-[#bcc9cd] text-sm sm:text-base leading-[24px] sm:leading-[26px] max-w-[768px] pt-[16px] sm:pt-[20px] pb-[24px] sm:pb-[32px]"
        >
          <p className="mb-0">
            Platform pemantauan disparitas sarana &amp; prasarana pendidikan tingkat provinsi
            berdasarkan data resmi SDI 2023. Memetakan akses laboratorium komputer, koneksi
            internet, pasokan listrik stabil, sanitasi air bersih, serta kualifikasi pendidik di
            seluruh penjuru kepulauan nusantara.
          </p>
        </Reveal>

        {/* CTA Actions */}
        <Reveal
          delay={MOTION_TOKENS.stagger.heroItem * 3}
          className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-[16px] items-stretch sm:items-center justify-center pb-[32px] sm:pb-[48px] w-full sm:w-auto"
        >
          <a
            href="#peta-interaktif"
            className="hover-lift bg-[#0db8d3] hover:bg-[#4bd7f3] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[8px] items-center justify-center px-[24px] sm:px-[28px] py-[14px] min-h-[48px] rounded-[9999px] cursor-pointer"
          >
            <span className="font-geist font-semibold text-[#00444f] text-[15px] sm:text-[16px] tracking-[0.16px]">
              Jelajahi Dasbor
            </span>
            <img src={imgContainer} alt="" className="size-[14px]" />
          </a>

          <button
            type="button"
            onClick={() => exportDatasetToCSV('eduinsight-sdi-2023-ringkasan.csv')}
            className="hover-lift bg-[rgba(28,56,73,0.4)] hover:bg-[rgba(28,56,73,0.7)] border border-[rgba(255,255,255,0.1)] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[8px] items-center justify-center px-[24px] sm:px-[28px] py-[14px] min-h-[48px] rounded-[9999px] cursor-pointer"
          >
            <img src={imgContainer1} alt="" className="size-[14px]" />
            <span className="font-geist font-semibold text-[#cae6fc] text-[15px] sm:text-[16px] tracking-[0.16px]">
              Unduh Laporan SDI (.CSV)
            </span>
          </button>
        </Reveal>

        {/* 3 Key Trust Badges */}
        <Reveal
          delay={MOTION_TOKENS.stagger.heroItem * 4}
          className="flex flex-wrap gap-2.5 sm:gap-[16px] lg:gap-[24px] items-center justify-center"
        >
          <div className="backdrop-blur-[12px] bg-[rgba(3,34,50,0.6)] border border-white/5 flex gap-[8px] items-center px-[14px] sm:px-[16px] py-[8px] rounded-[9999px]">
            <img src={imgContainer2} alt="" className="size-[14px] shrink-0" />
            <span className="font-geist font-medium text-[#bcc9cd] text-[12px]">
              🏛️ Data Resmi Kemendikdasmen
            </span>
          </div>

          <div className="backdrop-blur-[12px] bg-[rgba(3,34,50,0.6)] border border-white/5 flex gap-[8px] items-center px-[14px] sm:px-[16px] py-[8px] rounded-[9999px]">
            <img src={imgContainer3} alt="" className="size-[14px] shrink-0" />
            <span className="font-geist font-medium text-[#bcc9cd] text-[12px]">
              🗺️ Cakupan 38 Provinsi
            </span>
          </div>

          <div className="backdrop-blur-[12px] bg-[rgba(3,34,50,0.6)] border border-white/5 flex gap-[8px] items-center px-[14px] sm:px-[16px] py-[8px] rounded-[9999px]">
            <img src={imgContainer4} alt="" className="size-[14px] shrink-0" />
            <span className="font-geist font-medium text-[#bcc9cd] text-[12px]">
              📊 Analisis Berbasis Data &amp; SDI 2023
            </span>
          </div>
        </Reveal>
      </section>

      {/* SECTION 2: 4 NATIONAL KPI CARDS (Figma node 117:76) with Count-Up & Stagger */}
      <section
        data-node-id="117:76"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-[24px] w-full"
      >
        {/* KPI 1: Rata-Rata Nasional */}
        <Reveal
          delay={0}
          data-node-id="117:77"
          className="hover-lift backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] flex flex-col justify-between overflow-hidden rounded-[16px] border border-white/5 shadow-lg"
        >
          <div className="p-[20px] sm:p-[24px] pb-[16px] flex flex-col gap-[4px]">
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
                RATA-RATA NASIONAL
              </span>
              <div className="bg-[rgba(75,215,243,0.1)] px-[10px] py-[2px] rounded-[9999px] shrink-0">
                <span className="font-mono-tech font-semibold text-[#4bd7f3] text-[10px] tracking-[0.8px]">
                  +4,2% Tahunan
                </span>
              </div>
            </div>
            <span className="font-space font-medium text-[#bcc9cd] text-[12px] tracking-[0.72px] pt-[12px]">
              Skor Komposit Kesiapan
            </span>
            <span
              ref={kpiAvgRef}
              className="font-space font-bold text-[#4bd7f3] text-[44px] sm:text-[52px] lg:text-[56px] leading-[1.15] tracking-[-1.4px]"
            >
              {kpiAvgValue}
            </span>
          </div>
          <div className="bg-[rgba(15,45,61,0.4)] flex items-center justify-between gap-2 px-[20px] sm:px-[24px] py-[12px] border-t border-white/5">
            <span className="font-geist font-normal text-[#bcc9cd] text-[12px]">
              Target Renstra SDI: 75,0%
            </span>
            <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[0.8px] shrink-0">
              SELISIH 6,6 poin
            </span>
          </div>
        </Reveal>

        {/* KPI 2: Provinsi Tertinggi */}
        <Reveal
          delay={MOTION_TOKENS.stagger.card}
          data-node-id="117:94"
          className="hover-lift backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] flex flex-col justify-between overflow-hidden rounded-[16px] border border-white/5 shadow-lg"
        >
          <div className="p-[20px] sm:p-[24px] pb-[16px] flex flex-col gap-[4px]">
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
                PROVINSI TERTINGGI
              </span>
              <div className="bg-[#0db8d3] px-[10px] py-[2px] rounded-[9999px] shrink-0">
                <span className="font-mono-tech font-bold text-[#00444f] text-[10px] tracking-[0.8px]">
                  Peringkat 1
                </span>
              </div>
            </div>
            <span className="font-space font-medium text-[#bcc9cd] text-[12px] tracking-[0.72px] pt-[12px]">
              DKI JAKARTA
            </span>
            <span
              ref={kpiHighRef}
              className="font-space font-bold text-[#4bd7f3] text-[44px] sm:text-[52px] lg:text-[56px] leading-[1.15] tracking-[-1.4px]"
            >
              {kpiHighValue}
            </span>
          </div>
          <div className="bg-[rgba(15,45,61,0.4)] flex items-center justify-between gap-2 px-[20px] sm:px-[24px] py-[12px] border-t border-white/5">
            <span className="font-geist font-normal text-[#bcc9cd] text-[12px]">
              Akses internet &amp; lab 98,2%
            </span>
            <span className="text-[#4bd7f3] text-[12px] shrink-0">↗</span>
          </div>
        </Reveal>

        {/* KPI 3: Provinsi Terendah */}
        <Reveal
          delay={MOTION_TOKENS.stagger.card * 2}
          data-node-id="117:111"
          className="hover-lift backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] flex flex-col justify-between overflow-hidden rounded-[16px] border border-white/5 shadow-lg"
        >
          <div className="p-[20px] sm:p-[24px] pb-[16px] flex flex-col gap-[4px]">
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
                PROVINSI TERENDAH
              </span>
              <div className="bg-[#93000a] flex items-center gap-1 px-[10px] py-[2px] rounded-[9999px] shrink-0">
                <img src={imgContainer5} alt="" className="size-[11px]" />
                <span
                  ref={kpiGapRef}
                  className="font-mono-tech font-bold text-[#ffdad6] text-[10px] tracking-[0.8px]"
                >
                  {kpiGapValue}
                </span>
              </div>
            </div>
            <span className="font-space font-medium text-[#bcc9cd] text-[12px] tracking-[0.72px] pt-[12px]">
              PAPUA PEGUNUNGAN
            </span>
            <span
              ref={kpiLowRef}
              className="font-space font-bold text-[#ffb4ab] text-[44px] sm:text-[52px] lg:text-[56px] leading-[1.15] tracking-[-1.4px]"
            >
              {kpiLowValue}
            </span>
          </div>
          <div className="bg-[rgba(15,45,61,0.4)] flex items-center justify-between gap-2 px-[20px] sm:px-[24px] py-[12px] border-t border-white/5">
            <span className="font-geist font-normal text-[#bcc9cd] text-[12px]">
              Hanya 18,4% berlistrik stabil
            </span>
            <span className="font-mono-tech font-medium text-[#ffb4ab] text-[10px] tracking-[0.8px] shrink-0">
              Prioritas 3T
            </span>
          </div>
        </Reveal>

        {/* KPI 4: Median Nasional */}
        <Reveal
          delay={MOTION_TOKENS.stagger.card * 3}
          data-node-id="117:128"
          className="hover-lift backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] flex flex-col justify-between overflow-hidden rounded-[16px] border border-white/5 shadow-lg"
        >
          <div className="p-[20px] sm:p-[24px] pb-[16px] flex flex-col gap-[4px]">
            <div className="flex items-center justify-between gap-2 w-full">
              <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
                MEDIAN NASIONAL
              </span>
              <div className="bg-[#1c3849] flex items-center gap-1 px-[10px] py-[2px] rounded-[9999px] shrink-0">
                <img src={imgContainer6} alt="" className="size-[10px]" />
                <span className="font-mono-tech font-medium text-[#a4c9ff] text-[10px] tracking-[0.8px]">
                  Tolok Ukur
                </span>
              </div>
            </div>
            <span className="font-space font-medium text-[#bcc9cd] text-[12px] tracking-[0.72px] pt-[12px]">
              TOLOK UKUR DIY / BALI
            </span>
            <span
              ref={kpiMedianRef}
              className="font-space font-bold text-[#a4c9ff] text-[44px] sm:text-[52px] lg:text-[56px] leading-[1.15] tracking-[-1.4px]"
            >
              {kpiMedianValue}
            </span>
          </div>
          <div className="bg-[rgba(15,45,61,0.4)] flex items-center justify-between gap-2 px-[20px] sm:px-[24px] py-[12px] border-t border-white/5">
            <span className="font-geist font-normal text-[#bcc9cd] text-[12px]">
              19 provinsi di bawah garis rata-rata
            </span>
            <span className="font-mono-tech font-medium text-[#a4c9ff] text-[10px] tracking-[0.8px] shrink-0">
              Proporsi 50:50
            </span>
          </div>
        </Reveal>
      </section>

      {/* SECTION 3: INTERACTIVE INDONESIA CHOROPLETH MAP (Figma node 117:145) */}
      <IndonesiaMapSection
        selectedIndicator={selectedIndicator}
        setSelectedIndicator={setSelectedIndicator}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        onSelectProvinceForCompare={(prov) => {
          if (onAddProvinceToCompare) onAddProvinceToCompare(prov);
          if (onNavigate) onNavigate('perbandingan');
        }}
      />

      {/* SECTION 4: DETAILED BREAKDOWN & DISPARITY SUMMARY PREVIEW (Figma node 117:262) */}
      <section
        data-node-id="117:262"
        className="flex flex-col gap-[24px] sm:gap-[32px] w-full py-2 sm:py-4"
      >
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
          <div className="flex flex-col gap-[8px]">
            <div className="bg-[#032232] inline-flex gap-[8px] items-center px-[12px] py-[4px] rounded-full border border-white/5 w-fit">
              <img src={imgContainer8} alt="" className="size-[11px]" />
              <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[1px] uppercase">
                MATRIKS KETIMPANGAN ANTARWILAYAH
              </span>
            </div>
            <h2 className="font-space font-bold text-[#cae6fc] text-2xl sm:text-[32px] leading-tight sm:leading-[40px] tracking-[-0.8px]">
              Perbandingan 5 Provinsi Tertinggi vs 5 Provinsi Terendah
            </h2>
          </div>
          <div className="max-w-[448px] text-[#bcc9cd] font-geist text-[12px] leading-[18px]">
            <p className="mb-0">
              Disparitas ekstrem terlihat pada ketersediaan laboratorium TIK dan stabilitas aliran
              daya listrik sekolah antara wilayah barat dan timur nusantara.
            </p>
          </div>
        </Reveal>

        {/* Bento Grid: 5 Tertinggi (Left) vs 5 Terendah (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-[32px] w-full">
          {/* Left Column: 5 PROVINSI TERTINGGI (Figma node 117:274) */}
          <Reveal
            delay={0}
            data-node-id="117:274"
            className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] flex flex-col p-4 sm:p-6 lg:p-[32px] rounded-[24px] border border-white/10 shadow-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-[20px] sm:pb-[24px] w-full">
              <div className="flex gap-[12px] items-center">
                <div className="bg-[rgba(13,184,211,0.2)] rounded-full size-[36px] flex items-center justify-center shrink-0">
                  <img src={imgContainer9} alt="" className="size-[17px]" />
                </div>
                <div>
                  <h3 className="font-space font-semibold text-[#cae6fc] text-lg sm:text-[20px] leading-[26px] sm:leading-[28px] tracking-[0.4px]">
                    5 Provinsi Tertinggi Kesiapan Fasilitas
                  </h3>
                  <p className="font-geist text-[#bcc9cd] text-[12px] leading-[18px]">
                    Provinsi dengan skor tertinggi nasional
                  </p>
                </div>
              </div>
              <span className="font-mono-tech font-semibold text-[#4bd7f3] text-[10px] tracking-[0.8px] uppercase">
                TINGGI (&gt;80%)
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:gap-[20px] w-full">
              {TOP_5_ITEMS.map((item, idx) => (
                <Reveal
                  key={item.name}
                  delay={idx * MOTION_TOKENS.stagger.tableRow}
                  className="hover-lift bg-[rgba(15,45,61,0.4)] hover:bg-[rgba(15,45,61,0.65)] flex flex-col gap-[8px] p-3.5 sm:p-[16px] rounded-[16px] border border-white/5 hover:border-[#4bd7f3]/30"
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex flex-wrap gap-[8px] items-center">
                      <span className="font-mono-tech font-semibold text-[#4bd7f3] text-[12px]">
                        {item.rank}
                      </span>
                      <span className="font-geist font-medium text-[#cae6fc] text-[15px] sm:text-[16px]">
                        {item.name}
                      </span>
                      <span
                        className={`${item.regionBadgeClass} px-[8px] py-[2px] rounded-full font-mono-tech text-[10px]`}
                      >
                        {item.region}
                      </span>
                    </div>
                    <span className="font-space font-semibold text-[#4bd7f3] text-[18px] sm:text-[20px] shrink-0">
                      {item.scoreStr}
                    </span>
                  </div>
                  <div className="bg-[#00101b] h-[8px] rounded-full overflow-hidden w-full">
                    <AnimatedBar
                      percent={item.scoreNum}
                      direction="horizontal"
                      delay={idx * MOTION_TOKENS.stagger.tableRow + 100}
                      className={`${item.barColorClass} rounded-full`}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                      {item.subtext}
                    </span>
                    <span className="font-mono-tech text-[#4bd7f3] text-[10px] shrink-0">
                      {item.status}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          {/* Right Column: 5 PROVINSI TERENDAH (Figma node 117:377) */}
          <Reveal
            delay={100}
            data-node-id="117:377"
            className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] flex flex-col p-4 sm:p-6 lg:p-[32px] rounded-[24px] border border-white/10 shadow-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-[20px] sm:pb-[24px] w-full">
              <div className="flex gap-[12px] items-center">
                <div className="bg-[rgba(147,0,10,0.2)] rounded-full size-[36px] flex items-center justify-center shrink-0">
                  <img src={imgContainer10} alt="" className="size-[17px]" />
                </div>
                <div>
                  <h3 className="font-space font-semibold text-[#cae6fc] text-lg sm:text-[20px] leading-[26px] sm:leading-[28px] tracking-[0.4px]">
                    5 Provinsi Terendah Kesiapan Fasilitas
                  </h3>
                  <p className="font-geist text-[#bcc9cd] text-[12px] leading-[18px]">
                    Wilayah memerlukan intervensi DAK Fisik prioritas
                  </p>
                </div>
              </div>
              <span className="font-mono-tech font-semibold text-[#ffb4ab] text-[10px] tracking-[0.8px] uppercase">
                KRITIS (&lt;45%)
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:gap-[20px] w-full">
              {BOTTOM_5_ITEMS.map((item, idx) => (
                <Reveal
                  key={item.name}
                  delay={idx * MOTION_TOKENS.stagger.tableRow}
                  className="hover-lift bg-[rgba(15,45,61,0.4)] hover:bg-[rgba(15,45,61,0.65)] flex flex-col gap-[8px] p-3.5 sm:p-[16px] rounded-[16px] border border-white/5 hover:border-[#ffb4ab]/30"
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex flex-wrap gap-[8px] items-center">
                      <span
                        className={`font-mono-tech font-semibold ${item.rankColor} text-[12px]`}
                      >
                        {item.rank}
                      </span>
                      <span className="font-geist font-medium text-[#cae6fc] text-[15px] sm:text-[16px]">
                        {item.name}
                      </span>
                      <span
                        className={`${item.regionBadgeClass} px-[8px] py-[2px] rounded-full font-mono-tech text-[10px]`}
                      >
                        {item.region}
                      </span>
                    </div>
                    <span
                      className={`font-space font-semibold ${item.scoreColor} text-[18px] sm:text-[20px] shrink-0`}
                    >
                      {item.scoreStr}
                    </span>
                  </div>
                  <div className="bg-[#00101b] h-[8px] rounded-full overflow-hidden w-full">
                    <AnimatedBar
                      percent={item.scoreNum}
                      direction="horizontal"
                      delay={idx * MOTION_TOKENS.stagger.tableRow + 100}
                      className={`${item.barColorClass} rounded-full`}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                      {item.subtext}
                    </span>
                    <span className={`font-mono-tech ${item.statusColor} text-[10px] shrink-0`}>
                      {item.status}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Bottom Callout: Policy Recommendations & Methodology Link (Figma node 117:468) */}
        <Reveal
          delay={120}
          id="metodologi-callout"
          data-node-id="117:468"
          className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.6)] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between p-5 sm:p-[24px] rounded-[24px] gap-5 sm:gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="bg-[rgba(13,184,211,0.2)] rounded-full size-[44px] flex items-center justify-center shrink-0">
              <img src={imgContainer11} alt="" className="size-[20px]" />
            </div>
            <div>
              <h4 className="font-space font-semibold text-[#cae6fc] text-base sm:text-[18px]">
                Rekomendasi Kebijakan Berbasis Wilayah Sasaran
              </h4>
              <p className="font-geist text-[#bcc9cd] text-xs sm:text-[14px] leading-relaxed max-w-[800px] mt-1">
                Prioritaskan DAK Fisik Afirmasi dan implementasi konektivitas satelit/BAKTI Kominfo
                untuk 8 provinsi di kawasan Maluku dan Papua yang mencatatkan indeks kesiapan
                sarpras di bawah 50%.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenMethodology}
            className="hover-lift w-full md:w-auto min-h-[44px] bg-[#1c3849] hover:bg-[#0db8d3] hover:text-[#00363f] px-[24px] py-[10px] rounded-full font-mono-tech font-medium text-[#cae6fc] text-[12px] tracking-[0.72px] whitespace-nowrap cursor-pointer border border-white/10 text-center"
          >
            Baca Metodologi SDI →
          </button>
        </Reveal>
      </section>
    </div>
  );
}
