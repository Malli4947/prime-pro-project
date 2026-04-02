import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const TIMELINE = [
  { year: '2012', title: 'Founded',              desc: 'Launched in Hyderabad with a singular mission — to make real estate transparent, trustworthy, and accessible for every Indian family.' },
  { year: '2015', title: 'RERA & HMDA Approved', desc: 'Became one of the first real estate portals in Telangana to achieve full RERA compliance with HMDA & DTCP approved listings.' },
  { year: '2018', title: 'Pan-South Expansion',  desc: 'Scaled operations across 12 cities in Telangana, Andhra Pradesh, Karnataka and Tamil Nadu with 200+ verified projects.' },
  { year: '2021', title: 'Award Winning',         desc: 'Recognised as "Best Real Estate Portal – South India" for excellence in transparency, customer satisfaction and digital innovation.' },
  { year: '2023', title: 'NRI Investment Desk',   desc: 'Launched a dedicated NRI investment division providing end-to-end FEMA compliant solutions for non-resident property buyers.' },
  { year: '2025', title: '2,400+ Properties',    desc: 'Crossed 2,400 active verified listings and 1,800+ successful family settlements across Hyderabad\'s prime localities.' },
];

const VALUES = [
  { icon: '🔍', title: 'Transparency',   desc: 'Zero hidden charges, honest pricing, and fully verified RERA-compliant listings. What you see is exactly what you get.' },
  { icon: '🤝', title: 'Trust',          desc: 'We build lasting relationships — 87% of our clients return or refer us to friends and family within a year.' },
  { icon: '⚡', title: 'Speed',          desc: 'Every enquiry receives a response within 2 hours during business hours. Your time and investment both matter to us.' },
  { icon: '📋', title: 'Legal Clarity',  desc: 'Every project is RERA registered, HMDA or DTCP approved, and legally vetted before it appears on our platform.' },
  { icon: '🏆', title: 'Excellence',     desc: 'Award-winning service backed by 12+ years of deep on-ground expertise across South India\'s fastest-growing cities.' },
  { icon: '💚', title: 'Community',      desc: 'We invest in the localities we serve — partnering with local developers, civic bodies, and community initiatives across Hyderabad.' },
];

const STATS = [
  { icon: '🏘️', value: '2,400+', label: 'Properties Listed'  },
  { icon: '🤝', value: '1,800+', label: 'Happy Families'      },
  { icon: '🏙️', value: '48+',    label: 'Prime Localities'    },
  { icon: '⭐', value: '4.9/5',  label: 'Customer Rating'     },
];

const AGENTS = [
  { id:1, name:'Priya Reddy',   role:'Senior Property Advisor',  deals:'142', exp:'8 Yrs', initials:'PR', color:'#C9A84C' },
  { id:2, name:'Rahul Sharma',  role:'Commercial & Villa Specialist', deals:'98', exp:'6 Yrs', initials:'RS', color:'#1A2B4A' },
  { id:3, name:'Anita Verma',   role:'NRI Investment Desk',       deals:'76',  exp:'5 Yrs', initials:'AV', color:'#22c55e' },
];

