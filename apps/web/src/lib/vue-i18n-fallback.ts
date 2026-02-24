import { inject, ref, type App, type Ref } from 'vue';

type LocaleMessages = Record<string, unknown>;
type MessageSchema = Record<string, LocaleMessages>;

const I18N_SYMBOL = Symbol('i18n');

const getByPath = (source: LocaleMessages, key: string): string => {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);
  return typeof value === 'string' ? value : key;
};

export const createI18n = (options: { locale: string; messages: MessageSchema }) => {
  const locale = ref(options.locale);
  const messages: MessageSchema = { ...options.messages };

  const t = (key: string) => getByPath(messages[locale.value] || {}, key);

  const global = {
    locale: locale as Ref<string>,
    setLocaleMessage(localeName: string, localeMessages: LocaleMessages) {
      messages[localeName] = localeMessages;
    },
    t,
  };

  return {
    install(app: App) {
      app.provide(I18N_SYMBOL, { global });
      app.config.globalProperties.$t = t;
    },
    global,
  };
};

export const useI18n = () => {
  const i18n = inject<{ global: { t: (key: string) => string; locale: Ref<string> } }>(I18N_SYMBOL);
  if (!i18n) {
    throw new Error('i18n is not initialized.');
  }
  return {
    t: i18n.global.t,
    locale: i18n.global.locale,
  };
};
