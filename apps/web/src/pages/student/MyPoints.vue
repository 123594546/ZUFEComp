<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>{{ t('points.title') }}</span>
        <el-tag type="success" size="large">{{ t('points.current') }}：{{ points }}</el-tag>
      </div>
    </template>

    <el-table :data="ledger" v-loading="loading" :empty-text="t('points.empty')">
      <el-table-column prop="createdAt" :label="t('common.time')" min-width="180" />
      <el-table-column prop="note" :label="t('points.source')" min-width="220" />
      <el-table-column prop="points" :label="t('points.change')" width="120">
        <template #default="scope">
          <el-tag type="warning">+{{ scope.row.points }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" :label="t('points.type')" width="180" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';
const { t } = useI18n();
interface LedgerItem { id: string; createdAt: string; note: string; points: number; type: string; }
const loading = ref(false); const points = ref(0); const ledger = ref<LedgerItem[]>([]);
onMounted(async () => { loading.value = true; try { const { data } = await http.get('/me/points'); points.value = data.data.points; ledger.value = data.data.ledger; } finally { loading.value = false; } });
</script>
