import { Router } from 'express';
import { nanoid } from 'nanoid';
import { db } from '../db.js';
import { auth, requireRole } from '../middleware/auth.js';
import { now } from '../utils/helpers.js';
import { awardPointsOnce } from '../utils/points.js';
import type { Role } from '../types/models.js';

const router = Router();
router.use(auth, requireRole('admin'));

router.get('/submissions', async (req, res) => {
  await db.read();
  const { status = '', keyword = '', activityId = '', studentId = '', sortBy = 'createdAt', order = 'desc', page = '1', pageSize = '10' } = req.query as Record<string, string>;
  let list = db.data.submissions.map((s) => ({ ...s, user: db.data.users.find((u) => u.id === s.userId), activity: db.data.activities.find((a) => a.id === s.activityId) }));
  if (keyword) list = list.filter((s) => s.fileName.includes(keyword) || s.note.includes(keyword));
  if (status) list = list.filter((s) => s.status === status);
  if (activityId) list = list.filter((s) => s.activityId === activityId);
  if (studentId) list = list.filter((s) => s.user?.studentId?.includes(studentId));
  list = list.sort((a, b) => {
    const asc = order === 'asc' ? 1 : -1;
    if (sortBy === 'studentId') return ((a.user?.studentId || '').localeCompare(b.user?.studentId || '')) * asc;
    if (sortBy === 'status') return a.status.localeCompare(b.status) * asc;
    return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * asc;
  });
  const p = Number(page), ps = Number(pageSize);
  const data = list.slice((p - 1) * ps, p * ps);
  res.json({ success: true, data, meta: { total: list.length, page: p, pageSize: ps } });
});

router.patch('/submissions/:id/review', async (req, res) => {
  await db.read();
  const s = db.data.submissions.find((x) => x.id === req.params.id);
  if (!s) return res.status(404).json({ success: false, message: '不存在' });
  s.status = req.body.status;
  s.reviewNote = req.body.reviewNote || '';
  s.reviewerId = req.user!.id;
  s.updatedAt = now();
  if (s.status === 'approved') {
    const activity = db.data.activities.find((item) => item.id === s.activityId);
    awardPointsOnce({ userId: s.userId, type: 'submissionApproved', refId: s.id, points: 20, note: `材料通过：${activity?.title || '活动材料'}` });
  }
  db.data.notifications.push({ id: nanoid(), userId: s.userId, title: '材料审核结果已更新', content: `你的材料已被${s.status === 'approved' ? '通过' : '驳回'}。${s.reviewNote ? `备注：${s.reviewNote}` : ''}`, type: 'submission_reviewed', read: false, createdAt: now() });
  await db.write();
  res.json({ success: true, data: s });
});

router.post('/submissions/batch-review', async (req, res) => {
  await db.read();
  const { ids = [], status = 'approved', reviewNote = '' } = req.body as { ids: string[]; status: 'approved' | 'rejected'; reviewNote?: string };
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ success: false, message: '请选择要审核的数据' });
  const updated = db.data.submissions.filter((s) => ids.includes(s.id));
  updated.forEach((s) => {
    s.status = status;
    s.reviewNote = reviewNote;
    s.reviewerId = req.user!.id;
    s.updatedAt = now();
    db.data.notifications.push({ id: nanoid(), userId: s.userId, title: '材料审核结果已更新', content: `你的材料已被${status === 'approved' ? '通过' : '驳回'}。${reviewNote ? `备注：${reviewNote}` : ''}`, type: 'submission_reviewed', read: false, createdAt: now() });
  });
  await db.write();
  res.json({ success: true, data: { count: updated.length } });
});

