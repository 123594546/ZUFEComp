<template>
  <el-card>
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <el-input v-model="query.keyword" :placeholder="t('activity.searchPlaceholder')" style="width: 240px" />
      <el-select v-model="query.status" :placeholder="t('common.status')" clearable style="width: 150px">
        <el-option value="draft" :label="t('activity.draft')" /><el-option value="published" :label="t('activity.published')" /><el-option value="closed" :label="t('activity.closed')" />
      </el-select>
      <el-button @click="load">{{ t('common.search') }}</el-button>
      <el-button type="primary" @click="open()">{{ t('activity.create') }}</el-button>
    </div>

    <el-table :data="list" border>
      <el-table-column prop="title" :label="t('activity.title')" min-width="200" />
      <el-table-column prop="type" :label="t('activity.type')" width="120" />
      <el-table-column prop="capacity" :label="t('activity.limit')" width="100" />
      <el-table-column prop="signupDeadline" :label="t('activity.signupDeadline')" min-width="180" />
      <el-table-column :label="t('common.status')" width="180">
        <template #default="s"><el-select v-model="s.row.status" @change="changeStatus(s.row)" size="small" style="width:130px"><el-option value="draft" :label="t('activity.draft')" /><el-option value="published" :label="t('activity.published')" /><el-option value="closed" :label="t('activity.closed')" /></el-select></template>
      </el-table-column>
      <el-table-column fixed="right" width="220">
        <template #default="s"><el-button @click="open(s.row)">{{ t('common.edit') }}</el-button><el-button type="danger" @click="remove(s.row.id)">{{ t('common.delete') }}</el-button></template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" :title="t('activity.manage')" width="700px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="110px">
        <el-form-item :label="t('activity.title')" prop="title"><el-input v-model="form.title" /></el-form-item>
        <el-form-item :label="t('activity.type')" prop="type"><el-input v-model="form.type" /></el-form-item>
        <el-form-item :label="t('activity.tags')"><el-select v-model="form.tags" multiple><el-option :label="t('activity.tagsSchool')" value="校级" /><el-option :label="t('activity.tagsCollege')" value="院级" /><el-option :label="t('activity.tagsPractice')" value="实践" /><el-option :label="t('activity.tagsCompetition')" value="竞赛" /></el-select></el-form-item>
        <el-form-item :label="t('activity.description')" prop="description"><el-input v-model="form.description" type="textarea" /></el-form-item>
        <el-form-item :label="t('activity.location')" prop="location"><el-input v-model="form.location" /></el-form-item>
        <el-form-item :label="t('activity.timeRange')" required><el-date-picker v-model="timeRange" type="datetimerange" value-format="YYYY-MM-DDTHH:mm:ss[Z]" style="width:100%" /></el-form-item>
        <el-form-item :label="t('activity.signupDeadline')" prop="signupDeadline"><el-date-picker v-model="form.signupDeadline" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss[Z]" style="width:100%" /></el-form-item>
        <el-form-item :label="t('activity.limit')" prop="capacity"><el-input-number v-model="form.capacity" :min="1" /></el-form-item>
        <el-form-item :label="t('common.status')"><el-select v-model="form.status"><el-option value="draft" :label="t('activity.draft')" /><el-option value="published" :label="t('activity.published')" /><el-option value="closed" :label="t('activity.closed')" /></el-select></el-form-item>
      </el-form>
      <template #footer><el-button @click="save">{{ t('common.save') }}</el-button></template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';
const { t } = useI18n();
const list = ref<any[]>([]); const query = reactive({ keyword: '', status: '' }); const visible = ref(false); const formRef = ref(); const timeRange = ref<string[]>([]);
const form = reactive<any>({ id: '', title: '', type: '', tags: ['校级'], description: '', location: '', startTime: '', endTime: '', signupDeadline: '', capacity: 100, status: 'draft' });
const rules = { title: [{ required: true, message: t('activity.title') }], type: [{ required: true, message: t('activity.type') }], description: [{ required: true, message: t('activity.description') }], location: [{ required: true, message: t('activity.location') }], signupDeadline: [{ required: true, message: t('activity.signupDeadline') }] };
const load = async () => { list.value = (await http.get('/activities', { params: { ...query, pageSize: 100 } })).data.data; };
const open = (row?: any) => { Object.assign(form, row || { id: '', title: '', type: '', tags: ['校级'], description: '', location: '', startTime: new Date().toISOString(), endTime: new Date(Date.now() + 7200000).toISOString(), signupDeadline: new Date().toISOString(), capacity: 100, status: 'draft' }); timeRange.value = [form.startTime, form.endTime]; visible.value = true; };
const save = async () => { await formRef.value.validate(); form.startTime = timeRange.value?.[0] || form.startTime; form.endTime = timeRange.value?.[1] || form.endTime; if (form.id) await http.put(`/activities/${form.id}`, form); else await http.post('/activities', form); ElMessage.success(t('activity.saved')); visible.value = false; await load(); };
const remove = async (id: string) => { const cascade = await ElMessageBox.confirm(t('activity.deleteConfirmMessage'), t('activity.deleteConfirmTitle'), { type: 'warning', distinguishCancelAndClose: true, confirmButtonText: t('activity.deleteAll'), cancelButtonText: t('activity.deleteOnly') }).then(() => true).catch(() => false); await http.delete(`/activities/${id}`, { params: { cascade } }); ElMessage.success(t('activity.deleted')); await load(); };
const changeStatus = async (row: any) => { await http.patch(`/activities/${row.id}/status`, { status: row.status }); ElMessage.success(t('activity.statusUpdated')); };
onMounted(load);
</script>
