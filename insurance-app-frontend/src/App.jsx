import { NavLink, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PlansPage from './pages/PlansPage';
import CalculatorPage from './pages/CalculatorPage';
import AdminPage from './pages/AdminPage';

function Nav() {
  const navLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition ${
      isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-300/60' : 'text-slate-700 hover:bg-blue-100'
    }`;

  return (
    <nav className="sticky top-0 z-30 border-b border-blue-100/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="ins-brand text-lg text-blue-900">
          PolicyPulse
        </NavLink>
        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/plans" className={navLinkClass}>
            Plans
          </NavLink>
          <NavLink to="/calculator" className={navLinkClass}>
            Calculator
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-blue-200/45 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-indigo-200/35 blur-3xl" />
      </div>
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
