import { createI18n } from 'vue-i18n';
import type { Locale } from './stores/locale';

const loadedLocales = new Set<string>();

export const i18n = createI18n({
    locale: 'zh',
  messages: {},
});

const localeModules = import.meta.glob('./locales/*.json');

export const loadLocaleMessages = async (locale: Locale) => {
  if (loadedLocales.has(locale)) {
    return;
  }

  const loader = localeModules[`./locales/${locale}.json`];
  if (!loader) {
    throw new Error(`Locale ${locale} is not supported.`);
  }

  const messages = (await loader()) as { default: Record<string, unknown> };
  i18n.global.setLocaleMessage(locale, messages.default);
  loadedLocales.add(locale);
};

export const setI18nLanguage = async (locale: Locale) => {
  await loadLocaleMessages(locale);
  i18n.global.locale.value = locale;
  document.documentElement.setAttribute('lang', locale);
};
