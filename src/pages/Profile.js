import  { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import LeadershipSection from '../components/LeadershipSection';
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

const CAT_FALLBACK_IMAGES = {
  residential: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
  commercial:  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
  agriculture: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
  industrial:  'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&q=80',
  luxury:      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
  plots:       'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80',
  villa:       'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  default:     'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
};

function getCatImage(cat) {
  if (cat.image) return cat.image;
  const key = cat.name?.toLowerCase().trim();
  if (CAT_FALLBACK_IMAGES[key]) return CAT_FALLBACK_IMAGES[key];
  const partial = Object.keys(CAT_FALLBACK_IMAGES).find(k => key?.includes(k));
  return partial ? CAT_FALLBACK_IMAGES[partial] : CAT_FALLBACK_IMAGES.default;
}

const AGENTS = [
  { id: 1, name: 'Priya Reddy',  role: 'Senior Property Advisor', deals: '142', exp: '8 Yrs', initials: 'PR', color: '#C9A84C' },
  { id: 2, name: 'Rahul Sharma', role: 'Commercial Specialist',   deals: '98',  exp: '6 Yrs', initials: 'RS', color: '#1A2B4A' },
  { id: 3, name: 'Anita Verma',  role: 'NRI Investment Desk',     deals: '76',  exp: '5 Yrs', initials: 'AV', color: '#22c55e' },
];

const TESTIMONIALS = [
  { id:1, name:'Kiran Rao',    role:'Home Buyer',          city:'Tellapur, Hyderabad', rating:5, initials:'KR', color:'#C9A84C',
    text:"PrimePro made finding my dream 3BHK in Tellapur effortless. They shortlisted only RERA-approved options that matched my budget, arranged site visits the same week and handled the paperwork end-to-end. Honest pricing, zero brokerage and a team that genuinely listens — I would recommend them to any home buyer." },
  { id:2, name:'Divya Nair',   role:'Commercial Investor', city:'Kokapet, Hyderabad',  rating:5, initials:'DN', color:'#1A2B4A',
    text:"I was looking for a pre-leased commercial space with stable rental yields and PrimePro delivered the perfect deal within a week. Their market insight, transparent ROI breakdown and clean documentation made the entire investment risk-free. Truly professional advisors." },
  { id:3, name:'Suresh Kumar', role:'Property Seller',     city:'Kollur, Hyderabad',   rating:5, initials:'SK', color:'#3b82f6',
    text:"I sold my plot through PrimePro Projects and got the best market price thanks to their strong buyer network. Verified leads, transparent negotiation and quick registration — the whole process closed in under three weeks. Highly recommended for genuine sellers." },
];

const WHY_FEATURES = [
  { icon: '🔍', title: 'Verified Listings', desc: 'Every property is physically verified by our team.' },
  { icon: '🤝', title: 'Zero Brokerage',    desc: 'Direct deals with developers — no hidden commissions.' },
  { icon: '📋', title: 'RERA Certified',    desc: 'All listed projects are RERA registered & compliant.' },
  { icon: '⚡', title: '2-Hour Response',   desc: 'Our agents respond to every enquiry within 2 hours.' },
];

const BASE_STATS = [
  { icon: '🏘️', value: '200+',  label: 'Properties'  },
  { icon: '🤝', value: '100+',   label: 'Clients'      },
  { icon: '🏙️', value: '5',     label: 'Major Cities' },
  { icon: '⭐', value: '4.9★',  label: 'Rating'       },
];

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton-line skeleton-line--lg" />
      <div className="skeleton-line skeleton-line--md" />
      <div className="skeleton-line skeleton-line--sm" />
    </div>
  </div>
);

