import { Link } from 'react-router-dom';
import './Portfolio.css';

/* ── Social SVG icons (matches Footer styling) ──────────────── */
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);

/* ── Founder profile — narrative aligned with About Us ──────── */
const FOUNDER = {
  firstName: 'Prashanth',
  lastName:  'Reddy',
  role:      "Founder & CEO · PrimePro Project's",
  location:  'Madhapur, Hyderabad',
  tagline:   "Build your dream with PrimePro Project's — transparent, trusted, value-driven.",
  blurb:     "I founded PrimePro Project's in 2024 with one clear mission — to make real estate transparent, trustworthy, and accessible for every family and investor in Telangana. We specialise in Villas, High-Rise Apartments, HMDA & DTCP approved layouts and concept-based farmland projects. We don't just sell properties — we help you invest in growth, lifestyle and long-term value.",
  phone:     '+91 63048 29287',
  email:     'primeproprojects@gmail.com',
  experience:'5',
  socials: [
    { label: 'Facebook',  Icon: FacebookIcon,  href: 'https://www.facebook.com/share/1b2ZzeYLep/?mibextid=wwXIfr',                                              color: '#1877F2' },
    { label: 'Instagram', Icon: InstagramIcon, href: 'https://www.instagram.com/primepro_projects?igsh=MThzdGtxeTY1MW83cQ%3D%3D&utm_source=qr',                 color: '#E1306C' },
    { label: 'Twitter',   Icon: TwitterIcon,   href: 'https://x.com/primeproproject?s=21',                                                                       color: '#000000' },
    { label: 'LinkedIn',  Icon: LinkedInIcon,  href: 'https://www.linkedin.com/in/prime-pro-projects-00b21640a?utm_source=share_via&utm_content=profile&utm_medium=member_ios', color: '#0A66C2' },
    { label: 'WhatsApp',  Icon: WhatsAppIcon,  href: 'https://whatsapp.com/channel/0029VbCPUUhKWEL0Emt89D2r',                                                    color: '#25D366' },
    { label: 'YouTube',   Icon: YouTubeIcon,   href: 'https://youtube.com/@prasanth_reddy3?si=hWS69-H45xioU-RQ',                                                 color: '#FF0000' },
  ],
};

/* ── Key numbers (same source as About / Home) ──────────────── */
const STATS = [
  { num: '200+', label: 'Properties Listed' },
  { num: '35+',  label: 'Happy Families'    },
  { num: '5',    label: 'Major Cities'      },
  { num: '4.9★', label: 'Customer Rating'   },
];

/* ── Vision & Mission — pulled from About page ──────────────── */
const VISION = "To craft exceptional residential and commercial communities that elevate living standards, blend comfort with sustainability, and foster vibrant neighbourhoods — empowering homeowners to experience joy and pride in their property across Hyderabad.";
const MISSION = "To be a trusted leader in real estate, setting benchmarks in quality, innovation and transparency — creating vibrant communities, empowering homeowners and building future-ready spaces that enhance lifestyles in every locality we serve.";

/* ── What I specialise in — mirrors About differentiators ───── */
const EXPERTISE = [
  {
    icon: '🏠',
    title: 'Villas & High-Rise Apartments',
    desc:  "Exclusive access to luxury villas, premium high-rise apartments and gated communities across Hyderabad's most sought-after localities.",
  },
  {
    icon: '📐',
    title: 'HMDA & DTCP Approved Layouts',
    desc:  'All open plot and layout projects are government-approved with full HMDA & DTCP compliance — zero legal risk for your investment.',
  },
  {
    icon: '🌿',
    title: 'Concept-Based Farmland',
    desc:  'Unique farmland investment opportunities combining eco-living with strong ROI potential — ideal for both NRIs and end-users.',
  },
  {
    icon: '🌏',
    title: 'NRI Investment Desk',
    desc:  'A dedicated NRI desk with FEMA-compliant solutions, power-of-attorney handling and remote site visits — invest from anywhere in the world.',
  },
  {
    icon: '🏢',
    title: 'Commercial Spaces',
    desc:  "Retail outlets, office floors and pre-leased commercial assets across Hyderabad's IT corridors — built for stable rental yields.",
  },
  {
    icon: '🛡️',
    title: 'Transparent Dealings',
    desc:  'Complete transparency at every step — from pricing to documentation. No hidden charges, no surprises, ever.',
  },
];

/* ── Values that drive me — mirrors About VALUES ────────────── */
const CREDENTIALS = [
  { icon: '🔍', title: 'Transparency',   desc: 'Zero hidden charges, honest pricing and fully verified RERA-compliant listings. What you see is what you get.' },
  { icon: '🤝', title: 'Trust',          desc: '87% of our clients return or refer a friend within a year. Relationships matter more than transactions.' },
  { icon: '⚡', title: 'Speed',          desc: 'Every enquiry receives a response within 2 hours during business hours. Your time matters.' },
  { icon: '📋', title: 'Legal Clarity',  desc: 'Every project is RERA registered, HMDA or DTCP approved and legally vetted before it reaches you.' },
  { icon: '🏆', title: 'Excellence',     desc: "Award-winning service backed by deep on-ground expertise across Hyderabad and Telangana's growth corridors." },
  { icon: '💚', title: 'Community',      desc: 'We invest in the localities we serve — partnering with local developers, civic bodies and community initiatives.' },
];

