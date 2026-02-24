import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import activityRoutes from './routes/activities.js';
import meRoutes from './routes/me.js';
import adminRoutes from './routes/admin.js';
import submissionRoutes from './routes/submissions.js';
import fileRoutes from './routes/files.js';
import { initDB } from './db.js';
import { seedIfEmpty } from './seed.js';

dotenv.config();

export const createApp = async () => {
  await initDB();
  await seedIfEmpty();
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/', (_req, res) =>
    res.json({
      success: true,
      message: 'ZUFEComp API is running. Use /api/health for health check.'
    })
  );
  app.get('/api/health', (_req, res) => res.json({ success: true }));
  app.use('/api/auth', authRoutes);
  app.use('/api/activities', activityRoutes);
  app.use('/api/me', meRoutes);
  app.use('/api', submissionRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/files', fileRoutes);

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  return app;
};
