<template>
  <el-container><el-aside width="220px"><el-menu router><el-menu-item index="/app/dashboard">首页</el-menu-item><el-menu-item index="/app/activities">活动列表</el-menu-item><el-menu-item index="/app/me/enrollments">我的报名</el-menu-item><el-menu-item index="/app/me/submissions">我的提交</el-menu-item></el-menu></el-aside>
  <el-container><el-header>学生端 <el-button @click="logout" size="small">退出</el-button></el-header><el-main><router-view /></el-main></el-container></el-container>
</template>
<script setup lang="ts">
import { useAuthStore } from '../stores/auth';import { useRouter } from 'vue-router';
const auth=useAuthStore();const router=useRouter();const logout=()=>{auth.logout();router.push('/login');};
</script>
