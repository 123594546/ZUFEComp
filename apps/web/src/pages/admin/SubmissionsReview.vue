<template>
  <el-card>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
      <el-input v-model="query.studentId" :placeholder="t('admin.submissions.studentFilter')" style="width:180px" />
      <el-input v-model="query.activityId" :placeholder="t('admin.submissions.activityFilter')" style="width:180px" />
      <el-select v-model="query.status" :placeholder="t('admin.submissions.reviewStatus')" clearable style="width:150px">
        <el-option value="pending" :label="t('submission.pending')" /><el-option value="approved" :label="t('submission.approved')" /><el-option value="rejected" :label="t('submission.rejected')" />
      </el-select>
      <el-button @click="load">{{ t('common.search') }}</el-button>
    </div>
    <el-table :data="list" @selection-change="sels = $event" border>
      <el-table-column type="selection" width="50" />
      <el-table-column prop="user.studentId" :label="t('login.studentId')" width="120" />
      <el-table-column prop="user.name" :label="t('admin.submissions.student')" width="120" />
      <el-table-column prop="activity.title" :label="t('common.activity')" min-width="180" />
      <el-table-column prop="status" :label="t('submission.status')" width="90" />
      <el-table-column prop="aiReview.score" :label="t('admin.submissions.aiScore')" width="90" />
      <el-table-column prop="aiReview.ocrText" :label="t('admin.submissions.ocr')" min-width="240" show-overflow-tooltip />
      <el-table-column fixed="right" width="220">
        <template #default="s"><el-button @click="review(s.row, 'approved')">{{ t('admin.submissions.approve') }}</el-button><el-button type="danger" @click="review(s.row, 'rejected')">{{ t('admin.submissions.reject') }}</el-button></template>
      </el-table-column>
    </el-table>
    <div style="margin-top:12px;display:flex;gap:8px">
      <el-input v-model="batchNote" :placeholder="t('admin.submissions.batchNote')" style="width:300px" />
      <el-button @click="batch('approved')">{{ t('admin.submissions.batchApprove') }}</el-button>
      <el-button type="danger" @click="batch('rejected')">{{ t('admin.submissions.batchReject') }}</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';
const { t } = useI18n();
const list = ref<any[]>([]); const sels = ref<any[]>([]); const batchNote = ref(''); const query = reactive({ studentId: '', activityId: '', status: '' });
const load = async () => { list.value = (await http.get('/admin/submissions', { params: { ...query, pageSize: 100 } })).data.data; };
const review = async (row: any, status: string) => { const reviewNote = await ElMessageBox.prompt(t('admin.submissions.reviewPrompt'), t('admin.submissions.reviewAction'), { inputValue: status === 'approved' ? t('admin.submissions.approveDefault') : t('admin.submissions.rejectDefault') }).then((v) => (typeof v === 'string' ? v : v.value)); await http.patch(`/admin/submissions/${row.id}/review`, { status, reviewNote }); await load(); };
const batch = async (status: 'approved' | 'rejected') => { await http.post('/admin/submissions/batch-review', { ids: sels.value.map((x) => x.id), status, reviewNote: batchNote.value || (status === 'approved' ? t('admin.submissions.batchApproveDefault') : t('admin.submissions.batchRejectDefault')) }); await load(); };
onMounted(load);
</script>
