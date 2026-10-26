import { DATA_SOURCES } from '../config/constants';

/**
 * Halaman Metodologi dan Sumber Data.
 */
export default function MethodologyPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Metodologi & Sumber Data</h1>
        <p className="text-sm text-slate-400 mt-1">Dokumentasi asal data, cakupan geografis, dan metode agregasi</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-200">Sumber Data Primer</h2>
        <div className="space-y-3">
          {DATA_SOURCES.map((source) => (
            <div key={source.name} className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
              <h3 className="text-sm font-semibold text-white">{source.name} ({source.year})</h3>
              <p className="text-xs text-slate-400 mt-1">{source.description}</p>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-xs text-sky-400 hover:underline"
              >
                Kunjungi Sumber Resmi
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-200">Metode Kalkulasi</h2>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-xs text-slate-400 space-y-2">
          <p>
            <strong>Rata-rata Nasional:</strong> Dihitung secara aritmatika unweighted dari 38 nilai capaian provinsi.
          </p>
          <p>
            <strong>Disparitas Sektor:</strong> Didefinisikan sebagai selisih persentase capaian sekolah Negeri dikurangi Swasta (Negeri - Swasta).
          </p>
          <p>
            <strong>Korelasi:</strong> Memetakan hubungan bivariat antara variabel fasilitas input dan indikator capaian output (IPM atau APS 13-15).
          </p>
        </div>
      </div>
    </div>
  );
}
