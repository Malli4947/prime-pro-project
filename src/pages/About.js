import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { STATS, AGENTS } from '../data/Properties';
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
  { year: '2012', title: 'Founded',           desc: 'PrimePro launched in Hyderabad with a mission to simplify real estate for every Indian family.' },
  { year: '2015', title: 'RERA Registered',   desc: 'Became one of the first real estate portals in Telangana to achieve full RERA compliance.' },
  { year: '2018', title: 'Pan-South Expansion', desc: 'Scaled operations to 12 cities across Telangana, Andhra Pradesh, Karnataka and Tamil Nadu.' },
  { year: '2021', title: 'Award Winning',     desc: 'Recognised as "Best Real Estate Portal – South India" by PropTech India Awards.' },
  { year: '2023', title: 'Digital Innovation', desc: 'Launched AI-powered property matching and virtual site visit technology.' },
  { year: '2025', title: '1,200+ Properties', desc: 'Crossed 1,200 active verified listings and 850+ successful family settlements.' },
];

const VALUES = [
  { icon: '🔍', title: 'Transparency',    desc: 'Zero hidden charges, honest pricing, and fully verified listings on every property we showcase.' },
  { icon: '🤝', title: 'Trust',           desc: 'We build lasting relationships — 87% of our clients return or refer us to friends and family.' },
  { icon: '⚡', title: 'Speed',           desc: 'Our agents respond to every enquiry within 2 hours. Your time is as valuable as your investment.' },
  { icon: '📋', title: 'Compliance',      desc: 'Every project is RERA registered and legally vetted before it appears on our platform.' },
  { icon: '🏆', title: 'Excellence',      desc: 'Award-winning service backed by 12+ years of deep market expertise across South India.' },
  { icon: '💚', title: 'Community',       desc: 'We invest in the neighbourhoods we serve, partnering with local developers and civic bodies.' },
];

export default function About() {
  const [mounted, setMounted] = useState(false);
  const [heroRef,    heroVis]    = useReveal(0.1);
  const [storyRef,   storyVis]   = useReveal();
  const [valuesRef,  valuesVis]  = useReveal();
  const [timeRef,    timeVis]    = useReveal();
  const [teamRef,    teamVis]    = useReveal();
  const [statsRef,   statsVis]   = useReveal();
  const [ctaRef,     ctaVis]     = useReveal();

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
              For over 12 years, PrimePro has helped thousands of families and investors find their perfect property across South India — with zero hidden charges and complete transparency.
            </p>
            <div className="about-hero__actions">
              <Link to="/properties" className="btn btn-gold btn-lg">Browse Properties</Link>
              <a href="#contact" className="btn btn-outline-light btn-lg">Talk to Us</a>
            </div>
          </div>
        </div>
        {/* floating stat chips */}
        <div className="about-hero__chips">
          <div className="about-hero__chip anim-fade-up d-3">🏆 Award Winning 2024</div>
          <div className="about-hero__chip anim-fade-up d-4">✓ RERA Compliant</div>
          <div className="about-hero__chip anim-fade-up d-5">⭐ 4.9 Rating</div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────── */}
      <section className="about-stats" ref={statsRef}>
        <div className="about-stats__bg" />
        <div className="container">
          <div className={`about-stats__grid${statsVis ? ' anim-fade-up' : ''}`}>
            {STATS.map((s, i) => (
              <div key={i} className="about-stat" style={{ animationDelay: `${i * 80}ms` }}>
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
              alt="PrimePro Office"
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
              Hyderabad's Most <span className="hi">Trusted</span><br />Real Estate Platform
            </h2>
            <p className="sec-sub" style={{ marginBottom: 20 }}>
              PrimePro was founded in 2012 with a simple belief — buying or renting a home should be an exciting, not stressful, experience. We set out to build a platform that combines deep local knowledge with cutting-edge technology.
            </p>
            <p className="about-story__text">
              Today, we are South India's fastest-growing property platform with over 50 expert agents, 1,200+ verified listings, and a track record of 850+ successful transactions. We cover residential, commercial, and agricultural properties across 12 cities.
            </p>
            <div className="about-story__pills">
              <span className="about-story__pill">✓ ISO Certified</span>
              <span className="about-story__pill">✓ RERA Registered</span>
              <span className="about-story__pill">✓ Zero Brokerage</span>
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
            <h2 className="sec-title">Our Core <span className="hi">Values</span></h2>
            <p className="sec-sub">
              Everything we do is guided by six principles that put our clients first, always.
            </p>
          </div>
          <div className={`about-values__grid${valuesVis ? ' anim-fade-up d-2' : ''}`}>
            {VALUES.map((v, i) => (
              <div key={i} className="value-card" style={{ animationDelay: `${i * 70}ms` }}>
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
                style={{ animationDelay: `${i * 100}ms` }}>
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
              Dedicated professionals with years of on-ground experience across Hyderabad's prime localities.
            </p>
          </div>
          <div className={`about-team__grid${teamVis ? ' anim-fade-up d-2' : ''}`}>
            {AGENTS.map((a, i) => (
              <div key={a.id} className="team-card" style={{ animationDelay: `${i * 90}ms` }}>
                <div className="team-card__avatar" style={{
                  background: `linear-gradient(135deg, ${a.color}dd, ${a.color}66)`
                }}>
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
                  <a href="tel:18005006000" className="team-card__social">📞</a>
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
              { icon:'🔍', label:'Verified Listings',   val:'100%', sub:'physically inspected' },
              { icon:'⚡', label:'Response Time',        val:'< 2hr', sub:'guaranteed' },
              { icon:'💰', label:'Zero Hidden Charges',  val:'₹0',   sub:'brokerage fee' },
              { icon:'📋', label:'RERA Projects',        val:'100%',  sub:'compliant & legal' },
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

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="about-cta section section--dark" ref={ctaRef}>
        <div className="container">
          <div className={`about-cta__inner${ctaVis ? ' anim-fade-up' : ''}`}>
            <h2 className="about-cta__title">
              Ready to Start Your<br /><span className="hi">Property Journey?</span>
            </h2>
            <p className="about-cta__sub">
              Explore 1,200+ verified properties or talk to an expert for personalised guidance.
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