import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'dev_secret';
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

export const signToken = (payload: { id: string; role: string }) => jwt.sign(payload, secret, { expiresIn });
export const verifyToken = (token: string) => jwt.verify(token, secret) as { id: string; role: 'student' | 'admin' };
