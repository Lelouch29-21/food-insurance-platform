import { useEffect, useState } from 'react';
import api from '../api/client';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/my')
      .then((res) => setOrders(res.data.orders))
      .catch((err) => setError(err.response?.data?.message || 'Please login to view orders'));
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">My Orders</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <div className="space-y-3">
        {orders.map((order) => (
          <article key={order._id} className="card">
            <h2 className="font-semibold">Order #{order._id.slice(-6)}</h2>
            <p className="text-sm text-gray-500">Total: Rs {order.totalAmount}</p>
            <p className="text-sm text-gray-500">Healthy %: {order.healthyPercentage}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
