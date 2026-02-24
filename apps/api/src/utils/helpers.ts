import { Enrollment } from '../types/models.js';

export const now = () => new Date().toISOString();

export const calcRemaining = (activityId: string, enrollments: Enrollment[], capacity: number) => {
  const count = enrollments.filter((e) => e.activityId === activityId && e.status === 'enrolled').length;
  return Math.max(capacity - count, 0);
};
