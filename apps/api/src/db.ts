import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'node:path';
import fs from 'node:fs';
import { DBSchema } from './types/models.js';

const dataFile = process.env.DATA_FILE || '../../data/db.json';
const resolvedPath = path.resolve(process.cwd(), dataFile);

fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

const adapter = new JSONFile<DBSchema>(resolvedPath);
export const db = new Low<DBSchema>(adapter, {
  users: [],
  activities: [],
  enrollments: [],
  submissions: [],
  pointsLedger: []
});

export const initDB = async () => {
  await db.read();
  db.data ||= { users: [], activities: [], enrollments: [], submissions: [], pointsLedger: [] };
  db.data.pointsLedger ||= [];
  db.data.users = db.data.users.map((user) => ({ ...user, points: user.points || 0 }));
  await db.write();
};
