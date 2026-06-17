/* eslint-disable no-unused-vars */
import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import AnimatedBackground from '../components/AnimatedBackground';
import LeadershipSection from '../components/LeadershipSection';
import { cachedFetch } from '../utils/apiCache';
import './Home.css';

const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=85';

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useBannerSlider(total, interval = 5000) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [prog,   setProg]   = useState(0);
  const progRef  = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    setActive(0); setProg(0); startRef.current = Date.now();
  }, [total]);

  const goTo = useCallback((idx) => {
    setActive((idx + total) % total);
    setProg(0); startRef.current = Date.now();
  }, [total]);

  const next = useCallback(() => setActive(a => (a + 1) % total), [total]);
  const prev = useCallback(() => setActive(a => (a - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused || total <= 1) { cancelAnimationFrame(progRef.current); return; }
    if (!startRef.current) startRef.current = Date.now();
    const tick = () => {
      const p = Math.min(((Date.now() - startRef.current) / interval) * 100, 100);
      setProg(p);
      if (p < 100) progRef.current = requestAnimationFrame(tick);
    };
    progRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progRef.current);
  }, [active, paused, total, interval]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (paused || total <= 1) return;
    const t = setTimeout(() => {
      setActive(a => (a + 1) % total);
      setProg(0); startRef.current = Date.now();
    }, interval);
    return () => clearTimeout(t);
  }, [active, paused, total, interval]);

  return { active, prog, next, prev, goTo, setPaused };
}

const AGENTS = [
   {
    id: 1,
    name: 'Prashanth Reddy',
    role: 'Senior Property Advisor',
    deals: '130',
    exp: '5 Yrs',
    initials: 'PR',
    color: '#1A2B4A',
    phone: '9347870247',
  },
  {
    id: 2,
    name: 'Vaishnavi Chowdary',
    role: 'Senior Property Advisor',
    deals: '100',
    exp: '4 Yrs',
    initials: 'VC',
    color: '#C9A84C',
    phone: '8688874521',
  },

  {
    id: 3,
    name: 'K Arun Kumar Reddy',
    role: 'Property Advisor',
    deals: '75',
    exp: '3 Yrs',
    initials: 'AK',
    color: '#22c55e',
    phone: '9390798969',
  },
];

const TESTIMONIALS = [
  { id:1, name:'Kiran Rao',    role:'Home Buyer',      city:'Tellapur, Hyderabad', rating:5, initials:'KR', color:'#C9A84C',
    text:"PrimePro made finding my dream 3BHK in Tellapur effortless. They shortlisted only RERA-approved options that matched my budget, arranged site visits the same week and handled the paperwork end-to-end. Honest pricing, zero brokerage and a team that genuinely listens — I would recommend them to any home buyer." },
  { id:2, name:'Divya Nair',   role:'Commercial Investor', city:'Kokapet, Hyderabad', rating:5, initials:'DN', color:'#1A2B4A',
    text:"I was looking for a pre-leased commercial space with stable rental yields and PrimePro delivered the perfect deal within a week. Their market insight, transparent ROI breakdown and clean documentation made the entire investment risk-free. Truly professional advisors." },
  { id:3, name:'Suresh Kumar', role:'Property Seller', city:'Kollur, Hyderabad',   rating:5, initials:'SK', color:'#3b82f6',
    text:"I sold my plot through PrimePro Projects and got the best market price thanks to their strong buyer network. Verified leads, transparent negotiation and quick registration — the whole process closed in under three weeks. Highly recommended for genuine sellers." },
];

const STATS = [
  { icon:'🏘️', value:'200+',  label:'Properties'   },
  { icon:'🤝', value:'100+',   label:'Clients'       },
  { icon:'🏙️', value:'5',     label:'Major Cities'  },
  { icon:'⭐', value:'4.9★',  label:'Rating'        },
];

const WHY_FEATURES = [
  { icon:'🔍', title:'Verified Listings', desc:'Every property is physically verified by our team.' },
  { icon:'🤝', title:'Zero Brokerage',    desc:'Direct deals with developers — no hidden commissions.' },
  { icon:'📋', title:'RERA Certified',    desc:'All listed projects are RERA registered & compliant.' },
  { icon:'⚡', title:'2-Hour Response',   desc:'Our agents respond to every enquiry within 2 hours.' },
];

