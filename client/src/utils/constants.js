export const USER_ROLES = {
  CANDIDATE: 'candidate',
  HR: 'hr',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  CANDIDATE_DASHBOARD: '/candidate/dashboard',
  HR_DASHBOARD: '/hr/dashboard',
  RESUME_BUILDER: '/candidate/resume-builder',
  MY_RESUMES: '/candidate/my-resumes',
  RESUME_SCORER: '/candidate/resume-scorer',
  COVER_LETTER: '/candidate/cover-letter',
  JOB_SEARCH: '/candidate/job-search',
  APPLIED_JOBS: '/candidate/applied-jobs',
  MOCK_INTERVIEW: '/candidate/mock-interview',
  CANDIDATE_INTERVIEWS: '/candidate/interviews',
  MY_ASSESSMENTS: '/candidate/assessments',
  HR_RESUMES: '/hr/resumes',
  HR_CANDIDATES: '/hr/candidates',
  HR_MEETINGS: '/hr/meetings',
  HR_MCQ: '/hr/mcq-creator',
  HR_MESSAGES: '/hr/messages',
  HR_FEEDBACK: '/hr/feedback',
  HR_SETTINGS: '/hr/settings',
  HR_PROFILE: '/hr/settings/profile',
  HR_CHANGE_PASSWORD: '/hr/settings/change-password',
  POST_JOB: '/hr/post-job',
  HR_JOBS: '/hr/jobs',
  SUBSCRIPTION: '/candidate/subscription',
  SETTINGS: '/candidate/settings',
  CHANGE_PASSWORD: '/candidate/change-password',
  PROFILE_SETTINGS: '/candidate/profile-settings',
  MESSAGES: '/candidate/messages',
};

export const RESUME_TEMPLATES = [
  { id: 1, name: 'Modern', preview: '/templates/modern.png' },
  { id: 2, name: 'Classic', preview: '/templates/classic.png' },
  { id: 3, name: 'Creative', preview: '/templates/creative.png' },
];

