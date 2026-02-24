import { useLocaleStore } from './stores/locale';

const dict = {
  zh: {
    student: '学生端',
    dashboard: '首页',
    activities: '活动列表',
    myEnrollments: '我的报名',
    mySubmissions: '我的提交',
    myPoints: '我的积分',
    logout: '退出',
    switchLang: '切换英文',
  },
  en: {
    student: 'Student',
    dashboard: 'Dashboard',
    activities: 'Activities',
    myEnrollments: 'My Enrollments',
    mySubmissions: 'My Submissions',
    myPoints: 'My Points',
    logout: 'Logout',
    switchLang: '切换中文',
  },
};

export const t = (key: keyof (typeof dict)['zh']) => {
  const locale = useLocaleStore();
  return dict[locale.locale][key];
};
