import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AnimatedBackground from '../components/AnimatedBackground';
import LeadershipSection from '../components/LeadershipSection';
import './About.css';

function useReveal(threshold = 0.10) {
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
  { year: '2024', title: 'Founded — Our Journey Begins',   desc: 'PrimePro Project\'s was established in Hyderabad with a clear mission — to make real estate transparent, trustworthy, and accessible for every family and investor in Telangana.' },
  { year: '2024', title: 'First Verified Listings',         desc: 'Launched our first set of HMDA & DTCP approved listings across Madhapur, Kavuri Hills, and Gachibowli — covering Villas, Apartments, and Open Plots.' },
  { year: '2024', title: 'Growing Network',                 desc: 'Expanded our developer and channel partner network across Hyderabad\'s prime localities. Closed our first successful property deals with happy families.' },
  { year: '2025', title: 'Farmland & NRI Desk',             desc: 'Launched Concept-Based Farmland Projects and a dedicated NRI investment advisory desk — helping non-resident Indians invest with full transparency and legal clarity.' },
  { year: '2025', title: 'Scaling New Heights',             desc: 'Reached new milestones with 200+ verified listings, 100+ happy clients, and a strong presence across Hyderabad\'s fastest-growing real estate corridors.' },
  { year: '2025', title: 'Award Winning Recognition',       desc: 'Recognised as one of Hyderabad\'s most trusted real estate platforms — with verified listings, a dedicated NRI desk, and a channel partner network spanning the entire city.' },
  { year: '2026', title: 'Expanding Horizons',              desc: 'Scaling operations beyond Hyderabad into emerging Telangana corridors — bringing new luxury villa projects, commercial spaces, and farmland investments to a wider audience.' },
  { year: '2026', title: 'Technology & Innovation',         desc: 'Launched an enhanced digital platform with AI-powered property recommendations, virtual site tours, and real-time RERA verification — making property discovery faster and smarter.' },
  { year: '2026', title: 'Stronger. Bigger. Trusted.',      desc: 'With 200+ listings, 100+ happy clients, and a presence across 5 major cities, PrimePro Project\'s continues to set new benchmarks in Hyderabad\'s real estate market.' },
];

const VALUES = [
  { icon: '🔍', title: 'Transparency',   desc: 'Zero hidden charges, honest pricing, and fully verified RERA-compliant listings. What you see is exactly what you get.' },
  { icon: '🤝', title: 'Trust',          desc: 'We build lasting relationships — 87% of our clients return or refer us to friends and family within a year.' },
  { icon: '⚡', title: 'Speed',          desc: 'Every enquiry receives a response within 2 hours during business hours. Your time and investment both matter to us.' },
  { icon: '📋', title: 'Legal Clarity',  desc: 'Every project is RERA registered, HMDA or DTCP approved, and legally vetted before it appears on our platform.' },
  { icon: '🏆', title: 'Excellence',     desc: 'Award-winning service backed by deep on-ground expertise across Hyderabad and Telangana\'s fastest-growing real estate corridors — recognised since our founding in 2024.' },
  { icon: '💚', title: 'Community',      desc: 'We invest in the localities we serve — partnering with local developers, civic bodies, and community initiatives across Hyderabad.' },
];

const STATS = [
  { icon: '🏘️', value: '200+',  label: 'Properties Listed'  },
  { icon: '🤝', value: '100+',   label: 'Happy Families'      },
  { icon: '🏙️', value: '5',     label: 'Major Cities'        },
  { icon: '⭐', value: '4.9/5', label: 'Customer Rating'     },
];

