<template><el-card><el-table :data="list" @selection-change="sels=$event" ><el-table-column type="selection"/><el-table-column prop="user.name" label="学生"/><el-table-column prop="activity.title" label="活动"/><el-table-column prop="status" label="状态"/><el-table-column><template #default="s"><el-button @click="review(s.row,'approved')">通过</el-button><el-button type="danger" @click="review(s.row,'rejected')">驳回</el-button></template></el-table-column></el-table><el-button @click="batch('approved')">批量通过</el-button><el-button @click="batch('rejected')">批量驳回</el-button></el-card></template>
<script setup lang="ts">import { onMounted, ref } from 'vue';import { http } from '../../api/http';const list=ref<any[]>([]);const sels=ref<any[]>([]);
const load=async()=>{list.value=(await http.get('/admin/submissions',{params:{pageSize:100}})).data.data;};onMounted(load);
const review=async(row:any,status:string)=>{await http.patch('/admin/submissions/'+row.id+'/review',{status,reviewNote:status==='rejected'?'材料不完整':'通过'});load();};
const batch=async(status:string)=>{for(const r of sels.value){await review(r,status);} };
</script>