router.get('/points/ranking', async (_req, res) => {
  await db.read();
  const data = db.data.users
    .filter((item) => item.role === 'student')
    .map((item) => ({ id: item.id, studentId: item.studentId, name: item.name, college: item.college, grade: item.grade, points: item.points || 0 }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 50);
  res.json({ success: true, data });
});

router.get('/stats', async (_req, res) => {
  await db.read();
  const totalActivities = db.data.activities.length;
  const totalEnrollments = db.data.enrollments.filter((e) => e.status === 'enrolled').length;
  const pending = db.data.submissions.filter((s) => s.status === 'pending').length;
  const byCollege: Record<string, number> = {};
  const byGrade: Record<string, number> = {};
  db.data.enrollments.filter((e) => e.status === 'enrolled').forEach((e) => {
    const u = db.data.users.find((x) => x.id === e.userId); if (!u) return;
    byCollege[u.college] = (byCollege[u.college] || 0) + 1;
    byGrade[u.grade] = (byGrade[u.grade] || 0) + 1;
  });
  const byType: Record<string, number> = {};
  db.data.enrollments.filter((e) => e.status === 'enrolled').forEach((e) => {
    const a = db.data.activities.find((x) => x.id === e.activityId); if (!a) return;
    byType[a.type] = (byType[a.type] || 0) + 1;
  });
  const trend: Record<string, number> = {};
  db.data.enrollments.filter((e) => e.status === 'enrolled').forEach((e) => {
    const key = e.createdAt.slice(0, 10);
    trend[key] = (trend[key] || 0) + 1;
  });
  const reviewed = db.data.submissions.filter((s) => s.status !== 'pending').length;
  const approved = db.data.submissions.filter((s) => s.status === 'approved').length;
  res.json({ success: true, data: { totalActivities, totalEnrollments, pendingReviews: pending, byCollege, byGrade, byType, enrollTrend: trend, approveRate: reviewed ? Number((approved / reviewed).toFixed(2)) : 0 } });
});

const toCsv = (rows: Record<string, unknown>[]) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return [headers.join(','), ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? '').replaceAll('"', '""')}"`).join(','))].join('\n');
};

router.get('/export/enrollments', async (req, res) => {
  await db.read();
  const { activityId } = req.query as Record<string, string>;
  const rows = db.data.enrollments.filter((e) => e.status === 'enrolled' && (!activityId || e.activityId === activityId)).map((e) => {
    const u = db.data.users.find((x) => x.id === e.userId); const a = db.data.activities.find((x) => x.id === e.activityId);
    return { enrollmentId: e.id, activityTitle: a?.title || '', studentId: u?.studentId || '', name: u?.name || '', college: u?.college || '', grade: u?.grade || '', createdAt: e.createdAt };
  });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.send(toCsv(rows));
});
router.get('/export/submissions', async (req, res) => {
  await db.read();
  const { status } = req.query as Record<string, string>;
  const rows = db.data.submissions.filter((s) => !status || s.status === status).map((s) => {
    const u = db.data.users.find((x) => x.id === s.userId); const a = db.data.activities.find((x) => x.id === s.activityId);
    return { submissionId: s.id, activityTitle: a?.title || '', studentId: u?.studentId || '', name: u?.name || '', status: s.status, reviewNote: s.reviewNote || '' };
  });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.send(toCsv(rows));
});

router.get('/notifications', async (req, res) => {
  await db.read();
  const data = db.data.notifications.filter((n) => n.userId === req.user!.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ success: true, data });
});

router.patch('/notifications/:id/read', async (req, res) => {
  await db.read();
  const i = db.data.notifications.find((n) => n.id === req.params.id && n.userId === req.user!.id);
  if (!i) return res.status(404).json({ success: false, message: '消息不存在' });
  i.read = true;
  await db.write();
  res.json({ success: true, data: i });
});

router.get('/roles', async (_req, res) => {
  await db.read();
  const data = db.data.users.filter((u) => u.role !== 'student').map((u) => ({ id: u.id, studentId: u.studentId, name: u.name, role: u.role, permissions: u.permissions || {} }));
  res.json({ success: true, data });
});

router.patch('/roles/:id', async (req, res) => {
  await db.read();
  const user = db.data.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: '用户不存在' });
  const role = req.body.role as Role;
  if (!['admin', 'activityAdmin', 'reviewer'].includes(role)) return res.status(400).json({ success: false, message: '非法角色' });
  user.role = role;
  user.permissions = req.body.permissions || {};
  await db.write();
  res.json({ success: true, data: user });
});

export default router;
