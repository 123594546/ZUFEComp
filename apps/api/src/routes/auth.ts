import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { db } from '../db.js';
import { signToken } from '../utils/jwt.js';
import { auth } from '../middleware/auth.js';
import { now } from '../utils/helpers.js';

const router = Router();
const sanitize = (u: any) => ({ id: u.id, studentId: u.studentId, name: u.name, grade: u.grade, college: u.college, role: u.role, createdAt: u.createdAt });

router.post('/register', async (req, res) => {
  const { studentId, name, password, grade, college } = req.body;
  if (!studentId || !name || !password) return res.status(400).json({ success: false, message: '参数不完整' });
  await db.read();
  if (db.data.users.some((u) => u.studentId === studentId)) return res.status(400).json({ success: false, message: '学号已注册' });
  const user = { id: nanoid(), studentId, name, grade: grade || '', college: college || '', role: 'student' as const, passwordHash: await bcrypt.hash(password, 10), createdAt: now() };
  db.data.users.push(user);
  await db.write();
  const token = signToken({ id: user.id, role: user.role });
  res.json({ success: true, data: { token, user: sanitize(user) } });
});

router.post('/login', async (req, res) => {
  const { studentId, password } = req.body;
  await db.read();
  const user = db.data.users.find((u) => u.studentId === studentId);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(400).json({ success: false, message: '账号或密码错误' });
  const token = signToken({ id: user.id, role: user.role });
  res.json({ success: true, data: { token, user: sanitize(user) } });
});

router.get('/me', auth, async (req, res) => {
  await db.read();
  const user = db.data.users.find((u) => u.id === req.user?.id);
  if (!user) return res.status(404).json({ success: false, message: '用户不存在' });
  res.json({ success: true, data: sanitize(user) });
});

export default router;
