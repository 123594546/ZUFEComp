import { defineStore } from 'pinia';

export type Locale = 'zh' | 'en';

const normalizeLocale = (locale: string | null): Locale => (locale === 'en' ? 'en' : 'zh');

export const useLocaleStore = defineStore('locale', {
  state: () => ({ locale: normalizeLocale(localStorage.getItem('locale')) }),
  actions: {
    setLocale(locale: Locale) {
      this.locale = locale;
      localStorage.setItem('locale', locale);
    },
  },
});
