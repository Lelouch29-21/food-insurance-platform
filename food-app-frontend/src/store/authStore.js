import { create } from 'zustand';
import api from '../api/client';

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  async login(payload) {
    set({ loading: true });
    const { data } = await api.post('/auth/login', payload);
    set({ user: data.user, loading: false });
    return data.user;
  },
  async register(payload) {
    set({ loading: true });
    const { data } = await api.post('/auth/register', payload);
    set({ user: data.user, loading: false });
    return data.user;
  },
  async me() {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user });
      return data.user;
    } catch {
      set({ user: null });
      return null;
    }
  },
}));
