<template>
  <el-card>
    <el-form inline>
      <el-form-item><el-input v-model="query.keyword" :placeholder="t('activity.keyword')" /></el-form-item>
      <el-form-item><el-input v-model="query.type" :placeholder="t('activity.type')" /></el-form-item>
      <el-form-item>
        <el-select v-model="query.status" style="width: 130px" :placeholder="t('common.status')">
          <el-option :label="t('activity.allStatus')" value="" />
          <el-option :label="t('activity.draft')" value="draft" />
          <el-option :label="t('activity.published')" value="published" />
          <el-option :label="t('activity.closed')" value="closed" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.sortBy" style="width: 160px">
          <el-option :label="t('activity.createdAt')" value="createdAt" />
          <el-option :label="t('activity.signupDeadline')" value="signupDeadline" />
          <el-option :label="t('activity.capacity')" value="capacity" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.order" style="width: 120px">
          <el-option :label="t('activity.desc')" value="desc" />
          <el-option :label="t('activity.asc')" value="asc" />
        </el-select>
      </el-form-item>
      <el-button @click="onSearch">{{ t('common.search') }}</el-button>
    </el-form>

    <el-alert v-if="error" :title="error" show-icon style="margin-bottom: 12px" type="error" />

    <el-table v-loading="loading" :data="list">
      <el-table-column :label="t('activity.title')" prop="title" />
      <el-table-column :label="t('activity.type')" prop="type" />
      <el-table-column :label="t('activity.tags')">
        <template #default="s"><el-tag v-for="tag in s.row.tags" :key="tag">{{ tag }}</el-tag></template>
      </el-table-column>
      <el-table-column :label="t('common.status')" prop="status" />
      <el-table-column :label="t('activity.remaining')"><template #default="s">{{ s.row.remaining }}</template></el-table-column>
      <el-table-column><template #default="s"><el-button @click="$router.push('/app/activities/' + s.row.id)">{{ t('common.details') }}</el-button></template></el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="query.page"
      v-model:page-size="query.pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next"
      style="margin-top: 12px"
      @current-change="load"
      @size-change="onSizeChange"
    />

    <el-empty v-if="!list.length && !loading" :description="t('activity.empty')" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';

const { t } = useI18n();
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
    error.value = t('activity.loadFailed');
    ElMessage.error(t('activity.loadFailed'));
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
