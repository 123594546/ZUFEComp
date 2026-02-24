import jwt from 'jsonwebtoken';
import type { Role } from '../types/models.js';

const secret = (process.env.JWT_SECRET || 'dev_secret') as jwt.Secret;
const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];

export const signToken = (payload: { id: string; role: Role; permissions?: { manageActivityTypes?: string[]; manageableStatuses?: Array<'draft' | 'published' | 'closed'> } }) => jwt.sign(payload, secret, { expiresIn });
export const verifyToken = (token: string) => jwt.verify(token, secret) as { id: string; role: Role; permissions?: { manageActivityTypes?: string[]; manageableStatuses?: Array<'draft' | 'published' | 'closed'> } };
