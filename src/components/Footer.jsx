const LOGO_FOOTER = '/assets/figma/fbea7d27-9752-47b7-bb87-8ca6ef491376.png';

export default function Footer({ onNavigate }) {
  return (
    <footer
      data-node-id="166:1789"
      className="backdrop-blur-[12px] bg-[rgba(0,16,27,0.85)] border-t border-[rgba(255,255,255,0.1)] w-full mt-12 sm:mt-16"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
        {/* Left Brand & Description */}
        <div className="flex items-start sm:items-center gap-4">
          <button
            type="button"
            onClick={() => {
              if (onNavigate) onNavigate('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Kembali ke beranda Dasbor EduInsight Indonesia"
            className="w-[64px] sm:w-[72px] min-h-[48px] h-[54px] shrink-0 cursor-pointer group"
          >
            <img
              src={LOGO_FOOTER}
              alt="Logo EduInsight Indonesia"
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </button>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-space font-bold text-[#cae6fc] text-[18px] sm:text-[20px] leading-[28px] tracking-[-0.5px]">
                EduInsight Indonesia
              </span>
              <span className="bg-[#0f2d3d] border border-[rgba(255,255,255,0.1)] px-[9px] py-[3px] rounded-full font-mono-tech font-medium text-[#4bd7f3] text-[10px] leading-[14px] tracking-[0.8px]">
                v2.4
              </span>
            </div>
            <p className="font-geist font-normal text-[#bcc9cd] text-[12px] leading-[18px] max-w-[540px]">
              Platform pemantauan dan analisis ketimpangan sarana dan prasarana pendidikan dasar dan
              menengah di 38 provinsi di Indonesia.
            </p>
          </div>
        </div>

        {/* Right Attribution & Copyright */}
        <div className="flex flex-col md:items-end gap-1">
          <span className="font-mono-tech font-medium text-[#bcc9cd] text-[10px] leading-[14px] tracking-[0.8px] uppercase">
            TRANSPARANSI DATA &amp; SUMBER
          </span>
          <span className="font-geist font-normal text-[#869397] text-[12px] leading-[18px]">
            Kemendikdasmen SDI (Satu Data Indonesia) · Neraca Pendidikan Daerah
          </span>
          <span className="font-mono-tech font-medium text-[#3c494c] text-[10px] leading-[14px] tracking-[0.8px] pt-1">
            © 2024 EduInsight Indonesia. Terbuka untuk riset dan publik.
          </span>
        </div>
      </div>
    </footer>
  );
}
