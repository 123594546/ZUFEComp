<template>
  <el-container>
    <el-aside width="220px">
      <el-menu router>
        <el-menu-item index="/admin/overview">{{ t('layout.overview') }}</el-menu-item>
        <el-menu-item index="/admin/activities">{{ t('layout.manageActivities') }}</el-menu-item>
        <el-menu-item index="/admin/submissions">{{ t('layout.reviewSubmissions') }}</el-menu-item>
        <el-menu-item index="/admin/export">{{ t('layout.exportCenter') }}</el-menu-item>
        <el-menu-item index="/admin/roles">{{ t('layout.rolesCenter') }}</el-menu-item>
        <el-menu-item index="/admin/messages">
          {{ t('layout.messageCenter') }}
          <el-badge :value="unread || ''" style="margin-left: 8px" />
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        {{ t('layout.admin') }}
        <el-button @click="switchLanguage" size="small" style="margin-left: 8px">{{ switchLabel }}</el-button>
        <el-button @click="logout" size="small">{{ t('layout.logout') }}</el-button>
      </el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLocaleStore, type Locale } from '../stores/locale';
import { useAuthStore } from '../stores/auth';
import { http } from '../api/http';
import { setI18nLanguage } from '../i18n';

const localeStore = useLocaleStore();
const auth = useAuthStore();
const router = useRouter();
const unread = ref(0);
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

onMounted(async () => {
  const { data } = await http.get('/admin/notifications');
  unread.value = data.data.filter((x: { read: boolean }) => !x.read).length;
});
</script>
