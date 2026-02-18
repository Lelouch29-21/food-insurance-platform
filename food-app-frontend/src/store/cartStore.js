import { create } from 'zustand';

const KEY = 'food-cart-v1';

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(KEY, JSON.stringify(cart));
}

export const useCartStore = create((set, get) => ({
  items: readCart(),
  add(item) {
    const current = get().items;
    const found = current.find((it) => it._id === item._id);
    const items = found
      ? current.map((it) => (it._id === item._id ? { ...it, quantity: it.quantity + 1 } : it))
      : [...current, { ...item, quantity: 1 }];
    writeCart(items);
    set({ items });
  },
  remove(id) {
    const items = get().items.filter((it) => it._id !== id);
    writeCart(items);
    set({ items });
  },
  clear() {
    writeCart([]);
    set({ items: [] });
  },
}));
