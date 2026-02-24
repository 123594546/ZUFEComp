import { defineStore } from 'pinia';

export type Locale = 'zh' | 'en';

export const useLocaleStore = defineStore('locale', {
  state: () => ({ locale: (localStorage.getItem('locale') as Locale) || 'zh' }),
  actions: {
    setLocale(locale: Locale) {
      this.locale = locale;
      localStorage.setItem('locale', locale);
    },
    toggleLocale() {
      this.setLocale(this.locale === 'zh' ? 'en' : 'zh');
    },
  },
});
