import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const links = [
    { label: 'Home',        to: '/' },
    { label: 'Properties',  to: '/properties' },
    { label: 'About',       to: '/about' },
    { label: 'Contact',     to: '/contact' },
  ];

  const solid   = scrolled || !isHome || menuOpen;
  const navCls  = ['navbar', solid ? 'navbar--solid' : 'navbar--glass', menuOpen ? 'navbar--open' : ''].join(' ');

  return (
    <header className={navCls}>
      <div className="container navbar__inner">

        {/* ── Logo ─────────────────────────────────────────── */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⬡</span>
          <span className="navbar__logo-text">
            Prime<span className="navbar__logo-accent">Pro</span>
          </span>
        </Link>

        {/* ── Desktop nav ──────────────────────────────────── */}
        <nav className="navbar__nav">
          {links.map(({ label, to }) => (
            <Link key={label} to={to}
              className={`navbar__link${location.pathname === to ? ' active' : ''}`}>
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Actions ──────────────────────────────────────── */}
        <div className="navbar__actions">
          <a href="tel:18005006000" className="navbar__phone">
            <span className="navbar__phone-icon">📞</span>
            1800 500 600
          </a>
          <Link to="/properties" className="btn btn-gold btn-sm navbar__cta">
            Get Started
          </Link>
        </div>

        {/* ── Hamburger ────────────────────────────────────── */}
        <button
          className={`navbar__burger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu">
          <span className="navbar__burger-bar" />
          <span className="navbar__burger-bar" />
          <span className="navbar__burger-bar" />
        </button>
      </div>

      {/* ── Mobile drawer ────────────────────────────────── */}
      <div className={`navbar__drawer${menuOpen ? ' open' : ''}`}>
        {links.map(({ label, to }) => (
          <Link key={label} to={to}
            className={`navbar__drawer-link${location.pathname === to ? ' active' : ''}`}>
            {label}
          </Link>
        ))}
        <div className="navbar__drawer-footer">
          <Link to="/properties" className="btn btn-gold btn-full">Browse Properties</Link>
          <a href="tel:18005006000" className="navbar__drawer-phone">📞 1800 500 600</a>
        </div>
      </div>
    </header>
  );
}