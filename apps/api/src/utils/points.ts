import { nanoid } from 'nanoid';
import { db } from '../db.js';
import { now } from './helpers.js';

interface AwardParams {
  userId: string;
  type: 'enrollment' | 'submission' | 'submissionApproved';
  refId: string;
  points: number;
  note: string;
}

export const awardPointsOnce = ({ userId, type, refId, points, note }: AwardParams) => {
  const exists = db.data.pointsLedger.some((item) => item.userId === userId && item.type === type && item.refId === refId);
  if (exists) return false;
  const user = db.data.users.find((item) => item.id === userId);
  if (!user) return false;
  user.points += points;
  db.data.pointsLedger.push({ id: nanoid(), userId, type, refId, points, note, createdAt: now() });
  return true;
};
