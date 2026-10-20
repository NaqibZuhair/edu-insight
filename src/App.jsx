import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css' // Import CSS Leaflet di sini
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center max-w-md">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">EduInsight</h1>
        <p className="text-slate-300 mb-4">
          Tailwind CSS v4 & React Berhasil Terhubung!
        </p>
        <span className="inline-block bg-sky-500/20 text-sky-300 px-4 py-1.5 rounded-full text-sm font-medium border border-sky-500/30">
          Ready for WIA 2026
        </span>
      </div>
    </div>
  );
}
