import { useState } from 'react';
import { ShieldCheck, MapPinned, BarChart3 } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    src: '/assets/figma/b9a16426-58d5-44c5-8e55-15092ffc2118.png',
    caption: 'Potret Sarana Ruang Kelas & Lingkungan Sekolah Dasar',
    region: 'Wilayah Kepulauan & Pedesaan'
  },
  {
    id: 2,
    src: '/assets/figma/97adf2d1-c3b0-4612-8511-7ab11f72b21e.png',
    caption: 'Kegiatan Pembelajaran Siswa di Daerah Terdepan, Terluar, Tertinggal (3T)',
    region: 'Indonesia Timur'
  },
  {
    id: 3,
    src: '/assets/figma/c3ed8bd0-20d2-4204-aa1c-28cd665f1b5a.png',
    caption: 'Semangat Belajar Anak Bangsa di Tengah Keterbatasan Infrastruktur',
    region: 'Nusa Tenggara & Maluku'
  },
  {
    id: 4,
    src: '/assets/figma/e80aa6a3-53cf-4747-a909-9cd63d09c348.png',
    caption: 'Transformasi Digital & Akses Perangkat TIK Satuan Pendidikan',
    region: 'Program Digitalisasi Sekolah'
  },
  {
    id: 5,
    src: '/assets/figma/f34616f1-f3dd-499f-89a7-15186add6041.png',
    caption: 'Kesiapan Laboratorium Komputer untuk Asesmen Nasional (ANBK)',
    region: 'Standar Pelayanan Minimal (SPM)'
  },
  {
    id: 6,
    src: '/assets/figma/a38b26f7-2e34-4d56-9f7d-2b4c4ee99e73.png',
    caption: 'Kolaborasi Guru Bersertifikasi & Siswa dalam Ekosistem Pendidikan',
    region: '38 Provinsi Indonesia'
  }
];

const BTN_BG_ELLIPSE = '/assets/figma/403774c1-852c-4b34-99ad-a036d3283780.svg';
const ICON_FORWARD = '/assets/figma/0d6f115e-83e1-43a3-9025-9b8c0caa6cc1.png';
const ICON_BACK = '/assets/figma/544e1043-3e8d-483e-9f43-09b23fac2224.png';

const VALUE_CARDS = [
  {
    title: 'Data Resmi',
    description:
      'Bersumber dari Satu Data Indonesia (SDI) & Kemendikbudristek untuk akurasi yang dapat dipertanggungjawabkan.',
    Icon: ShieldCheck
  },
  {
    title: 'Insight Wilayah',
    description:
      'Melihat kondisi pendidikan tiap provinsi secara menyeluruh dengan indikator infrastruktur terukur.',
    Icon: MapPinned
  },
  {
    title: 'Berbasis Data',
    description:
      'Mendukung analisis dan pengambilan keputusan kebijakan yang lebih tepat sasaran bagi daerah 3T.',
    Icon: BarChart3
  }
];

