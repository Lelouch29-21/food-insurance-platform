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
      <h1 className="mb-6 text-3xl font-bold text-blue-950">Insurance Plans</h1>
      <div className="panel h-80">
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
        {plans.map((plan) => (
          <article key={plan._id} className="panel">
            <h2 className="text-lg font-bold">{plan.name}</h2>
            <p className="text-sm text-slate-600">{plan.provider}</p>
            <p className="mt-3">Base Rate: <b>{plan.baseInterestRate}%</b></p>
            <p>Current Rate: <b className="text-blue-700">{plan.currentInterestRate}%</b></p>
          </article>
        ))}
      </div>
    </main>
  );
}
