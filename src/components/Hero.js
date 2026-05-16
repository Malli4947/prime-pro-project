/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Hero.css';

/* ─────────────────────────────────────────────────────────────
   HERO — Cinematic full-screen slider (Aparna-style)
   • Auto-advances every 6 s with a progress bar
   • Ken Burns zoom on each slide image
   • Content animates in from different directions per slide
   • Particle canvas overlay
   • Search bar slides up after content
─────────────────────────────────────────────────────────────── */

const SLIDES = [
  {
    id: 1,
    tag: 'Premium Residential',
    title: 'Find Your',
    highlight: 'Dream Home',
    sub: "Discover verified luxury villas, apartments & plots across Hyderabad's prime localities.",
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=85',
    accent: '#C9A84C',
    dir: 'left',
  },
  {
    id: 2,
    tag: 'Gated Communities',
    title: 'Live in',
    highlight: 'Pure Luxury',
    sub: 'World-class amenities, RERA-certified projects and zero brokerage — only at PrimePro.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=85',
    accent: '#E4C47A',
    dir: 'right',
  },
  {
    id: 3,
    tag: 'Smart Investment',
    title: 'Invest in',
    highlight: 'Your Future',
    sub: 'High-yield commercial spaces, open plots and farmland with guaranteed legal clarity.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=85',
    accent: '#C9A84C',
    dir: 'up',
  },
  {
    id: 4,
    tag: 'NRI Desk',
    title: 'Your Home',
    highlight: 'Awaits You',
    sub: 'Dedicated NRI investment desk with FEMA-compliant solutions and end-to-end support.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&q=85',
    accent: '#E4C47A',
    dir: 'left',
  },
];

const INTERVAL = 6000;

/* ── Particle canvas ─────────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.4,
      o: Math.random() * 0.45 + 0.1,
      p: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.p += 0.018;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const a = p.o * (0.6 + 0.4 * Math.sin(p.p));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${a})`;
        ctx.fill();
      });
      // lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${0.12 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}

/* ── Typed words ─────────────────────────────────────────────── */
function useTypewriter(words, typingSpeed = 80, deleteSpeed = 45, pauseMs = 1800) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    const word = words[idx];
    let t;
    if (typing) {
      if (text.length < word.length) {
        t = setTimeout(() => setText(word.slice(0, text.length + 1)), typingSpeed);
      } else {
        t = setTimeout(() => setTyping(false), pauseMs);
      }
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed);
      } else {
        setIdx(i => (i + 1) % words.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(t);
  }, [text, typing, idx, words, typingSpeed, deleteSpeed, pauseMs]);
  return text;
}

