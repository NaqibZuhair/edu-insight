import { NavLink } from 'react-router-dom';
import { NAV_ROUTES } from '../../config/constants';

/**
 * Komponen navigasi utama aplikasi.
 */
export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="text-xl font-bold tracking-tight text-white">
            EduInsight
          </NavLink>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_ROUTES.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
