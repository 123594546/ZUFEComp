<template>
  <el-card>
    <el-table :data="list">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="studentId" label="账号" />
      <el-table-column label="角色">
        <template #default="s">
          <el-select v-model="s.row.role" style="width: 150px">
            <el-option value="admin" label="超级管理员" />
            <el-option value="activityAdmin" label="活动管理员" />
            <el-option value="reviewer" label="审核员" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="可管活动类型">
        <template #default="s">
          <el-select v-model="s.row.permissions.manageActivityTypes" multiple collapse-tags>
            <el-option label="志愿服务" value="志愿服务" />
            <el-option label="学科竞赛" value="学科竞赛" />
            <el-option label="讲座论坛" value="讲座论坛" />
            <el-option label="创新创业" value="创新创业" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="s">
          <el-button type="primary" @click="save(s.row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { http } from '../../api/http';

const list = ref<any[]>([]);
const load = async () => {
  list.value = (await http.get('/admin/roles')).data.data.map((x: any) => ({ ...x, permissions: x.permissions || { manageActivityTypes: [], manageableStatuses: ['draft', 'published', 'closed'] } }));
};
const save = async (row: any) => {
  await http.patch(`/admin/roles/${row.id}`, { role: row.role, permissions: row.permissions });
  ElMessage.success('已保存');
};
onMounted(load);
</script>
