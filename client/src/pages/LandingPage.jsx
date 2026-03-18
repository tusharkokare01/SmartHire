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
    accent: '#6366f1',
    bg: 'rgba(99,102,241,0.12)',
  },
  {
    icon: '🎯',
    title: 'AI Resume Scorer',
    desc: 'Get instant AI-powered feedback on your resume. Improve your score and stand out to recruiters.',
    accent: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
  },
  {
    icon: '💼',
    title: 'Smart Job Search',
    desc: 'Browse thousands of job listings. Filter by role, location, salary, and apply directly from the platform.',
    accent: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
  },
  {
    icon: '🎤',
    title: 'Mock Interviews',
    desc: 'Practice with AI-powered mock interviews. Get real-time feedback and improve your interview skills.',
    accent: '#ec4899',
    bg: 'rgba(236,72,153,0.12)',
  },
  {
    icon: '✉️',
    title: 'Cover Letter Generator',
    desc: 'Generate tailored cover letters for every job application in seconds using advanced AI.',
    accent: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
  },
  {
    icon: '👔',
    title: 'HR Recruitment Suite',
    desc: 'Post jobs, manage candidates, schedule interviews, and create assessments — all in one dashboard.',
    accent: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
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
              <article
                key={i}
                className="landing-feature-card"
                style={{ '--accent': f.accent }}
              >
                <div
                  className="landing-feature-icon"
                  style={{ background: f.bg }}
                >
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="landing-cta" aria-label="Call to action">
          <div className="landing-cta-box">
            <h2>Ready to Launch Your Career?</h2>
            <p>
              Join thousands of professionals using Smart Career Hub to build resumes, 
              find jobs, and ace interviews. Start for free today.
            </p>
            <Link to={ROUTES.REGISTER} className="landing-hero-btn filled">
              Create Free Account <ArrowRight />
            </Link>
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
