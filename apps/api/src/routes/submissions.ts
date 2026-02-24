import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { db } from '../db.js';
import { auth, requireRole } from '../middleware/auth.js';
import { now } from '../utils/helpers.js';
import { evaluateSubmission } from '../utils/ai.js';
import { awardPointsOnce } from '../utils/points.js';

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

const router = Router();
router.use(auth);

router.post('/activities/:id/submissions', requireRole('student'), upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: '缺少文件' });
  await db.read();
  const act = db.data.activities.find((a) => a.id === req.params.id);
  if (!act) return res.status(404).json({ success: false, message: '活动不存在' });
  const aiReview = evaluateSubmission({
    fileSize: req.file.size,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    note: (req.body.note as string) || '',
  });
  const submission = { id: nanoid(), activityId: req.params.id, userId: req.user!.id, fileName: req.file.originalname, filePath: req.file.path, mimeType: req.file.mimetype, note: (req.body.note as string) || '', status: 'pending' as const, aiReview, createdAt: now(), updatedAt: now() };
  db.data.submissions.push(submission);
  db.data.users
    .filter((u) => u.role === 'admin' || u.role === 'reviewer')
    .forEach((admin) => {
      db.data.notifications.push({ id: nanoid(), userId: admin.id, title: '有新的材料待审核', content: `活动 ${act.title} 收到新的学生材料：${req.file?.originalname || ''}`, type: 'submission_created', read: false, createdAt: now() });
    });
  awardPointsOnce({ userId: req.user!.id, type: 'submission', refId: submission.id, points: 10, note: `提交材料：${act.title}` });
  await db.write();
  res.json({ success: true, data: submission });
});

export default router;
