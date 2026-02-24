import { Router } from 'express';
import { db } from '../db.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/enrollments', requireRole('student'), async (req, res) => {
  await db.read();
  const list = db.data.enrollments
    .filter((e) => e.userId === req.user!.id)
    .map((e) => ({ ...e, activity: db.data.activities.find((a) => a.id === e.activityId) }));
  res.json({ success: true, data: list });
});

router.get('/submissions', requireRole('student'), async (req, res) => {
  await db.read();
  const list = db.data.submissions.filter((s) => s.userId === req.user!.id).map((s) => ({ ...s, activity: db.data.activities.find((a) => a.id === s.activityId) }));
  res.json({ success: true, data: list });
});

export default router;
