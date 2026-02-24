<template>
  <el-card>
    <el-form inline>
      <el-form-item><el-input v-model="query.keyword" placeholder="搜索" /></el-form-item>
      <el-form-item><el-input v-model="query.type" placeholder="类型" /></el-form-item>
      <el-form-item>
        <el-select v-model="query.status" style="width: 130px" placeholder="状态">
          <el-option label="全部状态" value="" />
          <el-option label="草稿" value="draft" />
          <el-option label="已发布" value="published" />
          <el-option label="已关闭" value="closed" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.sortBy" style="width: 160px">
          <el-option label="发布时间" value="createdAt" />
          <el-option label="报名截止" value="signupDeadline" />
          <el-option label="容量" value="capacity" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.order" style="width: 120px">
          <el-option label="降序" value="desc" />
          <el-option label="升序" value="asc" />
        </el-select>
      </el-form-item>
      <el-button @click="onSearch">查询</el-button>
    </el-form>

    <el-alert v-if="error" :title="error" type="error" show-icon style="margin-bottom: 12px" />

    <el-table :data="list" v-loading="loading">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="type" label="类型" />
      <el-table-column label="标签">
        <template #default="s"><el-tag v-for="t in s.row.tags" :key="t">{{ t }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="status" label="状态" />
      <el-table-column label="剩余"><template #default="s">{{ s.row.remaining }}</template></el-table-column>
      <el-table-column><template #default="s"><el-button @click="$router.push('/app/activities/' + s.row.id)">详情</el-button></template></el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="query.page"
      v-model:page-size="query.pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @current-change="load"
      @size-change="onSizeChange"
      style="margin-top: 12px"
    />

    <el-empty v-if="!list.length && !loading" description="暂无活动" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { http } from '../../api/http';

const query = reactive({ keyword: '', type: '', status: '', sortBy: 'createdAt', order: 'desc', page: 1, pageSize: 10 });
type ActivityListItem = {
  id: string;
  title: string;
  type: string;
  tags: string[];
  status: 'draft' | 'published' | 'closed';
  remaining: number;
};

const list = ref<ActivityListItem[]>([]);
const total = ref(0);
const loading = ref(false);
const error = ref('');

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await http.get('/activities', { params: query });
    list.value = data.data;
    total.value = data.meta.total;
  } catch (err) {
    list.value = [];
    total.value = 0;
    error.value = '活动加载失败，请稍后重试';
    ElMessage.error('活动加载失败，请稍后重试');
    console.error(err);
  } finally {
    loading.value = false;
  }
};
const onSearch = () => {
  query.page = 1;
  load();
};
const onSizeChange = () => {
  query.page = 1;
  load();
};

onMounted(load);
</script>
