/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

/* ─────────────────────────────────────────────────────────────
   HERO — Cinematic slider with interactive category navigator
   • 5 categories: Apartments → Villas → Plots → Commercial → Farm Lands
   • Left: lean headline + sub + 2 CTAs
   • Right: image-thumbnail navigator (fills desktop, scrolls on mobile)
   • Colourful gold accents · glassmorphism · fully responsive
─────────────────────────────────────────────────────────────── */

const SLIDES = [
  {
    id: 1,
    nav: 'Apartments',
    tag: 'Premium Apartments',
    title: 'Find Your',
    highlight: 'Dream Home',
    sub: 'Looking for a RERA-verified 2, 3 or 4 BHK in Kokapet, Gachibowli, Tellapur or Narsingi?',
    image: 'https://cbuildfiles.blob.core.windows.net/ventura-estate-developers/propertyimages/2024-12-05/a4a69c1d-3dd5-475f-8116-245bd4ecc184c7.jpg',
    accent: '#C9A84C',
    to: '/properties?subtype=Apartment',
  },
  {
    id: 2,
    nav: 'Villas',
    tag: 'Luxury Villas',
    title: 'Live in a',
    highlight: 'Private Villa',
    sub: 'Looking for a private gated villa with Vastu-compliant design, pool, clubhouse and 24/7 security?',
    image: '/Villas.jpeg',
    accent: '#E4C47A',
    to: '/properties?subtype=Villa',
  },
  {
    id: 3,
    nav: 'Open Plots',
    tag: 'Open Plots & Layouts',
    title: 'Invest in',
    highlight: 'Prime Land',
    sub: 'Looking for HMDA & DTCP-approved open plots with clear titles in high-appreciation belts?',
    image: '/Plots.jpeg',
    accent: '#C9A84C',
    to: '/properties?subtype=Plot',
  },
  {
    id: 4,
    nav: 'Commercial',
    tag: 'Commercial Spaces',
    title: 'Grow Your',
    highlight: 'Business',
    sub: "Looking for office floors, retail outlets or pre-leased assets in Hyderabad's IT corridors?",
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2880&q=90&auto=format&fit=crop',
    accent: '#E4C47A',
    to: '/properties?type=Commercial',
  },
  {
    id: 5,
    nav: 'Farm Lands',
    tag: 'Concept Farm Lands',
    title: 'Own a Piece of',
    highlight: 'Green Earth',
    sub: 'Looking for a gated farm-land community with managed agro-living and strong appreciation?',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=2880&q=90&auto=format&fit=crop',
    accent: '#C9A84C',
    to: '/properties?subtype=Farm+Land',
  },
];

const INTERVAL = 10000;
const FALLBACK = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=2880&q=90&auto=format&fit=crop';

export default function Hero({ cmsHero }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const cmsImages = Array.isArray(cmsHero?.backgroundImages) && cmsHero.backgroundImages.length > 0
    ? cmsHero.backgroundImages
    : null;
  const slides = cmsImages
    ? cmsImages.map((img, i) => ({
        ...SLIDES[i % SLIDES.length],
        id: i + 1,
        image: img.url || SLIDES[i % SLIDES.length].image,
      }))
    : SLIDES;

  const total = slides.length;
  const slide = slides[current % total];

  const goTo = useCallback((idx) => {
    setCurrent((idx + total) % total);
    setProgress(0);
    startRef.current = performance.now();
  }, [total]);

  useEffect(() => {
    if (paused) { cancelAnimationFrame(rafRef.current); return; }
    startRef.current = performance.now();
    const tick = (now) => {
      const pct = Math.min(((now - startRef.current) / INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setCurrent(c => (c + 1) % total);
        setProgress(0);
        startRef.current = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, total]);

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background slides ── */}
      <div className="hero__bg">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`hero__slide${i === current ? ' hero__slide--active' : ''}`}
            aria-hidden={i !== current}
          >
            <img
              src={s.image}
              alt={s.highlight}
              loading={i === 0 ? 'eager' : 'lazy'}
              onError={e => { e.target.onerror = null; e.target.src = FALLBACK; }}
            />
          </div>
        ))}
        <div className="hero__overlay" />
        <div className="hero__vignette" />
      </div>

      {/* ── Colourful ambient orbs ── */}
      <div className="hero__orbs" aria-hidden="true">
        <span className="hero__orb hero__orb--gold" />
        <span className="hero__orb hero__orb--amber" />
        <span className="hero__orb hero__orb--blue" />
        <span className="hero__grid-deco" />
      </div>

      {/* ── Main row: content + category navigator ── */}
      <div className="container hero__inner">

        {/* Left — content */}
        <div className="hero__content" key={`c-${current}`}>
          <span className="hero__tag" style={{ '--accent': slide.accent }}>
            <span className="hero__tag-dot" />
            {cmsHero?.tagline || slide.tag}
          </span>

          <h1 className="hero__title">
            <span className="hero__title-1">{cmsHero?.title || slide.title}</span>
            <span className="hero__title-2" style={{ '--accent': slide.accent }}>
              {slide.highlight}
            </span>
          </h1>

          <p className="hero__sub">{cmsHero?.subtitle || slide.sub}</p>

          <div className="hero__cta">
            <Link to={slide.to} className="hero__btn hero__btn--gold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              {cmsHero?.ctaText || 'Browse Properties'}
            </Link>
            <Link to="/contact" className="hero__btn hero__btn--ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Talk to Expert
            </Link>
          </div>

          {/* Mini trust strip — adds a touch of colour + credibility */}
          <div className="hero__trust">
            <span className="hero__trust-item"><b>200+</b> Properties</span>
            <span className="hero__trust-sep" />
            <span className="hero__trust-item"><b>35+</b> Happy Families</span>
            <span className="hero__trust-sep" />
            <span className="hero__trust-item"><b>4.9★</b> Rated</span>
          </div>
        </div>
      </div>

      {/* ── Bottom category strip — image cards (desktop + mobile) ── */}
      <div className="container hero__strip-wrap">
        <div className="hero__strip-head">
          <span className="hero__strip-label">Explore Categories</span>
          <span className="hero__strip-count">
            <b>{String(current + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}
          </span>
        </div>
        <div className="hero__strip">
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={`hero__chip${i === current ? ' hero__chip--active' : ''}`}
              onClick={() => goTo(i)}
              style={{ '--accent': s.accent }}
              aria-label={`Show ${s.nav}`}
            >
              <span className="hero__chip-thumb">
                <img src={s.image} alt={s.nav} loading="lazy"
                  onError={e => { e.target.onerror = null; e.target.src = FALLBACK; }} />
              </span>
              <span className="hero__chip-text">
                <span className="hero__chip-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="hero__chip-name">{s.nav}</span>
              </span>
              {i === current && (
                <span className="hero__chip-bar"><span style={{ width: `${progress}%` }} /></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="hero__progress">
        <div className="hero__progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
