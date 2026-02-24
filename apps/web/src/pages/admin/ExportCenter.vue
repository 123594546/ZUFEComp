<template>
  <el-card>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <el-input v-model="activityId" :placeholder="t('admin.export.activityId')" style="width:200px" />
      <el-select v-model="status" :placeholder="t('admin.export.submitStatus')" style="width:160px">
        <el-option value="" :label="t('common.all')" /><el-option value="pending" :label="t('submission.pending')" /><el-option value="approved" :label="t('submission.approved')" /><el-option value="rejected" :label="t('submission.rejected')" />
      </el-select>
      <el-select v-model="format" style="width:130px"><el-option value="csv" label="CSV" /><el-option value="excel" label="Excel" /></el-select>
      <el-button @click="download('/admin/export/enrollments?activityId=' + activityId, 'enrollments')">{{ t('admin.export.exportEnrollments') }}</el-button>
      <el-button @click="download('/admin/export/submissions?status=' + status, 'submissions')">{{ t('admin.export.exportSubmissions') }}</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const activityId = ref(''); const status = ref(''); const format = ref<'csv' | 'excel'>('csv');
const download = (u: string, filePrefix: string) => { const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace('/api', '') + '/api'; const link = document.createElement('a'); link.href = `${base}${u}`; link.download = `${filePrefix}-${Date.now()}.${format.value === 'excel' ? 'xlsx' : 'csv'}`; link.target = '_blank'; link.click(); };
</script>
