<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>我的积分</span>
        <el-tag type="success" size="large">当前积分：{{ points }}</el-tag>
      </div>
    </template>

    <el-table :data="ledger" v-loading="loading" empty-text="暂无积分记录">
      <el-table-column prop="createdAt" label="时间" min-width="180" />
      <el-table-column prop="note" label="来源" min-width="220" />
      <el-table-column prop="points" label="变更" width="120">
        <template #default="scope">
          <el-tag type="warning">+{{ scope.row.points }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="180" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { http } from '../../api/http';

interface LedgerItem {
  id: string;
  createdAt: string;
  note: string;
  points: number;
  type: string;
}

const loading = ref(false);
const points = ref(0);
const ledger = ref<LedgerItem[]>([]);

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await http.get('/me/points');
    points.value = data.data.points;
    ledger.value = data.data.ledger;
  } finally {
    loading.value = false;
  }
});
</script>
