import { useState, useMemo, useEffect, useRef } from 'react';
import {
  getEnrichedProvinces,
  getIndicatorValue,
  CHOROPLETH_LEGEND_ITEMS,
  getChoroplethColorMeta
} from '../utils/dataService';
import { formatPercentID } from '../constants/labels';
import { useMotionPreferences } from './MotionPrimitives';
import { MOTION_TOKENS } from '../constants/motionTokens';
import {
  ArrowUpRight,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Info
} from 'lucide-react';

const imgIcon = '/assets/figma/10e666b4-ceba-4572-ae59-12ffa28f24ac.svg';
const imgContainer7 = '/assets/figma/23efe18c-e362-444e-97c4-7b1500078615.svg';

const INDICATOR_OPTIONS = [
  { key: 'komputer', label: 'Komputer Sekolah (Lab TIK)' },
  { key: 'internet', label: 'Koneksi Internet Stabil' },
  { key: 'listrik', label: 'Pasokan Listrik 24 Jam' },
  { key: 'air_minum', label: 'Sanitasi & Air Bersih' },
  { key: 'guru_d4s1', label: 'Guru D4/S1 Bersertifikasi' },
  { key: 'composite', label: 'Skor Komposit (5 Indikator)' }
];

const SECTOR_OPTIONS = [
  { key: 'total', label: 'Semua Jenjang' },
  { key: 'negeri', label: 'Negeri (SD/SMP/SMA)', shortMobile: 'Negeri' },
  { key: 'swasta', label: 'Swasta', shortMobile: 'Swasta' }
];

// Vector paths for the 7 major island clusters of Indonesia (viewBox: 0 0 1000 440)
const ISLAND_REGIONS = [
  {
    id: 'sumatera',
    name: 'Sumatera',
    matchRegion: 'sumatera',
    representativeProv: 'Sumatera Utara',
    labelPos: { x: 180, y: 155 },
    paths: [
      'M 82 78 C 95 72, 115 80, 135 105 C 150 120, 175 145, 195 170 C 215 195, 235 220, 250 250 C 265 280, 275 305, 282 328 C 280 338, 272 342, 258 335 C 242 328, 225 305, 205 275 C 185 245, 165 215, 145 180 C 125 145, 105 115, 88 95 C 78 85, 76 80, 82 78 Z',
      'M 268 248 C 278 242, 288 252, 292 272 C 288 280, 278 282, 272 275 C 265 268, 262 255, 268 248 Z',
      'M 305 268 C 318 265, 325 275, 322 286 C 314 290, 305 285, 305 268 Z',
      'M 245 162 C 255 160, 258 170, 252 176 C 245 178, 240 172, 245 162 Z M 256 172 C 265 170, 268 180, 260 185 C 254 184, 252 178, 256 172 Z',
      'M 108 175 C 116 172, 120 185, 116 198 C 110 200, 105 192, 108 175 Z',
      'M 138 225 C 146 222, 150 236, 145 252 C 140 254, 134 245, 138 225 Z M 152 262 C 160 260, 165 275, 160 288 C 154 288, 148 280, 152 262 Z'
    ]
  },
  {
    id: 'kalimantan',
    name: 'Kalimantan',
    matchRegion: 'kalimantan',
    representativeProv: 'Kalimantan Barat',
    labelPos: { x: 410, y: 190 },
    paths: [
      'M 355 135 C 375 125, 420 128, 455 112 C 475 108, 482 125, 475 145 C 498 170, 470 195, 460 225 C 450 255, 435 264, 405 264 C 375 264, 350 252, 346 220 C 344 185, 348 155, 355 135 Z'
    ]
  },
  {
    id: 'jawa',
    name: 'Pulau Jawa',
    matchRegion: 'jawa',
    representativeProv: 'DKI Jakarta',
    labelPos: { x: 375, y: 388 },
    paths: [
      'M 285 332 C 305 326, 335 328, 365 330 C 390 332, 415 322, 435 330 C 460 334, 485 340, 518 350 C 516 366, 495 364, 465 362 C 430 360, 395 358, 365 355 C 335 352, 305 350, 282 342 C 278 338, 278 335, 285 332 Z',
      'M 465 326 C 485 322, 510 326, 508 334 C 495 338, 475 336, 465 326 Z'
    ]
  },
  {
    id: 'nusa-tenggara',
    name: 'Nusa Tenggara',
    matchRegion: 'nusa',
    representativeProv: 'Nusa Tenggara Timur',
    labelPos: { x: 620, y: 415 },
    paths: [
      'M 526 348 C 538 344, 546 352, 544 362 C 538 368, 528 365, 526 348 Z',
      'M 556 350 C 572 348, 576 360, 572 368 C 560 370, 554 362, 556 350 Z',
      'M 584 348 C 602 344, 615 356, 608 364 C 615 350, 638 352, 636 364 C 625 368, 592 366, 584 348 Z',
      'M 648 352 C 675 350, 705 348, 715 352 C 708 360, 678 360, 648 358 Z M 718 348 C 728 348, 730 354, 720 356 Z',
      'M 648 375 C 672 372, 682 384, 676 392 C 658 395, 645 388, 648 375 Z',
      'M 720 385 C 738 374, 755 368, 752 380 C 740 392, 722 396, 720 385 Z M 712 396 C 722 395, 724 402, 715 404 Z'
    ]
  },
  {
    id: 'sulawesi',
    name: 'Sulawesi',
    matchRegion: 'sulawesi',
    representativeProv: 'Sulawesi Selatan',
    labelPos: { x: 625, y: 220 },
    paths: [
      'M 580 185 C 576 160, 605 152, 635 142 C 658 130, 664 142, 645 155 C 625 168, 596 178, 588 188 C 596 195, 628 202, 634 212 C 625 218, 598 214, 588 210 C 602 230, 625 250, 622 268 C 612 288, 596 270, 588 245 C 582 258, 578 285, 572 298 C 564 288, 562 255, 562 235 C 565 212, 575 195, 580 185 Z'
    ]
  },
  {
    id: 'maluku',
    name: 'Maluku',
    matchRegion: 'maluku',
    representativeProv: 'Maluku',
    labelPos: { x: 740, y: 215 },
    paths: [
      'M 714 130 C 725 128, 728 145, 720 152 C 735 142, 738 155, 726 162 C 724 175, 732 195, 722 198 C 716 182, 715 160, 714 130 Z',
      'M 675 236 C 696 234, 702 245, 698 252 C 685 255, 674 248, 675 236 Z',
      'M 710 232 C 738 230, 765 236, 762 244 C 738 246, 712 242, 710 232 Z M 718 248 C 730 248, 730 256, 720 256 Z',
      'M 764 308 C 775 306, 776 322, 768 324 Z M 785 302 C 802 298, 804 332, 790 334 Z',
      'M 746 342 C 762 338, 764 365, 750 366 Z'
    ]
  },
  {
    id: 'papua',
    name: 'Papua',
    matchRegion: 'papua',
    representativeProv: 'Papua Pegunungan',
    labelPos: { x: 895, y: 275 },
    paths: [
      'M 770 178 C 795 170, 825 168, 832 182 C 825 198, 808 208, 802 222 C 790 232, 782 215, 770 195 C 764 185, 766 180, 770 178 Z',
      'M 832 182 C 870 184, 915 186, 955 190 L 955 330 C 935 332, 910 315, 875 285 C 848 260, 835 235, 832 182 Z',
      'M 842 162 C 854 160, 856 168, 846 170 Z M 848 176 C 872 175, 872 182, 852 184 Z'
    ]
  }
];

