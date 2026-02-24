import { Router } from 'express';
import { db } from '../db.js';
import { auth, requireRole } from '../middleware/auth.js';
import { now } from '../utils/helpers.js';
import { awardPointsOnce } from '../utils/points.js';

const router = Router();
router.use(auth, requireRole('admin'));

router.get('/submissions', async (req, res) => {
  await db.read();
  const { status = '', keyword = '', page = '1', pageSize = '10' } = req.query as Record<string, string>;
  let list = db.data.submissions.filter((s) => s.fileName.includes(keyword) || s.note.includes(keyword));
  if (status) list = list.filter((s) => s.status === status);
  const p = Number(page), ps = Number(pageSize);
  const data = list.slice((p - 1) * ps, p * ps).map((s) => ({ ...s, user: db.data.users.find((u) => u.id === s.userId), activity: db.data.activities.find((a) => a.id === s.activityId) }));
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
  await db.write();
  res.json({ success: true, data: s });
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
  const reviewed = db.data.submissions.filter((s) => s.status !== 'pending').length;
  const approved = db.data.submissions.filter((s) => s.status === 'approved').length;
  res.json({ success: true, data: { totalActivities, totalEnrollments, pendingReviews: pending, byCollege, byGrade, byType, approveRate: reviewed ? Number((approved / reviewed).toFixed(2)) : 0 } });
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

export default router;
