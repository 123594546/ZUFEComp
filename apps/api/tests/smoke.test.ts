import request from 'supertest';
import fs from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

let app: any;
let studentToken = '';
let adminToken = '';
let activityId = 'act_1';
let submissionId = '';

beforeAll(async () => {
  const file = path.resolve(process.cwd(), '../../data/test-db.json');
  process.env.DATA_FILE = '../../data/test-db.json';
  process.env.UPLOAD_DIR = '../../uploads';
  if (fs.existsSync(file)) fs.unlinkSync(file);
  app = await createApp();
});

describe('smoke api', () => {
  it('login', async () => {
    const s = await request(app).post('/api/auth/login').send({ studentId: '20230001', password: '123456' });
    expect(s.status).toBe(200);
    studentToken = s.body.data.token;
    const a = await request(app).post('/api/auth/login').send({ studentId: 'admin001', password: '123456' });
    adminToken = a.body.data.token;
  });
  it('get activities', async () => {
    const r = await request(app).get('/api/activities').set('Authorization', `Bearer ${studentToken}`);
    expect(r.body.success).toBeTruthy();
    const enrollable = r.body.data.find((item: { status: string; signupDeadline: string; remaining: number }) => item.status === 'published' && new Date(item.signupDeadline).getTime() > Date.now() && item.remaining > 0);
    activityId = enrollable?.id || r.body.data[0].id;
  });
  it('enroll', async () => {
    const r = await request(app).post(`/api/activities/${activityId}/enroll`).set('Authorization', `Bearer ${studentToken}`);
    expect(r.status).toBe(200);
  });
  it('submit and review', async () => {
    const file = path.resolve(process.cwd(), 'tests/demo.txt');
    fs.writeFileSync(file, 'demo');
    const s = await request(app).post(`/api/activities/${activityId}/submissions`).set('Authorization', `Bearer ${studentToken}`).attach('file', file).field('note', 'hello');
    expect(s.status).toBe(200);
    submissionId = s.body.data.id;
    const r = await request(app).patch(`/api/admin/submissions/${submissionId}/review`).set('Authorization', `Bearer ${adminToken}`).send({ status: 'approved', reviewNote: 'ok' });
    expect(r.status).toBe(200);

    const points = await request(app).get('/api/me/points').set('Authorization', `Bearer ${studentToken}`);
    expect(points.status).toBe(200);
    const ledgerTypes = points.body.data.ledger.map((item: { type: string }) => item.type);
    expect(points.body.data.points).toBeGreaterThanOrEqual(35);
    expect(ledgerTypes).toContain('enrollment');
    expect(ledgerTypes).toContain('submission');
    expect(ledgerTypes).toContain('submissionApproved');
  });
});
