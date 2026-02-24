<template>
  <el-card>
    <el-table :data="list">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="createdAt" label="时间" />
      <el-table-column label="状态">
        <template #default="s">
          <el-tag :type="s.row.read ? 'info' : 'danger'">{{ s.row.read ? '已读' : '未读' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="s"><el-button @click="markRead(s.row)" :disabled="s.row.read">标记已读</el-button></template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { http } from '../../api/http';

const list = ref<any[]>([]);
const load = async () => {
  list.value = (await http.get('/admin/notifications')).data.data;
};
const markRead = async (row: any) => {
  await http.patch(`/admin/notifications/${row.id}/read`);
  await load();
};
onMounted(load);
</script>
