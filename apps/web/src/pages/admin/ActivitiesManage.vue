<template>
  <el-card>
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <el-input v-model="query.keyword" placeholder="按标题/描述搜索" style="width: 240px" />
      <el-select v-model="query.status" placeholder="状态" clearable style="width: 150px">
        <el-option value="draft" label="草稿" /><el-option value="published" label="已发布" /><el-option value="closed" label="已结束" />
      </el-select>
      <el-button @click="load">筛选</el-button>
      <el-button type="primary" @click="open()">新增活动</el-button>
    </div>

    <el-table :data="list" border>
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="capacity" label="上限" width="80" />
      <el-table-column prop="signupDeadline" label="报名截止" min-width="180" />
      <el-table-column label="状态" width="180">
        <template #default="s">
          <el-select v-model="s.row.status" @change="changeStatus(s.row)" size="small" style="width:130px">
            <el-option value="draft" label="草稿" /><el-option value="published" label="已发布" /><el-option value="closed" label="已结束" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="220">
        <template #default="s">
          <el-button @click="open(s.row)">编辑</el-button>
          <el-button type="danger" @click="remove(s.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" title="活动维护" width="700px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="110px">
        <el-form-item label="活动标题" prop="title"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="活动类型" prop="type"><el-input v-model="form.type" /></el-form-item>
        <el-form-item label="标签"><el-select v-model="form.tags" multiple><el-option label="校级" value="校级" /><el-option label="院级" value="院级" /><el-option label="实践" value="实践" /><el-option label="竞赛" value="竞赛" /></el-select></el-form-item>
        <el-form-item label="活动描述" prop="description"><el-input v-model="form.description" type="textarea" /></el-form-item>
        <el-form-item label="地点" prop="location"><el-input v-model="form.location" /></el-form-item>
        <el-form-item label="时间范围" required>
          <el-date-picker v-model="timeRange" type="datetimerange" value-format="YYYY-MM-DDTHH:mm:ss[Z]" style="width:100%" />
        </el-form-item>
        <el-form-item label="报名截止" prop="signupDeadline"><el-date-picker v-model="form.signupDeadline" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss[Z]" style="width:100%" /></el-form-item>
        <el-form-item label="人数上限" prop="capacity"><el-input-number v-model="form.capacity" :min="1" /></el-form-item>
        <el-form-item label="状态"><el-select v-model="form.status"><el-option value="draft" label="草稿" /><el-option value="published" label="已发布" /><el-option value="closed" label="已结束" /></el-select></el-form-item>
      </el-form>
      <template #footer><el-button @click="save">保存</el-button></template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { http } from '../../api/http';

const list = ref<any[]>([]);
const query = reactive({ keyword: '', status: '' });
const visible = ref(false);
const formRef = ref();
const timeRange = ref<string[]>([]);
const form = reactive<any>({ id: '', title: '', type: '', tags: ['校级'], description: '', location: '', startTime: '', endTime: '', signupDeadline: '', capacity: 100, status: 'draft' });
const rules = { title: [{ required: true, message: '请输入标题' }], type: [{ required: true, message: '请输入类型' }], description: [{ required: true, message: '请输入描述' }], location: [{ required: true, message: '请输入地点' }], signupDeadline: [{ required: true, message: '请选择截止时间' }] };

const load = async () => {
  list.value = (await http.get('/activities', { params: { ...query, pageSize: 100 } })).data.data;
};

const open = (row?: any) => {
  Object.assign(form, row || { id: '', title: '', type: '', tags: ['校级'], description: '', location: '', startTime: new Date().toISOString(), endTime: new Date(Date.now() + 7200000).toISOString(), signupDeadline: new Date().toISOString(), capacity: 100, status: 'draft' });
  timeRange.value = [form.startTime, form.endTime];
  visible.value = true;
};

const save = async () => {
  await formRef.value.validate();
  form.startTime = timeRange.value?.[0] || form.startTime;
  form.endTime = timeRange.value?.[1] || form.endTime;
  if (form.id) await http.put(`/activities/${form.id}`, form);
  else await http.post('/activities', form);
  ElMessage.success('保存成功');
  visible.value = false;
  await load();
};

const remove = async (id: string) => {
  const cascade = await ElMessageBox.confirm('是否删除关联报名和材料数据？选择“确定”将级联删除。', '删除确认', { type: 'warning', distinguishCancelAndClose: true, confirmButtonText: '删除全部', cancelButtonText: '仅删活动' })
    .then(() => true)
    .catch(() => false);
  await http.delete(`/activities/${id}`, { params: { cascade } });
  ElMessage.success('已删除');
  await load();
};

const changeStatus = async (row: any) => {
  await http.patch(`/activities/${row.id}/status`, { status: row.status });
  ElMessage.success('状态已更新');
};

onMounted(load);
</script>
