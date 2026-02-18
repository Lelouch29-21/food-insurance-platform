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
