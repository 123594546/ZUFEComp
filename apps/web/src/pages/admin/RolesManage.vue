<template>
  <el-card>
    <el-table :data="list">
      <el-table-column prop="name" :label="t('admin.roles.name')" />
      <el-table-column prop="studentId" :label="t('admin.roles.account')" />
      <el-table-column :label="t('admin.roles.role')">
        <template #default="s">
          <el-select v-model="s.row.role" style="width: 150px">
            <el-option value="admin" :label="t('admin.roles.superAdmin')" />
            <el-option value="activityAdmin" :label="t('admin.roles.activityAdmin')" />
            <el-option value="reviewer" :label="t('admin.roles.reviewer')" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="t('admin.roles.permissions')">
        <template #default="s">
          <el-select v-model="s.row.permissions.manageActivityTypes" multiple collapse-tags>
            <el-option :label="t('admin.roles.volunteer')" value="志愿服务" />
            <el-option :label="t('admin.roles.competition')" value="学科竞赛" />
            <el-option :label="t('admin.roles.lecture')" value="讲座论坛" />
            <el-option :label="t('admin.roles.innovation')" value="创新创业" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="s"><el-button type="primary" @click="save(s.row)">{{ t('common.save') }}</el-button></template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';
const { t } = useI18n();
const list = ref<any[]>([]);
const load = async () => { list.value = (await http.get('/admin/roles')).data.data.map((x: any) => ({ ...x, permissions: x.permissions || { manageActivityTypes: [], manageableStatuses: ['draft', 'published', 'closed'] } })); };
const save = async (row: any) => { await http.patch(`/admin/roles/${row.id}`, { role: row.role, permissions: row.permissions }); ElMessage.success(t('admin.roles.saved')); };
onMounted(load);
</script>
