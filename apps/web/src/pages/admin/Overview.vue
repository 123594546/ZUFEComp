<template>
  <el-row :gutter="12">
    <el-col :span="8"><el-card>{{ t('admin.overview.totalActivities') }} {{ stats.totalActivities }}</el-card></el-col>
    <el-col :span="8"><el-card>{{ t('admin.overview.totalEnrollments') }} {{ stats.totalEnrollments }}</el-card></el-col>
    <el-col :span="8"><el-card>{{ t('admin.overview.pendingReviews') }} {{ stats.pendingReviews }}</el-card></el-col>
  </el-row>
  <el-row :gutter="12" style="margin-top: 12px">
    <el-col :span="12"><div ref="typeChart" style="height:300px"></div></el-col>
    <el-col :span="12"><div ref="collegeChart" style="height:300px"></div></el-col>
  </el-row>
  <div ref="trendChart" style="height:320px;margin-top:16px"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { http } from '../../api/http';
import * as echarts from 'echarts';
const { t } = useI18n();
const stats = ref<any>({});
const typeChart = ref<HTMLDivElement>();
const collegeChart = ref<HTMLDivElement>();
const trendChart = ref<HTMLDivElement>();
onMounted(async () => {
  stats.value = (await http.get('/admin/stats')).data.data;
  echarts.init(typeChart.value!).setOption({ title: { text: t('admin.overview.typeDist') }, tooltip: {}, xAxis: { type: 'category', data: Object.keys(stats.value.byType || {}) }, yAxis: { type: 'value' }, series: [{ type: 'bar', data: Object.values(stats.value.byType || {}) }] });
  echarts.init(collegeChart.value!).setOption({ title: { text: t('admin.overview.collegeDist') }, tooltip: {}, series: [{ type: 'pie', radius: '60%', data: Object.entries(stats.value.byCollege || {}).map(([name, value]) => ({ name, value })) }] });
  echarts.init(trendChart.value!).setOption({ title: { text: t('admin.overview.trend') }, tooltip: {}, xAxis: { type: 'category', data: Object.keys(stats.value.enrollTrend || {}) }, yAxis: { type: 'value' }, series: [{ type: 'line', smooth: true, data: Object.values(stats.value.enrollTrend || {}) }] });
});
</script>