const EmptyState = ({ icon = '🏠', msg = 'Nothing here yet.' }) => (
  <div className="home-empty">
    <span className="home-empty__icon">{icon}</span>
    <p>{msg}</p>
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

  useEffect(() => {
    fetch(`${BASE}/api/cms`)
      .then(r => r.json())
      .then(d => { if (d.success && d.cms) setCmsData(d.cms); })
      .catch(() => {})
      .finally(() => setLoadingCms(false));
  }, []);

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
      .catch(() => {})
      .finally(() => setLoadingCats(false));
  }, []);

  useEffect(() => {
    fetch(`${BASE}/api/properties/featured?limit=6`)
      .then(r => r.json())
      .then(d => { if (d.success) setFeaturedProps(d.properties || []); })
      .catch(() => {})
      .finally(() => setLoadingFeat(false));
  }, []);

  useEffect(() => {
    fetch(`${BASE}/api/properties?page=1&limit=6`)
      .then(r => r.json())
      .then(d => { if (d.success) setTrendingProps(d.properties || []); })
      .catch(() => {})
      .finally(() => setLoadingTrend(false));
  }, []);

  const hero    = cmsData?.hero    || {};
  const about   = cmsData?.about   || {};
  const banners = (cmsData?.banners || []).filter(b => b.isActive);

  const contactPhone = about.phone    || '9866212211';
  const contactEmail = about.email    || 'primeproprojects@gmail.com';
  const contactAddr  = about.address  || 'Divya Diamonds, Hi Tech city, 3-225, Kavuri Hills Rd, CBI Colony, Madhapur, Hyderabad, Telangana 500033';
  const yearsExp     = about.yearsExperience || 12;
  const aboutHeading = about.heading  || "Hyderabad's Most Trusted Real Estate Platform";
  const aboutBody    = about.body     || 'We combine deep local expertise with cutting-edge technology to make your property journey smooth, transparent, and rewarding.';

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="home">

      <Hero cmsHero={hero} />

      {banners.length > 0 && (
        <section className="home-cms-banners">
          <div className="container">
            <div className="home-cms-banners__grid">
              {banners.map((banner, i) => (
                <div key={banner._id || i} className="cms-banner-card">
                  <img src={banner.image} alt={banner.title || 'Banner'} loading="lazy" />
                  <div className="cms-banner-card__overlay">
                    {banner.title    && <h3 className="cms-banner-card__title">{banner.title}</h3>}
                    {banner.subtitle && <p  className="cms-banner-card__sub">{banner.subtitle}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="cat-card cat-card--skeleton">
                  <div className="skeleton-img" />
                  <div style={{ padding: '16px' }}>
                    <div className="skeleton-line skeleton-line--sm" style={{ marginBottom: 8 }} />
                    <div className="skeleton-line skeleton-line--md" />
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <EmptyState icon="🏷️" msg="No categories found. Add some from the admin panel." />
          ) : (
            <div className="home-cats__grid">
              {categories.map((cat, i) => (
                <Link
                  key={cat._id}
                  to={`/properties?type=${encodeURIComponent(cat.name)}`}
                  className={`cat-card${catsVis ? ' anim-fade-up' : ''}`}
                  style={{ animationDelay: `${i * 90}ms` }}>

                  <div className="cat-card__img">
                    <img src={getCatImage(cat)} alt={cat.name} loading="lazy" />
                    <div
                      className="cat-card__overlay"
                      style={cat.color ? { background: `${cat.color}44` } : {}}
                    />
                  </div>

                  <div className="cat-card__body">
                    <span className="cat-card__emoji" style={cat.color ? { color: cat.color } : {}}>
                      {cat.icon || '🏠'}
                    </span>
                    <h3 className="cat-card__name">{cat.name}</h3>
                    {cat.description && (
                      <p className="cat-card__desc">{cat.description}</p>
                    )}
                    {cat.propertyCount > 0 && (
                      <span className="cat-card__count"
                        style={cat.color ? { background: `${cat.color}22`, color: cat.color, border: `1px solid ${cat.color}44` } : {}}>
                        {cat.propertyCount} {cat.propertyCount === 1 ? 'listing' : 'listings'}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
            <div className="grid-3">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
          ) : featuredProps.length === 0 ? (
            <EmptyState icon="🏠" msg="No featured properties yet. Mark some as featured from the admin panel." />
          ) : (
            <div className={`grid-3${featVis ? ' anim-fade-up d-2' : ''}`}>
              {featuredProps.map((p, i) => (
                <PropertyCard key={p._id} property={p} style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-stats" ref={statRef}>
        <div className="home-stats__bg" />
        <div className="container">
          <div className={`home-stats__grid${statVis ? ' anim-fade-up' : ''}`}>
            {BASE_STATS.map((s, i) => (
              <div key={i} className="home-stat" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="home-stat__icon">{s.icon}</span>
                <span className="home-stat__val">{s.value}</span>
                <span className="home-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LeadershipSection variant="mid" />

      <section className="section home-why" ref={whyRef}>
        <div className="container home-why__inner">
          <div className={`home-why__img${whyVis ? ' anim-fade-left' : ''}`}>
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=720&q=85"
              alt="Our Team"
              loading="lazy"
            />
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
                <span className="skel-inline" />
              ) : (() => {
                const words = aboutHeading.split(' ');
                const last  = words.pop();
                return <>{words.join(' ')} <span className="hi">{last}</span></>;
              })()}
            </h2>

            <p className="sec-sub" style={{ marginBottom: 32 }}>
              {loadingCms ? <span className="skel-block" /> : aboutBody}
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

            <div className="home-why__contact-row">
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="home-why__contact-chip">
                  <span>✉️</span> {contactEmail}
                </a>
              )}
              {contactPhone && (
                <a href={`tel:${contactPhone}`} className="home-why__contact-chip">
                  <span>📞</span> {contactPhone}
                </a>
              )}
              <a href="tel:9866475511" className="home-why__contact-chip">
                <span>📞</span> 9866475511
              </a>
              {contactAddr && (
                <span className="home-why__contact-chip">
                  <span>📍</span> {contactAddr}
                </span>
              )}
            </div>

            <Link to="/properties" className="btn btn-gold" style={{ marginTop: 24 }}>
              Explore All Properties →
            </Link>
          </div>
        </div>
      </section>

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
            <div className="grid-3">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
          ) : trendingProps.length === 0 ? (
            <EmptyState icon="🏠" msg="No properties yet." />
          ) : (
            <div className={`grid-3${trendVis ? ' anim-fade-up d-2' : ''}`}>
              {trendingProps.map((p, i) => (
                <PropertyCard key={p._id} property={p} style={{ animationDelay: `${i * 60}ms` }} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section home-agents" ref={agentRef}>
        <div className="container">
          <div className={`home-section-header home-section-header--center${agentVis ? ' anim-fade-up' : ''}`}>
            <span className="sec-tag">Expert Team</span>
            <h2 className="sec-title">Our Top <span className="hi">Agents</span></h2>
            <p className="sec-sub" style={{ margin: '0 auto' }}>
              Experienced professionals dedicated to finding your perfect match.
            </p>
          </div>
          <div className={`home-agents__grid${agentVis ? ' anim-fade-up d-2' : ''}`}>
            {AGENTS.map((a, i) => (
              <div key={a.id} className="agent-card" style={{ animationDelay: `${i * 90}ms` }}>
                <div
                  className="agent-card__avatar"
                  style={{ background: `linear-gradient(135deg, ${a.color}cc, ${a.color}55)` }}>
                  <span>{a.initials}</span>
                </div>
                <h3 className="agent-card__name">{a.name}</h3>
                <p className="agent-card__role">{a.role}</p>
                <div className="agent-card__stats">
                  <div className="agent-card__stat"><b>{a.deals}</b><span>Deals</span></div>
                  <div className="agent-card__stat-sep" />
                  <div className="agent-card__stat"><b>{a.exp}</b><span>Experience</span></div>
                </div>
                <a href={`tel:${contactPhone}`} className="btn btn-outline btn-sm btn-full agent-card__cta">
                  Contact
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark home-testi" ref={testiRef}>
        <div className="container">
          <div className={`home-section-header home-section-header--center${testiVis ? ' anim-fade-up' : ''}`}>
            <span className="sec-tag">Client Stories</span>
            <h2 className="sec-title sec-title--light">
              What Our Clients <span className="hi">Say</span>
            </h2>
          </div>
          <div className={`home-testi__grid${testiVis ? ' anim-fade-up d-2' : ''}`}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id} className="testi-card" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="testi-card__quote">"</div>
                <div className="testi-card__stars">{'⭐'.repeat(t.rating)}</div>
                <p className="testi-card__text">{t.text}</p>
                <div className="testi-card__author">
                  <div
                    className="testi-card__avatar"
                    style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>
                    {t.initials}
                  </div>
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

      <div className="home-marquee" aria-hidden="true">
        <div className="home-marquee__track">
          {[
            'Kokapet','Financial District','Gachibowli','Narsingi','Tellapur','Osman Nagar','Kollur','Miyapur',
            'Bachupally','Patancheru','Kompally','Medchal','Suchitra','Alwal','Shamirpet','Dundigal','Bowrampet',
            'Kandlakoya','Genome Valley','Maisammaguda','Shamshabad','Rajendranagar','Maheshwaram','Kandukur',
            'Srisailam Highway','Tukkuguda','Adibatla','Balapur','Chandrayangutta','Kothur',
            'Uppal','Pocharam','Nagole','LB Nagar','Hayathnagar','Ghatkesar','Pedda Amberpet',
            'Vanasthalipuram','Yadadri',
            'Kokapet','Financial District','Gachibowli','Narsingi','Tellapur','Osman Nagar','Kollur','Miyapur',
            'Bachupally','Patancheru','Kompally','Medchal','Suchitra','Alwal','Shamirpet','Dundigal','Bowrampet',
            'Kandlakoya','Genome Valley','Maisammaguda','Shamshabad','Rajendranagar','Maheshwaram','Kandukur',
            'Srisailam Highway','Tukkuguda','Adibatla','Balapur','Chandrayangutta','Kothur',
            'Uppal','Pocharam','Nagole','LB Nagar','Hayathnagar','Ghatkesar','Pedda Amberpet',
            'Vanasthalipuram','Yadadri',
          ].map((loc, i) => (
            <span key={i} className="home-marquee__item">⬡ {loc}</span>
          ))}
        </div>
      </div>
    </div>
  );
}