<template><el-row :gutter="12"><el-col :span="8" v-for="c in cards" :key="c.label"><el-card><div>{{c.label}}</div><h2>{{c.value}}</h2></el-card></el-col></el-row></template>
<script setup lang="ts">import { onMounted, ref } from 'vue';import { http } from '../../api/http';
const cards=ref([{label:'我的报名',value:0},{label:'我的提交',value:0},{label:'待审核',value:0}]);
onMounted(async()=>{const [e,s]=await Promise.all([http.get('/me/enrollments'),http.get('/me/submissions')]);cards.value[0].value=e.data.data.length;cards.value[1].value=s.data.data.length;cards.value[2].value=s.data.data.filter((x:any)=>x.status==='pending').length;});
</script>
