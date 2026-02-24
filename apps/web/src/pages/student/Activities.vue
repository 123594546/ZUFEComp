<template>
  <el-card>
    <el-form inline>
      <el-form-item><el-input v-model="query.keyword" placeholder="搜索" /></el-form-item>
      <el-form-item><el-input v-model="query.type" placeholder="类型" /></el-form-item>
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
import { http } from '../../api/http';

const query = reactive({ keyword: '', type: '', sortBy: 'createdAt', order: 'desc', page: 1, pageSize: 10 });
const list = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);

const load = async () => {
  loading.value = true;
  const { data } = await http.get('/activities', { params: query });
  list.value = data.data;
  total.value = data.meta.total;
  loading.value = false;
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
