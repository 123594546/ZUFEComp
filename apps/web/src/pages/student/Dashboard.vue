<template>
  <el-row :gutter="12">
    <el-col :span="8" v-for="c in cards" :key="c.label">
      <el-card>
        <div>{{ c.label }}</div>
        <h2>{{ c.value }}</h2>
      </el-card>
    </el-col>
  </el-row>

  <el-card style="margin-top: 12px">
    <template #header>AI 活动推荐</template>
    <el-empty v-if="!recommendations.length" description="暂无推荐" />
    <el-space wrap v-else>
      <el-card v-for="item in recommendations" :key="item.id" style="width: 280px">
        <h4>{{ item.title }}</h4>
        <p>匹配分：{{ item.recommendScore }}</p>
        <p>{{ item.recommendReason }}</p>
      </el-card>
    </el-space>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { http } from '../../api/http';

const cards = ref([
  { label: '我的报名', value: 0 },
  { label: '我的提交', value: 0 },
  { label: '待审核', value: 0 },
]);
const recommendations = ref<any[]>([]);

onMounted(async () => {
  const [e, s, r] = await Promise.all([
    http.get('/me/enrollments'),
    http.get('/me/submissions'),
    http.get('/me/recommendations'),
  ]);
  cards.value[0].value = e.data.data.length;
  cards.value[1].value = s.data.data.length;
  cards.value[2].value = s.data.data.filter((x: { status: string }) => x.status === 'pending').length;
  recommendations.value = r.data.data;
});
</script>
