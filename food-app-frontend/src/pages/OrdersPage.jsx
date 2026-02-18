import { useEffect, useState } from 'react';
import api from '../api/client';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/my')
      .then((res) => setOrders(res.data.orders || []))
      .catch((err) => setError(err.response?.data?.message || 'Please login to view orders'));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Orders</h1>
          <p className="text-sm text-slate-600">Review your checkout history and health impact.</p>
        </div>
        <p className="rounded-full border border-orange-200 bg-white px-3 py-1 text-sm font-semibold text-orange-700">
          {orders.length} orders
        </p>
      </div>

      {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-700">{error}</p>}

      {!error && !orders.length && <div className="card text-slate-600">No orders yet. Place your first order from Menu.</div>}

      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order._id} className="card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900">Order #{order._id.slice(-6)}</h2>
              <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-orange-50 p-3">
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-lg font-bold text-orange-700">Rs {order.totalAmount}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-xs text-slate-500">Healthy %</p>
                <p className="text-lg font-bold text-emerald-700">{order.healthyPercentage}%</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-3">
                <p className="text-xs text-slate-500">Items</p>
                <p className="text-lg font-bold text-slate-800">{order.items?.length || 0}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
