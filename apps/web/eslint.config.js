import pluginVue from 'eslint-plugin-vue';
import vueTs from '@vue/eslint-config-typescript';

export default [
  ...pluginVue.configs['flat/essential'],
  ...vueTs(),
  {
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
];
