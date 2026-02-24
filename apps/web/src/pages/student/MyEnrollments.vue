<template><el-table :data="list"><el-table-column prop="activity.title" label="活动"/><el-table-column prop="status" label="状态"/></el-table></template>
<script setup lang="ts">import { onMounted, ref } from 'vue';import { http } from '../../api/http';const list=ref([]);onMounted(async()=>{list.value=(await http.get('/me/enrollments')).data.data;});</script>
