const LOGO_HERO = '/assets/figma/11e472fa-f082-4980-9ccb-2e26f4cba3c0.png';

const NAV_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'perbandingan', label: 'Perbandingan' },
  { id: 'disparitas', label: 'Disparitas' },
  { id: 'metodologi', label: 'Metodologi' }
];

export default function Navbar({ activeTab, setActiveTab, onOpenMethodology }) {
  const handleTabClick = (tabId) => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 pt-4 pb-2 pointer-events-none">
      <div className="max-w-[1280px] w-full mx-auto flex h-[80px] items-center pointer-events-auto">
        <div
          data-node-id="117:509"
          className="backdrop-blur-[24px] bg-[rgba(28,56,73,0.6)] border border-[rgba(255,255,255,0.15)] grid grid-cols-[auto_1fr_auto] items-center w-full px-[20px] py-[8px] rounded-[9999px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.36)]"
        >
          {/* Brand Monogram Logo & Title */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => handleTabClick('dashboard')}
              className="flex gap-[8px] items-center pl-[4px] cursor-pointer group text-left"
            >
              <div className="relative size-[32px] shrink-0">
                <img
                  src={LOGO_HERO}
                  alt="EduInsight Logo"
                  className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-space font-semibold text-[#cae6fc] text-[20px] leading-[28px] tracking-[-0.5px]">
                  EduInsight
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Pills - Perfectly Balanced in Navbar Center */}
          <div className="flex items-center justify-center">
            <nav
              aria-label="Navigasi Utama"
              className="bg-[rgba(0,16,27,0.4)] border border-[rgba(255,255,255,0.05)] rounded-[9999px] flex gap-[4px] sm:gap-[8px] p-[4px] sm:p-[5px] overflow-x-auto"
            >
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-[12px] sm:px-[16px] py-[5px] sm:py-[6px] rounded-[9999px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#0db8d3] text-[#00444f] font-geist font-semibold text-[13px] sm:text-[14px] leading-[20px] sm:leading-[22px] shadow-[0px_0px_8px_rgba(13,184,211,0.35)]'
                        : 'text-[#bcc9cd] hover:text-[#cae6fc] font-geist font-normal text-[11px] sm:text-[12px] leading-[18px]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Status Pill */}
          <div className="flex items-center justify-end">
            <div
              data-node-id="117:524"
              className="bg-[rgba(15,45,61,0.6)] border border-[rgba(255,255,255,0.1)] flex items-center gap-[8px] px-[17px] py-[7px] rounded-[9999px]"
            >
              <div className="bg-[#0db8d3] rounded-full size-[8px] animate-pulse shadow-[0_0_8px_#0db8d3]" />
              <span className="font-mono-tech font-medium text-[#4bd7f3] text-[10px] leading-[14px] tracking-[0.8px] uppercase whitespace-nowrap">
                DATA SDI 2023 · 38 PROVINSI
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