/* ── Main Hero ───────────────────────────────────────────────── */
export default function Hero({ cmsHero }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [mounted, setMounted] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const inputRef = useRef(null);
  const progressRef = useRef(null);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  const typed = useTypewriter(['Dream Home', 'Perfect Villa', 'Ideal Plot', 'Best Investment']);

  useEffect(() => {
    const t1 = setTimeout(() => setMounted(true), 100);
    const t2 = setTimeout(() => setSearchVisible(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* Progress bar animation */
  const runProgress = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  /* Auto-advance — total slide count is resolved after cmsHero is available */
  const totalSlides = (Array.isArray(cmsHero?.backgroundImages) && cmsHero.backgroundImages.length > 0)
    ? cmsHero.backgroundImages.length
    : SLIDES.length;

  useEffect(() => {
    if (paused) { cancelAnimationFrame(rafRef.current); return; }
    runProgress();
    const timer = setTimeout(() => {
      goTo((current + 1) % totalSlides);
    }, INTERVAL);
    return () => { clearTimeout(timer); cancelAnimationFrame(rafRef.current); };
  }, [current, paused, runProgress, totalSlides]);

  const goTo = useCallback((idx) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setPrev(current);
    setCurrent(idx);
    setProgress(0);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 900);
  }, [animating, current]);

  const handleSearch = e => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (search.trim()) q.set('search', search.trim());
    if (type !== 'All') q.set('type', type);
    navigate(`/properties?${q.toString()}`);
  };

  /* Use CMS data if available, else use slides */
  const useCms = cmsHero?.title;
  // Use CMS background images if set, otherwise fall back to SLIDES images
  const cmsImages = Array.isArray(cmsHero?.backgroundImages) && cmsHero.backgroundImages.length > 0
    ? cmsHero.backgroundImages
    : null;
  // Build the effective slides array — use CMS images or default slides
  const effectiveSlides = cmsImages
    ? cmsImages.map((img, i) => ({
        ...SLIDES[i % SLIDES.length],
        id: i + 1,
        image: img.url || SLIDES[i % SLIDES.length].image,
      }))
    : SLIDES;

  const slide = effectiveSlides[current % effectiveSlides.length];
  const prevSlide = prev !== null ? effectiveSlides[prev % effectiveSlides.length] : null;

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Particle canvas ── */}
      <ParticleCanvas />

      {/* ── Dot grid ── */}
      <div className="hero__grid" aria-hidden="true" />

      {/* ── Slides — use CMS images when available ── */}
      {effectiveSlides.map((s, i) => (
        <div
          key={s.id}
          className={`hero__slide ${
            i === current % effectiveSlides.length ? 'hero__slide--active' :
            i === (prev !== null ? prev % effectiveSlides.length : -1) ? 'hero__slide--exit' : ''
          }`}
          aria-hidden={i !== current % effectiveSlides.length}
        >
          {/* Ken Burns image */}
          <div className={`hero__slide-img${i === current % effectiveSlides.length ? ' hero__slide-img--zoom' : ''}`}>
            <img src={s.image} alt={s.highlight} loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
          {/* Gradient overlay */}
          <div className="hero__slide-overlay" />
          {/* Side gradient */}
          <div className="hero__slide-side" />
        </div>
      ))}

      {/* ── Corner accents ── */}
      <div className="hero__corner hero__corner--tl" aria-hidden="true" />
      <div className="hero__corner hero__corner--br" aria-hidden="true" />

      {/* ── Floating shapes ── */}
      <div className="hero__shapes" aria-hidden="true">
        <div className="hero__shape hero__shape--ring1" />
        <div className="hero__shape hero__shape--ring2" />
        <div className="hero__shape hero__shape--hex" />
        <div className="hero__shape hero__shape--dot1" />
        <div className="hero__shape hero__shape--dot2" />
        <div className="hero__shape hero__shape--dot3" />
        <div className="hero__shape hero__shape--line1" />
        <div className="hero__shape hero__shape--line2" />
      </div>

      {/* ── Main content ── */}
      <div className="container hero__body">

        {/* Content block */}
        <div className={`hero__content hero__content--${slide.dir}${mounted ? ' hero__content--in' : ''}`}>

          {/* Tag */}
          <div className="hero__tag" key={`tag-${current}`}>
            <span className="hero__tag-dot" />
            <span>{useCms ? "Hyderabad's #1 Real Estate Platform" : slide.tag}</span>
          </div>

          {/* Title */}
          <h1 className="hero__title" key={`title-${current}`}>
            {useCms ? (
              <>{cmsHero.title}</>
            ) : (
              <>
                <span className="hero__title-line1">{slide.title}</span>
                <br />
                <span className="hero__title-highlight" style={{ '--accent': slide.accent }}>
                  {slide.highlight}
                  <span className="hero__title-underline" />
                </span>
              </>
            )}
          </h1>

          {/* Typewriter sub (only when no CMS) */}
          {!useCms && (
            <div className="hero__typed-wrap" key={`typed-${current}`}>
              <span className="hero__typed-prefix">Looking for a </span>
              <span className="hero__typed-word">{typed}</span>
              <span className="hero__cursor">|</span>
              <span className="hero__typed-suffix"> in Hyderabad?</span>
            </div>
          )}

          {/* Subtitle */}
          <p className="hero__sub" key={`sub-${current}`}>
            {useCms ? cmsHero.subtitle : slide.sub}
          </p>

          {/* CTAs */}
          <div className="hero__ctas" key={`cta-${current}`}>
            <Link to="/properties" className="hero__btn hero__btn--primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              {useCms ? cmsHero.ctaText : 'Browse Properties'}
              <span className="hero__btn-shine" />
            </Link>
            <Link to="/contact" className="hero__btn hero__btn--secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Talk to Expert
            </Link>
          </div>

          {/* Trust badges */}
          <div className="hero__trust" key={`trust-${current}`}>
            {[
              { icon: '🛡️', text: 'RERA Verified' },
              { icon: '💰', text: 'Zero Brokerage' },
              { icon: '⚡', text: '2-Hr Response' },
              { icon: '🏆', text: 'Award Winning' },
            ].map((b, i) => (
              <div key={i} className="hero__trust-badge">
                <span className="hero__trust-icon">{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats panel (right side) */}
        <div className={`hero__stats-panel${mounted ? ' hero__stats-panel--in' : ''}`}>
          {[
            { val: '2,400+', label: 'Properties', icon: '🏘️' },
            { val: '1,800+', label: 'Happy Clients', icon: '🤝' },
            { val: '48+',    label: 'Localities', icon: '🏙️' },
            { val: '4.9★',   label: 'Rating', icon: '⭐' },
          ].map((s, i) => (
            <div key={i} className="hero__stat-item" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
              <span className="hero__stat-icon">{s.icon}</span>
              <span className="hero__stat-val">{s.val}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search bar ── */}
      {/* <div className={`hero__search-wrap${searchVisible ? ' hero__search-wrap--in' : ''}`}>
        <div className="container">
          <form className="hero__search" onSubmit={handleSearch}>
            <div className="hero__search-inner">
              <div className="hero__search-type">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hero__search-type-icon">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                <select value={type} onChange={e => setType(e.target.value)} className="hero__type-select">
                  <option value="All">All Types</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Luxury">Luxury</option>
                </select>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="hero__select-caret">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <div className="hero__search-divider" />
              <div className="hero__search-field">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hero__search-field-icon">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  className="hero__search-input"
                  placeholder="Search by location, project or type…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="hero__search-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <span className="hero__search-btn-text">Search</span>
              </button>
            </div>
            <div className="hero__quick-tags">
              <span className="hero__quick-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Popular:
              </span>
              {['Banjara Hills', 'Gachibowli', 'Jubilee Hills', 'Villa', '3BHK'].map(tag => (
                <button key={tag} type="button" className="hero__quick-tag"
                  onClick={() => { setSearch(tag); inputRef.current?.focus(); }}>
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div> */}

      {/* ── Mobile stats strip ── */}
      <div className="hero__stats-strip">
        <div className="hero__stats-strip-inner container">
          {[
            { val: '2,400+', label: 'Properties', icon: '🏘️' },
            { val: '1,800+', label: 'Happy Clients', icon: '🤝' },
            { val: '48+',    label: 'Localities', icon: '🏙️' },
            { val: '4.9★',   label: 'Rating', icon: '⭐' },
          ].map((s, i) => (
            <div key={i} className="hero__strip-item">
              <span className="hero__strip-icon">{s.icon}</span>
              <span className="hero__strip-val">{s.val}</span>
              <span className="hero__strip-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Slide controls ── */}
      <div className="hero__controls">
        {/* Prev / Next */}
        <button className="hero__nav hero__nav--prev" onClick={() => goTo((current - 1 + effectiveSlides.length) % effectiveSlides.length)} aria-label="Previous slide">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button className="hero__nav hero__nav--next" onClick={() => goTo((current + 1) % effectiveSlides.length)} aria-label="Next slide">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        {/* Dots + progress */}
        <div className="hero__dots">
          {effectiveSlides.map((s, i) => (
            <button
              key={i}
              className={`hero__dot${i === current ? ' hero__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === current && (
                <svg className="hero__dot-ring" viewBox="0 0 36 36">
                  <circle className="hero__dot-ring-bg" cx="18" cy="18" r="15" />
                  <circle
                    className="hero__dot-ring-fill"
                    cx="18" cy="18" r="15"
                    style={{ strokeDashoffset: `${94.25 - (progress / 100) * 94.25}` }}
                  />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Slide counter */}
        <div className="hero__counter">
          <span className="hero__counter-cur">{String(current + 1).padStart(2, '0')}</span>
          <span className="hero__counter-sep">/</span>
          <span className="hero__counter-tot">{String(effectiveSlides.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="hero__progress-bar">
        <div className="hero__progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Scroll hint ── */}
      <div className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-wheel" />
        </div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
