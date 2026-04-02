import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import './Navbar.css';
import './Navbar.additions.css';

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [authOpen,  setAuthOpen]  = useState(false);
  const [authTab,   setAuthTab]   = useState('login');
  const [user,      setUser]      = useState(null);
  const [userMenu,  setUserMenu]  = useState(false);
  const userMenuRef = useRef(null);
  const location    = useLocation();
  const navigate    = useNavigate();
  const isHome      = location.pathname === '/';

  useEffect(() => {
    const load = () => {
      try {
        const token = localStorage.getItem('pp_user_token');
        const saved = localStorage.getItem('pp_user');
        setUser(token && saved ? JSON.parse(saved) : null);
      } catch { setUser(null); }
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [location.pathname]);

  useEffect(() => {
    if (!userMenu) return;
    const fn = e => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenu(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [userMenu]);

  const openLogin    = () => { setAuthTab('login');    setAuthOpen(true); setMenuOpen(false); };
  const openRegister = () => { setAuthTab('register'); setAuthOpen(true); setMenuOpen(false); };

  const handleAuthSuccess = (userData, token) => {
    localStorage.setItem('pp_user_token', token);
    localStorage.setItem('pp_user', JSON.stringify(userData));
    setUser(userData);
    setAuthOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('pp_user_token');
    localStorage.removeItem('pp_user');
    setUser(null); setUserMenu(false); setMenuOpen(false);
    navigate('/');
  };

  const links = [
    { label: 'Home',       to: '/' },
    { label: 'Properties', to: '/properties' },
    { label: 'About',      to: '/about' },
    { label: 'Contact',    to: '/contact' },
  ];

  const solid  = scrolled || !isHome || menuOpen;
  const navCls = ['navbar', solid ? 'navbar--solid' : 'navbar--glass', menuOpen ? 'navbar--open' : '']
    .filter(Boolean).join(' ');

  // Always show initials — no avatar image anywhere
  const initials  = user?.name
    ? user.name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '';
  const firstName = user?.name?.split(' ')[0] || '';
  const roleLabel = user?.role === 'superadmin' ? '👑 Super Admin'
                  : user?.role === 'admin'      ? '🛡️ Admin'
                  : '👤 Member';

  return (
    <>
      <header className={navCls}>
        <div className="container navbar__inner">

          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-icon">⬡</span>
            <span className="navbar__logo-text">
              Prime<span className="navbar__logo-accent">Pro</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="navbar__nav">
            {links.map(({ label, to }) => (
              <Link key={label} to={to}
                className={`navbar__link${location.pathname === to ? ' active' : ''}`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="navbar__actions">
            {/* <a href="tel:18005006000" className="navbar__phone">
              <span className="navbar__phone-icon">📞</span>9347870247
            </a> */}

            {user ? (
              /* ── Logged in ── */
              <div className="pp-user-wrap" ref={userMenuRef}>
                {/* Pill: gold initials circle + first name + caret */}
                <button className="pp-pill"
                  onClick={() => setUserMenu(v => !v)}
                  aria-expanded={userMenu}>
                  <div className="pp-pill__av">
                    <span className="pp-pill__initials">{initials}</span>
                  </div>
                  <span className="pp-pill__name">{firstName}</span>
                  <svg className={`pp-pill__caret${userMenu ? ' open' : ''}`}
                    width="10" height="10" viewBox="0 0 10 10"
                    fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1.5 3l3.5 3.5L8.5 3" />
                  </svg>
                </button>

                {/* Dropdown */}
                {userMenu && (
                  <div className="pp-menu" role="menu">

                    {/* Header: big initials + name + email + phone + role */}
                    <div className="pp-menu__head">
                      <div className="pp-menu__head-av">
                        {initials}
                      </div>
                      <div className="pp-menu__head-info">
                        <div className="pp-menu__head-name">{user.name}</div>
                        <div className="pp-menu__head-email">{user.email}</div>
                        {user.phone && (
                          <div className="pp-menu__head-phone">+91 {user.phone}</div>
                        )}
                        {/* <span className={`pp-menu__role pp-menu__role--${user.role || 'user'}`}>
                          {roleLabel}
                        </span> */}
                      </div>
                    </div>

                    <div className="pp-menu__div" />

                    <Link to="/profile" className="pp-menu__item"
                      onClick={() => setUserMenu(false)}>
                      <span className="pp-menu__ico">👤</span>My Profile
                    </Link>
                    {/* <Link to="/profile" className="pp-menu__item"
                      onClick={() => setUserMenu(false)}>
                      <span className="pp-menu__ico">❤️</span>Saved Properties
                    </Link> */}
                    {/* <Link to="/profile" className="pp-menu__item"
                      onClick={() => setUserMenu(false)}>
                      <span className="pp-menu__ico">📬</span>My Enquiries
                    </Link> */}

                    <div className="pp-menu__div" />

                    <button className="pp-menu__item pp-menu__item--logout"
                      onClick={handleLogout}>
                      <span className="pp-menu__ico">🚪</span>Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Not logged in: two distinct buttons ── */
              <div className="pp-auth-row">
                <button className="pp-btn-signin" onClick={openLogin}>Sign In</button>
                <button className="btn btn-gold btn-sm" onClick={openRegister}>Register Free</button>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className={`navbar__burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">
            <span className="navbar__burger-bar" />
            <span className="navbar__burger-bar" />
            <span className="navbar__burger-bar" />
          </button>
        </div>

        {/* Mobile drawer */}
        <div className={`navbar__drawer${menuOpen ? ' open' : ''}`}>
          {links.map(({ label, to }) => (
            <Link key={label} to={to}
              className={`navbar__drawer-link${location.pathname === to ? ' active' : ''}`}>
              {label}
            </Link>
          ))}
          <div className="navbar__drawer-footer">
            {user ? (
              <>
                {/* Mobile user info: initials circle + name + email */}
                <div className="pp-drawer-user">
                  <div className="pp-drawer-av">{initials}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:'#fff',
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.5)',
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {user.email}
                    </div>
                    <div style={{ fontSize:11, color:'#C9A84C', fontWeight:700, marginTop:2 }}>
                      {roleLabel}
                    </div>
                  </div>
                </div>
                <Link to="/profile" className="btn btn-gold btn-full"
                  onClick={() => setMenuOpen(false)}
                  style={{ textDecoration:'none', display:'flex',
                    alignItems:'center', justifyContent:'center', gap:8 }}>
                  👤 My Profile
                </Link>
                <button onClick={handleLogout} style={{
                  width:'100%', marginTop:8, height:42,
                  background:'transparent', border:'1.5px solid rgba(255,255,255,.2)',
                  borderRadius:10, color:'rgba(255,255,255,.75)',
                  fontSize:13, fontWeight:600, cursor:'pointer',
                }}>
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-gold btn-full" onClick={openRegister}>
                  🏠 Register Free
                </button>
                <button onClick={openLogin} style={{
                  width:'100%', marginTop:8, height:42,
                  background:'transparent', border:'1.5px solid rgba(201,168,76,.5)',
                  borderRadius:10, color:'#C9A84C', fontSize:13, fontWeight:700, cursor:'pointer',
                }}>
                  Sign In
                </button>
              </>
            )}
            {/* <a href="tel:18005006000" className="navbar__drawer-phone">📞 9347870247</a> */}
          </div>
        </div>
      </header>

      {authOpen && (
        <AuthModal defaultTab={authTab}
          onClose={() => setAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}