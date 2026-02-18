import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2">
      <section className="space-y-6">
        <p className="inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
          Smart food. Smarter insurance.
        </p>
        <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
          Every meal can improve your financial future.
        </h1>
        <p className="text-lg text-gray-600">
          Checkout healthy orders and directly influence your insurance interest rate in real time.
        </p>
        <Link to="/menu" className="inline-block rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white">
          Explore Menu
        </Link>
      </section>
      <section className="card flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 text-white">
        <div>
          <h2 className="text-2xl font-bold">Health-to-Wealth Engine</h2>
          <p className="mt-2 opacity-90">Order value + healthy choices = dynamic interest boost.</p>
        </div>
      </section>
    </main>
  );
}
