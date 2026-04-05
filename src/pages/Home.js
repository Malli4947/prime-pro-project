import  { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import './Home.css';

const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

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

const AGENTS = [
  { id:1, name:'Priya Reddy',  role:'Senior Property Advisor', deals:'142', exp:'8 Yrs', initials:'PR', color:'#C9A84C' },
  { id:2, name:'Rahul Sharma', role:'Commercial Specialist',   deals:'98',  exp:'6 Yrs', initials:'RS', color:'#1A2B4A' },
  { id:3, name:'Anita Verma',  role:'NRI Investment Desk',     deals:'76',  exp:'5 Yrs', initials:'AV', color:'#22c55e' },
];

const TESTIMONIALS = [
  { id:1, name:'Kiran Rao',    role:'Home Buyer',     city:'Madhapur',     rating:5, initials:'KR', color:'#C9A84C', text:'PrimePro made finding my dream home effortless. The team was responsive and guided me through every step.' },
  { id:2, name:'Divya Nair',   role:'Investor',       city:'Gachibowli',   rating:5, initials:'DN', color:'#1A2B4A', text:'Excellent platform with verified listings. I found the perfect commercial space within a week!' },
  { id:3, name:'Suresh Kumar', role:'Property Seller',city:'Banjara Hills', rating:5, initials:'SK', color:'#3b82f6', text:"Sold my property at the best price. The team's market knowledge and network is outstanding." },
];

const STATS = [
  { icon:'🏘️', value:'2,400+', label:'Properties Listed' },
  { icon:'🤝', value:'1,800+', label:'Happy Clients'      },
  { icon:'🏙️', value:'48+',    label:'Prime Localities'   },
  { icon:'⭐', value:'4.9/5',  label:'Average Rating'     },
];

const WHY_FEATURES = [
  { icon:'🔍', title:'Verified Listings', desc:'Every property is physically verified by our team.' },
  { icon:'🤝', title:'Zero Brokerage',    desc:'Direct deals with developers — no hidden commissions.' },
  { icon:'📋', title:'RERA Certified',    desc:'All listed projects are RERA registered & compliant.' },
  { icon:'⚡', title:'2-Hour Response',   desc:'Our agents respond to every enquiry within 2 hours.' },
];

const CAT_IMAGES = {
  residential: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
  commercial:  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
  agriculture: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
  industrial:  'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&q=80',
  luxury:      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
  default:     'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
};
function getCatImage(cat) {
  if (cat.image) return cat.image;
  const key = cat.name?.toLowerCase().trim();
  return CAT_IMAGES[key] || CAT_IMAGES.default;
}

const shimmerStyle = {
  background: 'linear-gradient(90deg,#f0f2f8 25%,#e2e6f0 50%,#f0f2f8 75%)',
  backgroundSize: '600px 100%',
  animation: 'shimmer 1.4s infinite linear',
  borderRadius: 6,
};

const chipStyle = {
  display:'inline-flex', alignItems:'center', gap:6,
  padding:'7px 14px', borderRadius:99,
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

  // GET /api/cms  →  { success, cms: { hero, about, seo, banners } }
  useEffect(() => {
    fetch(`${BASE}/api/cms`)
      .then(r => r.json())
      .then(d => { if (d.success && d.cms) setCmsData(d.cms); })
      .catch(e => console.error('CMS error:', e))
      .finally(() => setLoadingCms(false));
  }, []);

  // GET /api/categories
  useEffect(() => {
    fetch(`${BASE}/api/categories`)
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.categories)) {
          setCategories(
            d.categories
              .filter(c => c.isActive !== false)
              .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
          );
        }
      })
      .catch(e => console.error('Categories error:', e))
      .finally(() => setLoadingCats(false));
  }, []);

  // GET /api/properties/featured?limit=6
  useEffect(() => {
    fetch(`${BASE}/api/properties/featured?limit=6`)
      .then(r => r.json())
      .then(d => { if (d.success) setFeaturedProps(d.properties || []); })
      .catch(e => console.error('Featured error:', e))
      .finally(() => setLoadingFeat(false));
  }, []);

  // GET /api/properties?page=1&limit=6
  useEffect(() => {
    fetch(`${BASE}/api/properties?page=1&limit=6`)
      .then(r => r.json())
      .then(d => { if (d.success) setTrendingProps(d.properties || []); })
      .catch(e => console.error('Trending error:', e))
      .finally(() => setLoadingTrend(false));
  }, []);

  // CMS-derived values — all from API, not hardcoded
  const about        = cmsData?.about || {};
  const contactPhone = about.phone    || '9347870247';
  const contactEmail = about.email    || 'info@primepro.in';
  const contactAddr  = about.address  || 'Jubilee Hills, Hyderabad';
  const yearsExp     = about.yearsExperience || 12;
  const aboutHeading = about.heading  || "Hyderabad's Most Trusted Real Estate Platform";
  const aboutBody    = about.body     || 'We combine deep local expertise with cutting-edge technology.';
  const cmsBanners   = (cmsData?.banners || []).filter(b => b.isActive);

  return (
    <div className="home">

      {/*
        HERO — passes cmsData.hero to Hero component
        Hero reads: title, subtitle, ctaText, backgroundImage
        While cmsData is null, Hero shows a skeleton internally
      */}
      <Hero cmsHero={cmsData?.hero} />

      {/* CMS BANNERS — from cms.banners[] where isActive=true */}
      {cmsBanners.length > 0 && (
        <section style={{ padding:'40px 0 0' }}>
          <div className="container">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
              {cmsBanners.map((banner, i) => (
                <div key={banner._id || i} style={{ position:'relative', borderRadius:16, overflow:'hidden', height:180, boxShadow:'0 4px 20px rgba(26,43,74,0.12)' }}>
                  <img src={banner.image} alt={banner.title || 'Banner'} loading="lazy"
                    style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(10,13,30,0.7) 0%,transparent 55%)', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:20 }}>
                    {banner.title    && <h3 style={{ color:'#fff', fontSize:18, fontWeight:700, margin:'0 0 4px' }}>{banner.title}</h3>}
                    {banner.subtitle && <p  style={{ color:'rgba(255,255,255,0.8)', fontSize:13, margin:0 }}>{banner.subtitle}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES — from GET /api/categories */}
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
                  <div style={{ padding:16 }}>
                    <div style={{ height:12, width:'60%', ...shimmerStyle }} />
                  </div>
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
              {categories.map((cat, i) => (
                <Link key={cat._id} to={`/properties?type=${encodeURIComponent(cat.name)}`}
                  className={`cat-card${catsVis ? ' anim-fade-up' : ''}`}
                  style={{ animationDelay:`${i * 90}ms` }}>
                  <div className="cat-card__img">
                    <img src={getCatImage(cat)} alt={cat.name} loading="lazy" />
                    <div className="cat-card__overlay"
                      style={cat.color ? { background:`${cat.color}44` } : {}} />
                  </div>
                  <div className="cat-card__body">
                    <span className="cat-card__emoji" style={cat.color ? { color:cat.color } : {}}>
                      {cat.icon || '🏠'}
                    </span>
                    <h3 className="cat-card__name">{cat.name}</h3>
                    {cat.description && <p className="cat-card__desc">{cat.description}</p>}
                    {cat.propertyCount > 0 && (
                      <span style={{ display:'inline-block', marginTop:8, padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700, background: cat.color ? `${cat.color}18` : 'rgba(201,168,76,0.1)', color: cat.color || '#C9A84C', border:`1px solid ${cat.color ? `${cat.color}33` : 'rgba(201,168,76,0.25)'}` }}>
                        {cat.propertyCount} listings
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
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

      {/* STATS */}
      <section className="home-stats" ref={statRef}>
        <div className="home-stats__bg" />
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

      {/* WHY US — all text from cms.about */}
      <section className="section home-why" ref={whyRef}>
        <div className="container home-why__inner">
          <div className={`home-why__img${whyVis ? ' anim-fade-left' : ''}`}>
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=720&q=85" alt="Our Team" loading="lazy" />
            <div className="home-why__badge">
              <span className="home-why__badge-num">{yearsExp}+</span>
              <span className="home-why__badge-txt">Years of<br />Excellence</span>
            </div>
            <div className="home-why__badge-2">🏆 Award Winning 2024</div>
          </div>
          <div className={`home-why__content${whyVis ? ' anim-fade-right' : ''}`}>
            <span className="sec-tag">Why Choose Us</span>
            <h2 className="sec-title">
              {loadingCms ? (
                <span style={{ display:'inline-block', width:300, height:28, verticalAlign:'middle', ...shimmerStyle }} />
              ) : (
                <>
                  {aboutHeading.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="hi">{aboutHeading.split(' ').slice(-1)[0]}</span>
                </>
              )}
            </h2>
            <p className="sec-sub" style={{ marginBottom:32 }}>
              {loadingCms
                ? <span style={{ display:'block', height:60, marginTop:8, ...shimmerStyle }} />
                : aboutBody}
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
            <Link to="/properties" className="btn btn-gold" style={{ marginTop:24 }}>
              Explore All Properties →
            </Link>
          </div>
        </div>
      </section>

      {/* TRENDING PROPERTIES */}
      <section className="section section--mid home-trending" ref={trendRef}>
        <div className="container">
          <div className={`home-section-header${trendVis ? ' anim-fade-up' : ''}`}>
            <div>
              <span className="sec-tag">Latest Listings</span>
              <h2 className="sec-title">Trending <span className="hi">Properties</span></h2>
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

      {/* AGENTS — phone from cms.about.phone */}
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
                <a href={`tel:${contactPhone}`} className="btn btn-outline btn-sm btn-full agent-card__cta">Contact</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section--dark home-testi" ref={testiRef}>
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

      {/* MARQUEE */}
      <div className="home-marquee" aria-hidden="true">
        <div className="home-marquee__track">
          {['Banjara Hills','Jubilee Hills','Gachibowli','Madhapur','Kondapur','Hitec City','Narsingi','Begumpet',
            'Banjara Hills','Jubilee Hills','Gachibowli','Madhapur','Kondapur','Hitec City','Narsingi','Begumpet']
            .map((loc, i) => <span key={i} className="home-marquee__item">⬡ {loc}</span>)}
        </div>
      </div>
    </div>
  );
}