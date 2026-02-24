<template><el-row :gutter="12"><el-col :span="8"><el-card>总活动 {{stats.totalActivities}}</el-card></el-col><el-col :span="8"><el-card>总报名 {{stats.totalEnrollments}}</el-card></el-col><el-col :span="8"><el-card>待审核 {{stats.pendingReviews}}</el-card></el-col></el-row><div ref="chart" style="height:320px;margin-top:16px"></div></template>
<script setup lang="ts">import { onMounted, ref } from 'vue';import { http } from '../../api/http';import * as echarts from 'echarts';
const stats=ref<any>({});const chart=ref<HTMLDivElement>();
onMounted(async()=>{stats.value=(await http.get('/admin/stats')).data.data;const c=echarts.init(chart.value!);c.setOption({tooltip:{},xAxis:{type:'category',data:Object.keys(stats.value.byType||{})},yAxis:{type:'value'},series:[{type:'bar',data:Object.values(stats.value.byType||{})}]});});
</script>
