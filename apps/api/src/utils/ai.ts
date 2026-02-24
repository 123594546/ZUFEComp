import type { Activity, Enrollment, Submission } from '../types/models.js';

export const scoreRecommendedActivities = (params: {
  activities: Activity[];
  enrollments: Enrollment[];
  submissions: Submission[];
  userId: string;
}) => {
  const { activities, enrollments, submissions, userId } = params;
  const userEnrollments = enrollments.filter((e) => e.userId === userId && e.status === 'enrolled');
  const joinedActivityIds = new Set(userEnrollments.map((e) => e.activityId));
  const enrolledByType: Record<string, number> = {};
  const submittedByType: Record<string, number> = {};

  userEnrollments.forEach((e) => {
    const activity = activities.find((a) => a.id === e.activityId);
    if (!activity) return;
    enrolledByType[activity.type] = (enrolledByType[activity.type] || 0) + 1;
  });

  submissions.filter((s) => s.userId === userId).forEach((s) => {
    const activity = activities.find((a) => a.id === s.activityId);
    if (!activity) return;
    submittedByType[activity.type] = (submittedByType[activity.type] || 0) + 1;
  });

  return activities
    .filter((a) => a.status === 'published' && !joinedActivityIds.has(a.id))
    .map((activity) => {
      const byEnroll = enrolledByType[activity.type] || 0;
      const bySubmission = submittedByType[activity.type] || 0;
      const recencyBoost = Math.max(0, 30 - Math.floor((Date.now() - new Date(activity.createdAt).getTime()) / (24 * 60 * 60 * 1000)));
      const score = Number((40 + byEnroll * 18 + bySubmission * 12 + recencyBoost * 0.5).toFixed(1));
      return {
        ...activity,
        recommendScore: score,
        recommendReason: byEnroll || bySubmission
          ? `你在“${activity.type}”类活动已有参与记录，匹配度较高`
          : '根据活动热度与发布时间推荐给你',
      };
    })
    .sort((a, b) => b.recommendScore - a.recommendScore);
};

export const evaluateSubmission = (params: { fileSize: number; fileName: string; mimeType: string; note: string }) => {
  const reasons: string[] = [];
  const ext = params.fileName.split('.').pop()?.toLowerCase() || '';
  const allowedExt = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'zip'];
  const allowedMime = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'application/zip', 'application/x-zip-compressed'];

  if (!allowedExt.includes(ext)) reasons.push('文件扩展名不在白名单内');
  if (!allowedMime.includes(params.mimeType)) reasons.push('MIME 类型不符合要求');
  if (params.fileSize > 10 * 1024 * 1024) reasons.push('文件超过 10MB 限制');
  if (params.note.trim().length < 5) reasons.push('说明文字过短，建议补充材料说明');

  const ocrText = `OCR模拟提取：${params.fileName.replace(/\.[^/.]+$/, '')} ${params.note.slice(0, 80)}`.trim();
  if (!/证书|证明|获奖|参与|完成/.test(ocrText)) reasons.push('OCR 未识别到明显证明关键词，请人工复核');

  const score = Math.max(0, 100 - reasons.length * 18);
  return {
    score,
    result: reasons.length <= 1 ? 'pass' as const : 'warn' as const,
    reasons,
    ocrText,
  };
};
