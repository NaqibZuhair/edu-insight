import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardView from './views/DashboardView';
import PerbandinganView from './views/PerbandinganView';
import DisparitasView from './views/DisparitasView';
import { X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [selectedProvinceNames, setSelectedProvinceNames] = useState([
    'DKI Jakarta',
    'DI Yogyakarta',
    'Papua Pegunungan'
  ]);

  const handleAddProvinceToCompare = (provName) => {
    if (!provName) return;
    setSelectedProvinceNames((prev) => {
      if (prev.some((n) => n.toLowerCase() === provName.toLowerCase())) {
        return prev;
      }
      if (prev.length < 3) {
        return [...prev, provName];
      }
      return [prev[0], prev[1], provName];
    });
  };

  return (
    <div className="min-h-screen text-[#cae6fc] bg-[#00101b] flex flex-col relative selection:bg-[#0db8d3]/30 selection:text-[#4bd7f3]">
      {/* Dynamic Atmospheric Glow Orbs - Balanced Left & Right */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute bg-[rgba(0,118,210,0.12)] blur-[150px] -left-[140px] rounded-full size-[550px] top-[180px]" />
        <div className="absolute bg-[rgba(13,184,211,0.1)] blur-[140px] left-1/2 -translate-x-1/2 rounded-full size-[600px] top-[-160px]" />
        <div className="absolute bg-[rgba(0,118,210,0.12)] blur-[150px] -right-[140px] rounded-full size-[550px] top-[180px]" />
      </div>

      {/* Navigation Header (Figma 117:507) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMethodology={() => setMethodologyOpen(true)}
      />

      {/* Main Content Area: STRICTLY 3 PAGES */}
      <main className="flex-1 relative z-10 w-full">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={setActiveTab}
            onAddProvinceToCompare={handleAddProvinceToCompare}
            onOpenMethodology={() => setMethodologyOpen(true)}
          />
        )}

        {activeTab === 'perbandingan' && (
          <PerbandinganView
            selectedProvinceNames={selectedProvinceNames}
            setSelectedProvinceNames={setSelectedProvinceNames}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'disparitas' && (
          <DisparitasView
            onNavigate={setActiveTab}
            onAddProvinceToCompare={handleAddProvinceToCompare}
          />
        )}
      </main>

      {/* Methodology SDI Modal Overlay */}
      {methodologyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#001e2e] border border-white/15 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl text-left">
            <button
              type="button"
              onClick={() => setMethodologyOpen(false)}
              className="absolute top-5 right-5 text-[#869397] hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0db8d3]/20 border border-[#0db8d3]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#0db8d3]" />
              <span className="font-mono-tech text-[10px] text-[#4bd7f3] uppercase tracking-wider">
                METODOLOGI SDI 2023
              </span>
            </div>
            <h3 className="font-space font-bold text-2xl text-[#cae6fc] mb-3">
              Standar Pengukuran &amp; Validasi Data
            </h3>
            <p className="font-geist text-sm text-[#bcc9cd] leading-relaxed mb-4">
              Indikator Kesiapan Sarana &amp; Prasarana Pendidikan EduInsight dihitung dari data resmi
              Satu Data Indonesia (SDI) 2023 Kemendikdasmen di 38 provinsi mencakup seluruh jenjang
              pendidikan formal (SD, SMP, SMA, SMK, dan SLB).
            </p>
            <div className="space-y-3 font-geist text-xs text-[#cae6fc] bg-[#001522] p-4 rounded-xl border border-white/5 mb-6">
              <p>
                <strong>1. Skor Komposit Kesiapan:</strong> Rata-rata terbobot dari 5 variabel kunci:
                Akses Lab Komputer (25%), Internet Stabil (25%), Aliran Listrik 24 Jam (20%), Sanitasi
                &amp; Air Bersih (15%), dan Guru D4/S1 Bersertifikasi (15%).
              </p>
              <p>
                <strong>2. Analisis Disparitas:</strong> Perhitungan selisih absolut dan persentase gap
                antara satuan pendidikan negeri dan swasta per provinsi, serta korelasi regresi
                terhadap Indeks Pembangunan Manusia (IPM) BPS.
              </p>
              <p>
                <strong>3. Wilayah Prioritas 3T:</strong> Klasifikasi daerah Terdepan, Terluar, dan
                Tertinggal berdasarkan Perpres untuk alokasi DAK Fisik Afirmasi.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMethodologyOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#0db8d3] hover:bg-[#4bd7f3] text-[#00363f] font-geist font-semibold text-sm transition-all cursor-pointer text-center"
            >
              Tutup Ringkasan Metodologi
            </button>
          </div>
        </div>
      )}

      {/* Shared Footer (Figma 117:491) */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
