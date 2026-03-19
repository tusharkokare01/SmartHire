import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import './LandingPage.css';

/* ─── SVG Icons ─── */
const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/* ─── Feature data ─── */
const features = [
  {
    icon: '📝',
    title: 'AI Resume Builder',
    desc: 'Create stunning, ATS-friendly resumes with AI assistance. Choose from professional templates and export to PDF.',
    accent: '#059669',
    bg: 'rgba(5,150,105,0.12)',
  },
  {
    icon: '🎯',
    title: 'AI Resume Scorer',
    desc: 'Get instant AI-powered feedback on your resume. Improve your score and stand out to recruiters.',
    accent: '#34d399',
    bg: 'rgba(52,211,153,0.12)',
  },
  {
    icon: '💼',
    title: 'Smart Job Search',
    desc: 'Browse thousands of job listings. Filter by role, location, salary, and apply directly from the platform.',
    accent: '#0d9488',
    bg: 'rgba(13,148,136,0.12)',
  },
  {
    icon: '🎤',
    title: 'Mock Interviews',
    desc: 'Practice with AI-powered mock interviews. Get real-time feedback and improve your interview skills.',
    accent: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
  },
  {
    icon: '✉️',
    title: 'Cover Letter Generator',
    desc: 'Generate tailored cover letters for every job application in seconds using advanced AI.',
    accent: '#047857',
    bg: 'rgba(4,120,87,0.12)',
  },
  {
    icon: '👔',
    title: 'HR Recruitment Suite',
    desc: 'Post jobs, manage candidates, schedule interviews, and create assessments — all in one dashboard.',
    accent: '#6ee7b7',
    bg: 'rgba(110,231,183,0.12)',
  },
];

/* ═══════════ MAIN COMPONENT ═══════════ */
const LandingPage = () => {
  return (
    <div className="landing">
      <div className="landing-page">

        {/* ══ NAVIGATION ══ */}
        <nav className="landing-nav" role="navigation" aria-label="Main navigation">
          <Link to="/" className="landing-logo">
            <div className="landing-logo-box">
              <LogoIcon />
            </div>
            <span className="landing-logo-text">Smart Career Hub</span>
          </Link>
          <div className="landing-nav-links">
            <Link to={ROUTES.LOGIN} className="landing-nav-btn ghost">Sign In</Link>
            <Link to={ROUTES.REGISTER} className="landing-nav-btn primary">Get Started Free</Link>
          </div>
        </nav>

        {/* ══ HERO SECTION ══ */}
        <header className="landing-hero">
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            AI-Powered Career Platform
          </div>

          <h1>
            Your Career Journey Starts with{' '}
            <span className="gradient-text">Smart Career Hub</span>
          </h1>

          <p className="landing-hero-subtitle">
            Build professional resumes, search the best jobs, practice mock interviews,
            and let AI score your resume — everything you need to land your dream job, in one platform.
          </p>

          <div className="landing-hero-actions">
            <Link to={ROUTES.REGISTER} className="landing-hero-btn filled">
              Get Started — It&apos;s Free <ArrowRight />
            </Link>
            <Link to={ROUTES.LOGIN} className="landing-hero-btn outline">
              Sign In to Dashboard
            </Link>
          </div>
        </header>

        {/* ══ STATS BAR ══ */}
        <section className="landing-stats" aria-label="Platform statistics">
          <div className="landing-stat">
            <div className="landing-stat-number">10K+</div>
            <div className="landing-stat-label">Resumes Built</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-number">5K+</div>
            <div className="landing-stat-label">Jobs Listed</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-number">2K+</div>
            <div className="landing-stat-label">Interviews Practiced</div>
          </div>
          <div className="landing-stat">
            <div className="landing-stat-number">98%</div>
            <div className="landing-stat-label">Satisfaction Rate</div>
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <section className="landing-features" aria-label="Platform features">
          <p className="landing-features-title">Features</p>
          <h2 className="landing-features-heading">
            Everything You Need to Succeed
          </h2>

          <div className="landing-features-grid">
            {features.map((f, i) => (
              <Link
                to={ROUTES.LOGIN}
                key={i}
                className="landing-feature-card"
                style={{ '--accent': f.accent, textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className="landing-feature-icon"
                  style={{ background: f.bg }}
                >
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="landing-footer">
          © {new Date().getFullYear()} Smart Career Hub · Built by Tushar Kokare · All rights reserved
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;
