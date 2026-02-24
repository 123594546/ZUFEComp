<template>
  <el-card>
    <el-form :model="form">
      <el-form-item :label="t('login.studentId')"><el-input v-model="form.studentId" /></el-form-item>
      <el-form-item :label="t('login.password')"><el-input v-model="form.password" show-password /></el-form-item>
      <el-button :loading="loading" type="primary" @click="submit">{{ t('common.login') }}</el-button>
      <el-button @click="$router.push('/register')">{{ t('common.register') }}</el-button>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';
import { useAuthStore } from '../../stores/auth';

const form = reactive({ studentId: '', password: '' });
const loading = ref(false);
const auth = useAuthStore();
const router = useRouter();
const { t } = useI18n();

const submit = async () => {
  loading.value = true;
  try {
    const { data } = await http.post('/auth/login', form);
    auth.setAuth(data.data.token, data.data.user);
    router.push(data.data.user.role === 'admin' ? '/admin/overview' : '/app/dashboard');
  } catch (e: unknown) {
    const message = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
    ElMessage.error(message || t('login.failed'));
  } finally {
    loading.value = false;
  }
};
</script>
