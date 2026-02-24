import { Router } from 'express';
import { nanoid } from 'nanoid';
import { db } from '../db.js';
import { auth, requireRole } from '../middleware/auth.js';
import { calcRemaining, now } from '../utils/helpers.js';

const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
  await db.read();
  const { keyword = '', type = '', tag = '', status = '', sortBy = 'createdAt', order = 'desc', page = '1', pageSize = '10' } = req.query as Record<string, string>;
  let list = db.data.activities.filter((a) => a.title.includes(keyword) || a.description.includes(keyword));
  if (type) list = list.filter((a) => a.type === type);
  if (tag) list = list.filter((a) => a.tags.includes(tag));
  if (status) list = list.filter((a) => a.status === status);
  list = list.sort((a, b) => {
    const asc = order === 'asc' ? 1 : -1;
    if (sortBy === 'signupDeadline') return (new Date(a.signupDeadline).getTime() - new Date(b.signupDeadline).getTime()) * asc;
    if (sortBy === 'capacity') return (a.capacity - b.capacity) * asc;
    return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * asc;
  });
  const p = Number(page), ps = Number(pageSize);
  const data = list.slice((p - 1) * ps, p * ps).map((a) => ({ ...a, remaining: calcRemaining(a.id, db.data.enrollments, a.capacity) }));
  res.json({ success: true, data, meta: { total: list.length, page: p, pageSize: ps } });
});

router.get('/:id', async (req, res) => {
  await db.read();
  const a = db.data.activities.find((x) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: '活动不存在' });
  const my = db.data.enrollments.find((e) => e.activityId === a.id && e.userId === req.user!.id);
  res.json({ success: true, data: { ...a, remaining: calcRemaining(a.id, db.data.enrollments, a.capacity), myEnrollmentStatus: my?.status || null } });
});

router.post('/', requireRole('admin'), async (req, res) => {
  await db.read();
  const body = req.body;
  const item = { id: nanoid(), ...body, createdBy: req.user!.id, createdAt: now(), updatedAt: now() };
  db.data.activities.push(item);
  await db.write();
  res.json({ success: true, data: item });
});
router.put('/:id', requireRole('admin'), async (req, res) => {
  await db.read();
  const i = db.data.activities.findIndex((a) => a.id === req.params.id);
  if (i < 0) return res.status(404).json({ success: false, message: '不存在' });
  db.data.activities[i] = { ...db.data.activities[i], ...req.body, updatedAt: now() };
  await db.write();
  res.json({ success: true, data: db.data.activities[i] });
});
router.patch('/:id/status', requireRole('admin'), async (req, res) => {
  await db.read();
  const a = db.data.activities.find((x) => x.id === req.params.id);
  if (!a) return res.status(404).json({ success: false, message: '不存在' });
  a.status = req.body.status;
  a.updatedAt = now();
  await db.write();
  res.json({ success: true, data: a });
});
router.delete('/:id', requireRole('admin'), async (req, res) => {
  await db.read();
  db.data.activities = db.data.activities.filter((a) => a.id !== req.params.id);
  await db.write();
  res.json({ success: true });
});

router.post('/:id/enroll', requireRole('student'), async (req, res) => {
  await db.read();
  const act = db.data.activities.find((a) => a.id === req.params.id);
  if (!act || act.status !== 'published') return res.status(400).json({ success: false, message: '活动不可报名' });
  if (new Date(act.signupDeadline).getTime() < Date.now()) return res.status(400).json({ success: false, message: '已截止报名' });
  if (calcRemaining(act.id, db.data.enrollments, act.capacity) <= 0) return res.status(400).json({ success: false, message: '名额已满' });
  const ex = db.data.enrollments.find((e) => e.activityId === act.id && e.userId === req.user!.id);
  if (ex) { ex.status = 'enrolled'; ex.updatedAt = now(); }
  else db.data.enrollments.push({ id: nanoid(), activityId: act.id, userId: req.user!.id, status: 'enrolled', createdAt: now(), updatedAt: now() });
  await db.write();
  res.json({ success: true });
});
router.delete('/:id/enroll', requireRole('student'), async (req, res) => {
  await db.read();
  const e = db.data.enrollments.find((x) => x.activityId === req.params.id && x.userId === req.user!.id && x.status === 'enrolled');
  if (!e) return res.status(404).json({ success: false, message: '未报名' });
  e.status = 'cancelled'; e.updatedAt = now();
  await db.write();
  res.json({ success: true });
});

export default router;
