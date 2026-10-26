import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ComparePage from './pages/ComparePage';
import DisparityPage from './pages/DisparityPage';
import MethodologyPage from './pages/MethodologyPage';

/**
 * Komponen root dengan konfigurasi React Router.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="disparity" element={<DisparityPage />} />
          <Route path="methodology" element={<MethodologyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
