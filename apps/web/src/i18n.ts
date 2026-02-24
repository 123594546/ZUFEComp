import { createI18n } from 'vue-i18n';
import { shallowRef } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import type { Language } from 'element-plus/es/locale';
import type { Locale } from './stores/locale';

const loadedLocales = new Set<string>();
const loadedElementLocales = new Set<string>(['zh']);

export const elementPlusLocale = shallowRef<Language>(zhCn);

export const i18n = createI18n({
  locale: 'zh',
  messages: {},
});

const localeModules = import.meta.glob('./locales/*.json');
const elementLocaleModules: Record<Locale, () => Promise<{ default: Language }>> = {
  zh: () => import('element-plus/es/locale/lang/zh-cn'),
  en: () => import('element-plus/es/locale/lang/en'),
};

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

const loadElementLocale = async (locale: Locale) => {
  if (loadedElementLocales.has(locale)) {
    if (locale === 'zh') {
      elementPlusLocale.value = zhCn;
    }
    return;
  }
  const localeModule = await elementLocaleModules[locale]();
  elementPlusLocale.value = localeModule.default;
  loadedElementLocales.add(locale);
};

export const setI18nLanguage = async (locale: Locale) => {
  await Promise.all([loadLocaleMessages(locale), loadElementLocale(locale)]);
  i18n.global.locale.value = locale;
  document.documentElement.setAttribute('lang', locale);
};
