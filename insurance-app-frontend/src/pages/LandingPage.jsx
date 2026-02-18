import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <p className="inline-block rounded-full border border-blue-200 bg-white/70 px-4 py-1 text-sm font-semibold text-blue-700">
            Dynamic Rate Intelligence
          </p>
          <h1 className="text-5xl font-extrabold leading-tight text-slate-900">
            Insurance Built Like a <span className="text-blue-700">Live Financial System</span>
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Monitor interest movements, simulate premium growth, and audit adjustment logs from a single fintech-style dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/plans" className="btn-primary">
              Explore Plans
            </Link>
            <Link to="/calculator" className="rounded-xl border border-blue-200 bg-white px-4 py-2 font-semibold text-blue-700">
              Open Calculator
            </Link>
          </div>
          <div className="grid max-w-xl grid-cols-3 gap-3 pt-2">
            <div className="panel p-3">
              <p className="text-xs text-slate-500">Avg Base Rate</p>
              <p className="text-xl font-bold text-blue-700">7.2%</p>
            </div>
            <div className="panel p-3">
              <p className="text-xs text-slate-500">Real-time Sync</p>
              <p className="text-xl font-bold text-blue-700">10s</p>
            </div>
            <div className="panel p-3">
              <p className="text-xs text-slate-500">Audit Ready</p>
              <p className="text-xl font-bold text-blue-700">Logs</p>
            </div>
          </div>
        </div>

        <div className="panel relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-700 to-indigo-700 text-white">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/20" />
          <div className="absolute -left-10 bottom-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="relative space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Live Preview</p>
            <h2 className="text-3xl font-extrabold">Plan Performance Board</h2>
            <p className="text-blue-50">
              Every food order can impact policy rates, and every adjustment is traceable for compliance and analytics.
            </p>
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
              <p className="text-sm">Portfolio plan: ABSLI Fortune Elite</p>
              <p className="mt-1 text-sm">Base rate: 7.6%</p>
              <p className="mt-3 text-xl font-bold">Current rate: 7.95%</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
