import { defineStore } from 'pinia';
import { http } from '../api/http';

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: localStorage.getItem('token') || '', user: JSON.parse(localStorage.getItem('user') || 'null') as any }),
  actions: {
    setAuth(token: string, user: any) { this.token = token; this.user = user; localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); },
    logout() { this.token = ''; this.user = null; localStorage.clear(); },
    async refreshMe() { if (!this.token) return; const { data } = await http.get('/auth/me'); this.user = data.data; localStorage.setItem('user', JSON.stringify(this.user)); }
  }
});
