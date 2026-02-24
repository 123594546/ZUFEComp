<template>
  <el-container>
    <el-aside width="220px">
      <el-menu router>
        <el-menu-item index="/app/dashboard">{{ t('layout.dashboard') }}</el-menu-item>
        <el-menu-item index="/app/activities">{{ t('layout.activities') }}</el-menu-item>
        <el-menu-item index="/app/me/enrollments">{{ t('layout.myEnrollments') }}</el-menu-item>
        <el-menu-item index="/app/me/submissions">{{ t('layout.mySubmissions') }}</el-menu-item>
        <el-menu-item index="/app/me/points">{{ t('layout.myPoints') }}</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        {{ t('layout.student') }}
        <el-button @click="switchLanguage" size="small" style="margin-left: 8px">{{ switchLabel }}</el-button>
        <el-button @click="logout" size="small">{{ t('layout.logout') }}</el-button>
      </el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores/auth';
import { useLocaleStore, type Locale } from '../stores/locale';
import { setI18nLanguage } from '../i18n';

const auth = useAuthStore();
const localeStore = useLocaleStore();
const router = useRouter();
const { t } = useI18n();

const switchLabel = computed(() => (localeStore.locale === 'zh' ? t('layout.switchToEnglish') : t('layout.switchToChinese')));

const switchLanguage = async () => {
  const nextLocale: Locale = localeStore.locale === 'zh' ? 'en' : 'zh';
  await setI18nLanguage(nextLocale);
  localeStore.setLocale(nextLocale);
};

const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>
