import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2">
      <section className="space-y-6">
        <p className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
          Dynamic Rate Intelligence
        </p>
        <h1 className="text-5xl font-extrabold leading-tight text-blue-950">Insurance plans that react to lifestyle behavior.</h1>
        <p className="text-lg text-slate-600">
          Track plan rates in real time and estimate premium growth with transparent compounding.
        </p>
        <Link to="/plans" className="inline-block rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white">
          View Plans
        </Link>
      </section>
      <section className="panel bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <h2 className="text-2xl font-bold">Fintech-grade dashboard</h2>
        <p className="mt-2 text-blue-100">Powered by order-driven interest adjustment logs.</p>
      </section>
    </main>
  );
}
