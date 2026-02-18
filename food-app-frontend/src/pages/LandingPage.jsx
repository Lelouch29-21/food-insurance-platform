import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <p className="inline-block rounded-full border border-orange-200 bg-white/70 px-4 py-1 text-sm font-semibold text-orange-700">
            Smart food. Smarter insurance.
          </p>
          <h1 className="text-5xl font-extrabold leading-tight text-slate-900">
            Eat Better, <span className="text-orange-600">Invest Better</span>.
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Each order shapes your insurance rate with our Health-to-Wealth engine. Track food quality and financial impact in one flow.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/menu" className="cta-btn">
              Explore Menu
            </Link>
            <Link to="/orders" className="rounded-xl border border-orange-200 bg-white px-4 py-2 font-semibold text-orange-700">
              View Orders
            </Link>
          </div>
          <div className="grid max-w-xl grid-cols-3 gap-3 pt-2">
            <div className="card p-3">
              <p className="text-xs text-slate-500">Healthy Score Impact</p>
              <p className="text-xl font-bold text-orange-700">+0.4%</p>
            </div>
            <div className="card p-3">
              <p className="text-xs text-slate-500">High Value Bonus</p>
              <p className="text-xl font-bold text-orange-700">+0.5%</p>
            </div>
            <div className="card p-3">
              <p className="text-xs text-slate-500">Order Frequency</p>
              <p className="text-xl font-bold text-orange-700">+0.25%</p>
            </div>
          </div>
        </div>

        <div className="card relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-red-500 text-white">
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/20" />
          <div className="absolute -left-10 bottom-4 h-24 w-24 rounded-full bg-white/10" />
          <div className="relative space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">Live Adjustment Preview</p>
            <h2 className="text-3xl font-extrabold">Health-to-Wealth Engine</h2>
            <p className="text-orange-50">
              High quality food can boost interest rates while unhealthy patterns can reduce them. Every checkout is measurable and logged.
            </p>
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
              <p className="text-sm">Sample order total: Rs 1,150</p>
              <p className="mt-1 text-sm">Healthy percentage: 72%</p>
              <p className="mt-3 text-xl font-bold">Projected adjustment: +0.9%</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
