import { defineStore } from 'pinia';
import { http } from '../api/http';

type AuthUser = { role?: string } & Record<string, unknown> | null;

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: localStorage.getItem('token') || '', user: JSON.parse(localStorage.getItem('user') || 'null') as AuthUser }),
  actions: {
    setAuth(token: string, user: AuthUser) {
      this.token = token;
      this.user = user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    async refreshMe() {
      if (!this.token) return;
      const { data } = await http.get('/auth/me');
      this.user = data.data;
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  }
});
