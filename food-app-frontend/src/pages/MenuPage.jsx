import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useCartStore } from '../store/cartStore';

const fallbackItems = [
  { _id: 'local-food-1', name: 'Grilled Paneer Bowl', category: 'VEG', price: 350, healthScore: 84 },
  { _id: 'local-food-2', name: 'Protein Chicken Wrap', category: 'NON_VEG', price: 420, healthScore: 72 },
  { _id: 'local-food-3', name: 'Cold Brew Coffee', category: 'BEVERAGE', price: 220, healthScore: 35 },
  { _id: 'local-food-4', name: 'Fruit Yogurt Parfait', category: 'DESSERT', price: 280, healthScore: 66 },
  { _id: 'local-food-5', name: 'Veggie Quinoa Salad', category: 'VEG', price: 390, healthScore: 91 },
  { _id: 'local-food-6', name: 'Cheese Burst Pizza Slice', category: 'NON_VEG', price: 500, healthScore: 20 },
];

const categoryStyle = {
  VEG: 'bg-emerald-100 text-emerald-800',
  NON_VEG: 'bg-rose-100 text-rose-800',
  BEVERAGE: 'bg-sky-100 text-sky-800',
  DESSERT: 'bg-violet-100 text-violet-800',
};

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const add = useCartStore((s) => s.add);

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await api.get('/food');
        setItems(res.data.items || []);
      } catch {
        setItems(fallbackItems);
      }
    }

    loadMenu();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Curated Menu</h1>
          <p className="text-sm text-slate-600">Choose items that optimize both nutrition and your plan rate.</p>
        </div>
        <p className="rounded-full border border-orange-200 bg-white px-3 py-1 text-sm font-semibold text-orange-700">
          {items.length} items available
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item._id} className="card">
            <div className="flex items-start justify-between gap-3">
              <p className={`rounded-full px-2 py-1 text-xs font-bold ${categoryStyle[item.category] || 'bg-slate-100 text-slate-700'}`}>
                {item.category}
              </p>
              <p className="text-sm font-semibold text-slate-600">Rs {item.price}</p>
            </div>
            <h2 className="mt-3 text-xl font-bold text-slate-900">{item.name}</h2>
            <p className="mt-2 text-sm text-slate-500">Health Score: {item.healthScore}/100</p>
            <div className="mt-2 h-2 rounded-full bg-orange-100">
              <div className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${item.healthScore}%` }} />
            </div>
            <button
              className="cta-btn mt-5 w-full"
              onClick={() => {
                add(item);
                toast.success('Added to cart');
              }}
            >
              Add to Cart
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
