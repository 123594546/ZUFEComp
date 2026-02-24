import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import type { Role } from '../types/models.js';

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

export const requireRole = (...roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: '无权限访问' });
  }
  next();
};
