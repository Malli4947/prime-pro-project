import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Hero.css';

// ── Hero component ────────────────────────────────────────────────────────────
// Props:
//   cmsHero — from GET /api/cms → cms.hero
//     { title, subtitle, ctaText, backgroundImage }
//
// If cmsHero is not yet loaded (null/undefined), shows a loading skeleton.
// All content comes exclusively from the CMS — no static fallback slides.
// ─────────────────────────────────────────────────────────────────────────────
export default function Hero({ cmsHero }) {
  const navigate    = useNavigate();
  const [search,    setSearch]    = useState('');
  const [type,      setType]      = useState('All');
  const [mounted,   setMounted]   = useState(false);
  const inputRef    = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (search.trim()) q.set('search', search.trim());
    if (type !== 'All') q.set('type', type);
    navigate(`/properties?${q.toString()}`);
  };

  // ── Derive values from CMS ────────────────────────────────────────────────
  // cmsHero comes from: GET /api/cms → data.cms.hero
  // Fields: { title, subtitle, ctaText, backgroundImage }
  const isLoading = !cmsHero;

  const heroTitle  = cmsHero?.title           || '';
  const heroSub    = cmsHero?.subtitle        || '';
  const heroCta    = cmsHero?.ctaText         || 'Browse Properties';
  const heroBg     = cmsHero?.backgroundImage || '';

  return (
    <section
      className={`hero${mounted ? ' hero--mounted' : ''}`}
      style={heroBg ? {
        backgroundImage: `url(${heroBg})`,
        backgroundSize:     'cover',
        backgroundPosition: 'center',
        backgroundRepeat:   'no-repeat',
      } : {}}>

      {/* Dark overlay so text is always readable */}
      <div className="hero__overlay" />

      {/* Content */}
      <div className="container hero__body">

        {isLoading ? (
          // ── Skeleton while CMS loads ────────────────────────────────────
          <div className="hero__skeleton">
            <div className="hero-skel hero-skel--tag" />
            <div className="hero-skel hero-skel--title" />
            <div className="hero-skel hero-skel--title hero-skel--title-2" />
            <div className="hero-skel hero-skel--sub" />
            <div className="hero-skel hero-skel--btn" />
          </div>
        ) : (
          // ── Live CMS content ────────────────────────────────────────────
          <>
            <div className={`hero__content${mounted ? ' hero__content--in' : ''}`}>
              {/* Tag */}
              <div className="hero__tag">
                <span className="hero__tag-dot" />
                Hyderabad's #1 Real Estate Platform
              </div>

              {/* Title from cms.hero.title */}
              <h1 className="hero__title">
                {heroTitle || <>&nbsp;</>}
              </h1>

              {/* Subtitle from cms.hero.subtitle */}
              {heroSub && (
                <p className="hero__sub">{heroSub}</p>
              )}

              {/* CTA from cms.hero.ctaText */}
              <div className="hero__ctas">
                <Link to="/properties" className="btn btn-gold hero__cta-primary">
                  {heroCta} →
                </Link>
                <Link to="/properties?status=For+Rent" className="btn hero__cta-secondary">
                  Explore Rentals
                </Link>
              </div>

              {/* Trust badges */}
              <div className="hero__trust">
                <span className="hero__trust-item">✓ RERA Verified</span>
                <span className="hero__trust-sep">·</span>
                <span className="hero__trust-item">✓ Zero Brokerage</span>
                <span className="hero__trust-sep">·</span>
                <span className="hero__trust-item">✓ 2-Hr Response</span>
              </div>
            </div>

            {/* Search box */}
            <div className={`hero__search-wrap${mounted ? ' hero__search-wrap--in' : ''}`}>
              <form className="hero__search" onSubmit={handleSearch}>
                <div className="hero__search-inner">
                  {/* Type selector */}
                  <div className="hero__search-type">
                    <select
                      value={type}
                      onChange={e => setType(e.target.value)}
                      className="hero__type-select">
                      <option value="All">All Types</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                    <span className="hero__select-arrow">▾</span>
                  </div>

                  <div className="hero__search-divider" />

                  {/* Text input */}
                  <input
                    ref={inputRef}
                    type="text"
                    className="hero__search-input"
                    placeholder="Search by location, project or type…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />

                  {/* Submit */}
                  <button type="submit" className="hero__search-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <span>Search</span>
                  </button>
                </div>

                {/* Quick tags */}
                <div className="hero__quick-tags">
                  <span className="hero__quick-label">Popular:</span>
                  {['Banjara Hills', 'Gachibowli', 'Jubilee Hills', 'Villa', '3BHK'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className="hero__quick-tag"
                      onClick={() => { setSearch(tag); inputRef.current?.focus(); }}>
                      {tag}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            {/* Scroll hint */}
            <div className="hero__scroll">
              <div className="hero__scroll-line" />
              <span>Scroll</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}