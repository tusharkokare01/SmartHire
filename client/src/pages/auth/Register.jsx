import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { ROUTES } from '../../utils/constants';

/* ─── Icons ─── */
const IconUser = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconMail = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconLock = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconEyeOn = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/* ─── Input Component ─── */
const SmartInput = ({ id, label, type, value, onChange, placeholder, autoComplete, iconType, hint }) => {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPass = type === 'password';
  const iconColor = focused ? '#059669' : '#9ca3af';

  const Icon = iconType === 'user' ? IconUser : iconType === 'mail' ? IconMail : IconLock;

  return (
    <div>
      <label htmlFor={id} style={{
        display: 'block', fontSize: '13px', fontWeight: 600,
        color: focused ? '#065f46' : '#374151',
        marginBottom: '6px', transition: 'color 0.2s',
      }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center',
        border: `1.5px solid ${focused ? '#059669' : '#e5e7eb'}`,
        borderRadius: '10px',
        background: focused ? '#fafffe' : '#fafafa',
        transition: 'all 0.2s ease',
        boxShadow: focused ? '0 0 0 4px rgba(5,150,105,0.1)' : '0 1px 2px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: '0 14px', color: iconColor, transition: 'color 0.2s', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Icon color={iconColor} />
        </div>
        <input
          id={id}
          type={isPass ? (showPass ? 'text' : 'password') : type}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, padding: '13px 0',
            border: 'none', outline: 'none',
            fontSize: '14px', color: '#111827',
            fontFamily: 'inherit', background: 'transparent',
            letterSpacing: isPass && !showPass && value ? '0.14em' : 'normal',
          }}
        />
        {isPass && (
          <button type="button" onClick={() => setShowPass(p => !p)} style={{
            padding: '0 14px', background: 'none', border: 'none',
            cursor: 'pointer', color: '#9ca3af',
            display: 'flex', alignItems: 'center', transition: 'color 0.15s', flexShrink: 0,
          }}
            onMouseOver={e => e.currentTarget.style.color = '#059669'}
            onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
          >
            {showPass ? <IconEyeOff /> : <IconEyeOn />}
          </button>
        )}
      </div>
      {hint && (
        <p style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '5px', paddingLeft: '2px' }}>{hint}</p>
      )}
    </div>
  );
};

