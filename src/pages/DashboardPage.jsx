import { useState } from 'react';
import { DEFAULT_INDICATOR, INDICATORS } from '../config/constants';
import { getNationalAverage, getIndicatorSummary } from '../utils/dataService';

/**
 * Halaman Dashboard utama (Peta Choropleth & Ringkasan Nasional).
 */
export default function DashboardPage() {
  const [selectedIndicator, setSelectedIndicator] = useState(DEFAULT_INDICATOR);
  const nationalAvg = getNationalAverage(selectedIndicator);
  const summary = getIndicatorSummary(selectedIndicator, 'total');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Nasional</h1>
          <p className="text-sm text-slate-400">Distribusi indikator fasilitas pendidikan 38 provinsi</p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="indicator-select" className="text-xs text-slate-400">Indikator:</label>
          <select
            id="indicator-select"
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-slate-500"
          >
            {INDICATORS.map((ind) => (
              <option key={ind.key} value={ind.key}>
                {ind.label} ({ind.unit})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <span className="text-xs text-slate-400">Rata-rata Nasional</span>
          <p className="text-2xl font-semibold text-white mt-1">{nationalAvg}%</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <span className="text-xs text-slate-400">Nilai Tertinggi</span>
          <p className="text-2xl font-semibold text-white mt-1">{summary?.max ?? 0}%</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <span className="text-xs text-slate-400">Nilai Terendah</span>
          <p className="text-2xl font-semibold text-white mt-1">{summary?.min ?? 0}%</p>
        </div>
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <span className="text-xs text-slate-400">Median</span>
          <p className="text-2xl font-semibold text-white mt-1">{summary?.median ?? 0}%</p>
        </div>
      </div>

      <section className="h-96 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-center justify-center text-slate-500 text-sm">
        Placeholder Komponen Peta Leaflet (Choropleth Map)
      </section>
    </div>
  );
}
