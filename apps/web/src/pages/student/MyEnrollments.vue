<template>
  <el-table :data="list">
    <el-table-column prop="activity.title" :label="t('common.activity')" />
    <el-table-column prop="status" :label="t('common.status')" />
  </el-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';

const { t } = useI18n();
const list = ref([]);
onMounted(async () => {
  list.value = (await http.get('/me/enrollments')).data.data;
});
</script>
