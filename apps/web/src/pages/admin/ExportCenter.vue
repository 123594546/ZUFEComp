<template>
  <el-card>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <el-input v-model="activityId" placeholder="活动ID(可选)" style="width:200px" />
      <el-select v-model="status" placeholder="提交状态" style="width:160px">
        <el-option value="" label="全部" /><el-option value="pending" label="待审核" /><el-option value="approved" label="已通过" /><el-option value="rejected" label="已驳回" />
      </el-select>
      <el-select v-model="format" style="width:130px">
        <el-option value="csv" label="CSV" />
        <el-option value="excel" label="Excel" />
      </el-select>
      <el-button @click="download('/admin/export/enrollments?activityId=' + activityId, 'enrollments')">导出报名名单</el-button>
      <el-button @click="download('/admin/export/submissions?status=' + status, 'submissions')">导出材料审核</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activityId = ref('');
const status = ref('');
const format = ref<'csv' | 'excel'>('csv');

const download = (u: string, filePrefix: string) => {
  const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace('/api', '') + '/api';
  const link = document.createElement('a');
  link.href = `${base}${u}`;
  link.download = `${filePrefix}-${Date.now()}.${format.value === 'excel' ? 'xlsx' : 'csv'}`;
  link.target = '_blank';
  link.click();
};
</script>
