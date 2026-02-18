import { useEffect, useMemo, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../api/client';

const fallbackPlans = [
  {
    _id: 'local-plan-1',
    name: 'ABSLI DigiShield Plan',
    provider: 'Aditya Birla Sun Life Insurance (Demo Data)',
    baseInterestRate: 6.8,
    currentInterestRate: 6.8,
  },
  {
    _id: 'local-plan-2',
    name: 'ABSLI Guaranteed Milestone Plan',
    provider: 'Aditya Birla Sun Life Insurance (Demo Data)',
    baseInterestRate: 7.1,
    currentInterestRate: 7.1,
  },
  {
    _id: 'local-plan-3',
    name: 'ABSLI Empower Pension Plan',
    provider: 'Aditya Birla Sun Life Insurance (Demo Data)',
    baseInterestRate: 7.4,
    currentInterestRate: 7.4,
  },
];

export default function PlansPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const load = () =>
      api
        .get('/insurance/plans')
        .then((res) => setPlans(res.data.plans || []))
        .catch(() => setPlans(fallbackPlans));
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  const chartData = useMemo(
    () => plans.map((p) => ({ name: p.name, base: p.baseInterestRate, current: p.currentInterestRate })),
    [plans],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Insurance Plans</h1>
          <p className="text-sm text-slate-600">Base vs current rates update in near real-time.</p>
        </div>
        <p className="rounded-full border border-blue-200 bg-white px-3 py-1 text-sm font-semibold text-blue-700">
          {plans.length} plans tracked
        </p>
      </div>

      <div className="panel h-80 bg-gradient-to-br from-blue-50 to-indigo-50">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="base" stroke="#94a3b8" strokeWidth={2} />
            <Line type="monotone" dataKey="current" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const delta = Number((plan.currentInterestRate - plan.baseInterestRate).toFixed(2));
          const positive = delta >= 0;
          return (
            <article key={plan._id} className="panel">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-lg font-bold text-slate-900">{plan.name}</h2>
                <p className={`rounded-full px-2 py-1 text-xs font-bold ${positive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {positive ? '+' : ''}{delta}%
                </p>
              </div>
              <p className="mt-1 text-sm text-slate-600">{plan.provider}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-100 p-3">
                  <p className="text-xs text-slate-500">Base Rate</p>
                  <p className="text-lg font-bold text-slate-800">{plan.baseInterestRate}%</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3">
                  <p className="text-xs text-slate-500">Current Rate</p>
                  <p className="text-lg font-bold text-blue-700">{plan.currentInterestRate}%</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