const CAT_IMAGES = {
  apartments:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=640&q=75&auto=format&fit=crop',
  villas:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=640&q=75&auto=format&fit=crop',
  plots:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=640&q=75&auto=format&fit=crop',
  commercial:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=640&q=75&auto=format&fit=crop',
  'farm lands':'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=640&q=75&auto=format&fit=crop',
  'ready to move':'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=640&q=75&auto=format&fit=crop',
  'under construction':'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=640&q=75&auto=format&fit=crop',
  residential:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=640&q=75&auto=format&fit=crop',
  agriculture:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=640&q=75&auto=format&fit=crop',
  industrial:'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=640&q=75&auto=format&fit=crop',
  luxury:'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=640&q=75&auto=format&fit=crop',
  default:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=640&q=75&auto=format&fit=crop',
};

function isUrl(str) {
  return typeof str === 'string' && (str.startsWith('http://') || str.startsWith('https://'));
}
function isValidImage(str) {
  return typeof str === 'string' && (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('data:image/')
  );
}
function getCatImage(cat) {
  if (isValidImage(cat.image)) return cat.image;
  if (isValidImage(cat.icon))  return cat.icon;
  if (Array.isArray(cat.images) && cat.images.length > 0) {
    const p = cat.images.find(i => i.isPrimary) || cat.images[0];
    if (isValidImage(p?.url)) return p.url;
  }
  return CAT_IMAGES[cat.name?.toLowerCase().trim()] || CAT_IMAGES.default;
}
function getCatEmoji(cat) { return isValidImage(cat.icon) ? '🏠' : (cat.icon || '🏠'); }

// Resolve banner image — swap out blocked Google thumbnails
function getBannerImg(url) {
  if (!url) return FALLBACK_IMG;
  if (url.includes('encrypted-tbn') || url.includes('gstatic.com')) return FALLBACK_IMG;
  return url;
}

const shimmerStyle = {
  background:'linear-gradient(90deg,#f0f2f8 25%,#e2e6f0 50%,#f0f2f8 75%)',
  backgroundSize:'600px 100%', animation:'shimmer 1.4s infinite linear', borderRadius:6,
};
const chipStyle = {
  display:'inline-flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:99,
  background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)',
  color:'#1A2B4A', fontSize:13, fontWeight:500, textDecoration:'none',
};
const SkeletonCard = () => (
  <div style={{ borderRadius:16, overflow:'hidden', background:'#fff', border:'1px solid #e8edf5' }}>
    <div style={{ height:200, ...shimmerStyle }} />
    <div style={{ padding:16, display:'flex', flexDirection:'column', gap:10 }}>
      {[80,60,40].map(w => <div key={w} style={{ height:12, width:`${w}%`, ...shimmerStyle }} />)}
    </div>
  </div>
);