const AGENTS = [
  {
    id: 1,
    name: 'Prashanth Reddy',
    role: 'Senior Property Advisor',
    deals: '130',
    exp: '5 Yrs',
    initials: 'PR',
    color: '#1A2B4A',
    phone: '6304839287',
  },
  {
    id: 2,
    name: 'K Surya prakash',
    role: 'Senior Property Advisor',
    deals: '100',
    exp: '4 Yrs',
    initials: 'VC',
    color: '#C9A84C',
    phone: '9866475511',
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

/* ── What makes us different ───────────────────────────────── */
const DIFFERENTIATORS = [
  {
    icon: '🏠',
    title: 'Villas & High-Rise Apartments',
    desc: 'Exclusive access to luxury villas, premium high-rise apartments, and gated communities across Hyderabad\'s most sought-after localities.',
  },
  {
    icon: '📐',
    title: 'HMDA & DTCP Approved Layouts',
    desc: 'All open plot and layout projects are government-approved with full HMDA & DTCP compliance — zero legal risk for your investment.',
  },
  {
    icon: '🌿',
    title: 'Concept-Based Farmland Projects',
    desc: 'Unique farmland investment opportunities combining eco-living with strong ROI potential, ideal for both NRIs and end-users.',
  },
  {
    icon: '🛡️',
    title: 'Transparent Dealings',
    desc: 'We believe in complete transparency at every step — from pricing to documentation. No hidden charges, no surprises.',
  },
];

export default function About() {
  const [mounted, setMounted] = useState(false);
  const [storyRef,   storyVis]  = useReveal(0.08);
  const [valuesRef,  valuesVis] = useReveal(0.08);
  const [timeRef,    timeVis]   = useReveal(0.08);
  const [teamRef,    teamVis]   = useReveal(0.08);
  const [statsRef,   statsVis]  = useReveal(0.08);
  const [ctaRef,     ctaVis]    = useReveal(0.08);
  const [diffRef,    diffVis]   = useReveal(0.08);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  return (
    <div className="about-page" id="about">
      <Helmet>
        <title>About Us — Prime Pro Projects | Hyderabad Real Estate</title>
        <meta name="description" content="Learn about Prime Pro Projects — Hyderabad's trusted real estate platform since 2024. 200+ verified listings, RERA-compliant, zero brokerage. Meet our expert team." />
        <link rel="canonical" href="https://www.primeproprojects.in/about" />
        <meta property="og:title" content="About Prime Pro Projects — Hyderabad Real Estate" />
        <meta property="og:description" content="Hyderabad's trusted real estate platform. 200+ RERA-verified properties, expert team, zero brokerage." />
        <meta property="og:url" content="https://www.primeproprojects.in/about" />
      </Helmet>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="about-hero">
        <AnimatedBackground variant="dark" density={1} showGrid showOrbs showLines />
        <div className="about-hero__bg" />
        <div className="about-hero__pattern" />
        <div className="container about-hero__content">
          <div className={mounted ? 'anim-fade-up' : ''}>
            <span className="sec-tag">Our Story</span>
            <h1 className="about-hero__title">
              Build Your Dream with{' '}
              <span className="hi">PrimePro Project's</span>
            </h1>
            <p className="about-hero__sub">
              A trusted name in Hyderabad's real estate market — established in 2024 and delivering quality projects, transparent dealings, and value-driven investment opportunities across Villas, Apartments, HMDA & DTCP Approved Layouts, and Concept-Based Farmland Projects.
            </p>
            <div className="about-hero__actions">
              <Link to="/properties" className="btn btn-gold btn-lg">Browse Properties</Link>
              <Link to="/contact" className="btn btn-outline-light btn-lg">Talk to Us</Link>
            </div>
          </div>
        </div>
        <div className="about-hero__chips">
          <div className="about-hero__chip anim-fade-up d-3">🏆 Est. 2024 · Award Winning</div>
          <div className="about-hero__chip anim-fade-up d-4">✓ RERA &amp; HMDA Approved</div>
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
              src="/Founder.jpeg"
              alt="Our Office"
              loading="lazy"
            />
            <div className="about-story__img-badge">
              <span className="about-story__badge-num">5+</span>
              <span className="about-story__badge-txt">Years of<br />Excellence</span>
            </div>
          </div>
          <div className={`about-story__content${storyVis ? ' anim-fade-right' : ''}`}>
            <span className="sec-tag">Who We Are</span>
            <h2 className="sec-title">
              Build Your Dream with<br />
              <span className="hi">PrimePro Project's</span>
            </h2>
            <p className="sec-sub" style={{ marginBottom:18 }}>
              PrimePro Project's is a trusted name in Hyderabad's real estate market, established in 2024 and delivering quality projects and trusted investment opportunities. Our expertise spans across Villas, High-Rise Apartments, HMDA &amp; DTCP Approved Layouts, and Concept-Based Farmland Projects.
            </p>
            <p className="about-story__text">
              We take pride in offering transparent dealings, timely delivery, and customer-centric solutions that cater to both investors and end-users. With a deep understanding of the local market and a strong network of developers and channel partners, PrimePro Project's continues to create value-driven real estate experiences across Hyderabad and surrounding regions.
            </p>
            <p className="about-story__text" style={{ marginTop: 14 }}>
              At PrimePro Project's, we don't just sell properties — we help you invest in growth, lifestyle, and long-term value.
            </p>

            {/* Vision & Mission */}
            <div style={{ display:'flex', flexDirection:'column', gap:16, margin:'24px 0' }}>
              <div style={{ background:'#f8f4ea', borderRadius:12, padding:'16px 20px', borderLeft:'4px solid #C9A84C' }}>
                <div style={{ fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', color:'#C9A84C', marginBottom:6 }}>Our Vision</div>
                <p style={{ fontSize:14, color:'#1A2B4A', lineHeight:1.7, margin:0 }}>
                  To craft exceptional residential and commercial communities that elevate living standards, blend comfort with sustainability, and foster vibrant neighbourhoods — empowering homeowners to experience joy and pride in their property across Hyderabad.
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
              <span className="about-story__pill">✓ HMDA &amp; DTCP Approved</span>
              <span className="about-story__pill">✓ Zero Brokerage</span>
              <span className="about-story__pill">✓ NRI Desk</span>
              <span className="about-story__pill">✓ Verified Listings</span>
              <span className="about-story__pill">✓ Est. 2024 · Award Winning</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES US DIFFERENT ──────────────────────── */}
      <section className="section section--mid" ref={diffRef}>
        <div className="container">
          <div className={`about-values__header${diffVis ? ' anim-fade-up' : ''}`}>
            <span className="sec-tag">Our Expertise</span>
            <h2 className="sec-title">What We <span className="hi">Specialise In</span></h2>
            <p className="sec-sub">
              On-ground expertise across Hyderabad's real estate market since 2024 has given us unique insight and access to the best projects for every type of buyer.
            </p>
          </div>
          <div className={`about-values__grid${diffVis ? ' anim-fade-up d-2' : ''}`}>
            {DIFFERENTIATORS.map((d, i) => (
              <div key={i} className="value-card" style={{ animationDelay:`${i * 70}ms` }}>
                <div className="value-card__icon">{d.icon}</div>
                <h3 className="value-card__title">{d.title}</h3>
                <p className="value-card__desc">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ────────────────────────────────────── */}
      <section className="section about-values" ref={valuesRef}>
        <div className="container">
          <div className={`about-values__header${valuesVis ? ' anim-fade-up' : ''}`}>
            <span className="sec-tag">What Drives Us</span>
            <h2 className="sec-title">Excellence &amp; <span className="hi">Quality Workflow</span></h2>
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
            <h2 className="sec-title">5+ Years of <span className="hi">Excellence</span></h2>
            <p className="sec-sub" style={{ margin:'0 auto', textAlign:'center' }}>
              Over 5 years of building trust, delivering quality, and creating real value — every milestone has been driven by our commitment to transparent and rewarding real estate experiences in Hyderabad.
            </p>
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

          {/* ── 5+ Years bottom summary ── */}
          <div className={`about-timeline__summary${timeVis ? ' anim-fade-up' : ''}`} style={{ animationDelay:'900ms' }}>
            <div className="about-timeline__summary-badge">5+</div>
            <div className="about-timeline__summary-body">
              <h3 className="about-timeline__summary-title">Years of Excellence &amp; Counting</h3>
              <p className="about-timeline__summary-desc">
                From our first verified listing to 200+ properties across 5 major cities — PrimePro Project's has spent 5+ years earning the trust of families, investors, and NRIs across Hyderabad and Telangana. The journey continues.
              </p>
              <div className="about-timeline__summary-pills">
                <span>✓ 200+ Properties</span>
                <span>✓ 100+ Happy Clients</span>
                <span>✓ 5 Major Cities</span>
                <span>✓ 4.9 ★ Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LeadershipSection variant="light" />

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
                <a href={`tel:${a.phone}`} className="team-card__phone">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {a.phone}
                </a>
                <div className="team-card__socials">
                  <a href={`tel:${a.phone}`} className="team-card__social" title="Call">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </a>
                  <a href={`https://wa.me/91${a.phone}`} target="_blank" rel="noopener noreferrer" className="team-card__social" title="WhatsApp">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                  <a href="mailto:primeproprojects@gmail.com" className="team-card__social" title="Email">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </a>
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
      <section className="section section--dark about-testi-section">
        <div className="container">
          <div className="home-section-header home-section-header--center" style={{ marginBottom:36 }}>
            <span className="sec-tag">Client Stories</span>
            <h2 className="sec-title sec-title--light">What Our <span className="hi">Clients Say</span></h2>
          </div>
          <div className="home-testi__grid">
            {[
              { name:'Rajesh Kumar',  role:'Home Buyer',     city:'Kondapur, Hyderabad',    rating:5, initials:'RK', color:'#C9A84C',
                text:"We bought our family plot through PrimePro Projects and it was honestly the smoothest property purchase we've ever made. The location was carefully shortlisted to match our budget, every document was verified upfront, and the team walked us through each step with patience. No pressure, no hidden charges — just clear, professional guidance from start to handover." },
              { name:'Priya Reddy',   role:'NRI Investor',   city:'Dubai → Hyderabad', rating:5, initials:'PR', color:'#1A2B4A',
                text:"As an NRI, investing back home felt risky until I connected with PrimePro Projects. They handled the site shortlisting, legal verification, registration and even post-purchase follow-ups completely remotely. Regular video walkthroughs, instant WhatsApp replies and 100% transparent paperwork — exactly the kind of trust an overseas investor needs." },
              { name:'Anil Mehta',    role:'Villa Owner',    city:'Kollur, Hyderabad',  rating:5, initials:'AM', color:'#3b82f6',
                text:"I purchased my villa through PrimePro Projects and the experience exceeded every expectation. Their advice was unbiased, the project information was detailed and transparent, and the team's responsiveness during site visits, negotiation and registration was exceptional. If you want a trustworthy real estate partner in Hyderabad, this is the team to call." },
            ].map((t, i) => (
              <div key={i} className="testi-card" style={{ animationDelay:`${i * 100}ms` }}>
                <div className="testi-card__quote">"</div>
                <div className="testi-card__stars">{'⭐'.repeat(t.rating)}</div>
                <p className="testi-card__text about-testi-text">{t.text}</p>
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
              Explore verified properties — Villas, Apartments, Open Plots, and Farmland — or talk to an expert for personalised guidance. Zero brokerage. Full transparency. Est. 2024 · Award Winning.
            </p>
            <div className="about-cta__contact-row">
              <a href="tel:9866212211" className="about-cta__contact-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                9866212211
              </a>
              <a href="tel:9866475511" className="about-cta__contact-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                9866475511
              </a>
              <a href="mailto:primeproprojects@gmail.com" className="about-cta__contact-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                primeproprojects@gmail.com
              </a>
              <span className="about-cta__contact-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Divya Diamonds, Hi Tech city, 3-225, Kavuri Hills Rd, CBI Colony, Madhapur, Hyderabad, Telangana 500033
              </span>
            </div>
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