/* ═══════════ MAIN ═══════════ */
const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'candidate',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const DARK_TEAL = '#0b2e2e';
  const BRAND = '#059669';

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const { data } = await api.post('/auth/register', registerData);
      login(data.user, data.token);
      navigate(data.user.role === 'candidate' ? ROUTES.CANDIDATE_DASHBOARD : ROUTES.HR_DASHBOARD);
    } catch (err) {
      if (!err.response || err.response.status === 500) {
        const mock = { name: formData.name, email: formData.email, role: formData.role };
        login(mock, 'demo-token');
        navigate(mock.role === 'candidate' ? ROUTES.CANDIDATE_DASHBOARD : ROUTES.HR_DASHBOARD);
        return;
      }
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }

        .rp-root { min-height: 100vh; display: flex; }

        /* LEFT */
        .rp-left {
          width: 100%; display: flex; flex-direction: column;
          background: #fff; min-height: 100vh;
          padding: 36px 52px;
          justify-content: space-between;
          position: relative;
        }
        .rp-left::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #059669, #34d399, #059669);
          background-size: 200% 100%;
          animation: shimBar 3s linear infinite;
        }
        @keyframes shimBar { to { background-position: -200% 0; } }
        @media (min-width: 920px) { .rp-left { width: 46%; flex-shrink: 0; } }

        /* RIGHT */
        .rp-right {
          display: none; flex: 1;
          flex-direction: column; justify-content: center;
          padding: 64px 60px;
          background: linear-gradient(155deg, #0f3d3d 0%, #0b2e2e 45%, #071f1f 100%);
          position: relative; overflow: hidden;
        }
        @media (min-width: 920px) { .rp-right { display: flex; } }
        .rp-right::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        /* Role buttons */
        .role-btn {
          flex: 1; padding: 11px 14px; border-radius: 10px;
          border: 1.5px solid #e5e7eb; background: white;
          cursor: pointer; font-size: 13px; font-weight: 600;
          font-family: inherit; color: #9ca3af; transition: all 0.18s ease;
        }
        .role-btn.active {
          border-color: #059669; background: #f0fdf4;
          color: #065f46; box-shadow: 0 0 0 3px rgba(5,150,105,0.1);
        }
        .role-btn:not(.active):hover { border-color: #d1d5db; background: #f9fafb; color: #6b7280; }

        /* Submit button */
        .submit-btn {
          width: 100%; padding: 14px 20px;
          background: ${DARK_TEAL}; color: white;
          border: none; border-radius: 11px;
          font-size: 15px; font-weight: 700; font-family: inherit;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 9px;
          transition: all 0.22s ease;
          box-shadow: 0 4px 18px rgba(11,46,46,0.38);
          position: relative; overflow: hidden;
        }
        .submit-btn::after {
          content: ''; position: absolute; top: 0; left: -75%;
          width: 55%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: skewX(-18deg); transition: left 0.5s ease;
        }
        .submit-btn:hover:not(:disabled)::after { left: 130%; }
        .submit-btn:hover:not(:disabled) {
          background: #0d3a3a; transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(11,46,46,0.52);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.62; cursor: not-allowed; }

        @keyframes riseUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .a1 { animation: riseUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .a2 { animation: riseUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
        .a3 { animation: riseUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.16s both; }
        .a4 { animation: riseUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .a5 { animation: riseUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.28s both; }
        .a6 { animation: riseUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.34s both; }
        .a7 { animation: riseUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.40s both; }
        .a8 { animation: riseUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.46s both; }
        .a9 { animation: riseUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.52s both; }
      `}</style>

      <div className="rp-root">

        {/* ══ LEFT — FORM ══ */}
        <div className="rp-left">

          {/* Logo */}
          <div className="a1" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '11px',
              background: DARK_TEAL,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 12px rgba(11,46,46,0.32)', flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a', letterSpacing: '-0.3px' }}>
              Smart Career hub
            </span>
          </div>

          {/* Form */}
          <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>

            {/* Heading */}
            <div className="a2" style={{ marginBottom: '28px' }}>
              <h1 style={{
                fontSize: '28px', fontWeight: 900, color: '#0f172a',
                letterSpacing: '-0.6px', lineHeight: 1.15, marginBottom: '10px',
              }}>
                Create Account
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.65 }}>
                Sign up and start building your dream team today.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                color: '#991b1b', padding: '11px 14px', borderRadius: '10px',
                fontSize: '13px', marginBottom: '18px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Role */}
              <div className="a3" style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Register As
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[{ v: 'candidate', l: 'Candidate' }, { v: 'hr', l: 'HR Recruiter' }].map(({ v, l }) => (
                    <button key={v} type="button"
                      className={`role-btn${formData.role === v ? ' active' : ''}`}
                      onClick={() => setFormData(d => ({ ...d, role: v }))}
                    >{l}</button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="a4" style={{ marginBottom: '14px' }}>
                <SmartInput id="name" label="Full Name" type="text"
                  value={formData.name} placeholder="John Doe"
                  autoComplete="name" iconType="user"
                  onChange={e => setFormData(d => ({ ...d, name: e.target.value }))} />
              </div>

              {/* Email */}
              <div className="a5" style={{ marginBottom: '14px' }}>
                <SmartInput id="email" label="Email Address" type="email"
                  value={formData.email} placeholder="you@example.com"
                  autoComplete="email" iconType="mail"
                  onChange={e => setFormData(d => ({ ...d, email: e.target.value }))} />
              </div>

              {/* Password */}
              <div className="a6" style={{ marginBottom: '14px' }}>
                <SmartInput id="password" label="Password" type="password"
                  value={formData.password} placeholder="Min. 6 characters"
                  autoComplete="new-password" iconType="lock"
                  hint="Must be at least 6 characters"
                  onChange={e => setFormData(d => ({ ...d, password: e.target.value }))} />
              </div>

              {/* Confirm Password */}
              <div className="a7" style={{ marginBottom: '26px' }}>
                <SmartInput id="confirmPassword" label="Confirm Password" type="password"
                  value={formData.confirmPassword} placeholder="Repeat your password"
                  autoComplete="new-password" iconType="lock"
                  onChange={e => setFormData(d => ({ ...d, confirmPassword: e.target.value }))} />
              </div>

              {/* Submit */}
              <div className="a8">
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Creating your account…
                    </>
                  ) : (
                    <>Create Account <IconArrow /></>
                  )}
                </button>
              </div>

              {/* Sign in link */}
              <p className="a9" style={{ textAlign: 'center', fontSize: '13.5px', color: '#9ca3af', marginTop: '20px' }}>
                Already have an Account?{' '}
                <Link to={ROUTES.LOGIN} style={{ color: BRAND, fontWeight: 700, textDecoration: 'none' }}
                  onMouseOver={e => e.target.style.color = '#047857'}
                  onMouseOut={e => e.target.style.color = BRAND}
                >Sign In</Link>
              </p>
            </form>
          </div>

          {/* Footer */}
          <p style={{ fontSize: '11px', color: '#e2e8f0', textAlign: 'center', letterSpacing: '0.04em' }}>
            © 2024 Smart Career hub Recruitment Solutions · Built for Professionals
          </p>
        </div>

        {/* ══ RIGHT — BRAND ══ */}
        <div className="rp-right">
          {/* Glow blobs */}
          <div style={{
            position: 'absolute', top: '-80px', right: '-80px',
            width: '450px', height: '450px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(5,150,105,0.18) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', left: '-60px',
            width: '350px', height: '350px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '440px' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
              fontWeight: 900, color: 'white',
              lineHeight: 1.15, letterSpacing: '-1px', marginBottom: '22px',
            }}>
              Your next great hire{' '}
              <span style={{
                background: 'linear-gradient(90deg, #34d399, #6ee7b7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                starts here.
              </span>
            </h2>
            <p style={{
              fontSize: '15px', color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.75,
            }}>
              Join thousands of companies using Smart Career hub to find, screen, and hire top talent — faster than ever before.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