export default function Home() {
  const [cmsData,       setCmsData]       = useState(null);
  const [categories,    setCategories]    = useState([]);
  const [featuredProps, setFeaturedProps] = useState([]);
  const [trendingProps, setTrendingProps] = useState([]);
  const [loadingCms,    setLoadingCms]    = useState(true);
  const [loadingCats,   setLoadingCats]   = useState(true);
  const [loadingFeat,   setLoadingFeat]   = useState(true);
  const [loadingTrend,  setLoadingTrend]  = useState(true);

  const [catsRef,  catsVis]  = useReveal();
  const [featRef,  featVis]  = useReveal();
  const [whyRef,   whyVis]   = useReveal();
  const [statRef,  statVis]  = useReveal();
  const [trendRef, trendVis] = useReveal();
  const [agentRef, agentVis] = useReveal();
  const [testiRef, testiVis] = useReveal();

  // ── Fire all 4 fetches in parallel, with caching ──────────────────────────
  useEffect(() => {
    let cancelled = false;

    Promise.all([
      cachedFetch(`${BASE}/api/cms`),
      cachedFetch(`${BASE}/api/categories`),
      cachedFetch(`${BASE}/api/properties/featured?limit=6`),
      cachedFetch(`${BASE}/api/properties?page=1&limit=6`),
    ]).then(([cms, cats, featured, trending]) => {
      if (cancelled) return;

      if (cms?.success && cms.cms)           setCmsData(cms.cms);
      if (cats?.success && Array.isArray(cats.categories)) {
        setCategories(
          cats.categories
            .filter(c => c.isActive !== false)
            .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
        );
      }
      if (featured?.success)  setFeaturedProps(featured.properties || []);
      if (trending?.success)  setTrendingProps(trending.properties || []);
    }).catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setLoadingCms(false);
          setLoadingCats(false);
          setLoadingFeat(false);
          setLoadingTrend(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  const about        = cmsData?.about || {};
  const contactPhone = about.phone    || '6304829287';
  const contactEmail = about.email    || 'primeproprojects@gmail.com';
  const contactAddr  = about.address  || 'Madhapur, Kavuri Hills Phase 1, Hyderabad, Telangana';
  const yearsExp     = about.yearsExperience || 5;
  const aboutHeading = about.heading  || "Hyderabad's Most Trusted Real Estate Platform";
  const aboutBody    = about.body     || 'We combine deep local expertise with cutting-edge technology to make your property journey smooth, transparent, and rewarding.';

  return (
    <div className="home">
      <Helmet>
        <title>Prime Pro Projects — Hyderabad's Trusted Real Estate Platform</title>
        <meta name="description" content="Buy RERA-verified apartments, villas, plots, commercial spaces and farmlands in Hyderabad. Zero brokerage, 2-hour response, 200+ verified listings. Call +91 63048 29287." />
        <meta name="keywords" content="real estate Hyderabad, apartments Hyderabad, villas Hyderabad, plots Kokapet, RERA verified properties, Prime Pro Projects" />
        <link rel="canonical" href="https://www.primeproprojects.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Prime Pro Projects — Hyderabad's Trusted Real Estate Platform" />
        <meta property="og:description" content="200+ RERA-verified properties in Hyderabad. Apartments, villas, plots, commercial & farmland. Zero brokerage. Call +91 63048 29287." />
        <meta property="og:url" content="https://www.primeproprojects.in/" />
        <meta property="og:image" content="https://www.primeproprojects.in/FullLogo.jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prime Pro Projects — Hyderabad Real Estate" />
        <meta name="twitter:description" content="200+ RERA-verified properties. Zero brokerage. Expert advice." />
      </Helmet>
      <Hero cmsHero={cmsData?.hero} />

      {/* ── CATEGORIES ── */}
      <section className="section home-cats" ref={catsRef}>
        <div className="container">
          <div className={`home-cats__header${catsVis ? ' anim-fade-up' : ''}`}>
            <div>
              <span className="sec-tag">Browse Categories</span>
              <h2 className="sec-title">Property <span className="hi">Categories</span></h2>
            </div>
            <Link to="/properties" className="btn btn-outline">View All →</Link>
          </div>
          {loadingCats ? (
            <div className="home-cats__grid">
              {[1,2,3,4].map(i => (
                <div key={i} style={{ borderRadius:16, overflow:'hidden', border:'1px solid #e8edf5', background:'#fff' }}>
                  <div style={{ height:200, ...shimmerStyle }} />
                  <div style={{ padding:16 }}><div style={{ height:12, width:'60%', ...shimmerStyle }} /></div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 0' }}>
              <div style={{ fontSize:36, opacity:.3 }}>🏷️</div>
              <p style={{ color:'#94a3b8', marginTop:12 }}>No categories found.</p>
            </div>
          ) : (
            <div className="home-cats__grid">
              {categories.map((cat, i) => {
                // Map category name → subtype param for filtering
                const nameUpper = (cat.name || '').toUpperCase().trim();
                let filterParam = `type=${encodeURIComponent(cat.name)}`;
                if (nameUpper === 'APARTMENTS')          filterParam = 'subtype=Apartment';
                else if (nameUpper === 'VILLAS')         filterParam = 'subtype=Villa';
                else if (nameUpper === 'PLOTS')          filterParam = 'subtype=Plot';
                else if (nameUpper === 'FARM LANDS')     filterParam = 'subtype=Farm+Land';
                else if (nameUpper === 'COMMERCIAL')     filterParam = 'type=Commercial';
                else if (nameUpper === 'READY TO MOVE')  filterParam = 'subtype=Ready+to+Move';
                else if (nameUpper === 'UNDER CONSTRUCTION') filterParam = 'subtype=Under+Construction';
                return (
                <Link key={cat._id} to={`/properties?${filterParam}`}
                  className={`cat-card${catsVis ? ' anim-fade-up' : ''}`}
                  style={{ animationDelay:`${i * 90}ms` }}>
                  <div className="cat-card__img">
                    <img src={getCatImage(cat)} alt={cat.name} loading="lazy"
                      onError={e => { e.target.onerror = null; e.target.src = CAT_IMAGES.default; }} />
                    <div className="cat-card__overlay" />
                  </div>
                  <div className="cat-card__body">
                    <h3 className="cat-card__name">{cat.name}</h3>
                    {cat.description && <p className="cat-card__desc">{cat.description}</p>}
                    {cat.propertyCount > 0 && (
                      <span className="cat-card__count">
                        {cat.propertyCount} listings
                      </span>
                    )}
                  </div>
                </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section className="section section--mid home-featured" ref={featRef}>
        <div className="container">
          <div className={`home-section-header${featVis ? ' anim-fade-up' : ''}`}>
            <div>
              <span className="sec-tag">Hand-Picked</span>
              <h2 className="sec-title">Featured <span className="hi">Properties</span></h2>
            </div>
            <Link to="/properties?featured=true" className="btn btn-outline">See All →</Link>
          </div>
          {loadingFeat ? (
            <div className="grid-3">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
          ) : featuredProps.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 0' }}>
              <div style={{ fontSize:40, opacity:.3 }}>🏠</div>
              <p style={{ color:'#94a3b8', marginTop:12 }}>No featured properties yet.</p>
            </div>
          ) : (
            <div className={`grid-3${featVis ? ' anim-fade-up d-2' : ''}`}>
              {featuredProps.map((p, i) => (
                <PropertyCard key={p._id} property={p} style={{ animationDelay:`${i * 80}ms` }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="home-stats" ref={statRef}>
        <div className="home-stats__bg" />
        <AnimatedBackground variant="dark" density={0.6} showGrid showOrbs={false} showLines={false} />
        <div className="container">
          <div className={`home-stats__grid${statVis ? ' anim-fade-up' : ''}`}>
            {STATS.map((s, i) => (
              <div key={i} className="home-stat" style={{ animationDelay:`${i * 80}ms` }}>
                <span className="home-stat__icon">{s.icon}</span>
                <span className="home-stat__val">{s.value}</span>
                <span className="home-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="section home-why" ref={whyRef}>
        <div className="container home-why__inner">
          <div className={`home-why__img${whyVis ? ' anim-fade-left' : ''}`}>
            <img src="/Prashanth.jpeg" alt="Our Team" loading="lazy" decoding="async" />
            <div className="home-why__badge">
              <span className="home-why__badge-num">{yearsExp}+</span>
              <span className="home-why__badge-txt">Years of<br />Excellence</span>
            </div>
            <div className="home-why__badge-2">🏆 Award Winning 2024</div>
          </div>
          <div className={`home-why__content${whyVis ? ' anim-fade-right' : ''}`}>
            <span className="sec-tag">Why Choose Us</span>
            <h2 className="sec-title">
              {loadingCms
                ? <span style={{ display:'inline-block', width:300, height:28, verticalAlign:'middle', ...shimmerStyle }} />
                : <>{aboutHeading.split(' ').slice(0,-1).join(' ')} <span className="hi">{aboutHeading.split(' ').slice(-1)[0]}</span></>}
            </h2>
            <p className="sec-sub" style={{ marginBottom:32 }}>
              {loadingCms ? <span style={{ display:'block', height:60, marginTop:8, ...shimmerStyle }} /> : aboutBody}
            </p>
            <div className="home-why__features">
              {WHY_FEATURES.map((f, i) => (
                <div key={i} className="home-why__feature">
                  <div className="home-why__feat-icon">{f.icon}</div>
                  <div>
                    <div className="home-why__feat-title">{f.title}</div>
                    <div className="home-why__feat-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginTop:24, marginBottom:4 }}>
              {contactEmail && <a href={`mailto:${contactEmail}`} style={chipStyle}>✉️ {contactEmail}</a>}
              {contactPhone && <a href={`tel:${contactPhone}`}    style={chipStyle}>📞 {contactPhone}</a>}
              {contactAddr  && <span                              style={chipStyle}>📍 {contactAddr}</span>}
            </div>
            <Link to="/properties" className="btn btn-gold" style={{ marginTop:24 }}>Explore All Properties →</Link>
          </div>
        </div>
      </section>

      {/* ── TRENDING PROPERTIES ── */}
      <section className="section section--mid home-trending" ref={trendRef}>
        <div className="container">
          <div className={`home-section-header${trendVis ? ' anim-fade-up' : ''}`}>
            <div>
              <span className="sec-tag">Latest Listings</span>
              <h2 className="sec-title"> <span className="hi">Properties</span></h2>
            </div>
            <Link to="/properties" className="btn btn-outline">View All →</Link>
          </div>
          {loadingTrend ? (
            <div className="grid-3">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
          ) : trendingProps.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 0' }}>
              <div style={{ fontSize:40, opacity:.3 }}>🏠</div>
              <p style={{ color:'#94a3b8', marginTop:12 }}>No properties yet.</p>
            </div>
          ) : (
            <div className={`grid-3${trendVis ? ' anim-fade-up d-2' : ''}`}>
              {trendingProps.map((p, i) => (
                <PropertyCard key={p._id} property={p} style={{ animationDelay:`${i * 60}ms` }} />
              ))}
            </div>
          )}
        </div>
      </section>
 <LeadershipSection variant="dark" />

      {/* ── AGENTS ── */}
      <section className="section home-agents" ref={agentRef}>
        <div className="container">
          <div className={`home-section-header home-section-header--center${agentVis ? ' anim-fade-up' : ''}`}>
            <span className="sec-tag">Expert Team</span>
            <h2 className="sec-title">Our Top <span className="hi">Agents</span></h2>
            <p className="sec-sub" style={{ margin:'0 auto' }}>Experienced professionals dedicated to finding your perfect match.</p>
          </div>
          <div className={`home-agents__grid${agentVis ? ' anim-fade-up d-2' : ''}`}>
            {AGENTS.map((a, i) => (
              <div key={a.id} className="agent-card" style={{ animationDelay:`${i * 90}ms` }}>
                <div className="agent-card__avatar" style={{ background:`linear-gradient(135deg, ${a.color}cc, ${a.color}55)` }}>
                  <span>{a.initials}</span>
                </div>
                <h3 className="agent-card__name">{a.name}</h3>
                <p className="agent-card__role">{a.role}</p>
                <div className="agent-card__stats">
                  <div className="agent-card__stat"><b>{a.deals}</b><span>Deals</span></div>
                  <div className="agent-card__stat-sep" />
                  <div className="agent-card__stat"><b>{a.exp}</b><span>Experience</span></div>
                </div>
                <a href={`tel:${a.phone}`} className="agent-card__phone-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {a.phone}
                </a>
                <a href={`tel:${a.phone}`} className="btn btn-outline btn-sm btn-full agent-card__cta">Contact</a>
              </div>
            ))}
          </div>
        </div>
      </section>

    
     
      {/* ── TESTIMONIALS ── */}
      <section className="section section--dark home-testi" ref={testiRef}>
        <AnimatedBackground variant="dark" density={0.5} showGrid showOrbs={false} showLines />
        <div className="container">
          <div className={`home-section-header home-section-header--center${testiVis ? ' anim-fade-up' : ''}`}>
            <span className="sec-tag">Client Stories</span>
            <h2 className="sec-title sec-title--light">What Our Clients <span className="hi">Say</span></h2>
          </div>
          <div className={`home-testi__grid${testiVis ? ' anim-fade-up d-2' : ''}`}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id} className="testi-card" style={{ animationDelay:`${i * 100}ms` }}>
                <div className="testi-card__quote">"</div>
                <div className="testi-card__stars">{'⭐'.repeat(t.rating)}</div>
                <p className="testi-card__text">{t.text}</p>
                <div className="testi-card__author">
                  <div className="testi-card__avatar" style={{ background:`linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>{t.initials}</div>
                  <div>
                    <div className="testi-card__name">{t.name}</div>
                    <div className="testi-card__role">{t.role} · {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="home-marquee" aria-hidden="true">
        <div className="home-marquee__track">
          {[
            'Kokapet','Financial District','Gachibowli','Narsingi','Tellapur','Osman Nagar','Kollur','Miyapur',
            'Bachupally','Patancheru','Kompally','Medchal','Suchitra','Alwal','Shamirpet','Dundigal','Bowrampet',
            'Kandlakoya','Genome Valley','Maisammaguda','Shamshabad','Rajendranagar','Maheshwaram','Kandukur',
            'Srisailam Highway','Tukkuguda','Adibatla','Balapur','Chandrayangutta','Kothur',
            'Uppal','Pocharam','Nagole','LB Nagar','Hayathnagar','Ghatkesar','Pedda Amberpet',
            'Vanasthalipuram','Yadadri',
            // duplicate for seamless loop
            'Kokapet','Financial District','Gachibowli','Narsingi','Tellapur','Osman Nagar','Kollur','Miyapur',
            'Bachupally','Patancheru','Kompally','Medchal','Suchitra','Alwal','Shamirpet','Dundigal','Bowrampet',
            'Kandlakoya','Genome Valley','Maisammaguda','Shamshabad','Rajendranagar','Maheshwaram','Kandukur',
            'Srisailam Highway','Tukkuguda','Adibatla','Balapur','Chandrayangutta','Kothur',
            'Uppal','Pocharam','Nagole','LB Nagar','Hayathnagar','Ghatkesar','Pedda Amberpet',
            'Vanasthalipuram','Yadadri',
          ].map((loc, i) => <span key={i} className="home-marquee__item">⬡ {loc}</span>)}
        </div>
      </div>
    </div>
  );
}
