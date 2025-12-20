import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  CheckCircle,
  ArrowUpRight,
  Search,
  TrendingUp,
  FileText,
  Zap,
  Users,
  PenTool,
  Sparkles,
  X,
  FileEdit,
  Award,
  Crown,
  FileUser
} from 'lucide-react';
import Layout from '../../components/common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import api from '../../services/api';
import CareerCoach from '../../components/candidate/CareerCoach';
import { loadJSON } from '../../utils/storage';

const MOCK_JOBS = [
  { id: 'm1', title: 'Senior React Developer', company: 'TechNova', type: 'Remote', description: 'Seeking a React expert...', requirements: ['React', 'Node.js'] },
  { id: 'm2', title: 'Product Designer', company: 'Creative Studio', type: 'Hybrid', description: 'Design beautiful interfaces...', requirements: ['Figma', 'UI/UX'] },
  { id: 'm3', title: 'Data Scientist', company: 'DataCorp', type: 'On-site', description: 'Analyze large datasets...', requirements: ['Python', 'SQL'] },
  { id: 'm4', title: 'Marketing Manager', company: 'BrandFocus', type: 'Remote', description: 'Lead marketing campaigns...', requirements: ['SEO', 'Content'] },
  { id: 'm5', title: 'Full Stack Engineer', company: 'WebSolutions', type: 'Remote', description: 'Build scalable apps...', requirements: ['MERN', 'AWS'] }
];

const FALLBACK_DATA = {
  apps: 12,
  interviews: 1,
  shortlisted: 2,
  profile: 85,
  pipeline: [
    { title: 'Applied', value: 12, change: '+3 this week', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700', bar: 'bg-blue-400', fill: '82%', path: '/candidate/job-search' },
    { title: 'Interviews', value: 1, change: '1 scheduled', badgeBg: 'bg-amber-50', badgeText: 'text-amber-700', bar: 'bg-amber-400', fill: '45%', path: '/candidate/interviews' },
    { title: 'Assessments', value: 2, change: 'Action Required', badgeBg: 'bg-red-50', badgeText: 'text-red-700', bar: 'bg-red-500', fill: '100%', path: '/candidate/assessments' },
  ],
  upcoming: [
    { date: new Date().setDate(new Date().getDate() + 1), jobTitle: 'Senior React Dev', companyName: 'Vercel', time: '10:00 AM' },
  ],
  jobs: [
    { id: 1, title: 'Frontend Engineer', company: 'Raycast', type: 'Remote' },
    { id: 2, title: 'Design Engineer', company: 'Figma', type: 'Hybrid' },
    { id: 3, title: 'Full Stack Dev', company: 'Supabase', type: 'Remote' },
  ]
};

// --- VISUAL COMPONENTS ---

// 1. Radial Progress Widget
const ProfileDonut = ({ value, delay }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 hover-card animate-fade-in-up flex items-center justify-between" style={{ animationDelay: delay }}>
      <div>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}%</h3>
        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Profile Score</p>
      </div>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="32" cy="32" r={radius} stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
          <circle
            cx="32" cy="32" r={radius}
            stroke="#10b981" strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <Zap className="absolute h-5 w-5 text-emerald-500" />
      </div>
    </div>
  );
};


// 2. SVG Area Chart
// 2. SVG Area Chart


