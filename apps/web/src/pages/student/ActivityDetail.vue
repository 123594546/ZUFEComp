<template>
  <el-card v-if="detail">
    <h2>{{ detail.title }}</h2>
    <p>{{ detail.description }}</p>
    <el-tag>{{ detail.status }}</el-tag>
    <p>{{ t('activity.remainingQuota') }} {{ detail.remaining }}</p>
    <p>{{ t('activity.countdown') }}：{{ countdown }}</p>
    <el-button type="primary" @click="enroll">{{ t('activity.enroll') }}</el-button>
    <el-button @click="cancel">{{ t('activity.cancelEnroll') }}</el-button>
    <el-upload :http-request="upload" :show-file-list="false"><el-button>{{ t('activity.submitMaterial') }}</el-button></el-upload>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';

const { t } = useI18n();
const route = useRoute();
type ActivityDetail = {
  title: string;
  description: string;
  status: string;
  remaining: number;
  signupDeadline: string;
};

const detail = ref<ActivityDetail>();
const now = ref(Date.now());
setInterval(() => {
  now.value = Date.now();
}, 1000);

const countdown = computed(() => {
  if (!detail.value) return '';
  const diff = new Date(detail.value.signupDeadline).getTime() - now.value;
  return diff > 0 ? `${Math.floor(diff / 1000)}s` : t('activity.expired');
});

const load = async () => {
  detail.value = (await http.get(`/activities/${route.params.id}`)).data.data;
};

const enroll = async () => {
  try {
    await http.post(`/activities/${route.params.id}/enroll`);
    ElMessage.success(t('activity.enrollSuccess'));
    load();
  } catch (e: unknown) {
    const message = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
    ElMessage.error(message || t('activity.failed'));
  }
};

const cancel = async () => {
  await http.delete(`/activities/${route.params.id}/enroll`);
  ElMessage.success(t('activity.cancelSuccess'));
  load();
};

const upload = async (opt: { file: Blob }) => {
  const fd = new FormData();
  fd.append('file', opt.file);
  fd.append('note', t('activity.frontendNote'));
  await http.post(`/activities/${route.params.id}/submissions`, fd);
  ElMessage.success(t('activity.submitSuccess'));
};

onMounted(load);
</script>
