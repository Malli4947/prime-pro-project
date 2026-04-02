import React, { useState, useEffect, useRef } from 'react';
import './AuthModal.css';

// ── API base URL ──────────────────────────────────
// Set REACT_APP_API_URL=http://localhost:3000 in your .env
// DO NOT include /api at the end
const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

// ── Eye icon ──────────────────────────────────────
const EyeIcon = ({ show }) =>
  show ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

// ── Password strength meter ───────────────────────
function getStrength(pw) {
  if (!pw) return null;
  let score = 0;
  if (pw.length >= 6)            score++;
  if (pw.length >= 10)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  const levels = [
    null,
    { label: 'Weak',       color: '#e53e3e', w: '25%'  },
    { label: 'Fair',       color: '#f59e0b', w: '50%'  },
    { label: 'Good',       color: '#3b82f6', w: '75%'  },
    { label: 'Strong',     color: '#22c55e', w: '88%'  },
    { label: 'Very strong',color: '#16a34a', w: '100%' },
  ];
  return levels[score] || levels[1];
}

// ── Main component ────────────────────────────────
export default function AuthModal({ onClose, defaultTab = 'login', onAuthSuccess }) {
  // ── Tab & step state
  const [tab,     setTab]    = useState(defaultTab);  // 'login' | 'register'
  const [step,    setStep]   = useState('form');       // 'form' | 'success'
  const [loading, setLoading]= useState(false);
  const [error,   setError]  = useState('');

  // ── Password visibility
  const [showLoginPw,   setShowLoginPw]   = useState(false);
  const [showRegPw,     setShowRegPw]     = useState(false);
  const [showRegConfPw, setShowRegConfPw] = useState(false);

  // ── Login form — binds to POST /api/auth/login
  // Backend accepts: { email?, phone?, password }
  const [loginForm, setLoginForm] = useState({
    identifier: '',   // user types email OR phone — we detect which
    password:   '',
  });

  // ── Register form — binds to POST /api/auth/register
  // Backend accepts: { name, email, phone, password }
  const [regForm, setRegForm] = useState({
    name:            '',
    email:           '',
    phone:           '',
    password:        '',
    confirmPassword: '',  // ✅ frontend-only validation field (not sent to API)
  });

  const overlayRef = useRef();
  const strength   = getStrength(regForm.password);

  // ── Escape key + body scroll lock
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', fn);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // ── Switch tab — reset everything
  const switchTab = (t) => {
    setTab(t);
    setStep('form');
    setError('');
    setShowLoginPw(false);
    setShowRegPw(false);
    setShowRegConfPw(false);
  };

  // ─────────────────────────────────────────────────
  // LOGIN — POST /api/auth/login
  // Supports email OR phone number
  // Returns: { success, token, user: { _id, name, email, phone, role, avatar, isActive, createdAt } }
  // ─────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!loginForm.identifier.trim()) return setError('Enter your email or phone number');
    if (!loginForm.password)          return setError('Enter your password');

    setLoading(true);
    try {
      // Detect if user entered email or phone
      const isEmail = loginForm.identifier.includes('@');
      const body = {
        password: loginForm.password,
        ...(isEmail
          ? { email: loginForm.identifier.trim().toLowerCase() }
          : { phone: loginForm.identifier.trim() }
        ),
      };

      const res  = await fetch(`${BASE}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success && data.token && data.user) {
        // Store real JWT token and user object
        localStorage.setItem('pp_user_token', data.token);
        localStorage.setItem('pp_user',       JSON.stringify(data.user));

        setStep('success');

        // Give success animation a moment, then notify parent + close
        setTimeout(() => {
          onAuthSuccess?.(data.user, data.token);
          onClose();
        }, 1400);
      } else {
        // Show backend error message
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Network error — make sure the backend is running on port 5000.');
    }
    setLoading(false);
  };

  // ─────────────────────────────────────────────────
  // REGISTER — POST /api/auth/register
  // Returns: { success, token, user: { _id, name, email, phone, role, avatar, isActive, createdAt } }
  // Note: confirmPassword is validated frontend-only, NOT sent to API
  // ─────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, phone, password, confirmPassword } = regForm;

    // Frontend validation (in order)
    if (!name.trim())                          return setError('Full name is required');
    if (name.trim().length < 2)                return setError('Name must be at least 2 characters');
    if (!email.trim())                         return setError('Email address is required');
    if (!/\S+@\S+\.\S+/.test(email))           return setError('Enter a valid email address');
    if (!phone.trim())                         return setError('Mobile number is required');
    if (!/^[6-9]\d{9}$/.test(phone))          return setError('Enter a valid 10-digit Indian mobile number (starts with 6–9)');
    if (password.length < 6)                  return setError('Password must be at least 6 characters');
    if (password !== confirmPassword)          return setError('Passwords do not match');

    setLoading(true);
    try {
      // Only send what the backend expects — NOT confirmPassword
      const res  = await fetch(`${BASE}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:     name.trim(),
          email:    email.trim().toLowerCase(),
          phone:    phone.trim(),
          password: password,
        }),
      });
      const data = await res.json();

      if (data.success && data.token && data.user) {
        localStorage.setItem('pp_user_token', data.token);
        localStorage.setItem('pp_user',       JSON.stringify(data.user));

        setStep('success');

        setTimeout(() => {
          onAuthSuccess?.(data.user, data.token);
          onClose();
        }, 1600);
      } else {
        // Common: 409 = email/phone already registered
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Network error — make sure the backend is running on port 5000.');
    }
    setLoading(false);
  };

  // ── Form field helpers
  const setL = (k, v) => setLoginForm(f => ({ ...f, [k]: v }));
  const setR = (k, v) => setRegForm(f  => ({ ...f, [k]: v }));

  // ── JSX ───────────────────────────────────────────
  return (
    <div
      className="auth-overlay"
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="auth-modal" role="dialog" aria-modal="true">

        {/* ── Header ──────────────────────────────── */}
        <div className="auth-modal__header">
          <div className="auth-modal__logo">
            <div className="auth-modal__logo-icon">PP</div>
            <span className="auth-modal__logo-text">
              Prime<span className="auth-modal__logo-accent">Pro</span>
            </span>
          </div>
          <p className="auth-modal__title">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
          <p className="auth-modal__sub">
            {tab === 'login'
              ? 'Sign in to access your saved properties'
              : 'Join 12,000+ property seekers in Hyderabad'}
          </p>
          <button className="auth-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Tab switcher ────────────────────────── */}
        <div className="auth-tabs" role="tablist">
          <button
            className={`auth-tab${tab === 'login' ? ' active' : ''}`}
            role="tab" aria-selected={tab === 'login'}
            onClick={() => switchTab('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab${tab === 'register' ? ' active' : ''}`}
            role="tab" aria-selected={tab === 'register'}
            onClick={() => switchTab('register')}
          >
            Create Account
          </button>
        </div>

        {/* ── Body ────────────────────────────────── */}
        <div className="auth-modal__body">

          {/* ── Success state ─────────────────────── */}
          {step === 'success' ? (
            <div className="auth-success">
              <div className="auth-success-icon">✓</div>
              <div className="auth-success-title">
                {tab === 'login' ? 'Welcome back!' : 'Account created!'}
              </div>
              <p className="auth-success-sub">
                {tab === 'login'
                  ? "You're now signed in. Redirecting…"
                  : 'Your PrimePro account is ready. Redirecting…'}
              </p>
            </div>

          ) : tab === 'login' ? (

            /* ════════════════════════════════════════
               LOGIN FORM
               API: POST /api/auth/login
               Body: { email?, phone?, password }
               ════════════════════════════════════════ */
            <form className="auth-form" onSubmit={handleLogin} noValidate>

              {error && (
                <div className="auth-error">
                  <span>⚠</span> {error}
                </div>
              )}

              {/* Email or Phone */}
              <div className="auth-field">
                <label className="auth-label">Email or Phone Number</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">@</span>
                  <input
                    className={`auth-input${error && !loginForm.identifier ? ' has-error' : ''}`}
                    type="text"
                    placeholder="arjun@example.com or 9876543210"
                    value={loginForm.identifier}
                    onChange={e => setL('identifier', e.target.value)}
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    className={`auth-input${error && !loginForm.password ? ' has-error' : ''}`}
                    type={showLoginPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={e => setL('password', e.target.value)}
                    autoComplete="current-password"
                    style={{ paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    className="auth-pass-toggle"
                    onClick={() => setShowLoginPw(v => !v)}
                    aria-label={showLoginPw ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon show={showLoginPw} />
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="auth-forgot">
                <button type="button" onClick={() => alert('Password reset feature coming soon!')}>
                  Forgot password?
                </button>
              </div>

              {/* Sign In button */}
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? <><div className="auth-spinner" /> Signing in…</>
                  : '🔐 Sign In'}
              </button>

              {/* Switch to register */}
              <div className="auth-switch">
                Don't have an account?{' '}
                <button type="button" onClick={() => switchTab('register')}>
                  Create one free
                </button>
              </div>

              {/* Trust indicators */}
              <div className="auth-trust">
                <span className="auth-trust-item"><span className="auth-trust-dot" /> Secure login</span>
                <span className="auth-trust-item"><span className="auth-trust-dot" /> Zero brokerage</span>
                <span className="auth-trust-item"><span className="auth-trust-dot" /> RERA verified</span>
              </div>
            </form>

          ) : (

            /* ════════════════════════════════════════
               REGISTER FORM
               API: POST /api/auth/register
               Body: { name, email, phone, password }
               Note: confirmPassword is NOT sent — frontend only
               ════════════════════════════════════════ */
            <form className="auth-form" onSubmit={handleRegister} noValidate>

              {error && (
                <div className="auth-error">
                  <span>⚠</span> {error}
                </div>
              )}

              {/* Full name */}
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input
                    className="auth-input"
                    type="text"
                    placeholder="Arjun Mehta"
                    value={regForm.name}
                    onChange={e => setR('name', e.target.value)}
                    autoComplete="name"
                    autoFocus
                  />
                </div>
              </div>

              {/* Email */}
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">@</span>
                  <input
                    className="auth-input"
                    type="email"
                    placeholder="arjun@example.com"
                    value={regForm.email}
                    onChange={e => setR('email', e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Mobile number with +91 prefix */}
              <div className="auth-field">
                <label className="auth-label">Mobile Number</label>
                <div className="auth-input-phone">
                  <span className="auth-phone-prefix">🇮🇳 +91</span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={regForm.phone}
                    onChange={e => setR('phone', e.target.value.replace(/\D/, '').slice(0, 10))}
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Password with strength meter */}
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    className="auth-input"
                    type={showRegPw ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={regForm.password}
                    onChange={e => setR('password', e.target.value)}
                    autoComplete="new-password"
                    style={{ paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    className="auth-pass-toggle"
                    onClick={() => setShowRegPw(v => !v)}
                    aria-label={showRegPw ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon show={showRegPw} />
                  </button>
                </div>
                {/* Strength meter — only visible when user has typed */}
                {regForm.password && strength && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ height: 4, background: '#e8ecf2', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: strength.w, background: strength.color, borderRadius: 4, transition: 'width .3s' }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: strength.color, marginTop: 3, display: 'block' }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* ✅ Confirm password — RESTORED (was commented out) */}
              {/* This field is validated frontend-only. confirmPassword is NOT sent to the API. */}
              <div className="auth-field">
                <label className="auth-label">Confirm Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    className={`auth-input${
                      regForm.confirmPassword && regForm.confirmPassword !== regForm.password
                        ? ' has-error'
                        : ''
                    }`}
                    type={showRegConfPw ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={regForm.confirmPassword}
                    onChange={e => setR('confirmPassword', e.target.value)}
                    autoComplete="new-password"
                    style={{ paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    className="auth-pass-toggle"
                    onClick={() => setShowRegConfPw(v => !v)}
                    aria-label={showRegConfPw ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon show={showRegConfPw} />
                  </button>
                </div>
                {/* Inline mismatch warning */}
                {regForm.confirmPassword && regForm.confirmPassword !== regForm.password && (
                  <span style={{ fontSize: 11, color: '#e53e3e', fontWeight: 600, marginTop: 3, display: 'block' }}>
                    Passwords do not match
                  </span>
                )}
              </div>

              {/* Create account button */}
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? <><div className="auth-spinner" /> Creating account…</>
                  : '🏠 Create Free Account'}
              </button>

              {/* Terms */}
              <p className="auth-terms">
                By registering you agree to our{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
              </p>

              {/* Switch to login */}
              <div className="auth-switch">
                Already have an account?{' '}
                <button type="button" onClick={() => switchTab('login')}>
                  Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}