// 4. Tool Card
const ToolCard = ({ label, description, icon: Icon, path, color }) => (
  <Link
    to={path}
    className="group flex flex-col p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200"
  >
    <div className={`h-10 w-10 ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
      <Icon className="h-5 w-5 text-current" />
    </div>
    <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{label}</h3>
    <p className="text-xs text-slate-500 mt-1">{description}</p>
  </Link>
);

// 3. New Quick Action Card (Replacing old one)
const QuickActionCard = ({ title, desc, icon: Icon, path, color, delay }) => (
  <Link
    to={path}
    className="group relative flex flex-col justify-between p-6 h-64 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 overflow-hidden"
    style={{ animationDelay: delay }}
  >
    {/* Background Watermark Icon */}
    <Icon className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-50 group-hover:text-emerald-50/50 transition-colors transform rotate-12" />

    <div className={`relative z-10 w-12 h-12 rounded-full ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className="h-6 w-6" />
    </div>

    <div className="relative z-10 mt-auto">
      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">{title}</h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </Link>
);


// 4. Stat Card
const StatCard = ({ label, value, icon: Icon, delay }) => (
  <div
    className="bg-white p-8 rounded-xl border border-slate-200 hover-card group cursor-default animate-fade-in-up shadow-sm flex flex-col justify-between h-full"
    style={{ animationDelay: delay }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors border border-slate-100">
        <Icon className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
      </div>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

// 6. Highlight stat for hero sidebar
// 6. Highlight stat for hero sidebar
const HighlightStat = ({ icon: Icon, label, value, detail, tone, path, state }) => {
  const Container = path ? Link : 'div';
  return (
    <Container
      to={path}
      state={state}
      className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:border-emerald-500/50 transition-all hover:shadow-md cursor-pointer ${path ? 'group' : ''}`}
    >
      <div className={`p-3 rounded-xl ${tone.bg} ${tone.text} group-hover:scale-110 transition-transform`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{value}</span>
          <span className="text-xs font-semibold text-emerald-600">{detail}</span>
        </div>
      </div>
    </Container>
  );
};

// 7. Interview schedule card item
const ScheduleItem = ({ event }) => {
  const date = new Date(event.date);
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex flex-col items-center justify-center text-emerald-700 shadow-inner">
        <span className="text-[10px] font-bold uppercase">{date.toLocaleString('default', { month: 'short' })}</span>
        <span className="text-lg font-bold leading-none">{date.getDate()}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-900">{event.jobTitle}</h4>
        <p className="text-sm text-slate-500">{event.companyName} • {event.time}</p>
      </div>
      <div className="px-3 py-1 text-xs font-bold rounded-full bg-slate-50 border border-slate-200 text-slate-500">
        {event.mode || 'Virtual'}
      </div>
    </div>
  );
};

// 8. Pipeline stage card
const StageCard = ({ stage }) => {
  const Container = stage.path ? Link : 'div';
  return (
    <Container
      to={stage.path}
      className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-emerald-500/50 transition-colors block ${stage.path ? 'cursor-pointer hover:shadow-md' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${stage.badgeBg} ${stage.badgeText}`}>{stage.title}</div>
        <span className="text-xs font-semibold text-emerald-600">{stage.change}</span>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-slate-900">{stage.value}</p>
        <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${stage.bar}`} style={{ width: stage.fill }}></div>
        </div>
      </div>
    </Container>
  );
};

// 5. Job Card
const JobCard = ({ job }) => (
  <div className="group p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all duration-300 cursor-pointer shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">{job.title}</h4>
        <p className="text-xs text-slate-500 mt-1">{job.company}</p>
      </div>
      <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100">{job.type}</span>
    </div>
    <div className="mt-4 flex items-center justify-between">
      <div className="flex gap-2">
        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">98% Match</span>
      </div>
      <Link to={ROUTES.JOB_SEARCH} className="text-slate-400 hover:text-emerald-600 transition-colors">
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

// 6. Styled Welcome Banner (NEW)
const WelcomeBanner = ({ greeting, name, eventsCount, onClose }) => {
  const [typedName, setTypedName] = useState('');
  const fullName = `${greeting}, ${name}!`;

  useEffect(() => {
    let i = 0;
    setTypedName('');
    const interval = setInterval(() => {
      setTypedName(fullName.slice(0, i + 1));
      i++;
      if (i > fullName.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [fullName]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-8 md:p-10 shadow-sm border border-slate-100 reveal-text delay-100 group mb-6">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 bg-[length:200%_200%] animate-pulse-slow"></div>

      {/* Floating Elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl animate-float delay-0"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl animate-float delay-700"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold tracking-wide animate-pulse-slow">
            <Sparkles className="h-3 w-3" />
            <span>Beta Access</span>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2 min-h-[3.5rem] flex items-center">
              {typedName}
              <span className="animate-pulse text-emerald-500 ml-1">|</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-xl animate-fade-in-up delay-300">
              You have <strong className="text-emerald-700">{eventsCount} upcoming events</strong>. Your profile is looking great today.
            </p>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 animate-fade-in-up delay-500">
            <Link to={ROUTES.JOB_SEARCH} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:scale-105 active:scale-95 duration-200">
              Find Jobs <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to={ROUTES.RESUME_BUILDER} className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all hover:border-emerald-200 hover:scale-105 active:scale-95 duration-200">
              Update Resume
            </Link>
          </div>
        </div>

        {/* Progress Box */}

      </div>

      {/* Close Button */}
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [showBanner, setShowBanner] = useState(true);

  const [data, setData] = useState(FALLBACK_DATA);
  const [recommendationType, setRecommendationType] = useState('latest'); // 'matched' or 'latest'

  useEffect(() => {
    // Determine Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const controller = new AbortController();

    const loadData = async () => {
      if (!user?.id && !user?._id) {
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const userId = user.id || user._id;

      setLoading(true);
      try {
        const [appsRes, interviewsRes, jobsRes] = await Promise.allSettled([
          api.get(`/applications?candidateId=${userId}`, { signal: controller.signal }),
          api.get(`/candidate/interviews?candidateId=${userId}`, { signal: controller.signal }),
          api.get('/jobs', { signal: controller.signal })
        ]);

        const applications = appsRes.status === 'fulfilled' ? appsRes.value?.data || [] : [];
        const interviews = interviewsRes.status === 'fulfilled' ? interviewsRes.value?.data || [] : [];
        let jobs = jobsRes.status === 'fulfilled' ? jobsRes.value?.data || [] : [];

        console.log("DEBUG: Jobs API Response:", jobsRes);
        console.log("DEBUG: Parsed Jobs array length:", jobs.length);

        // FALLBACK: If API returns empty, use Mock Data for demonstration
        if (jobs.length === 0) {
          console.log("DEBUG: API empty, using MOCK_JOBS");
          jobs = MOCK_JOBS;
        }

        // Real Data Calculation
        const appsCount = applications.length;
        const shortlistedCount = applications.filter(app => (app.status || '').toLowerCase() === 'shortlisted').length;
        // const profileScore = user?.profileScore || 0; // REPLACED with Resume Count

        // --- NEW: Fetch Resumes & Extract Skills ---
        const localResumes = loadJSON(`resumes_list_${user.email}`, []) || [];
        const resumeCount = localResumes.length;

        // Extract skills from all resumes
        const userSkills = new Set();
        localResumes.forEach(r => {
          if (Array.isArray(r.skills)) {
            r.skills.forEach(s => userSkills.add(s.toLowerCase()));
          }
          // Also extract job titles from experience as keywords
          if (Array.isArray(r.experience)) {
            r.experience.forEach(exp => {
              if (exp.title) {
                // Split title into words and add significant ones
                const words = exp.title.toLowerCase().split(/\s+/);
                words.forEach(w => {
                  if (w.length > 2 && !['and', 'the', 'for', 'senior', 'junior', 'lead'].includes(w)) {
                    userSkills.add(w);
                  }
                });
              }
            });
          }
        });

        console.log("DEBUG: Final Search Keywords:", Array.from(userSkills));

        // Filter Jobs based on Skills
        let filteredJobs = jobs;
        let recType = 'latest';

        console.log("DEBUG: Resume Count:", resumeCount);
        console.log("DEBUG: Extracted Skills:", Array.from(userSkills));

        if (userSkills.size > 0) {
          const scoredJobs = jobs.map(job => {
            let score = 0;
            const jobText = (job.title + ' ' + (job.company || '') + ' ' + (job.description || '') + ' ' + (job.requirements?.join(' ') || '')).toLowerCase();

            userSkills.forEach(skill => {
              if (jobText.includes(skill)) score++;
            });
            return { ...job, score };
          });

          // Sort by score (desc) and take top ones with score > 0
          const matched = scoredJobs.filter(j => j.score > 0).sort((a, b) => b.score - a.score);

          console.log("DEBUG: Matched Jobs:", matched.map(j => `${j.title} (${j.score})`));

          if (matched.length > 0) {
            filteredJobs = matched;
            recType = 'matched';
          }
        }

        // If falling back to 'latest' (no matches), shuffle to show random jobs
        if (recType === 'latest' && filteredJobs.length > 0) {
          filteredJobs = [...filteredJobs].sort(() => 0.5 - Math.random());
        }

        setRecommendationType(recType);

        const recommendedJobs = (Array.isArray(filteredJobs) ? filteredJobs : []).slice(0, 3).map(job => ({
          id: job._id || job.id,
          title: job.title,
          company: job.company || job.companyName || 'Company',
          type: job.locationType || job.type || 'Remote',
          matchScore: job.score // Pass score to card if needed
        }));

        // --- NEW: Fetch Assignments ---
        let pendingAssessments = 0;
        try {
          const assessmentsRes = await api.get(`/assessments/my-assessments/${userId}`);
          pendingAssessments = assessmentsRes.data.filter(a => a.status !== 'Completed').length;
        } catch (e) { console.warn('Failed to fetch assessments', e); }

        const pipeline = [
          { title: 'Applied', value: appsCount, change: '', badgeBg: 'bg-blue-50', badgeText: 'text-blue-700', bar: 'bg-blue-400', fill: `${appsCount === 0 ? 0 : Math.min(100, Math.max(5, appsCount * 5))}%`, path: '/candidate/job-search' },
          { title: 'Interviews', value: interviews.length, change: '', badgeBg: 'bg-amber-50', badgeText: 'text-amber-700', bar: 'bg-amber-400', fill: `${interviews.length === 0 ? 0 : Math.min(100, Math.max(5, interviews.length * 20))}%`, path: '/candidate/interviews' },
          {
            title: 'Assessments',
            value: pendingAssessments,
            change: pendingAssessments > 0 ? 'Action Required' : 'Up to date',
            badgeBg: pendingAssessments > 0 ? 'bg-red-50' : 'bg-emerald-50',
            badgeText: pendingAssessments > 0 ? 'text-red-700' : 'text-emerald-700',
            bar: pendingAssessments > 0 ? 'bg-red-500' : 'bg-emerald-500',
            fill: `${pendingAssessments > 0 ? 100 : 0}%`,
            path: '/candidate/assessments'
          },
        ];

        const upcoming = interviews
          .filter(int => int.status !== 'completed' && int.status !== 'cancelled')
          .map(int => ({
            date: int.scheduledAt || int.date || int.createdAt,
            jobTitle: int.jobTitle || int.title || 'Interview',
            companyName: int.companyName || int.company || 'Company',
            time: int.time || (int.scheduledAt ? new Date(int.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'),
            mode: int.mode || int.location || 'Virtual',
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);


        // Calculate Activity (Last 7 Days)
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().split('T')[0];
        });

        const activityData = last7Days.map(date => {
          return applications.filter(app => {
            const appDate = (app.appliedAt || app.createdAt || '').split('T')[0];
            return appDate === date;
          }).length;
        });

        setData({
          apps: appsCount,
          interviews: interviews.length,
          shortlisted: shortlistedCount,
          assessments: pendingAssessments, // Add this
          resumeCount: resumeCount,
          pipeline,
          upcoming,
          jobs: recommendedJobs,
          activity: activityData
        });
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadData();
    return () => controller.abort();
  }, [user]);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 bg-emerald-600 rounded-xl animate-pulse mb-6"></div>
        <div className="h-1 w-32 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-600 animate-[shimmer_1s_infinite] w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <Layout role="candidate">
      <div className="max-w-7xl mx-auto space-y-8 pb-14 px-1">

        {/* Hero */}
        <section className="space-y-4">
          {showBanner && (
            <WelcomeBanner
              greeting={greeting}
              name={user?.name?.split(' ')[0]}
              eventsCount={data.upcoming.length}
              onClose={() => setShowBanner(false)}
            />
          )}
        </section>

        {/* Stats row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <HighlightStat icon={FileUser} label="View Resume" value={data.resumeCount || 0} detail="Total Resumes" tone={{ bg: 'bg-slate-50', text: 'text-slate-700' }} path={ROUTES.MY_RESUMES} />
          <HighlightStat icon={Briefcase} label="Total Applications" value={data.apps} detail="+3 this week" tone={{ bg: 'bg-emerald-50', text: 'text-emerald-700' }} path={ROUTES.APPLIED_JOBS} />
          <HighlightStat icon={Calendar} label="Interviews" value={data.interviews} detail="1 scheduled" tone={{ bg: 'bg-blue-50', text: 'text-blue-700' }} path={ROUTES.CANDIDATE_INTERVIEWS} />
          {/* Changed Shortlisted to Assessments */}
          <HighlightStat
            icon={CheckCircle}
            label="Assessments"
            value={data.assessments || 0}
            detail={data.assessments > 0 ? "Action Required" : "No pending tasks"}
            tone={{ bg: data.assessments > 0 ? 'bg-red-50' : 'bg-emerald-50', text: data.assessments > 0 ? 'text-red-700' : 'text-emerald-700' }}
            path="/candidate/assessments"
          />
        </section>



        {/* Quick Actions (formerly AI Career Toolkit) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              title="Resume Builder"
              desc="Create or update your CV with AI assistance."
              icon={FileText}
              path={ROUTES.RESUME_BUILDER}
              color="bg-emerald-50 text-emerald-600"
            />
            <QuickActionCard
              title="Check Score"
              desc="Analyze your resume against job descriptions."
              icon={Zap}
              path={ROUTES.RESUME_SCORER}
              color="bg-emerald-50 text-emerald-600"
            />
            <QuickActionCard
              title="Find Jobs"
              desc="Explore new matches tailored for you."
              icon={Search}
              path={ROUTES.JOB_SEARCH}
              color="bg-emerald-50 text-emerald-600"
            />
            <QuickActionCard
              title="Mock Interview"
              desc="Practice answering questions with AI."
              icon={Users}
              path={ROUTES.MOCK_INTERVIEW}
              color="bg-emerald-50 text-emerald-600"
            />
            <QuickActionCard
              title="Cover Letter"
              desc="Generate tailored letters for your applications."
              icon={FileEdit}
              path={ROUTES.COVER_LETTER}
              color="bg-emerald-50 text-emerald-600"
            />
          </div>
        </section>



        {/* Main split - Full Width now */}
        <section className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interview schedule</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Stay on top of your next conversation</h3>
              </div>
              <Link to={ROUTES.CANDIDATE_INTERVIEWS} className="text-emerald-600 font-semibold text-sm hover:underline">View calendar</Link>
            </div>
            {data.upcoming.length > 0 ? (
              data.upcoming.map((event, idx) => <ScheduleItem key={idx} event={event} />)
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400">
                No interviews scheduled. Try scheduling mock interviews to stay sharp.
              </div>
            )}
          </div>


        </section>

        {/* Recommendations */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Recommended roles
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {recommendationType === 'matched' ? 'Tailored picks based on your skills' : 'Top opportunities for you'}
              </h3>
            </div>
            <Link to={ROUTES.JOB_SEARCH} className="text-xs font-bold text-emerald-600 hover:underline">See all</Link>
          </div>

          {data.jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.jobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50">
              <p className="text-slate-500 font-medium">No job recommendations available right now.</p>
              <Link to={ROUTES.JOB_SEARCH} className="text-emerald-600 text-sm hover:underline mt-2 inline-block">
                Browse all jobs
              </Link>
            </div>
          )}
        </section>

      </div>
      <CareerCoach />
    </Layout>
  );
};

export default Dashboard;
