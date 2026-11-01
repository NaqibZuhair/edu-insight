import { useState } from 'react';
import IndonesiaMapSection from '../components/IndonesiaMapSection';
import {
  exportDatasetToCSV
} from '../utils/dataService';

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

export default function DashboardView({ onNavigate, onAddProvinceToCompare, onOpenMethodology }) {
  const [selectedIndicator, setSelectedIndicator] = useState('komputer');
  const [selectedSector, setSelectedSector] = useState('total');

  return (
    <div className="flex flex-col gap-[48px] items-center pt-[32px] sm:pt-[44px] relative w-full px-4 sm:px-6">
      {/* SECTION 1: HERO SECTION (Figma node 117:32) */}
      <section
        data-node-id="117:32"
        className="flex flex-col items-center max-w-[1040px] w-full text-center"
      >
        {/* Live Data Telemetry Badge */}
        <div data-node-id="117:33" className="flex flex-col items-center pb-[28px]">
          <div
            data-node-id="117:34"
            className="backdrop-blur-[12px] bg-[rgba(15,45,61,0.7)] flex gap-[10px] items-center px-[16px] py-[6px] rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-white/10"
          >
            <div className="bg-[#4bd7f3] rounded-full size-[8px] animate-pulse" />
            <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[1px] uppercase whitespace-nowrap">
              SATU DATA INDONESIA · SDI 2023 VALIDATED
            </span>
            <span className="font-mono-tech text-[#cae6fc] text-[10px] opacity-40">|</span>
            <span className="font-mono-tech font-medium text-[#bcc9cd] text-[10px] tracking-[1px] whitespace-nowrap">
              38 Provinsi
            </span>
          </div>
        </div>

        {/* Display Headline */}
        <h1 className="font-space font-bold text-[#cae6fc] text-[28px] sm:text-[42px] lg:text-[52px] leading-[1.16] tracking-[1.5px] uppercase max-w-[1024px] mx-auto text-center">
          POWERING PUBLIC TRANSPARENCY TO BRIDGE REGIONAL EDUCATION INFRASTRUCTURE GAPS IN INDONESIA
        </h1>

        {/* Subtitle */}
        <div className="flex flex-col font-geist font-normal text-[#bcc9cd] text-[15px] sm:text-[16px] leading-[26px] max-w-[768px] pt-[20px] pb-[32px]">
          <p className="mb-0">
            Platform pemantauan disparitas sarana &amp; prasarana pendidikan tingkat provinsi
            berdasarkan data resmi SDI 2023. Memetakan akses laboratorium komputer, koneksi
            internet, pasokan listrik stabil, sanitasi air bersih, serta kualifikasi pendidik di
            seluruh penjuru kepulauan nusantara.
          </p>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-wrap gap-[16px] items-center justify-center pb-[48px]">
          <a
            href="#peta-interaktif"
            className="bg-[#0db8d3] hover:bg-[#4bd7f3] transition-colors drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[8px] items-center px-[28px] py-[14px] rounded-[9999px] cursor-pointer"
          >
            <span className="font-geist font-semibold text-[#00444f] text-[16px] tracking-[0.16px]">
              Jelajahi Dashboard
            </span>
            <img src={imgContainer} alt="" className="size-[14px]" />
          </a>

          <button
            type="button"
            onClick={() => exportDatasetToCSV('eduinsight-sdi-2023-ringkasan.csv')}
            className="bg-[rgba(28,56,73,0.4)] hover:bg-[rgba(28,56,73,0.7)] transition-colors border border-[rgba(255,255,255,0.1)] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[8px] items-center px-[28px] py-[14px] rounded-[9999px] cursor-pointer"
          >
            <img src={imgContainer1} alt="" className="size-[14px]" />
            <span className="font-geist font-semibold text-[#cae6fc] text-[16px] tracking-[0.16px]">
              Unduh Laporan SDI (.CSV)
            </span>
          </button>
        </div>

        {/* 3 Key Trust Badges */}
        <div className="flex flex-wrap gap-[24px] items-center justify-center">
          <div className="backdrop-blur-[12px] bg-[rgba(3,34,50,0.6)] border border-white/5 flex gap-[8px] items-center px-[16px] py-[8px] rounded-[9999px]">
            <img src={imgContainer2} alt="" className="size-[14px]" />
            <span className="font-geist font-medium text-[#bcc9cd] text-[12px]">
              🏛️ Data Resmi Kemendikdasmen
            </span>
          </div>

          <div className="backdrop-blur-[12px] bg-[rgba(3,34,50,0.6)] border border-white/5 flex gap-[8px] items-center px-[16px] py-[8px] rounded-[9999px]">
            <img src={imgContainer3} alt="" className="size-[14px]" />
            <span className="font-geist font-medium text-[#bcc9cd] text-[12px]">
              🗺️ Cakupan 38 Provinsi
            </span>
          </div>

          <div className="backdrop-blur-[12px] bg-[rgba(3,34,50,0.6)] border border-white/5 flex gap-[8px] items-center px-[16px] py-[8px] rounded-[9999px]">
            <img src={imgContainer4} alt="" className="size-[14px]" />
            <span className="font-geist font-medium text-[#bcc9cd] text-[12px]">
              📊 Analisis Berbasis Data &amp; SDI 2023
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: 4 NATIONAL KPI CARDS (Figma node 117:76) */}
      <section
        data-node-id="117:76"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] max-w-[1280px] w-full mx-auto"
      >
        {/* KPI 1: Rata-Rata Nasional */}
        <div
          data-node-id="117:77"
          className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] flex flex-col justify-between overflow-hidden rounded-[16px] border border-white/5 shadow-lg"
        >
          <div className="p-[24px] pb-[16px] flex flex-col gap-[4px]">
            <div className="flex items-center justify-between w-full">
              <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
                RATA-RATA NASIONAL
              </span>
              <div className="bg-[rgba(75,215,243,0.1)] px-[10px] py-[2px] rounded-[9999px]">
                <span className="font-mono-tech font-semibold text-[#4bd7f3] text-[10px] tracking-[0.8px]">
                  +4.2% YoY
                </span>
              </div>
            </div>
            <span className="font-space font-medium text-[#bcc9cd] text-[12px] tracking-[0.72px] pt-[12px]">
              Skor Komposit Kesiapan
            </span>
            <span className="font-space font-bold text-[#4bd7f3] text-[56px] leading-[64px] tracking-[-1.4px]">
              68.4%
            </span>
          </div>
          <div className="bg-[rgba(15,45,61,0.4)] flex items-center justify-between px-[24px] py-[12px] border-t border-white/5">
            <span className="font-geist font-normal text-[#bcc9cd] text-[12px]">
              Target Renstra SDI: 75.0%
            </span>
            <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[0.8px]">
              GAP 6.6 pt
            </span>
          </div>
        </div>

        {/* KPI 2: Provinsi Tertinggi */}
        <div
          data-node-id="117:94"
          className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] flex flex-col justify-between overflow-hidden rounded-[16px] border border-white/5 shadow-lg"
        >
          <div className="p-[24px] pb-[16px] flex flex-col gap-[4px]">
            <div className="flex items-center justify-between w-full">
              <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
                PROVINSI TERTINGGI
              </span>
              <div className="bg-[#0db8d3] px-[10px] py-[2px] rounded-[9999px]">
                <span className="font-mono-tech font-bold text-[#00444f] text-[10px] tracking-[0.8px]">
                  Peringkat 1
                </span>
              </div>
            </div>
            <span className="font-space font-medium text-[#bcc9cd] text-[12px] tracking-[0.72px] pt-[12px]">
              DKI JAKARTA
            </span>
            <span className="font-space font-bold text-[#4bd7f3] text-[56px] leading-[64px] tracking-[-1.4px]">
              94.8%
            </span>
          </div>
          <div className="bg-[rgba(15,45,61,0.4)] flex items-center justify-between px-[24px] py-[12px] border-t border-white/5">
            <span className="font-geist font-normal text-[#bcc9cd] text-[12px]">
              Akses internet &amp; lab 98.2%
            </span>
            <span className="text-[#4bd7f3] text-[12px]">↗</span>
          </div>
        </div>

        {/* KPI 3: Provinsi Terendah */}
        <div
          data-node-id="117:111"
          className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] flex flex-col justify-between overflow-hidden rounded-[16px] border border-white/5 shadow-lg"
        >
          <div className="p-[24px] pb-[16px] flex flex-col gap-[4px]">
            <div className="flex items-center justify-between w-full">
              <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
                PROVINSI TERENDAH
              </span>
              <div className="bg-[#93000a] flex items-center gap-1 px-[10px] py-[2px] rounded-[9999px]">
                <img src={imgContainer5} alt="" className="size-[11px]" />
                <span className="font-mono-tech font-bold text-[#ffdad6] text-[10px] tracking-[0.8px]">
                  Gap: 71.7 pt
                </span>
              </div>
            </div>
            <span className="font-space font-medium text-[#bcc9cd] text-[12px] tracking-[0.72px] pt-[12px]">
              PAPUA PEGUNUNGAN
            </span>
            <span className="font-space font-bold text-[#ffb4ab] text-[56px] leading-[64px] tracking-[-1.4px]">
              23.1%
            </span>
          </div>
          <div className="bg-[rgba(15,45,61,0.4)] flex items-center justify-between px-[24px] py-[12px] border-t border-white/5">
            <span className="font-geist font-normal text-[#bcc9cd] text-[12px]">
              Hanya 18.4% berlistrik stabil
            </span>
            <span className="font-mono-tech font-medium text-[#ffb4ab] text-[10px] tracking-[0.8px]">
              Prioritas 3T
            </span>
          </div>
        </div>

        {/* KPI 4: Median Nasional */}
        <div
          data-node-id="117:128"
          className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] flex flex-col justify-between overflow-hidden rounded-[16px] border border-white/5 shadow-lg"
        >
          <div className="p-[24px] pb-[16px] flex flex-col gap-[4px]">
            <div className="flex items-center justify-between w-full">
              <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px] uppercase">
                MEDIAN NASIONAL
              </span>
              <div className="bg-[#1c3849] flex items-center gap-1 px-[10px] py-[2px] rounded-[9999px]">
                <img src={imgContainer6} alt="" className="size-[10px]" />
                <span className="font-mono-tech font-medium text-[#a4c9ff] text-[10px] tracking-[0.8px]">
                  Benchmark
                </span>
              </div>
            </div>
            <span className="font-space font-medium text-[#bcc9cd] text-[12px] tracking-[0.72px] pt-[12px]">
              DIY / BALI BENCHMARK
            </span>
            <span className="font-space font-bold text-[#a4c9ff] text-[56px] leading-[64px] tracking-[-1.4px]">
              64.9%
            </span>
          </div>
          <div className="bg-[rgba(15,45,61,0.4)] flex items-center justify-between px-[24px] py-[12px] border-t border-white/5">
            <span className="font-geist font-normal text-[#bcc9cd] text-[12px]">
              19 provinsi di bawah garis rata-rata
            </span>
            <span className="font-mono-tech font-medium text-[#a4c9ff] text-[10px] tracking-[0.8px]">
              50:50 Split
            </span>
          </div>
        </div>
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
        className="flex flex-col gap-[32px] max-w-[1280px] p-[32px] w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
          <div className="flex flex-col gap-[8px]">
            <div className="bg-[#032232] inline-flex gap-[8px] items-center px-[12px] py-[4px] rounded-full border border-white/5 w-fit">
              <img src={imgContainer8} alt="" className="size-[11px]" />
              <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] tracking-[1px] uppercase">
                MATRIKS KETIMPANGAN ANTAR-WILAYAH
              </span>
            </div>
            <h2 className="font-space font-bold text-[#cae6fc] text-[32px] leading-[40px] tracking-[-0.8px]">
              Perbandingan Top 5 vs Bottom 5 Provinsi
            </h2>
          </div>
          <div className="max-w-[448px] text-[#bcc9cd] font-geist text-[12px] leading-[18px]">
            <p className="mb-0">
              Disparitas ekstrem terlihat pada ketersediaan laboratorium TIK dan stabilitas aliran daya
              listrik sekolah antara wilayah barat dan timur nusantara.
            </p>
          </div>
        </div>

        {/* Bento Grid: Top 5 (Left) vs Bottom 5 (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] w-full">
          {/* Left Column: TOP 5 PROVINCES (Figma node 117:274) */}
          <div
            data-node-id="117:274"
            className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] flex flex-col p-[32px] rounded-[24px] border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between pb-[24px] w-full">
              <div className="flex gap-[12px] items-center">
                <div className="bg-[rgba(13,184,211,0.2)] rounded-full size-[36px] flex items-center justify-center">
                  <img src={imgContainer9} alt="" className="size-[17px]" />
                </div>
                <div>
                  <h3 className="font-space font-semibold text-[#cae6fc] text-[20px] leading-[28px] tracking-[0.4px]">
                    Top 5 Kesiapan Fasilitas
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

            <div className="flex flex-col gap-[20px] w-full">
              {/* Row 1: DKI Jakarta */}
              <div className="bg-[rgba(15,45,61,0.4)] flex flex-col gap-[8px] p-[16px] rounded-[16px] border border-white/5">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[8px] items-center">
                    <span className="font-mono-tech font-semibold text-[#4bd7f3] text-[12px]">
                      #01
                    </span>
                    <span className="font-geist font-medium text-[#cae6fc] text-[16px]">
                      DKI Jakarta
                    </span>
                    <span className="bg-[rgba(75,215,243,0.1)] px-[8px] py-[2px] rounded-full font-mono-tech text-[#4bd7f3] text-[10px]">
                      Jawa
                    </span>
                  </div>
                  <span className="font-space font-semibold text-[#4bd7f3] text-[20px]">
                    94.8%
                  </span>
                </div>
                <div className="bg-[#00101b] h-[8px] rounded-full overflow-hidden w-full">
                  <div className="bg-[#4bd7f3] h-full rounded-full" style={{ width: '94.8%' }} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                    Lab TIK: 98.4% · Internet: 99.1%
                  </span>
                  <span className="font-mono-tech text-[#4bd7f3] text-[10px]">
                    Paripurna
                  </span>
                </div>
              </div>

              {/* Row 2: DI Yogyakarta */}
              <div className="bg-[rgba(15,45,61,0.4)] flex flex-col gap-[8px] p-[16px] rounded-[16px] border border-white/5">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[8px] items-center">
                    <span className="font-mono-tech font-semibold text-[#4bd7f3] text-[12px]">
                      #02
                    </span>
                    <span className="font-geist font-medium text-[#cae6fc] text-[16px]">
                      DI Yogyakarta
                    </span>
                    <span className="bg-[rgba(75,215,243,0.1)] px-[8px] py-[2px] rounded-full font-mono-tech text-[#4bd7f3] text-[10px]">
                      Jawa
                    </span>
                  </div>
                  <span className="font-space font-semibold text-[#4bd7f3] text-[20px]">
                    91.3%
                  </span>
                </div>
                <div className="bg-[#00101b] h-[8px] rounded-full overflow-hidden w-full">
                  <div className="bg-[#4bd7f3] h-full rounded-full" style={{ width: '91.3%' }} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                    Lab TIK: 93.2% · Internet: 95.8%
                  </span>
                  <span className="font-mono-tech text-[#4bd7f3] text-[10px]">
                    Sangat Baik
                  </span>
                </div>
              </div>

              {/* Row 3: Bali */}
              <div className="bg-[rgba(15,45,61,0.4)] flex flex-col gap-[8px] p-[16px] rounded-[16px] border border-white/5">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[8px] items-center">
                    <span className="font-mono-tech font-semibold text-[#4bd7f3] text-[12px]">
                      #03
                    </span>
                    <span className="font-geist font-medium text-[#cae6fc] text-[16px]">
                      Bali
                    </span>
                    <span className="bg-[rgba(0,118,210,0.2)] px-[8px] py-[2px] rounded-full font-mono-tech text-[#a4c9ff] text-[10px]">
                      Nusa Tenggara
                    </span>
                  </div>
                  <span className="font-space font-semibold text-[#4bd7f3] text-[20px]">
                    87.6%
                  </span>
                </div>
                <div className="bg-[#00101b] h-[8px] rounded-full overflow-hidden w-full">
                  <div className="bg-[#0076d2] h-full rounded-full" style={{ width: '87.6%' }} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                    Lab TIK: 88.0% · Internet: 92.4%
                  </span>
                  <span className="font-mono-tech text-[#4bd7f3] text-[10px]">
                    Baik
                  </span>
                </div>
              </div>

              {/* Row 4: Kepulauan Riau */}
              <div className="bg-[rgba(15,45,61,0.4)] flex flex-col gap-[8px] p-[16px] rounded-[16px] border border-white/5">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[8px] items-center">
                    <span className="font-mono-tech font-semibold text-[#4bd7f3] text-[12px]">
                      #04
                    </span>
                    <span className="font-geist font-medium text-[#cae6fc] text-[16px]">
                      Kepulauan Riau
                    </span>
                    <span className="bg-[rgba(75,215,243,0.1)] px-[8px] py-[2px] rounded-full font-mono-tech text-[#4bd7f3] text-[10px]">
                      Sumatera
                    </span>
                  </div>
                  <span className="font-space font-semibold text-[#4bd7f3] text-[20px]">
                    84.2%
                  </span>
                </div>
                <div className="bg-[#00101b] h-[8px] rounded-full overflow-hidden w-full">
                  <div className="bg-[#0076d2] h-full rounded-full" style={{ width: '84.2%' }} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                    Lab TIK: 82.5% · Internet: 89.0%
                  </span>
                  <span className="font-mono-tech text-[#4bd7f3] text-[10px]">
                    Baik
                  </span>
                </div>
              </div>

              {/* Row 5: Jawa Timur */}
              <div className="bg-[rgba(15,45,61,0.4)] flex flex-col gap-[8px] p-[16px] rounded-[16px] border border-white/5">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[8px] items-center">
                    <span className="font-mono-tech font-semibold text-[#4bd7f3] text-[12px]">
                      #05
                    </span>
                    <span className="font-geist font-medium text-[#cae6fc] text-[16px]">
                      Jawa Timur
                    </span>
                    <span className="bg-[rgba(75,215,243,0.1)] px-[8px] py-[2px] rounded-full font-mono-tech text-[#4bd7f3] text-[10px]">
                      Jawa
                    </span>
                  </div>
                  <span className="font-space font-semibold text-[#4bd7f3] text-[20px]">
                    81.9%
                  </span>
                </div>
                <div className="bg-[#00101b] h-[8px] rounded-full overflow-hidden w-full">
                  <div className="bg-[#0076d2] h-full rounded-full" style={{ width: '81.9%' }} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                    Lab TIK: 76.5% · Internet: 81.2%
                  </span>
                  <span className="font-mono-tech text-[#4bd7f3] text-[10px]">
                    Baik
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: BOTTOM 5 PROVINCES (Figma node 117:377) */}
          <div
            data-node-id="117:377"
            className="backdrop-blur-[24px] bg-[rgba(3,34,50,0.7)] flex flex-col p-[32px] rounded-[24px] border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between pb-[24px] w-full">
              <div className="flex gap-[12px] items-center">
                <div className="bg-[rgba(147,0,10,0.2)] rounded-full size-[36px] flex items-center justify-center">
                  <img src={imgContainer10} alt="" className="size-[17px]" />
                </div>
                <div>
                  <h3 className="font-space font-semibold text-[#cae6fc] text-[20px] leading-[28px] tracking-[0.4px]">
                    Bottom 5 Kesiapan Fasilitas
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

            <div className="flex flex-col gap-[20px] w-full">
              {/* Row 1: NTT */}
              <div className="bg-[rgba(15,45,61,0.4)] flex flex-col gap-[8px] p-[16px] rounded-[16px] border border-white/5">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[8px] items-center">
                    <span className="font-mono-tech font-semibold text-[#cae6fc] text-[12px]">
                      #34
                    </span>
                    <span className="font-geist font-medium text-[#cae6fc] text-[16px]">
                      Nusa Tenggara Timur
                    </span>
                    <span className="bg-[rgba(0,118,210,0.2)] px-[8px] py-[2px] rounded-full font-mono-tech text-[#a4c9ff] text-[10px]">
                      Nusa Tenggara
                    </span>
                  </div>
                  <span className="font-space font-semibold text-[#bcc9cd] text-[20px]">
                    44.6%
                  </span>
                </div>
                <div className="bg-[#00101b] h-[8px] rounded-full overflow-hidden w-full">
                  <div className="bg-[#3c494c] h-full rounded-full" style={{ width: '44.6%' }} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                    Lab TIK: 41.2% · Listrik: 52.0%
                  </span>
                  <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                    Terbatas
                  </span>
                </div>
              </div>

              {/* Row 2: Papua Barat Daya */}
              <div className="bg-[rgba(15,45,61,0.4)] flex flex-col gap-[8px] p-[16px] rounded-[16px] border border-white/5">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[8px] items-center">
                    <span className="font-mono-tech font-semibold text-[#cae6fc] text-[12px]">
                      #35
                    </span>
                    <span className="font-geist font-medium text-[#cae6fc] text-[16px]">
                      Papua Barat Daya
                    </span>
                    <span className="bg-[rgba(147,0,10,0.2)] px-[8px] py-[2px] rounded-full font-mono-tech text-[#ffdad6] text-[10px]">
                      Papua
                    </span>
                  </div>
                  <span className="font-space font-semibold text-[#bcc9cd] text-[20px]">
                    38.9%
                  </span>
                </div>
                <div className="bg-[#00101b] h-[8px] rounded-full overflow-hidden w-full">
                  <div className="bg-[#3c494c] h-full rounded-full" style={{ width: '38.9%' }} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                    Lab TIK: 34.0% · Listrik: 45.8%
                  </span>
                  <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                    Rendah
                  </span>
                </div>
              </div>

              {/* Row 3: Papua Tengah */}
              <div className="bg-[rgba(15,45,61,0.4)] flex flex-col gap-[8px] p-[16px] rounded-[16px] border border-white/5">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[8px] items-center">
                    <span className="font-mono-tech font-semibold text-[#ffb4ab] text-[12px]">
                      #36
                    </span>
                    <span className="font-geist font-medium text-[#cae6fc] text-[16px]">
                      Papua Tengah
                    </span>
                    <span className="bg-[rgba(147,0,10,0.2)] px-[8px] py-[2px] rounded-full font-mono-tech text-[#ffdad6] text-[10px]">
                      Papua
                    </span>
                  </div>
                  <span className="font-space font-semibold text-[#ffb4ab] text-[20px]">
                    31.2%
                  </span>
                </div>
                <div className="bg-[#00101b] h-[8px] rounded-full overflow-hidden w-full">
                  <div className="bg-[#93000a] h-full rounded-full" style={{ width: '31.2%' }} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                    Lab TIK: 25.1% · Internet: 29.4%
                  </span>
                  <span className="font-mono-tech text-[#ffb4ab] text-[10px]">
                    Kritis
                  </span>
                </div>
              </div>

              {/* Row 4: Papua Selatan */}
              <div className="bg-[rgba(15,45,61,0.4)] flex flex-col gap-[8px] p-[16px] rounded-[16px] border border-white/5">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[8px] items-center">
                    <span className="font-mono-tech font-semibold text-[#ffb4ab] text-[12px]">
                      #37
                    </span>
                    <span className="font-geist font-medium text-[#cae6fc] text-[16px]">
                      Papua Selatan
                    </span>
                    <span className="bg-[rgba(147,0,10,0.2)] px-[8px] py-[2px] rounded-full font-mono-tech text-[#ffdad6] text-[10px]">
                      Papua
                    </span>
                  </div>
                  <span className="font-space font-semibold text-[#ffb4ab] text-[20px]">
                    28.4%
                  </span>
                </div>
                <div className="bg-[#00101b] h-[8px] rounded-full overflow-hidden w-full">
                  <div className="bg-[#93000a] h-full rounded-full" style={{ width: '28.4%' }} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                    Lab TIK: 21.0% · Listrik: 32.5%
                  </span>
                  <span className="font-mono-tech text-[#ffb4ab] text-[10px]">
                    Kritis
                  </span>
                </div>
              </div>

              {/* Row 5: Papua Pegunungan */}
              <div className="bg-[rgba(15,45,61,0.4)] flex flex-col gap-[8px] p-[16px] rounded-[16px] border border-white/5">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[8px] items-center">
                    <span className="font-mono-tech font-semibold text-[#ffb4ab] text-[12px]">
                      #38
                    </span>
                    <span className="font-geist font-medium text-[#cae6fc] text-[16px]">
                      Papua Pegunungan
                    </span>
                    <span className="bg-[rgba(147,0,10,0.2)] px-[8px] py-[2px] rounded-full font-mono-tech text-[#ffdad6] text-[10px]">
                      Papua
                    </span>
                  </div>
                  <span className="font-space font-semibold text-[#ffb4ab] text-[20px]">
                    23.1%
                  </span>
                </div>
                <div className="bg-[#00101b] h-[8px] rounded-full overflow-hidden w-full">
                  <div className="bg-[#ffb4ab] h-full rounded-full" style={{ width: '23.1%' }} />
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono-tech text-[#bcc9cd] text-[10px]">
                    Lab TIK: 14.8% · Listrik: 18.4%
                  </span>
                  <span className="font-mono-tech text-[#ffb4ab] text-[10px]">
                    Darurat
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Callout: Policy Recommendations & Methodology Link (Figma node 117:468) */}
        <div
          id="metodologi-callout"
          data-node-id="117:468"
          className="backdrop-blur-[24px] bg-[rgba(15,45,61,0.6)] border border-white/10 flex flex-col md:flex-row items-center justify-between p-[24px] rounded-[24px] gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="bg-[rgba(13,184,211,0.2)] rounded-full size-[44px] flex items-center justify-center shrink-0">
              <img src={imgContainer11} alt="" className="size-[20px]" />
            </div>
            <div>
              <h4 className="font-space font-semibold text-[#cae6fc] text-[18px]">
                Rekomendasi Kebijakan Berbasis Lokasi (Geographic Targeting)
              </h4>
              <p className="font-geist text-[#bcc9cd] text-[14px] leading-relaxed max-w-[800px] mt-1">
                Prioritaskan DAK Fisik Afirmasi dan implementasi konektivitas Starlink/BAKTI Kominfo
                untuk 8 provinsi di kawasan Maluku dan Papua yang mencatatkan indeks kesiapan sarpras
                di bawah 50%.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenMethodology}
            className="bg-[#1c3849] hover:bg-[#0db8d3] hover:text-[#00363f] transition-all px-[24px] py-[10px] rounded-full font-mono-tech font-medium text-[#cae6fc] text-[12px] tracking-[0.72px] whitespace-nowrap cursor-pointer border border-white/10"
          >
            Baca Metodologi SDI →
          </button>
        </div>
      </section>
    </div>
  );
}
