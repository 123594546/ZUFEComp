<template>
  <el-row :gutter="12">
    <el-col :span="8" v-for="c in cards" :key="c.label">
      <el-card><div>{{ c.label }}</div><h2>{{ c.value }}</h2></el-card>
    </el-col>
  </el-row>

  <el-card style="margin-top: 12px">
    <template #header>{{ t('dashboard.recommendations') }}</template>
    <el-empty v-if="!recommendations.length" :description="t('dashboard.emptyRecommendations')" />
    <el-space wrap v-else>
      <el-card v-for="item in recommendations" :key="item.id" style="width: 280px">
        <h4>{{ item.title }}</h4>
        <p>{{ t('dashboard.matchScore') }}：{{ item.recommendScore }}</p>
        <p>{{ item.recommendReason }}</p>
      </el-card>
    </el-space>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';
const { t } = useI18n();
const summary = ref({ enrollments: 0, submissions: 0, pending: 0, points: 0 });
const cards = computed(() => [
  { label: t('dashboard.myEnrollments'), value: summary.value.enrollments },
  { label: t('dashboard.mySubmissions'), value: summary.value.submissions },
  { label: t('dashboard.pendingReviews'), value: summary.value.pending },
  { label: t('dashboard.myPoints'), value: summary.value.points },
]);
const recommendations = ref<any[]>([]);
onMounted(async () => {
  const [e, s, r, p] = await Promise.all([http.get('/me/enrollments'), http.get('/me/submissions'), http.get('/me/recommendations'), http.get('/me/points')]);
  summary.value = { enrollments: e.data.data.length, submissions: s.data.data.length, pending: s.data.data.filter((x: { status: string }) => x.status === 'pending').length, points: p.data.data.points };
  recommendations.value = r.data.data;
});
</script>
