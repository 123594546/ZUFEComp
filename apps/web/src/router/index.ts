import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/login', component: () => import('../pages/common/Login.vue') },
  { path: '/register', component: () => import('../pages/common/Register.vue') },
  { path: '/403', component: () => import('../pages/common/Forbidden.vue') },
  { path: '/', redirect: '/app/dashboard' },
  { path: '/app', component: () => import('../layouts/StudentLayout.vue'), children: [
    { path: 'dashboard', component: () => import('../pages/student/Dashboard.vue') },
    { path: 'activities', component: () => import('../pages/student/Activities.vue') },
    { path: 'activities/:id', component: () => import('../pages/student/ActivityDetail.vue') },
    { path: 'me/enrollments', component: () => import('../pages/student/MyEnrollments.vue') },
    { path: 'me/submissions', component: () => import('../pages/student/MySubmissions.vue') }
  ]},
  { path: '/admin', component: () => import('../layouts/AdminLayout.vue'), children: [
    { path: 'overview', component: () => import('../pages/admin/Overview.vue') },
    { path: 'activities', component: () => import('../pages/admin/ActivitiesManage.vue') },
    { path: 'submissions', component: () => import('../pages/admin/SubmissionsReview.vue') },
    { path: 'export', component: () => import('../pages/admin/ExportCenter.vue') }
  ]},
  { path: '/:pathMatch(.*)*', component: () => import('../pages/common/NotFound.vue') }
];

const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (!['/login', '/register'].includes(to.path) && !auth.token) return '/login';
  if (auth.token && !auth.user) await auth.refreshMe();
  if (to.path.startsWith('/admin') && auth.user?.role !== 'admin') return '/403';
});
export default router;
