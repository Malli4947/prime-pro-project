import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import { PROPERTIES, CATEGORIES, STATS, TESTIMONIALS, AGENTS } from '../data/Properties';
import './Home.css';

/* ── Simple intersection-observer hook ──────────────────── */
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

export default function Home() {
  const featured = PROPERTIES.filter(p => p.featured);
  const trending = PROPERTIES.slice(0, 6);

  const [catsRef,  catsVis]  = useReveal();
  const [featRef,  featVis]  = useReveal();
  const [whyRef,   whyVis]   = useReveal();
  const [statRef,  statVis]  = useReveal();
  const [trendRef, trendVis] = useReveal();
  const [agentRef, agentVis] = useReveal();
  const [testiRef, testiVis] = useReveal();

  return (
    <div className="home">
      {/* ── HERO ─────────────────────────────────────────── */}
      <Hero />

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section className="section home-cats" ref={catsRef}>
        <div className="container">
          <div className={`home-cats__header${catsVis ? ' anim-fade-up' : ''}`}>
            <div>
              <span className="sec-tag">Browse Categories</span>
              <h2 className="sec-title">Property <span className="hi">Categories</span></h2>
            </div>
            <Link to="/properties" className="btn btn-outline">View All →</Link>
          </div>

          <div className="home-cats__grid">
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.id} to={`/properties?type=${cat.name}`}
                className={`cat-card${catsVis ? ' anim-fade-up' : ''}`}
                style={{ animationDelay: `${i * 90}ms` }}>
                <div className="cat-card__img">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <div className="cat-card__overlay" />
                </div>
                <div className="cat-card__body">
                  <span className="cat-card__emoji">{cat.emoji}</span>
                  <h3 className="cat-card__name">{cat.name}</h3>
                  <p className="cat-card__desc">{cat.desc}</p>
                  <span className="cat-card__count">{cat.count} Properties</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ──────────────────────────── */}
      <section className="section section--mid home-featured" ref={featRef}>
        <div className="container">
          <div className={`home-section-header${featVis ? ' anim-fade-up' : ''}`}>
            <div>
              <span className="sec-tag">Hand-Picked</span>
              <h2 className="sec-title">Featured <span className="hi">Properties</span></h2>
            </div>
            <Link to="/properties?featured=true" className="btn btn-outline">See All →</Link>
          </div>
          <div className={`grid-3${featVis ? ' anim-fade-up d-2' : ''}`}>
            {featured.map((p, i) => (
              <PropertyCard key={p.id} property={p} style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ─────────────────────────────────── */}
      <section className="home-stats" ref={statRef}>
        <div className="home-stats__bg" />
        <div className="container">
          <div className={`home-stats__grid${statVis ? ' anim-fade-up' : ''}`}>
            {STATS.map((s, i) => (
              <div key={i} className="home-stat" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="home-stat__icon">{s.icon}</span>
                <span className="home-stat__val">{s.value}</span>
                <span className="home-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────── */}
      <section className="section home-why" ref={whyRef}>
        <div className="container home-why__inner">
          <div className={`home-why__img${whyVis ? ' anim-fade-left' : ''}`}>
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=720&q=85"
              alt="Our Team"
              loading="lazy"
            />
            <div className="home-why__badge">
              <span className="home-why__badge-num">12+</span>
              <span className="home-why__badge-txt">Years of<br />Excellence</span>
            </div>
            <div className="home-why__badge-2">
              <span>🏆</span> Award Winning 2024
            </div>
          </div>

          <div className={`home-why__content${whyVis ? ' anim-fade-right' : ''}`}>
            <span className="sec-tag">Why Choose Us</span>
            <h2 className="sec-title">Hyderabad's Most <span className="hi">Trusted</span> Real Estate Platform</h2>
            <p className="sec-sub" style={{ marginBottom: 32 }}>
              We combine deep local expertise with cutting-edge technology to make your property journey smooth, transparent, and rewarding.
            </p>

            <div className="home-why__features">
              {[
                { icon: '🔍', title: 'Verified Listings',  desc: 'Every property is physically verified by our team.' },
                { icon: '🤝', title: 'Zero Brokerage',     desc: 'Direct deals with developers — no hidden commissions.' },
                { icon: '📋', title: 'RERA Certified',     desc: 'All listed projects are RERA registered & compliant.' },
                { icon: '⚡', title: '2-Hour Response',    desc: 'Our agents respond to every enquiry within 2 hours.' },
              ].map((f, i) => (
                <div key={i} className="home-why__feature">
                  <div className="home-why__feat-icon">{f.icon}</div>
                  <div>
                    <div className="home-why__feat-title">{f.title}</div>
                    <div className="home-why__feat-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/properties" className="btn btn-gold" style={{ marginTop: 8 }}>
              Explore All Properties →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRENDING PROPERTIES ──────────────────────────── */}
      <section className="section section--mid home-trending" ref={trendRef}>
        <div className="container">
          <div className={`home-section-header${trendVis ? ' anim-fade-up' : ''}`}>
            <div>
              <span className="sec-tag">Latest Listings</span>
              <h2 className="sec-title">Trending <span className="hi">Properties</span></h2>
            </div>
            <Link to="/properties" className="btn btn-outline">View All →</Link>
          </div>

          <div className={`grid-3${trendVis ? ' anim-fade-up d-2' : ''}`}>
            {trending.map((p, i) => (
              <PropertyCard key={p.id} property={p} style={{ animationDelay: `${i * 60}ms` }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENTS ───────────────────────────────────────── */}
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
                <div className="agent-card__avatar" style={{
                  background: `linear-gradient(135deg, ${a.color}cc, ${a.color}55)`
                }}>
                  <span>{a.initials}</span>
                </div>
                <h3 className="agent-card__name">{a.name}</h3>
                <p className="agent-card__role">{a.role}</p>
                <div className="agent-card__stats">
                  <div className="agent-card__stat">
                    <b>{a.deals}</b><span>Deals</span>
                  </div>
                  <div className="agent-card__stat-sep" />
                  <div className="agent-card__stat">
                    <b>{a.exp}</b><span>Experience</span>
                  </div>
                </div>
                <a href="tel:18005006000" className="btn btn-outline btn-sm btn-full agent-card__cta">
                  Contact
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
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
                  <div className="testi-card__avatar" style={{
                    background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`
                  }}>
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

      {/* ── MARQUEE STRIP ────────────────────────────────── */}
      <div className="home-marquee" aria-hidden="true">
        <div className="home-marquee__track">
          {['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Kondapur', 'Hitec City', 'Narsingi', 'Begumpet',
            'Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Kondapur', 'Hitec City', 'Narsingi', 'Begumpet']
            .map((loc, i) => (
              <span key={i} className="home-marquee__item">
                ⬡ {loc}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}