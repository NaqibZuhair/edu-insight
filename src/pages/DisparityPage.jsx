import { useState } from 'react';
import { DEFAULT_INDICATOR, FACILITY_INDICATORS } from '../config/constants';
import { getTopDisparityProvinces } from '../utils/dataService';

/**
 * Halaman Analisis Disparitas Sektor (Negeri vs Swasta).
 */
export default function DisparityPage() {
  const [indicator, setIndicator] = useState(DEFAULT_INDICATOR);
  const topDisparities = getTopDisparityProvinces(indicator, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Analisis Disparitas Sektor</h1>
          <p className="text-sm text-slate-400">Kesenjangan fasilitas antara sekolah Negeri dan Swasta</p>
        </div>

        <select
          value={indicator}
          onChange={(e) => setIndicator(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-slate-500"
        >
          {FACILITY_INDICATORS.map((ind) => (
            <option key={ind.key} value={ind.key}>
              {ind.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-200">5 Provinsi dengan Kesenjangan Terbesar</h2>
        </div>
        <div className="divide-y divide-slate-800/60">
          {topDisparities.map((item, index) => (
            <div key={item.province} className="px-5 py-3.5 flex items-center justify-between text-sm">
              <span className="text-slate-200 font-medium">{index + 1}. {item.province}</span>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>Negeri: {item.negeri}%</span>
                <span>Swasta: {item.swasta}%</span>
                <span className="font-semibold text-slate-200">Gap: {item.gap}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="h-80 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-center justify-center text-slate-500 text-sm">
        Placeholder Komponen Korelasi (Scatter Plot)
      </section>
    </div>
  );
}
