<template>
  <el-container>
    <el-aside width="220px">
      <el-menu router>
        <el-menu-item index="/app/dashboard">{{ t('dashboard') }}</el-menu-item>
        <el-menu-item index="/app/activities">{{ t('activities') }}</el-menu-item>
        <el-menu-item index="/app/me/enrollments">{{ t('myEnrollments') }}</el-menu-item>
        <el-menu-item index="/app/me/submissions">{{ t('mySubmissions') }}</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        {{ t('student') }}
        <el-button @click="locale.toggleLocale" size="small" style="margin-left: 8px">{{ t('switchLang') }}</el-button>
        <el-button @click="logout" size="small">{{ t('logout') }}</el-button>
      </el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useLocaleStore } from '../stores/locale';
import { t } from '../i18n';

const auth = useAuthStore();
const locale = useLocaleStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>