/* ── Founder journey — condensed from About timeline ────────── */
const JOURNEY = [
  { year: '2024', title: 'PrimePro Project\'s is Founded',     desc: 'Launched in Hyderabad with a clear mission — to make real estate transparent, trustworthy and accessible for every family and investor in Telangana.' },
  { year: '2024', title: 'First Verified Listings',            desc: 'Released our first HMDA & DTCP approved listings across Madhapur, Kavuri Hills and Gachibowli — covering villas, apartments and open plots.' },
  { year: '2025', title: 'Farmland & NRI Desk Launched',       desc: 'Introduced concept-based farmland projects and a dedicated NRI investment advisory desk — helping non-resident Indians invest with complete transparency.' },
  { year: '2025', title: 'Award-Winning Recognition',          desc: "Reached 200+ verified listings, 35+ happy clients and recognition as one of Hyderabad's most trusted real estate platforms." },
  { year: '2026', title: 'Scaling Across Telangana',           desc: 'Expanding into emerging corridors with AI-powered recommendations, virtual site tours and real-time RERA verification — five cities and counting.' },
];

/* ── Trust badges shown in hero — mirrors About chips ───────── */
const TRUST_PILLS = [
  '🏆 Est. 2024 · Award Winning',
  '✓ RERA Registered',
  '✓ HMDA & DTCP Approved',
  '✓ Zero Brokerage',
  '✓ NRI Desk',
];

