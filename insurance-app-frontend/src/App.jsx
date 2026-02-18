import { Link, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PlansPage from './pages/PlansPage';
import CalculatorPage from './pages/CalculatorPage';
import AdminPage from './pages/AdminPage';

function Nav() {
  return (
    <nav className="sticky top-0 z-30 border-b border-blue-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-brand-900">PolicyPulse</Link>
        <div className="flex gap-4 text-sm font-semibold text-blue-900">
          <Link to="/plans">Plans</Link>
          <Link to="/calculator">Calculator</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-white">
      <Nav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}
