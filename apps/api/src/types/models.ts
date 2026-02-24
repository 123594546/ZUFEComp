export type Role = 'student' | 'admin';

export interface User {
  id: string;
  studentId: string;
  name: string;
  grade: string;
  college: string;
  role: Role;
  passwordHash: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  type: string;
  tags: string[];
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  signupDeadline: string;
  capacity: number;
  status: 'draft' | 'published' | 'closed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  activityId: string;
  userId: string;
  status: 'enrolled' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  activityId: string;
  userId: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewerId?: string;
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBSchema {
  users: User[];
  activities: Activity[];
  enrollments: Enrollment[];
  submissions: Submission[];
}
