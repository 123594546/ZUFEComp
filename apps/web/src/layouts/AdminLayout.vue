<template>
  <el-container>
    <el-aside width="220px">
      <el-menu router>
        <el-menu-item index="/admin/overview">{{ t('overview') }}</el-menu-item>
        <el-menu-item index="/admin/activities">{{ t('manageActivities') }}</el-menu-item>
        <el-menu-item index="/admin/submissions">{{ t('reviewSubmissions') }}</el-menu-item>
        <el-menu-item index="/admin/export">{{ t('exportCenter') }}</el-menu-item>
        <el-menu-item index="/admin/roles">{{ t('rolesCenter') }}</el-menu-item>
        <el-menu-item index="/admin/messages">
          {{ t('messageCenter') }}
          <el-badge :value="unread || ''" style="margin-left: 8px" />
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        {{ t('admin') }}
        <el-button @click="locale.toggleLocale" size="small" style="margin-left: 8px">{{ t('switchLang') }}</el-button>
        <el-button @click="logout" size="small">{{ t('logout') }}</el-button>
      </el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { t } from '../i18n';
import { useLocaleStore } from '../stores/locale';
import { useAuthStore } from '../stores/auth';
import { http } from '../api/http';

const locale = useLocaleStore();
const auth = useAuthStore();
const router = useRouter();
const unread = ref(0);

const logout = () => {
  auth.logout();
  router.push('/login');
};

onMounted(async () => {
  const { data } = await http.get('/admin/notifications');
  unread.value = data.data.filter((x: any) => !x.read).length;
});
</script>
