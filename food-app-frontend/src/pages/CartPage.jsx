import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useCartStore } from '../store/cartStore';

const fallbackPlans = [
  { _id: 'local-plan-1', name: 'ABSLI DigiShield Plan', currentInterestRate: 6.8 },
  { _id: 'local-plan-2', name: 'ABSLI Guaranteed Milestone Plan', currentInterestRate: 7.1 },
  { _id: 'local-plan-3', name: 'ABSLI Empower Pension Plan', currentInterestRate: 7.4 },
];

export default function CartPage() {
  const { items, remove, clear } = useCartStore();
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await api.get('/insurance/plans');
        setPlans(res.data.plans || []);
        setSelectedPlanId(res.data.plans?.[0]?._id || '');
      } catch {
        setPlans(fallbackPlans);
        setSelectedPlanId(fallbackPlans[0]._id);
      }
    }

    loadPlans();
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  const checkout = async () => {
    if (!items.length) return;
    const payload = {
      planId: selectedPlanId,
      items: items.map((item) => ({ foodItemId: item._id, quantity: item.quantity })),
    };

    if (selectedPlanId.startsWith('local-plan-')) {
      toast.error('Live checkout requires backend API deployment');
      return;
    }

    try {
      const { data } = await api.post('/orders', payload);
      setResult(data.interest);
      clear();
      toast.success('Order placed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-extrabold text-slate-900">Cart & Checkout</h1>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="space-y-3">
          {!items.length && <div className="card text-slate-600">Your cart is empty. Add items from menu to continue.</div>}
          {items.map((item) => (
            <div key={item._id} className="card flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500">Qty {item.quantity} · Rs {item.price}</p>
              </div>
              <button onClick={() => remove(item._id)} className="rounded-full border border-red-200 px-3 py-1 text-sm font-semibold text-red-600">
                Remove
              </button>
            </div>
          ))}
        </section>

        <section className="card h-fit">
          <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
          <p className="mt-1 text-sm text-slate-600">{totalQty} items selected</p>

          <label className="mt-4 block text-sm font-medium text-slate-700">Insurance Plan</label>
          <select
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="field mt-2"
          >
            {plans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.name} ({plan.currentInterestRate}%)
              </option>
            ))}
          </select>

          <div className="mt-4 rounded-2xl bg-orange-50 p-4">
            <p className="text-sm text-slate-600">Payable Total</p>
            <p className="text-2xl font-extrabold text-orange-700">Rs {total}</p>
          </div>

          <button onClick={checkout} className="cta-btn mt-4 w-full">
            Checkout
          </button>
        </section>
      </div>

      {result && (
        <div className="card mt-6 bg-emerald-50">
          <h2 className="text-xl font-bold text-emerald-900">Interest Updated</h2>
          <p className="mt-1 text-sm text-emerald-800">Adjustment: {result.adjustment}%</p>
          <p className="text-sm text-emerald-800">New Rate: {result.newRate}%</p>
          <p className="mt-1 text-xs text-emerald-700">{result.reason}</p>
        </div>
      )}
    </main>
  );
}
