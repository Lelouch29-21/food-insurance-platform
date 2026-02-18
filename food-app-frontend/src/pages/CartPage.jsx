import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useCartStore } from '../store/cartStore';

export default function CartPage() {
  const { items, remove, clear } = useCartStore();
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get('/insurance/plans').then((res) => {
      setPlans(res.data.plans);
      setSelectedPlanId(res.data.plans?.[0]?._id || '');
    });
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = async () => {
    if (!items.length) return;
    const payload = {
      planId: selectedPlanId,
      items: items.map((item) => ({ foodItemId: item._id, quantity: item.quantity })),
    };

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
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Cart</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="card flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">Qty {item.quantity} · Rs {item.price}</p>
            </div>
            <button onClick={() => remove(item._id)} className="text-sm text-red-600">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 card">
        <label className="text-sm font-medium">Insurance Plan</label>
        <select
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value)}
          className="mt-2 w-full rounded-lg border px-3 py-2"
        >
          {plans.map((plan) => (
            <option key={plan._id} value={plan._id}>
              {plan.name} ({plan.currentInterestRate}%)
            </option>
          ))}
        </select>

        <p className="mt-3 text-lg font-semibold">Total: Rs {total}</p>
        <button onClick={checkout} className="mt-4 rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white">
          Checkout
        </button>
      </div>

      {result && (
        <div className="mt-6 card bg-emerald-50">
          <h2 className="font-bold">Interest Updated</h2>
          <p className="text-sm">Adjustment: {result.adjustment}%</p>
          <p className="text-sm">New Rate: {result.newRate}%</p>
          <p className="text-xs text-gray-600">{result.reason}</p>
        </div>
      )}
    </main>
  );
}
