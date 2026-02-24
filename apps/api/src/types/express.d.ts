import { Role } from './models.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
        permissions?: {
          manageActivityTypes?: string[];
          manageableStatuses?: Array<'draft' | 'published' | 'closed'>;
        };
      };
    }
  }
}

export {};
