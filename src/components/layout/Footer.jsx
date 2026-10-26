import { DATA_SOURCES } from '../../config/constants';

/**
 * Komponen footer informasi dan sumber data.
 */
export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-200">EduInsight</p>
          <p className="text-xs text-slate-500">Platform Analisis Kesenjangan Fasilitas Pendidikan Indonesia</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          {DATA_SOURCES.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-200 transition-colors"
            >
              {source.name} ({source.year})
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
