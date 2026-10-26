import { useState } from 'react';
import { DEFAULT_COMPARE_PROVINCES, DEFAULT_INDICATOR } from '../config/constants';
import { compareProvinces } from '../utils/dataService';

/**
 * Halaman Komparasi Antar-Provinsi.
 */
export default function ComparePage() {
  const [selectedProvinces] = useState(DEFAULT_COMPARE_PROVINCES);
  const [indicator] = useState(DEFAULT_INDICATOR);
  const comparisonData = compareProvinces(selectedProvinces, indicator);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Perbandingan Provinsi</h1>
        <p className="text-sm text-slate-400">Komparasi capaian indikator antar 2 sampai 3 provinsi terpilih</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comparisonData.map((item) => (
          <div key={item.name} className="p-5 rounded-xl border border-slate-800 bg-slate-900/50">
            <h2 className="text-lg font-semibold text-white">{item.name}</h2>
            <div className="mt-3 space-y-1 text-sm text-slate-300">
              <p>Total: {item.indicators?.total ?? '-'}%</p>
              {item.indicators?.negeri !== undefined && (
                <p className="text-xs text-slate-400">
                  Negeri: {item.indicators.negeri}% | Swasta: {item.indicators.swasta}%
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <section className="h-80 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-center justify-center text-slate-500 text-sm">
        Placeholder Komponen Visualisasi Komparasi (Bar Chart)
      </section>
    </div>
  );
}
