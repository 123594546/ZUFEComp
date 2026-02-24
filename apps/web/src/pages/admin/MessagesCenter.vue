<template>
  <el-card>
    <el-table :data="list">
      <el-table-column prop="title" :label="t('admin.messages.title')" />
      <el-table-column prop="content" :label="t('admin.messages.content')" />
      <el-table-column prop="createdAt" :label="t('common.time')" />
      <el-table-column :label="t('submission.status')">
        <template #default="s"><el-tag :type="s.row.read ? 'info' : 'danger'">{{ s.row.read ? t('admin.messages.read') : t('admin.messages.unread') }}</el-tag></template>
      </el-table-column>
      <el-table-column>
        <template #default="s"><el-button @click="markRead(s.row)" :disabled="s.row.read">{{ t('admin.messages.markRead') }}</el-button></template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';
const { t } = useI18n();
const list = ref<any[]>([]);
const load = async () => { list.value = (await http.get('/admin/notifications')).data.data; };
const markRead = async (row: any) => { await http.patch(`/admin/notifications/${row.id}/read`); await load(); };
onMounted(load);
</script>