export default function About() {
  const [mounted, setMounted] = useState(false);
  const [heroRef,    heroVis]   = useReveal(0.1);
  const [storyRef,   storyVis]  = useReveal();
  const [valuesRef,  valuesVis] = useReveal();
  const [timeRef,    timeVis]   = useReveal();
  const [teamRef,    teamVis]   = useReveal();
  const [statsRef,   statsVis]  = useReveal();
  const [ctaRef,     ctaVis]    = useReveal();

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  return (
    <div className="about-page" id="about">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="about-hero">
        <div className="about-hero__bg" />
        <div className="about-hero__pattern" />
        <div className="container about-hero__content">
          <div className={mounted ? 'anim-fade-up' : ''}>
            <span className="sec-tag">Our Story</span>
            <h1 className="about-hero__title">
              Built on <span className="hi">Trust.</span><br />
              Driven by <span className="hi">Excellence.</span>
            </h1>
            <p className="about-hero__sub">
              A trusted name in Hyderabad's real estate market — delivering quality projects, transparent dealings, and value-driven investment opportunities across Villas, Apartments, Open Plots, and Farmland for over 12 years.
            </p>
            <div className="about-hero__actions">
              <Link to="/properties" className="btn btn-gold btn-lg">Browse Properties</Link>
              <Link to="/contact" className="btn btn-outline-light btn-lg">Talk to Us</Link>
            </div>
          </div>
        </div>
        <div className="about-hero__chips">
          <div className="about-hero__chip anim-fade-up d-3">🏆 Award Winning 2024</div>
          <div className="about-hero__chip anim-fade-up d-4">✓ RERA & HMDA Approved</div>
          <div className="about-hero__chip anim-fade-up d-5">⭐ 4.9 / 5 Rating</div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────── */}
      <section className="about-stats" ref={statsRef}>
        <div className="about-stats__bg" />
        <div className="container">
          <div className={`about-stats__grid${statsVis ? ' anim-fade-up' : ''}`}>
            {STATS.map((s, i) => (
              <div key={i} className="about-stat" style={{ animationDelay:`${i * 80}ms` }}>
                <span className="about-stat__icon">{s.icon}</span>
                <span className="about-stat__val">{s.value}</span>
                <span className="about-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ─────────────────────────────────────── */}
      <section className="section about-story" ref={storyRef}>
        <div className="container about-story__inner">
          <div className={`about-story__img${storyVis ? ' anim-fade-left' : ''}`}>
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=720&q=85"
              alt="Our Office"
              loading="lazy"
            />
            <div className="about-story__img-badge">
              <span className="about-story__badge-num">12+</span>
              <span className="about-story__badge-txt">Years of<br />Excellence</span>
            </div>
          </div>
          <div className={`about-story__content${storyVis ? ' anim-fade-right' : ''}`}>
            <span className="sec-tag">Who We Are</span>
            <h2 className="sec-title">
              We Are a South India-Based Real Estate Platform<br />
              <span className="hi">Built on Trust, Vision & Value</span>
            </h2>
            <p className="sec-sub" style={{ marginBottom:18 }}>
              A trusted name in Hyderabad's real estate market, with over 12 years of experience delivering quality projects and trusted investment opportunities. Our expertise spans Villas, High-Rise Apartments, HMDA & DTCP Approved Layouts, Open Plots, and Concept-Based Farmland Projects.
            </p>
            <p className="about-story__text">
              We take pride in offering transparent dealings, timely delivery, and customer-centric solutions that cater to both investors and end-users. With a deep understanding of the local market and a strong network of developers and channel partners, we continue to create value-driven real estate experiences across Hyderabad and surrounding regions.
            </p>
            <p className="about-story__text">
              We don't just list properties — we help you invest in growth, lifestyle, and long-term value. Our NRI desk, legal advisory, and zero-brokerage model ensure your journey from search to settlement is smooth, transparent, and rewarding.
            </p>

            {/* Vision & Mission */}
            <div style={{ display:'flex', flexDirection:'column', gap:16, margin:'24px 0' }}>
              <div style={{ background:'#f8f4ea', borderRadius:12, padding:'16px 20px', borderLeft:'4px solid #C9A84C' }}>
                <div style={{ fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', color:'#C9A84C', marginBottom:6 }}>Our Vision</div>
                <p style={{ fontSize:14, color:'#1A2B4A', lineHeight:1.7, margin:0 }}>
                  To craft exceptional residential and commercial communities that elevate living standards, blend comfort with sustainability, and foster vibrant neighbourhoods — empowering homeowners to experience joy and pride in their property across South India.
                </p>
              </div>
              <div style={{ background:'#eff6ff', borderRadius:12, padding:'16px 20px', borderLeft:'4px solid #1A2B4A' }}>
                <div style={{ fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', color:'#1A2B4A', marginBottom:6 }}>Our Mission</div>
                <p style={{ fontSize:14, color:'#1A2B4A', lineHeight:1.7, margin:0 }}>
                  To be a trusted leader in real estate, setting benchmarks in quality, innovation, and transparency. We aim to create vibrant communities, empower homeowners, and build future-ready spaces that enhance lifestyles while driving progress in every locality we serve.
                </p>
              </div>
            </div>

            <div className="about-story__pills">
              <span className="about-story__pill">✓ RERA Registered</span>
              <span className="about-story__pill">✓ HMDA & DTCP Approved</span>
              <span className="about-story__pill">✓ Zero Brokerage</span>
              <span className="about-story__pill">✓ NRI Desk</span>
              <span className="about-story__pill">✓ Verified Listings</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ────────────────────────────────────── */}
      <section className="section section--mid about-values" ref={valuesRef}>
        <div className="container">
          <div className={`about-values__header${valuesVis ? ' anim-fade-up' : ''}`}>
            <span className="sec-tag">What Drives Us</span>
            <h2 className="sec-title">Excellence Skills & <span className="hi">Quality Workflow</span></h2>
            <p className="sec-sub">
              A leading real estate platform with a strong footprint across Telangana — committed to creating lasting value through high-quality living spaces and transparent, customer-focused practices.
            </p>
          </div>
          <div className={`about-values__grid${valuesVis ? ' anim-fade-up d-2' : ''}`}>
            {VALUES.map((v, i) => (
              <div key={i} className="value-card" style={{ animationDelay:`${i * 70}ms` }}>
                <div className="value-card__icon">{v.icon}</div>
                <h3 className="value-card__title">{v.title}</h3>
                <p className="value-card__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────── */}
      <section className="section about-timeline" ref={timeRef}>
        <div className="container">
          <div className={`about-timeline__header${timeVis ? ' anim-fade-up' : ''}`}>
            <span className="sec-tag">Our Journey</span>
            <h2 className="sec-title">Milestones That <span className="hi">Define Us</span></h2>
          </div>
          <div className="about-timeline__track">
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                className={`timeline-item${i % 2 === 0 ? ' timeline-item--left' : ' timeline-item--right'}${timeVis ? ' anim-fade-up' : ''}`}
                style={{ animationDelay:`${i * 100}ms` }}>
                <div className="timeline-item__card">
                  <div className="timeline-item__year">{item.year}</div>
                  <h3 className="timeline-item__title">{item.title}</h3>
                  <p className="timeline-item__desc">{item.desc}</p>
                </div>
                <div className="timeline-item__dot" />
              </div>
            ))}
            <div className="about-timeline__line" />
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────── */}
      <section className="section section--mid about-team" ref={teamRef}>
        <div className="container">
          <div className={`about-team__header${teamVis ? ' anim-fade-up' : ''}`}>
            <span className="sec-tag">The Experts</span>
            <h2 className="sec-title">Meet Our <span className="hi">Top Agents</span></h2>
            <p className="sec-sub">
              Dedicated professionals with years of on-ground experience across Hyderabad's prime localities — Kondapur, Gachibowli, Banjara Hills, Jubilee Hills, and beyond.
            </p>
          </div>
          <div className={`about-team__grid${teamVis ? ' anim-fade-up d-2' : ''}`}>
            {AGENTS.map((a, i) => (
              <div key={a.id} className="team-card" style={{ animationDelay:`${i * 90}ms` }}>
                <div className="team-card__avatar"
                  style={{ background:`linear-gradient(135deg, ${a.color}dd, ${a.color}66)` }}>
                  <span>{a.initials}</span>
                </div>
                <h3 className="team-card__name">{a.name}</h3>
                <p className="team-card__role">{a.role}</p>
                <div className="team-card__stats">
                  <div className="team-card__stat">
                    <b>{a.deals}</b><span>Deals Closed</span>
                  </div>
                  <div className="team-card__sep" />
                  <div className="team-card__stat">
                    <b>{a.exp}</b><span>Experience</span>
                  </div>
                </div>
                <div className="team-card__socials">
                  <a href="tel:9347870247" className="team-card__social">📞</a>
                  <a href="mailto:info@primepro.in" className="team-card__social">✉️</a>
                  <a href="#!" className="team-card__social">💼</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────── */}
      <section className="section about-why">
        <div className="container">
          <div className="about-why__grid">
            {[
              { icon:'🔍', label:'Verified Listings',     val:'100%', sub:'physically inspected'   },
              { icon:'⚡', label:'Response Guarantee',    val:'< 2hr', sub:'every enquiry'          },
              { icon:'💰', label:'Zero Hidden Charges',   val:'₹0',   sub:'brokerage fee'           },
              { icon:'📋', label:'RERA & HMDA Projects',  val:'100%',  sub:'compliant & legal'      },
            ].map((item, i) => (
              <div key={i} className="about-why__card">
                <div className="about-why__card-icon">{item.icon}</div>
                <div className="about-why__card-val">{item.val}</div>
                <div className="about-why__card-label">{item.label}</div>
                <div className="about-why__card-sub">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="section section--dark">
        <div className="container">
          <div className="home-section-header home-section-header--center" style={{ marginBottom:36 }}>
            <span className="sec-tag">Client Stories</span>
            <h2 className="sec-title sec-title--light">What Our <span className="hi">Clients Say</span></h2>
          </div>
          <div className="home-testi__grid">
            {[
              { name:'Rajesh Kumar',  role:'Home Buyer',     city:'Kondapur',    rating:5, initials:'RK', color:'#C9A84C',
                text:'"Buying a plot through this platform was one of the best decisions we made as a family. The location, documentation process, and customer service were all top-notch. Truly professional!"' },
              { name:'Priya Reddy',   role:'NRI Investor',   city:'Dubai → Hyd', rating:5, initials:'PR', color:'#1A2B4A',
                text:'"As an NRI, I was initially hesitant about investing in real estate back home. But the team made the entire process smooth and transparent. I received regular updates, and the team was always responsive."' },
              { name:'Anil Mehta',    role:'Villa Owner',    city:'Gachibowli',  rating:5, initials:'AM', color:'#3b82f6',
                text:'"We recently moved into our villa. The quality of construction and attention to detail exceeded our expectations. It\'s rare to find a platform that actually delivers on time and as promised!"' },
            ].map((t, i) => (
              <div key={i} className="testi-card" style={{ animationDelay:`${i * 100}ms` }}>
                <div className="testi-card__quote">"</div>
                <div className="testi-card__stars">{'⭐'.repeat(t.rating)}</div>
                <p className="testi-card__text">{t.text}</p>
                <div className="testi-card__author">
                  <div className="testi-card__avatar"
                    style={{ background:`linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>
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

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="about-cta section section--dark" ref={ctaRef}>
        <div className="container">
          <div className={`about-cta__inner${ctaVis ? ' anim-fade-up' : ''}`}>
            <h2 className="about-cta__title">
              Ready to Start Your<br /><span className="hi">Property Journey?</span>
            </h2>
            <p className="about-cta__sub">
              Explore 2,400+ verified properties — Villas, Apartments, Open Plots, and Farmland — or talk to an expert for personalised guidance. Zero brokerage. Full transparency.
            </p>
            <div className="about-cta__actions">
              <Link to="/properties" className="btn btn-gold btn-lg">Browse Properties →</Link>
              <Link to="/contact" className="btn btn-outline-light btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}