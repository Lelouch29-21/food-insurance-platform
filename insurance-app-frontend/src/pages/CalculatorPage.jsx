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
    api.get('/insurance/plans').then((res) => {
      const liveRate = res.data.plans?.[0]?.currentInterestRate || 0;
      setRate(liveRate);
    });
  }, []);

  const values = watch();
  const appliedRate = Number(values.rate || rate || 0);

  const premium = useMemo(() => {
    const principal = Number(values.principal || 0);
    const years = Number(values.years || 0);
    return principal * (1 + appliedRate / 100) ** years;
  }, [values.principal, values.years, appliedRate]);

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <div className="panel space-y-4">
        <h1 className="text-2xl font-bold">Premium Calculator</h1>
        <p className="text-sm text-slate-600">Formula: principal * (1 + rate/100)^years</p>
        <input {...register('principal')} type="number" className="w-full rounded-lg border px-3 py-2" placeholder="Principal" />
        <input {...register('years')} type="number" className="w-full rounded-lg border px-3 py-2" placeholder="Years" />
        <input {...register('rate')} type="number" step="0.01" className="w-full rounded-lg border px-3 py-2" placeholder={`Rate (default ${rate}%)`} />
        <p className="rounded-lg bg-blue-50 p-3 text-lg font-semibold text-blue-900">Estimated Premium: Rs {premium.toFixed(2)}</p>
      </div>
    </main>
  );
}