export default function SchoolCarousel() {
  // 5 positions (0..4) matching Frame 10, Frame 11, Frame 12, Frame 13, Frame 14 in Figma Component 2
  const [stepIndex, setStepIndex] = useState(0);
  const maxStep = 4;

  // Exact horizontal offsets from Figma Component 2 (node 149:27):
  // Frame 10: 0px, Frame 11: -390px, Frame 12: -780px, Frame 13: -1170px, Frame 14: -1560px
  const offsets = [0, -390, -780, -1170, -1560];

  const handlePrev = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStepIndex((prev) => Math.min(maxStep, prev + 1));
  };

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 pb-6 flex flex-col gap-12">
      {/* 3 Value Proposition Cards (Figma node 76:55) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VALUE_CARDS.map((card) => {
          const IconComponent = card.Icon;
          return (
            <div
              key={card.title}
              className="backdrop-blur-[20px] bg-gradient-to-b from-[#193546]/90 to-[#0f2d3d]/70 border border-white/15 rounded-[20px] p-6 flex flex-col gap-3 shadow-[0_12px_32px_rgba(0,0,0,0.3)] hover:border-[#4bd7f3]/40 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0db8d3]/15 border border-[#4bd7f3]/30 flex items-center justify-center text-[#4bd7f3]">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-dm font-bold text-[22px] leading-[28px] text-white">
                  {card.title}
                </h3>
              </div>
              <p className="font-lato text-[#cae6fc]/85 text-[14px] leading-[22px]">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 2-Column Editorial Intro (Figma node 152:294) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-4 pb-2 border-t border-white/10">
        <div className="lg:col-span-5">
          <h2 className="font-dm font-extrabold text-[32px] sm:text-[40px] leading-[1.18] text-white tracking-[-0.5px]">
            Data untuk Pendidikan yang Lebih Merata
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p className="font-lato text-[#cae6fc]/90 text-[16px] sm:text-[18px] leading-[28px]">
            EduInsight menyajikan data pendidikan dari berbagai provinsi di Indonesia secara ringkas
            dan mudah dipahami. Melalui visualisasi yang interaktif, pengguna dapat melihat
            perbandingan kondisi tiap wilayah dan menemukan kesenjangan yang perlu diperhatikan.
          </p>
        </div>
      </div>

      {/* Interactive 5-Step Photo Carousel (Figma Component 2, node 149:27) */}
      <div className="relative w-full py-2 select-none" data-node-id="149:27">
        {/* Carousel Viewport */}
        <div className="overflow-hidden rounded-[36px] sm:rounded-[50px] mx-auto max-w-[1198px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)] bg-[#00101b]/50">
          <div
            className="flex gap-[29px] transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(${offsets[stepIndex]}px)`
            }}
          >
            {SLIDES.map((slide) => (
              <div
                key={slide.id}
                className="relative w-[360px] sm:w-[460px] md:w-[503px] h-[250px] sm:h-[301px] shrink-0 rounded-[20px] overflow-hidden group"
              >
                <img
                  src={slide.src}
                  alt={slide.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00101b]/90 via-[#00101b]/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-4 left-5 right-5 flex flex-col gap-1">
                  <span className="font-mono-tech text-[10px] uppercase tracking-[0.8px] text-[#4bd7f3]">
                    {slide.region}
                  </span>
                  <p className="font-geist font-medium text-[14px] leading-[20px] text-[#cae6fc]">
                    {slide.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left Navigation Button */}
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Slide Sebelumnya"
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-[76px] h-[74px] sm:w-[96px] sm:h-[94px] cursor-pointer drop-shadow-[0px_4px_12px_rgba(0,0,0,0.45)] hover:scale-105 active:scale-95 transition-transform"
          >
            <img
              src={BTN_BG_ELLIPSE}
              alt=""
              className="absolute inset-0 w-full h-full object-contain"
            />
            <img
              src={ICON_BACK}
              alt="Kembali"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[48%] h-[48%] object-contain"
            />
          </button>
        )}

        {/* Right Navigation Button */}
        {stepIndex < maxStep && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Slide Selanjutnya"
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-[76px] h-[74px] sm:w-[96px] sm:h-[94px] cursor-pointer drop-shadow-[0px_4px_12px_rgba(0,0,0,0.45)] hover:scale-105 active:scale-95 transition-transform"
          >
            <img
              src={BTN_BG_ELLIPSE}
              alt=""
              className="absolute inset-0 w-full h-full object-contain"
            />
            <img
              src={ICON_FORWARD}
              alt="Maju"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </button>
        )}

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-3 mt-5">
          {[0, 1, 2, 3, 4].map((dotIdx) => {
            const isActive = stepIndex === dotIdx;
            return (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setStepIndex(dotIdx)}
                aria-label={`Ke Slide ${dotIdx + 1}`}
                className={`h-3.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-7 bg-[#0db8d3] shadow-[0_0_10px_#0db8d3]'
                    : 'w-3.5 bg-[#193546] hover:bg-[#065b98] border border-white/20'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
