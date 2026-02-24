<template>
  <el-table :data="list">
    <el-table-column prop="activity.title" :label="t('common.activity')" />
    <el-table-column prop="fileName" :label="t('common.file')" />
    <el-table-column :label="t('submission.status')">
      <template #default="s">
        <el-tag :type="s.row.status === 'approved' ? 'success' : s.row.status === 'rejected' ? 'danger' : 'warning'">{{ t(`submission.${s.row.status}`) }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column :label="t('submission.aiResult')">
      <template #default="s">
        <el-tag :type="s.row.aiReview?.result === 'pass' ? 'success' : 'warning'">{{ s.row.aiReview?.result ? t(`submission.${s.row.aiReview.result}`) : '-' }}</el-tag>
        <div v-if="s.row.aiReview?.reasons?.length">{{ s.row.aiReview.reasons.join('；') }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="reviewNote" :label="t('submission.rejectReason')" />
    <el-table-column>
      <template #default="s"><el-button @click="download(s.row.id)">{{ t('submission.download') }}</el-button></template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';

const { t } = useI18n();
const list = ref<any[]>([]);
onMounted(async () => {
  list.value = (await http.get('/me/submissions')).data.data;
});
const download = (id: string) => window.open((import.meta.env.VITE_API_BASE_URL || '/api').replace('/api', '') + `/api/files/${id}`);
</script>
