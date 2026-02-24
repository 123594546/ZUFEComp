import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { db } from '../db.js';

const router = Router();
router.get('/:submissionId', auth, async (req, res) => {
  await db.read();
  const s = db.data.submissions.find((x) => x.id === req.params.submissionId);
  if (!s) return res.status(404).json({ success: false, message: '文件不存在' });
  if (req.user!.role !== 'admin' && s.userId !== req.user!.id) return res.status(403).json({ success: false, message: '无权限下载' });
  res.setHeader('Content-Type', s.mimeType);
  res.download(s.filePath, s.fileName);
});
export default router;
