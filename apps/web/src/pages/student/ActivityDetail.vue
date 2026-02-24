<template><el-card v-if="detail"><h2>{{detail.title}}</h2><p>{{detail.description}}</p><el-tag>{{detail.status}}</el-tag><p>剩余名额 {{detail.remaining}}</p><p>报名截止倒计时：{{countdown}}</p><el-button type="primary" @click="enroll">报名</el-button><el-button @click="cancel">取消报名</el-button><el-upload :http-request="upload" :show-file-list="false"><el-button>提交材料</el-button></el-upload></el-card></template>
<script setup lang="ts">import { computed, onMounted, ref } from 'vue';import { useRoute } from 'vue-router';import { http } from '../../api/http';import { ElMessage } from 'element-plus';
const route=useRoute();const detail=ref<any>();const now=ref(Date.now());setInterval(()=>now.value=Date.now(),1000);
const countdown=computed(()=>{if(!detail.value)return '';const diff=new Date(detail.value.signupDeadline).getTime()-now.value;return diff>0?Math.floor(diff/1000)+'s':'已截止';});
const load=async()=>{detail.value=(await http.get('/activities/'+route.params.id)).data.data;};onMounted(load);
const enroll=async()=>{try{await http.post(`/activities/${route.params.id}/enroll`);ElMessage.success('报名成功');load();}catch(e:any){ElMessage.error(e.response?.data?.message||'失败');}};
const cancel=async()=>{await http.delete(`/activities/${route.params.id}/enroll`);ElMessage.success('已取消');load();};
const upload=async(opt:any)=>{const fd=new FormData();fd.append('file',opt.file);fd.append('note','前端提交');await http.post(`/activities/${route.params.id}/submissions`,fd);ElMessage.success('提交成功');};
</script>
