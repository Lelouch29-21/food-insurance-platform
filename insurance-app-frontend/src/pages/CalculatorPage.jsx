import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { calculatorSchema } from '../schemas/calculatorSchema';

export default function CalculatorPage() {
  const [rate, setRate] = useState(0);

  const { register, watch } = useForm({
    resolver: zodResolver(calculatorSchema),
    defaultValues: { principal: 100000, years: 5, rate: 0 },
  });

  useEffect(() => {
    api
      .get('/insurance/plans')
      .then((res) => {
        const liveRate = res.data.plans?.[0]?.currentInterestRate || 0;
        setRate(liveRate);
      })
      .catch(() => {
        setRate(7.1);
      });
  }, []);

  const values = watch();
  const principal = Number(values.principal || 0);
  const years = Number(values.years || 0);
  const appliedRate = Number(values.rate || rate || 0);

  const premium = useMemo(() => {
    return principal * (1 + appliedRate / 100) ** years;
  }, [principal, years, appliedRate]);

  const gain = premium - principal;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
        <div className="panel space-y-4">
          <h1 className="text-2xl font-extrabold text-slate-900">Premium Calculator</h1>
          <p className="text-sm text-slate-600">Formula: principal * (1 + rate/100)^years</p>

          <div>
            <label className="text-sm font-semibold text-slate-700">Principal</label>
            <input {...register('principal')} type="number" className="field mt-1" placeholder="Principal" />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Years</label>
            <input {...register('years')} type="number" className="field mt-1" placeholder="Years" />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Interest Rate (%)</label>
            <input
              {...register('rate')}
              type="number"
              step="0.01"
              className="field mt-1"
              placeholder={`Rate (default ${rate}%)`}
            />
          </div>
        </div>

        <div className="panel bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Projection</p>
          <p className="mt-3 text-sm text-blue-100">Estimated Premium</p>
          <p className="text-4xl font-extrabold">Rs {premium.toFixed(2)}</p>

          <div className="mt-5 space-y-3 rounded-2xl bg-white/15 p-4 backdrop-blur">
            <div className="flex justify-between text-sm">
              <span>Invested Principal</span>
              <span className="font-semibold">Rs {principal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Net Gain</span>
              <span className="font-semibold">Rs {gain.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Applied Rate</span>
              <span className="font-semibold">{appliedRate.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
