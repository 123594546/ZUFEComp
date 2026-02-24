<template>
  <el-card>
    <el-form :model="form">
      <el-form-item :label="t('login.studentId')"><el-input v-model="form.studentId" /></el-form-item>
      <el-form-item :label="t('register.name')"><el-input v-model="form.name" /></el-form-item>
      <el-form-item :label="t('register.grade')"><el-input v-model="form.grade" /></el-form-item>
      <el-form-item :label="t('register.college')"><el-input v-model="form.college" /></el-form-item>
      <el-form-item :label="t('login.password')"><el-input v-model="form.password" show-password /></el-form-item>
      <el-button type="primary" @click="submit">{{ t('common.register') }}</el-button>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';

const router = useRouter();
const { t } = useI18n();
const form = reactive({ studentId: '', name: '', password: '', grade: '', college: '' });

const submit = async () => {
  try {
    await http.post('/auth/register', form);
    ElMessage.success(t('register.success'));
    router.push('/login');
  } catch (e: unknown) {
    const message = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
    ElMessage.error(message || t('register.failed'));
  }
};
</script>
