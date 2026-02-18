import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useCartStore } from '../store/cartStore';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const add = useCartStore((s) => s.add);

  useEffect(() => {
    api.get('/food').then((res) => setItems(res.data.items));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Menu</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item._id} className="card">
            <p className="text-xs font-semibold text-orange-600">{item.category}</p>
            <h2 className="mt-1 text-xl font-bold">{item.name}</h2>
            <p className="mt-2 text-sm text-gray-500">Health Score: {item.healthScore}/100</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-semibold">Rs {item.price}</span>
              <button
                className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white"
                onClick={() => {
                  add(item);
                  toast.success('Added to cart');
                }}
              >
                Add
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
