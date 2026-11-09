import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useMotionPreferences } from './MotionPrimitives';

const LOGO_HERO = '/assets/figma/11e472fa-f082-4980-9ccb-2e26f4cba3c0.png';

const NAV_TABS = [
  { id: 'dashboard', label: 'Dasbor' },
  { id: 'perbandingan', label: 'Perbandingan' },
  { id: 'disparitas', label: 'Disparitas' },
  { id: 'metodologi', label: 'Metodologi' }
];

export default function Navbar({ activeTab, setActiveTab, onOpenMethodology }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { reducedMotion } = useMotionPreferences();

  // Tutup menu mobile otomatis saat lebar layar kembali ke desktop (lg >= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabClick = (tabId) => {
    setMobileMenuOpen(false);
    if (tabId === 'metodologi') {
      if (onOpenMethodology) {
        onOpenMethodology();
      } else {
        const el = document.getElementById('metodologi-callout');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          setActiveTab('dashboard');
          setTimeout(() => {
            const callout = document.getElementById('metodologi-callout');
            if (callout) callout.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
      return;
    }
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 md:px-6 lg:px-8 pt-3 sm:pt-4 pb-2 pointer-events-none">
      <div className="max-w-[1280px] w-full mx-auto flex flex-col pointer-events-auto relative">
        <div
          data-node-id="117:509"
          className="backdrop-blur-[24px] bg-[rgba(28,56,73,0.65)] border border-[rgba(255,255,255,0.15)] flex lg:grid lg:grid-cols-[auto_1fr_auto] items-center justify-between w-full px-4 sm:px-[20px] py-[8px] rounded-[9999px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.36)] min-h-[60px]"
        >
          {/* Brand Monogram Logo & Title */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => handleTabClick('dashboard')}
              aria-label="Kembali ke beranda Dasbor EduInsight"
              className="flex gap-[8px] items-center pl-[4px] min-h-[44px] cursor-pointer group text-left"
            >
              <div className="relative size-[32px] shrink-0">
                <img
                  src={LOGO_HERO}
                  alt="Logo EduInsight"
                  className="size-full object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-space font-semibold text-[#cae6fc] text-[18px] sm:text-[20px] leading-[28px] tracking-[-0.5px]">
                  EduInsight
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Pills - Desktop (lg+) with Hover Underline Micro-interaction */}
          <div className="hidden lg:flex items-center justify-center">
            <nav
              aria-label="Navigasi Utama"
              className="bg-[rgba(0,16,27,0.4)] border border-[rgba(255,255,255,0.05)] rounded-[9999px] flex gap-[8px] p-[5px]"
            >
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`group relative px-[16px] py-[8px] min-h-[38px] rounded-[9999px] transition-transform duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#0db8d3] text-[#00444f] font-geist font-semibold text-[14px] leading-[20px] shadow-[0px_0px_8px_rgba(13,184,211,0.35)]'
                        : 'text-[#bcc9cd] hover:text-[#cae6fc] font-geist font-normal text-[13px] leading-[18px]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {!isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-1.5 left-4 right-4 h-[1.5px] bg-[#4bd7f3] rounded-full origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Status Pill & Hamburger Toggle */}
          <div className="flex items-center justify-end gap-2">
            <div
              data-node-id="117:524"
              className="hidden sm:flex bg-[rgba(15,45,61,0.6)] border border-[rgba(255,255,255,0.1)] items-center gap-[8px] px-[15px] py-[7px] rounded-[9999px]"
            >
              <div className="bg-[#0db8d3] rounded-full size-[8px] shadow-[0_0_8px_#0db8d3]" />
              <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] leading-[14px] tracking-[0.8px] uppercase whitespace-nowrap">
                DATA SDI 2023 · 38 PROVINSI
              </span>
            </div>

            {/* Hamburger Button (< lg) with smooth Menu <-> X transition */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="lg:hidden flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full bg-[rgba(0,16,27,0.5)] border border-white/10 text-[#cae6fc] hover:text-[#4bd7f3] hover:border-[#4bd7f3]/40 transition-transform duration-200 cursor-pointer"
            >
              <span
                className="inline-flex items-center justify-center transition-transform duration-200"
                style={{
                  transform: mobileMenuOpen ? 'rotate(90deg) scale(1.05)' : 'rotate(0deg) scale(1)'
                }}
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Collapsible Navigation Drawer (< lg) */}
        {mobileMenuOpen && (
          <nav
            id="mobile-navigation-drawer"
            aria-label="Menu Navigasi Seluler"
            className="lg:hidden mt-2 backdrop-blur-[24px] bg-[rgba(0,24,38,0.96)] border border-white/15 rounded-2xl p-3 shadow-2xl flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-left font-geist text-sm flex items-center justify-between transition-transform duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#0db8d3] text-[#00444f] font-semibold shadow-[0_0_12px_rgba(13,184,211,0.3)]'
                      : 'text-[#cae6fc] hover:bg-white/5 font-normal'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="font-mono-tech text-[10px] uppercase tracking-wider bg-[#00444f]/15 px-2 py-0.5 rounded-full">
                      Aktif
                    </span>
                  )}
                </button>
              );
            })}

            <div className="mt-1 pt-2.5 border-t border-white/10 flex items-center gap-2 px-3">
              <span className="bg-[#0db8d3] rounded-full size-2" />
              <span className="font-mono-tech text-[10px] text-[#4bd7f3] uppercase tracking-wider">
                DATA SDI 2023 · 38 PROVINSI
              </span>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
