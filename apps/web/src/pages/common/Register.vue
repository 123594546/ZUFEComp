<template><el-card><el-form :model="form"><el-form-item label="学号"><el-input v-model="form.studentId"/></el-form-item><el-form-item label="姓名"><el-input v-model="form.name"/></el-form-item><el-form-item label="年级"><el-input v-model="form.grade"/></el-form-item><el-form-item label="学院"><el-input v-model="form.college"/></el-form-item><el-form-item label="密码"><el-input show-password v-model="form.password"/></el-form-item><el-button type="primary" @click="submit">注册</el-button></el-form></el-card></template>
<script setup lang="ts">import { reactive } from 'vue';import { http } from '../../api/http';import { ElMessage } from 'element-plus';import { useRouter } from 'vue-router';
const router=useRouter();const form=reactive({studentId:'',name:'',password:'',grade:'',college:''});
const submit=async()=>{try{await http.post('/auth/register',form);ElMessage.success('注册成功');router.push('/login');}catch(e:any){ElMessage.error(e.response?.data?.message||'注册失败');}};
</script>
