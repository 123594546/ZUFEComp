import bcrypt from 'bcryptjs';
import { db } from './db.js';

export const seedIfEmpty = async () => {
  await db.read();
  if (db.data.users.length || db.data.activities.length) return;
  const hash = await bcrypt.hash('123456', 10);
  db.data.users = [
    { id: 'u_admin', studentId: 'admin001', name: '系统管理员', grade: '教师', college: '信息管理学院', role: 'admin', passwordHash: hash, createdAt: new Date().toISOString() },
    { id: 'u_stu1', studentId: '20230001', name: '张三', grade: '2023', college: '财政税务学院', role: 'student', passwordHash: hash, createdAt: new Date().toISOString() },
    { id: 'u_stu2', studentId: '20230002', name: '李四', grade: '2023', college: '会计学院', role: 'student', passwordHash: hash, createdAt: new Date().toISOString() }
  ];
  const types = ['志愿服务', '学科竞赛', '讲座论坛', '创新创业'];
  db.data.activities = Array.from({ length: 10 }).map((_, i) => ({
    id: `act_${i + 1}`,
    title: `活动${i + 1}：${types[i % types.length]}专题`,
    type: types[i % types.length],
    tags: ['二课堂', i % 2 ? '竞赛' : '实践', i % 3 ? '校级' : '院级'],
    description: `这是第${i + 1}个演示活动，用于平台评审。`,
    location: i % 2 ? '学术中心A101' : '线上腾讯会议',
    startTime: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
    endTime: new Date(Date.now() + (i + 1) * 86400000 + 7200000).toISOString(),
    signupDeadline: new Date(Date.now() + i * 86400000).toISOString(),
    capacity: 50 + i * 5,
    status: i < 8 ? 'published' : 'draft',
    createdBy: 'u_admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  await db.write();
};
