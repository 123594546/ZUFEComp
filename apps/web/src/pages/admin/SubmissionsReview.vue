<template>
  <el-card>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
      <el-input v-model="query.studentId" placeholder="学号筛选" style="width:180px" />
      <el-input v-model="query.activityId" placeholder="活动ID筛选" style="width:180px" />
      <el-select v-model="query.status" placeholder="审核状态" clearable style="width:150px">
        <el-option value="pending" label="待审核" /><el-option value="approved" label="通过" /><el-option value="rejected" label="驳回" />
      </el-select>
      <el-button @click="load">查询</el-button>
    </div>
    <el-table :data="list" @selection-change="sels = $event" border>
      <el-table-column type="selection" width="50" />
      <el-table-column prop="user.studentId" label="学号" width="120" />
      <el-table-column prop="user.name" label="学生" width="120" />
      <el-table-column prop="activity.title" label="活动" min-width="180" />
      <el-table-column prop="status" label="状态" width="90" />
      <el-table-column prop="aiReview.score" label="AI评分" width="90" />
      <el-table-column prop="aiReview.ocrText" label="OCR提取" min-width="240" show-overflow-tooltip />
      <el-table-column fixed="right" width="220">
        <template #default="s">
          <el-button @click="review(s.row, 'approved')">通过</el-button>
          <el-button type="danger" @click="review(s.row, 'rejected')">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:12px;display:flex;gap:8px">
      <el-input v-model="batchNote" placeholder="批量备注" style="width:300px" />
      <el-button @click="batch('approved')">批量通过</el-button>
      <el-button type="danger" @click="batch('rejected')">批量驳回</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { http } from '../../api/http';

const list = ref<any[]>([]);
const sels = ref<any[]>([]);
const batchNote = ref('');
const query = reactive({ studentId: '', activityId: '', status: '' });

const load = async () => {
  list.value = (await http.get('/admin/submissions', { params: { ...query, pageSize: 100 } })).data.data;
};

const review = async (row: any, status: string) => {
  const reviewNote = await ElMessageBox.prompt('请输入审核备注', '审核操作', { inputValue: status === 'approved' ? '审核通过' : '材料不完整' }).then((v: any) => v.value);
  await http.patch(`/admin/submissions/${row.id}/review`, { status, reviewNote });
  await load();
};

const batch = async (status: 'approved' | 'rejected') => {
  await http.post('/admin/submissions/batch-review', { ids: sels.value.map((x) => x.id), status, reviewNote: batchNote.value || (status === 'approved' ? '批量审核通过' : '批量审核驳回') });
  await load();
};

onMounted(load);
</script>