export default function Portfolio() {
  return (
    <div className="portfolio-page">
      <div className="portfolio-inner">

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="pf-hero">
          <div className="pf-hero__left">
            <span className="pf-hero__badge">
              <span className="pf-hero__badge-dot" />
              Available for new clients · Hyderabad
            </span>

            <h1 className="pf-name">
              <span>{FOUNDER.firstName}</span>
              <span>{FOUNDER.lastName}</span>
            </h1>

            <div className="pf-rolecard">
              <div className="pf-rolecard__kicker">{FOUNDER.role}</div>
              <h2 className="pf-rolecard__title">
                Based in {FOUNDER.location.split(',')[0]} —<br />
                a real estate advisor, not just a broker.
              </h2>
              <p className="pf-rolecard__desc">
                {FOUNDER.tagline} Verified listings, RERA &amp; HMDA compliance and
                honest advice — that's the promise to every family I work with.
              </p>
              <div className="pf-rolecard__contact">
                <p><span className="label">P :</span>{FOUNDER.phone}</p>
                <p><span className="label">E :</span>{FOUNDER.email}</p>
              </div>
            </div>

            <div className="pf-trust-pills">
              {TRUST_PILLS.map(t => (
                <span key={t} className="pf-trust-pill">{t}</span>
              ))}
            </div>

            <div className="pf-socials">
              {FOUNDER.socials.map(({ label, Icon, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="pf-social"
                  style={{ '--social-color': color }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="pf-hero__right">
            <div className="pf-portrait-wrap">
              <img
                src="/founder-portrait.png"
                alt={`${FOUNDER.firstName} ${FOUNDER.lastName}`}
                className="pf-portrait"
              />
            </div>
            <div className="pf-shape-tri" />
            <div className="pf-shape-dot" />
          </div>
        </section>

        {/* ── STATS STRIP ──────────────────────────────── */}
        <section className="pf-stats">
          {STATS.map(s => (
            <div key={s.label} className="pf-stat">
              <div className="pf-stat__num">{s.num}</div>
              <div className="pf-stat__label">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── DETAIL: About + Query ────────────────────── */}
        <section className="pf-detail">
          <div className="pf-about">
            <div className="pf-kicker">About Me</div>
            <p className="pf-about__quote">
              We don't just sell properties —<br />
              we help you invest in growth,<br />
              lifestyle &amp; long-term value.
            </p>
            <p className="pf-about__body">
              {FOUNDER.blurb}
            </p>
            <div className="pf-exp">
              <span className="pf-exp__num">{FOUNDER.experience}+</span>
              <span className="pf-exp__label">
                <span>Years Of</span>
                <span>Excellence</span>
              </span>
            </div>
          </div>

          <div className="pf-query">
            <h2 className="pf-query__title">
              Any Type Of Query<br />&amp; Discussion.
            </h2>
            <p className="pf-query__lead">Let's talk with me</p>
            <a href={`mailto:${FOUNDER.email}`} className="pf-query__link">
              {FOUNDER.email}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <div className="pf-query__contacts">
              <a href={`tel:${FOUNDER.phone.replace(/\s+/g, '')}`} className="pf-query__chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {FOUNDER.phone}
              </a>
              <a
                href="https://wa.me/916304829287?text=Hi%20Prashanth%2C%20I%27d%20like%20to%20discuss%20a%20property%20requirement."
                target="_blank" rel="noopener noreferrer"
                className="pf-query__chip pf-query__chip--whatsapp"
              >
                <WhatsAppIcon />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── EXPERTISE — what I help you with ─────────── */}
        <section className="pf-expertise">
          <div className="pf-section-head">
            <div className="pf-kicker">What I Specialise In</div>
            <h2 className="pf-section-title">
              Six focus areas, <span className="pf-hi">one promise</span> — verified deals only.
            </h2>
            <p className="pf-section-sub">
              From villas and high-rises to HMDA &amp; DTCP layouts, farmland and
              NRI investments — on-ground expertise across Hyderabad's real estate
              market since 2024.
            </p>
          </div>

          <div className="pf-exp-grid">
            {EXPERTISE.map(e => (
              <article key={e.title} className="pf-exp-card">
                <div className="pf-exp-card__icon" aria-hidden="true">{e.icon}</div>
                <h3 className="pf-exp-card__title">{e.title}</h3>
                <p className="pf-exp-card__desc">{e.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── VISION & MISSION — editorial cards ───────── */}
        <section className="pf-vm">
          <div className="pf-section-head">
            <div className="pf-kicker">What We Stand For</div>
            <h2 className="pf-section-title">
              The <span className="pf-hi">vision</span> behind every deal.
            </h2>
          </div>
          <div className="pf-vm-grid">
            <article className="pf-vm-card pf-vm-card--vision">
              <div className="pf-vm-card__num">01</div>
              <div className="pf-vm-card__label">Our Vision</div>
              <p className="pf-vm-card__text">{VISION}</p>
            </article>
            <article className="pf-vm-card pf-vm-card--mission">
              <div className="pf-vm-card__num">02</div>
              <div className="pf-vm-card__label">Our Mission</div>
              <p className="pf-vm-card__text">{MISSION}</p>
            </article>
          </div>
        </section>

        {/* ── CREDENTIALS — values that drive me ───────── */}
        <section className="pf-creds">
          <div className="pf-section-head">
            <div className="pf-kicker">What Drives Me</div>
            <h2 className="pf-section-title">
              Six values, <span className="pf-hi">never compromised</span>.
            </h2>
            <p className="pf-section-sub">
              These principles shape every conversation, every site visit and every
              registration — the same standards I'd want for my own family.
            </p>
          </div>

          <div className="pf-cred-grid">
            {CREDENTIALS.map(c => (
              <div key={c.title} className="pf-cred">
                <div className="pf-cred__check">{c.icon}</div>
                <div>
                  <div className="pf-cred__title">{c.title}</div>
                  <div className="pf-cred__desc">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── JOURNEY TIMELINE ─────────────────────────── */}
        <section className="pf-journey">
          <div className="pf-section-head">
            <div className="pf-kicker">My Journey</div>
            <h2 className="pf-section-title">
              From first deal to <span className="pf-hi">trusted platform</span>.
            </h2>
          </div>

          <ol className="pf-timeline">
            {JOURNEY.map(j => (
              <li key={j.year} className="pf-tl-item">
                <span className="pf-tl-year">{j.year}</span>
                <div className="pf-tl-body">
                  <h4 className="pf-tl-title">{j.title}</h4>
                  <p className="pf-tl-desc">{j.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── OFFICE / BIO ─────────────────────────────── */}
        <section className="pf-office">
          <div className="pf-office__img">
            <img src="/founder-office.png" alt="At the PrimePro Project's office" />
          </div>
          <div className="pf-office__body">
            <div className="pf-kicker">Inside the Office</div>
            <h3>A trusted name in Hyderabad's real estate market — built on relationships, not commissions.</h3>
            <p>
              PrimePro Project's is a trusted name in Hyderabad's real estate market,
              established in 2024 and delivering quality projects and value-driven
              investment opportunities across villas, high-rise apartments, HMDA &amp; DTCP
              approved layouts and concept-based farmland projects.
            </p>
            <p>
              We take pride in transparent dealings, timely delivery and customer-centric
              solutions for both investors and end-users. With deep local market knowledge
              and a strong developer + channel partner network, we continue to create
              value-driven experiences across Hyderabad and surrounding regions.
            </p>
            <Link to="/contact" className="btn btn-gold" style={{ marginTop: 12 }}>
              Get in Touch →
            </Link>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────── */}
        <section className="pf-cta">
          <div className="pf-cta__inner">
            <h2 className="pf-cta__title">Ready to start your property journey?</h2>
            <p className="pf-cta__sub">
              Browse 200+ verified properties — villas, apartments, open plots and farmland —
              or talk to me directly for personalised guidance. Zero brokerage. Full transparency.
            </p>
            <div className="pf-cta__actions">
              <Link to="/properties" className="btn btn-gold">Browse Properties →</Link>
              <a href={`tel:${FOUNDER.phone.replace(/\s+/g, '')}`} className="btn btn-outline-light">
                Call {FOUNDER.phone}
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
