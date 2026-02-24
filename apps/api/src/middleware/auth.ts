import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ success: false, message: '未登录' });
  const token = header.replace('Bearer ', '');
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ success: false, message: '登录态失效' });
  }
};

export const requireRole = (role: 'admin' | 'student') => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ success: false, message: '无权限访问' });
  }
  next();
};
