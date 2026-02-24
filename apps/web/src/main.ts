import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import { i18n, setI18nLanguage } from './i18n';
import { useLocaleStore } from './stores/locale';

const bootstrap = async () => {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);

  const localeStore = useLocaleStore(pinia);
  await setI18nLanguage(localeStore.locale);

  app.use(router).use(i18n).use(ElementPlus).mount('#app');
};

void bootstrap();