function formatScoreOrMissing(val) {
  if (val === null || val === undefined || Number.isNaN(Number(val))) {
    return 'Data tidak tersedia';
  }
  return formatPercentID(val);
}

export default function IndonesiaMapSection({
  selectedIndicator,
  setSelectedIndicator,
  selectedSector,
  setSelectedSector,
  onSelectProvinceForCompare
}) {
  const { reducedMotion } = useMotionPreferences();
  const [selectedProvName, setSelectedProvName] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [mapEntered, setMapEntered] = useState(() => reducedMotion);
  const [, setViewportTick] = useState(0);

  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const dropdownRef = useRef(null);

  const enrichedProvinces = useMemo(
    () => getEnrichedProvinces(selectedIndicator, selectedSector),
    [selectedIndicator, selectedSector]
  );

  // Urutan penyalaan provinsi dari nilai TERENDAH ke TERTINGGI (0 .. 37)
  // agar mata pengguna melihat pola ketimpangan dari timur (rendah) ke barat (tinggi) dalam <= 1,2 detik.
  const lowToHighOrderMap = useMemo(() => {
    const ascending = [...enrichedProvinces].sort((a, b) => {
      const sA = a.score ?? -1;
      const sB = b.score ?? -1;
      return sA - sB;
    });
    const map = {};
    ascending.forEach((p, idx) => {
      map[p.name] = idx;
    });
    return map;
  }, [enrichedProvinces]);

  // Hitung rata-rata skor indikator aktif per gugus pulau untuk pewarnaan choropleth dinamis
  const islandColorMap = useMemo(() => {
    const result = {};
    ISLAND_REGIONS.forEach((reg) => {
      const provsInIsland = enrichedProvinces.filter((p) =>
        (p.geo?.region || '').toLowerCase().includes(reg.matchRegion)
      );
      const validScores = provsInIsland
        .map((p) => p.score)
        .filter((s) => s !== null && s !== undefined && !Number.isNaN(Number(s)));
      if (!validScores.length) {
        result[reg.id] = getChoroplethColorMeta(null);
      } else {
        const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
        result[reg.id] = getChoroplethColorMeta(avg);
      }
    });
    return result;
  }, [enrichedProvinces]);

  const activeProvince = useMemo(() => {
    if (!selectedProvName) return null;
    return (
      enrichedProvinces.find(
        (p) => p.name.toLowerCase() === selectedProvName.toLowerCase()
      ) || null
    );
  }, [enrichedProvinces, selectedProvName]);

  const currentLabel =
    INDICATOR_OPTIONS.find((o) => o.key === selectedIndicator)?.label ||
    'Komputer Sekolah (Lab TIK)';

  // Smart placement: if the selected province is in the east (x > 500), place popup on the left, else on the right
  const isEastProvince = useMemo(() => {
    if (!activeProvince) return false;
    const xCoord = (activeProvince.geo?.x || 50) * 10;
    return xCoord > 500;
  }, [activeProvince]);

  // FlyToBounds camera transform (<= 1s) saat provinsi dipilih
  const cameraTransform = useMemo(() => {
    if (!activeProvince || reducedMotion) {
      return 'translate3d(0px, 0px, 0px) scale(1)';
    }
    const targetX = (activeProvince.geo?.x || 50) * 10;
    const targetY = (activeProvince.geo?.y || 50) * 4.4;
    const zoom = 1.28;
    // Geser titik provinsi mendekati tengah kanvas (500, 220) dengan batas aman
    const rawTx = (500 - targetX) * 0.35;
    const rawTy = (220 - targetY) * 0.35;
    const tx = Math.max(-140, Math.min(140, Math.round(rawTx)));
    const ty = Math.max(-65, Math.min(65, Math.round(rawTy)));
    return `translate3d(${tx}px, ${ty}px, 0px) scale(${zoom})`;
  }, [activeProvince, reducedMotion]);

  // Trigger stagger reveal sekali saat peta masuk viewport
  useEffect(() => {
    if (reducedMotion) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      const raf = requestAnimationFrame(() => setMapEntered(true));
      return () => cancelAnimationFrame(raf);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setMapEntered(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // Recalculate map container dimensions on window resize / orientation change
  useEffect(() => {
    const handleResize = () => {
      setViewportTick((t) => t + 1);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Close indicator dropdown when clicking outside
  useEffect(() => {
    const handleOutsideDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('pointerdown', handleOutsideDropdown);
      return () => document.removeEventListener('pointerdown', handleOutsideDropdown);
    }
  }, [dropdownOpen]);

  // Close popup whenever clicking anywhere outside the popup card
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        if (!e.target.closest('[data-map-node]')) {
          setSelectedProvName(null);
        }
      }
    };

    if (selectedProvName) {
      document.addEventListener('pointerdown', handleOutsideClick);
      return () => document.removeEventListener('pointerdown', handleOutsideClick);
    }
  }, [selectedProvName]);

  // Close popup on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProvName(null);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter provinces for quick search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return enrichedProvinces
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [enrichedProvinces, searchQuery]);

  return (
    <section
      id="peta-interaktif"
      data-node-id="117:145"
      className="backdrop-blur-[40px] bg-[rgba(0,30,46,0.9)] flex flex-col items-start overflow-visible pb-6 sm:pb-[32px] pt-6 sm:pt-[40px] px-4 sm:px-6 lg:px-8 relative rounded-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] w-full border border-white/10"
    >
      {/* Mobile Filter Panel Header Toggle (< md) */}
      <div className="flex md:hidden items-center justify-between w-full pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-[#4bd7f3]" />
          <span className="font-mono-tech font-semibold text-xs text-[#cae6fc] uppercase tracking-wider">
            Filter &amp; Pencarian Peta
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileFilterOpen((prev) => !prev)}
          aria-expanded={mobileFilterOpen}
          aria-label={
            mobileFilterOpen ? 'Sembunyikan panel filter peta' : 'Tampilkan panel filter peta'
          }
          className="inline-flex items-center gap-1.5 px-3 min-h-[44px] rounded-full bg-[rgba(15,45,61,0.8)] border border-white/10 text-xs font-geist text-[#4bd7f3] cursor-pointer"
        >
          <span>{mobileFilterOpen ? 'Lipat Filter' : 'Buka Filter'}</span>
          {mobileFilterOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
      </div>

      {/* Header Bar & Controls Above Map Canvas (Figma node 117:146) */}
      <div
        className={`${
          mobileFilterOpen ? 'flex' : 'hidden md:flex'
        } flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between pb-[20px] sm:pb-[24px] w-full`}
      >
        {/* Left: Indicator Selector Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-[12px] w-full lg:w-auto">
          <span className="font-mono-tech font-medium text-[#869397] text-[10px] leading-[14px] tracking-[0.5px] uppercase whitespace-nowrap">
            INDIKATOR DISPARITAS:
          </span>

          <div ref={dropdownRef} className="relative w-full sm:w-[320px]">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-label="Pilih indikator kesiapan infrastruktur"
              className="bg-[#0f2d3d] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between px-4 py-[10px] min-h-[44px] rounded-[48px] w-full text-left cursor-pointer border border-white/10 hover:border-[#4bd7f3]/40 transition-colors"
            >
              <span className="font-geist font-semibold text-[#cae6fc] text-sm sm:text-[16px] tracking-[0.16px] truncate">
                {currentLabel}
              </span>
              <img src={imgIcon} alt="" className="size-[14px] shrink-0 ml-2" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-full bg-[#001e2e] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 backdrop-blur-xl">
                {INDICATOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setSelectedIndicator(opt.key);
                      setDropdownOpen(false);
                    }}
                    className={`text-left px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-geist transition-colors cursor-pointer ${
                      selectedIndicator === opt.key
                        ? 'bg-[#0db8d3] text-[#00363f] font-semibold'
                        : 'text-[#cae6fc] hover:bg-white/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center / Right: Quick Search + Sector Segmented Pills */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Quick Search Input (text-base on mobile to prevent iOS auto-zoom) */}
          <div className="relative w-full sm:w-56">
            <div className="flex items-center gap-2 bg-[rgba(0,16,27,0.7)] border border-white/10 px-3.5 min-h-[44px] rounded-full text-[#cae6fc]">
              <Search className="size-4 text-[#869397] shrink-0" />
              <input
                type="text"
                aria-label="Cari provinsi pada peta"
                placeholder="Cari provinsi…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-base sm:text-xs text-[#cae6fc] placeholder-[#869397] w-full font-geist"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Atur ulang pencarian provinsi"
                  title="Atur Ulang"
                  className="text-[#869397] hover:text-white p-1 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="absolute left-0 top-full mt-1.5 w-full bg-[#001e2e] border border-white/15 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-1 backdrop-blur-xl">
                {searchResults.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setSelectedProvName(p.name);
                      setSearchQuery('');
                    }}
                    className="text-left px-3 py-2 min-h-[44px] rounded-lg text-xs font-geist text-[#cae6fc] hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center"
                  >
                    <span>{p.name}</span>
                    <span className="font-mono-tech text-[10px] text-[#4bd7f3]">
                      {formatScoreOrMissing(p.score)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sector Segmented Pills */}
          <div
            data-node-id="117:156"
            role="group"
            aria-label="Filter sektor satuan pendidikan"
            className="bg-[rgba(0,16,27,0.8)] flex gap-[4px] items-center p-[4px] rounded-[9999px] w-full sm:w-auto border border-white/5"
          >
            {SECTOR_OPTIONS.map((sec) => {
              const isActive = selectedSector === sec.key;
              return (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => setSelectedSector(sec.key)}
                  className={`flex-1 sm:flex-initial px-[10px] sm:px-[16px] py-[8px] min-h-[40px] rounded-[9999px] transition-all cursor-pointer whitespace-nowrap text-center ${
                    isActive
                      ? 'bg-[#0db8d3] text-[#00444f] font-mono-tech font-bold text-[11px] sm:text-[12px] tracking-[0.5px] sm:tracking-[0.72px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'
                      : 'text-[#bcc9cd] hover:text-[#cae6fc] font-mono-tech font-medium text-[11px] sm:text-[12px] tracking-[0.5px] sm:tracking-[0.72px]'
                  }`}
                >
                  <span className="sm:hidden">{sec.shortMobile || sec.label}</span>
                  <span className="hidden sm:inline">{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Archipelagic Map Canvas Container (Figma node 117:163) */}
      <div
        ref={containerRef}
        onClick={() => setSelectedProvName(null)}
        data-node-id="117:163"
        className="map-water-area bg-[rgba(0,16,27,0.92)] flex h-[48vh] min-h-[300px] sm:h-[58vh] md:h-[64vh] max-h-[540px] items-center justify-center overflow-hidden relative rounded-[16px] shrink-0 w-full border border-white/10 cursor-default select-none shadow-inner touch-manipulation"
      >
        {/* Background Coordinate Grid Overlay */}
        <div className="map-water-area absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 bottom-0 left-[15%] border-r border-white/20" />
          <div className="absolute top-0 bottom-0 left-[35%] border-r border-white/20" />
          <div className="absolute top-0 bottom-0 left-[55%] border-r border-white/20" />
          <div className="absolute top-0 bottom-0 left-[75%] border-r border-white/20" />
          <div className="absolute top-0 bottom-0 left-[92%] border-r border-white/20" />
        </div>

        {/* Reset Zoom Button when a province is focused */}
        {activeProvince && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProvName(null);
            }}
            aria-label="Atur ulang tampilan fokus peta"
            className="absolute top-3 left-3 z-20 bg-[#001e2e]/90 hover:bg-[#0db8d3] text-[#cae6fc] hover:text-[#00363f] border border-white/15 px-3 py-1.5 min-h-[36px] rounded-full text-[11px] font-mono-tech flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <RotateCcw className="size-3" />
            <span>Tampilkan Seluruh Nusantara</span>
          </button>
        )}

        {/* SVG Archipelago Map */}
        <svg
          viewBox="0 0 1000 440"
          role="img"
          aria-label="Peta choropleth interaktif kesiapan sarana dan prasarana pendidikan 38 provinsi di Indonesia"
          className="w-full h-full p-1 sm:p-4"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#4bd7f3" floodOpacity="0.6" />
            </filter>
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.65" />
            </filter>

            {/* Pola Arsir Abu-abu untuk "Data tidak tersedia" (null / NaN) */}
            <pattern
              id="pattern-no-data"
              width="8"
              height="8"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <rect width="8" height="8" fill="#1e293b" />
              <line x1="0" y1="0" x2="0" y2="8" stroke="#64748b" strokeWidth="3" />
            </pattern>

            {/* 4 Gradien Kelas Choropleth yang Konsisten dengan Legenda & Ramah Buta Warna */}
            <linearGradient id="grad-tier-critical" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2c1808" />
              <stop offset="100%" stopColor="#6b3410" />
            </linearGradient>
            <linearGradient id="grad-tier-medium" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0c2d48" />
              <stop offset="100%" stopColor="#164e78" />
            </linearGradient>
            <linearGradient id="grad-tier-good" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0d3b5e" />
              <stop offset="100%" stopColor="#1d6fa5" />
            </linearGradient>
            <linearGradient id="grad-tier-high" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0d4a63" />
              <stop offset="100%" stopColor="#0db8d3" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Grup Kamera untuk FlyToBounds (<= 850ms ease-out) */}
          <g
            style={{
              transform: cameraTransform,
              transformOrigin: '500px 220px',
              transition: reducedMotion
                ? 'none'
                : `transform ${MOTION_TOKENS.duration.flyToBounds}ms ${MOTION_TOKENS.easing.easeOut}`
            }}
          >
            {/* Equator Line (Khatulistiwa 0°00') */}
            <g className="pointer-events-none">
              <line
                x1="50"
                y1="170"
                x2="950"
                y2="170"
                stroke="#4bd7f3"
                strokeWidth="1.2"
                strokeDasharray="6 6"
                opacity="0.35"
              />
              <text
                x="55"
                y="163"
                fill="#869397"
                fontSize="10"
                fontFamily="monospace"
                opacity="0.65"
                letterSpacing="0.8"
              >
                Khatulistiwa 0°00&apos;
              </text>
            </g>

            {/* Render Island Clusters with Dynamic Choropleth Tier Colors */}
            {ISLAND_REGIONS.map((region) => {
              const isHovered = hoveredRegion === region.id;
              const isSelected =
                activeProvince &&
                activeProvince.geo?.region?.toLowerCase().includes(region.matchRegion);
              const regionColorMeta = islandColorMap[region.id] || getChoroplethColorMeta(null);

              return (
                <g
                  key={region.id}
                  data-map-node="true"
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProvName(region.representativeProv);
                  }}
                >
                  {region.paths.map((pData, pIdx) => (
                    <path
                      key={pIdx}
                      d={pData}
                      fill={regionColorMeta.regionFill}
                      stroke={
                        isSelected
                          ? '#ffffff'
                          : isHovered
                          ? '#cae6fc'
                          : regionColorMeta.regionStroke
                      }
                      strokeWidth={isSelected ? '2' : isHovered ? '1.5' : '1.15'}
                      strokeOpacity={isSelected ? 1 : isHovered ? 0.95 : 0.65}
                      filter={isSelected ? regionColorMeta.glowFilter : 'none'}
                      className="map-region-path"
                    />
                  ))}

                  {/* Region Label */}
                  <text
                    x={region.labelPos.x}
                    y={region.labelPos.y}
                    fill={isSelected ? '#ffffff' : isHovered ? '#cae6fc' : '#bcc9cd'}
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="sans-serif"
                    letterSpacing="1"
                    textAnchor="middle"
                    opacity={isSelected || isHovered ? 0.95 : 0.65}
                    className="transition-opacity duration-200 pointer-events-none select-none uppercase"
                  >
                    {region.name}
                  </text>
                </g>
              );
            })}

            {/* 38 Interactive Province Node Markers (Staggered Low -> High on initial reveal) */}
            {enrichedProvinces.map((prov) => {
              const x = (prov.geo?.x || 50) * 10;
              const y = (prov.geo?.y || 50) * 4.4;
              const isSelected = activeProvince?.name === prov.name;
              const isHovered = hoveredNode === prov.name;
              const colorMeta = getChoroplethColorMeta(prov.score);
              const nodeColor = isSelected ? '#ffffff' : colorMeta.nodeColor;

              // Stagger delay berdasarkan urutan nilai dari terendah (0) ke tertinggi (37), maks 900ms + 280ms durasi = 1,18s (<= 1,2s)
              const orderIdx = lowToHighOrderMap[prov.name] ?? 0;
              const staggerDelayMs = reducedMotion ? 0 : Math.round((orderIdx / 37) * 900);

              return (
                <g
                  key={prov.name}
                  data-map-node="true"
                  className="cursor-pointer map-node-group"
                  style={
                    reducedMotion
                      ? undefined
                      : {
                          opacity: mapEntered ? 1 : 0,
                          transform: mapEntered ? 'scale(1)' : 'scale(0.2)',
                          transitionDelay: `${staggerDelayMs}ms`
                        }
                  }
                  onMouseEnter={() => setHoveredNode(prov.name)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProvName(prov.name);
                  }}
                >
                  {/* Invisible Expanded Touch Area for Mobile Accessibility */}
                  <circle cx={x} cy={y} r="15" fill="transparent" />

                  {/* Outer Ring when hovered or selected */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 13 : 10}
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      opacity="0.85"
                    />
                  )}

                  {/* Inner Glow Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 6.5 : isHovered ? 5.5 : 4.2}
                    fill={nodeColor}
                    stroke="#00101b"
                    strokeWidth="1"
                    filter={colorMeta.glowFilter}
                    className="map-node-circle"
                  />

                  {/* Hover Mini Tooltip Tag with Value & Source Year */}
                  {isHovered && !isSelected && (
                    <g pointerEvents="none">
                      <rect
                        x={Math.max(10, Math.min(840, x - 75))}
                        y={Math.max(6, y - 42)}
                        width="150"
                        height="34"
                        rx="8"
                        fill="#001e2e"
                        stroke={colorMeta.nodeColor}
                        strokeWidth="1"
                        opacity="0.96"
                      />
                      <text
                        x={Math.max(85, Math.min(915, x))}
                        y={Math.max(20, y - 27)}
                        fill="#cae6fc"
                        fontSize="9.5"
                        fontFamily="sans-serif"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {prov.name.length > 16 ? `${prov.name.slice(0, 15)}…` : prov.name} ·{' '}
                        {formatScoreOrMissing(prov.score)}
                      </text>
                      <text
                        x={Math.max(85, Math.min(915, x))}
                        y={Math.max(32, y - 15)}
                        fill="#869397"
                        fontSize="8"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {prov.geo?.isDOB
                          ? `DOB (${prov.geo.parentProvince}) · SDI 2023`
                          : 'Sumber: SDI & BPS 2023'}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Desktop/Tablet Floating Detail Popup Card (md+) */}
        {activeProvince && (
          <div
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            data-node-id="117:217"
            className={`hidden md:flex absolute top-4 ${
              isEastProvince ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
            } backdrop-blur-[24px] bg-[rgba(15,45,61,0.95)] flex-col gap-[10px] p-[18px] rounded-[18px] shadow-[0px_20px_40px_rgba(0,0,0,0.65)] border border-[#4bd7f3]/40 z-30 max-w-[340px] w-full animate-in fade-in zoom-in-95 duration-200`}
          >
            {/* Header: Name + Status + Close Button */}
            <div className="flex items-center justify-between w-full border-b border-white/10 pb-2">
              <div className="flex gap-[8px] items-center truncate">
                <div
                  className="rounded-full size-[10px] shrink-0"
                  style={{
                    backgroundColor: getChoroplethColorMeta(activeProvince.score).nodeColor
                  }}
                />
                <span className="font-space font-bold text-[#cae6fc] text-[16px] truncate">
                  {activeProvince.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div
                  className={`px-[8px] py-[2px] rounded-full text-[10px] font-mono-tech font-medium ${
                    getChoroplethColorMeta(activeProvince.score).badgeClass
                  }`}
                >
                  {activeProvince.status} ({formatScoreOrMissing(activeProvince.score)})
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProvName(null)}
                  aria-label="Tutup detail provinsi"
                  title="Tutup detail provinsi"
                  className="text-[#869397] hover:text-[#cae6fc] p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* 3 Main Physical Metrics (Lab TIK, Internet, Listrik) */}
            <div className="bg-[rgba(0,16,27,0.75)] flex gap-[8px] items-start justify-center py-[10px] px-[8px] rounded-[14px] w-full border border-white/5">
              <div className="flex flex-1 flex-col items-center">
                <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px]">
                  Lab TIK
                </span>
                <span className="font-geist font-semibold text-[#cae6fc] text-[14px] pt-0.5">
                  {formatScoreOrMissing(
                    getIndicatorValue(activeProvince, 'komputer', selectedSector)
                  )}
                </span>
              </div>
              <div className="w-px h-8 bg-white/10 my-auto" />
              <div className="flex flex-1 flex-col items-center">
                <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px]">
                  Internet
                </span>
                <span className="font-geist font-semibold text-[#a4c9ff] text-[14px] pt-0.5">
                  {formatScoreOrMissing(
                    getIndicatorValue(activeProvince, 'internet', selectedSector)
                  )}
                </span>
              </div>
              <div className="w-px h-8 bg-white/10 my-auto" />
              <div className="flex flex-1 flex-col items-center">
                <span className="font-mono-tech font-medium text-[#869397] text-[10px] tracking-[0.5px]">
                  Listrik
                </span>
                <span className="font-geist font-semibold text-[#4bd7f3] text-[14px] pt-0.5">
                  {formatScoreOrMissing(
                    getIndicatorValue(activeProvince, 'listrik', selectedSector)
                  )}
                </span>
              </div>
            </div>

            {/* Additional Info: Peringkat & Wilayah */}
            <div className="flex items-center justify-between text-xs font-mono-tech text-[#bcc9cd] px-1">
              <span>Wilayah: {activeProvince.geo?.region}</span>
              <span className="text-[#4bd7f3]">Peringkat #{activeProvince.rank}/38</span>
            </div>

            {/* Source & DOB Derivation Note inside Popup */}
            <div className="bg-[rgba(0,16,27,0.55)] border border-white/5 rounded-xl px-2.5 py-2 text-[10px] font-geist text-[#bcc9cd] leading-relaxed">
              <div className="font-mono-tech text-[#869397] text-[9.5px]">
                Sumber: {activeProvince.geo?.dataSource || 'Kemendikdasmen SDI & BPS (2023)'}
              </div>
              {activeProvince.geo?.isDOB && (
                <div className="text-[#fde68a] mt-1 flex items-start gap-1.5">
                  <Info className="size-3.5 shrink-0 mt-0.5 text-[#f59e0b]" />
                  <span>
                    <strong>Provinsi DOB ({activeProvince.geo.dobLaw}):</strong>{' '}
                    {activeProvince.geo.dobNote}
                  </span>
                </div>
              )}
            </div>

            {/* Jump to Comparison CTA */}
            {onSelectProvinceForCompare && (
              <button
                type="button"
                onClick={() => onSelectProvinceForCompare(activeProvince.name)}
                className="w-full min-h-[40px] bg-[#0db8d3] hover:bg-[#4bd7f3] text-[#00363f] font-geist font-semibold text-xs py-2 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <span>Bandingkan Provinsi Ini</span>
                <ArrowUpRight className="size-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bar Legenda & Statistik Cepat di Luar Kanvas Peta (Agar Tidak Menghalangi Pulau Jawa / Nusa Tenggara) */}
      <div className="mt-3 flex flex-col xl:flex-row gap-2.5 xl:items-center justify-between w-full">
        {/* Choropleth Legend (Includes Critical, Blue Tiers, and No Data Hatched Swatch) */}
        <div
          data-node-id="117:243"
          className="backdrop-blur-[12px] bg-[rgba(15,45,61,0.75)] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-3.5 py-2.5 rounded-[14px] border border-white/10 w-full xl:w-auto"
        >
          <span className="font-mono-tech font-semibold text-[#869397] text-[9px] sm:text-[10px] tracking-[0.6px] uppercase shrink-0">
            LEGENDA SKALA KESIAPAN:
          </span>
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
            {CHOROPLETH_LEGEND_ITEMS.map((item) => (
              <div key={item.key} className="flex items-center gap-1.5">
                {item.isHatched ? (
                  <span
                    aria-hidden="true"
                    className="inline-block size-3 rounded-sm border border-[#94a3b8] shrink-0"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(45deg, #1e293b, #1e293b 2px, #64748b 2px, #64748b 4px)'
                    }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="inline-block size-3 rounded-sm border border-white/20 shrink-0"
                    style={{ backgroundColor: item.swatchColor }}
                  />
                )}
                <span className="font-mono-tech text-[9.5px] sm:text-[10px] text-[#cae6fc] whitespace-nowrap">
                  {item.range !== 'N/A' ? `${item.range} (${item.label})` : item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Source & Coverage Badge */}
        <div
          data-node-id="117:256"
          className="backdrop-blur-[12px] bg-[rgba(15,45,61,0.65)] flex gap-[8px] items-center px-[14px] py-[9px] rounded-full border border-white/10 self-start xl:self-auto shrink-0"
        >
          <img src={imgContainer7} alt="" className="w-[15px] h-[12px] shrink-0" />
          <span className="font-mono-tech font-medium text-[#bcc9cd] text-[10px] tracking-[0.6px]">
            38 Provinsi · SDI Kemendikdasmen &amp; BPS 2023
          </span>
        </div>
      </div>

      {/* Mobile Detail Card Below Map (< md) */}
      {activeProvince && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="md:hidden mt-4 backdrop-blur-[24px] bg-[rgba(15,45,61,0.95)] flex flex-col gap-3 p-4 rounded-2xl shadow-xl border border-[#4bd7f3]/40 w-full"
        >
          <div className="flex items-center justify-between w-full border-b border-white/10 pb-2">
            <div className="flex gap-2 items-center truncate">
              <div
                className="rounded-full size-2.5 shrink-0"
                style={{
                  backgroundColor: getChoroplethColorMeta(activeProvince.score).nodeColor
                }}
              />
              <span className="font-space font-bold text-[#cae6fc] text-base truncate">
                {activeProvince.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono-tech font-medium ${
                  getChoroplethColorMeta(activeProvince.score).badgeClass
                }`}
              >
                {activeProvince.status} ({formatScoreOrMissing(activeProvince.score)})
              </div>
              <button
                type="button"
                onClick={() => setSelectedProvName(null)}
                aria-label="Tutup detail provinsi"
                className="text-[#869397] hover:text-[#cae6fc] min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="bg-[rgba(0,16,27,0.75)] flex gap-2 items-start justify-center py-2.5 px-2 rounded-xl w-full border border-white/5">
            <div className="flex flex-1 flex-col items-center">
              <span className="font-mono-tech font-medium text-[#869397] text-[10px]">Lab TIK</span>
              <span className="font-geist font-semibold text-[#cae6fc] text-sm pt-0.5">
                {formatScoreOrMissing(
                  getIndicatorValue(activeProvince, 'komputer', selectedSector)
                )}
              </span>
            </div>
            <div className="w-px h-8 bg-white/10 my-auto" />
            <div className="flex flex-1 flex-col items-center">
              <span className="font-mono-tech font-medium text-[#869397] text-[10px]">Internet</span>
              <span className="font-geist font-semibold text-[#a4c9ff] text-sm pt-0.5">
                {formatScoreOrMissing(
                  getIndicatorValue(activeProvince, 'internet', selectedSector)
                )}
              </span>
            </div>
            <div className="w-px h-8 bg-white/10 my-auto" />
            <div className="flex flex-1 flex-col items-center">
              <span className="font-mono-tech font-medium text-[#869397] text-[10px]">Listrik</span>
              <span className="font-geist font-semibold text-[#4bd7f3] text-sm pt-0.5">
                {formatScoreOrMissing(
                  getIndicatorValue(activeProvince, 'listrik', selectedSector)
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono-tech text-[#bcc9cd] px-1">
            <span>Wilayah: {activeProvince.geo?.region}</span>
            <span className="text-[#4bd7f3]">Peringkat #{activeProvince.rank}/38</span>
          </div>

          <div className="bg-[rgba(0,16,27,0.55)] border border-white/5 rounded-xl px-3 py-2 text-[11px] font-geist text-[#bcc9cd]">
            <div className="font-mono-tech text-[10px] text-[#869397]">
              Sumber: {activeProvince.geo?.dataSource || 'Kemendikdasmen SDI & BPS (2023)'}
            </div>
            {activeProvince.geo?.isDOB && (
              <div className="text-[#fde68a] mt-1">
                <strong>Provinsi DOB ({activeProvince.geo.dobLaw}):</strong>{' '}
                {activeProvince.geo.dobNote}
              </div>
            )}
          </div>

          {onSelectProvinceForCompare && (
            <button
              type="button"
              onClick={() => onSelectProvinceForCompare(activeProvince.name)}
              className="w-full min-h-[44px] bg-[#0db8d3] hover:bg-[#4bd7f3] text-[#00363f] font-geist font-semibold text-xs py-2.5 rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <span>Bandingkan Provinsi Ini</span>
              <ArrowUpRight className="size-4" />
            </button>
          )}
        </div>
      )}

      {/* Catatan Kaki Peta: Transparansi Sumber Data & Penurunan Data Provinsi DOB Papua */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full text-[11px] font-geist text-[#869397]">
        <div className="flex items-start sm:items-center gap-2">
          <Info className="size-3.5 text-[#4bd7f3] shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong className="text-[#bcc9cd]">Catatan Data Provinsi Baru (DOB Papua):</strong> Data
            4 provinsi pemekaran (Papua Selatan, Papua Tengah, Papua Pegunungan, dan Papua Barat
            Daya) diturunkan dan diagregasi dari provinsi induk (Papua &amp; Papua Barat) sesuai
            masa transisi pendataan Satu Data Indonesia (SDI) Kemendikdasmen &amp; BPS 2023.
          </span>
        </div>
        <span className="font-mono-tech text-[10px] text-[#4bd7f3] shrink-0">
          Urutan Nyala: Nilai Terendah → Tertinggi
        </span>
      </div>
    </section>
  );
}
