import { useLocaleStore } from './stores/locale';

const dict = {
  zh: {
    student: '学生端',
    admin: '管理端',
    dashboard: '首页',
    activities: '活动列表',
    myEnrollments: '我的报名',
    mySubmissions: '我的提交',
    myPoints: '我的积分',
    logout: '退出',
    switchLang: '切换英文',
    overview: '看板',
    manageActivities: '活动管理',
    reviewSubmissions: '材料审核',
    exportCenter: '导出中心',
    rolesCenter: '权限管理',
    messageCenter: '消息中心',
  },
  en: {
    student: 'Student',
    admin: 'Admin',
    dashboard: 'Dashboard',
    activities: 'Activities',
    myEnrollments: 'My Enrollments',
    mySubmissions: 'My Submissions',
    myPoints: 'My Points',
    logout: 'Logout',
    switchLang: '切换中文',
    overview: 'Overview',
    manageActivities: 'Activities',
    reviewSubmissions: 'Reviews',
    exportCenter: 'Export',
    rolesCenter: 'Roles',
    messageCenter: 'Messages',
  },
};

export const t = (key: keyof (typeof dict)['zh']) => {
  const locale = useLocaleStore();
  return dict[locale.locale][key];
};
