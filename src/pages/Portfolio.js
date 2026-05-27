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
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

/* ── Founder profile ───────────────────────────────────────── */
const FOUNDER = {
  firstName: 'Prashanth',
  lastName:  'Reddy',
  role:      "Founder & CEO · PrimePro Projects",
  location:  'Madhapur, Kavuri Hills Phase 1, Hyderabad, Telangana',
  tagline:   "I help families, NRIs and investors buy the right property in Hyderabad — verified, transparent and stress-free.",
  blurb:     "I founded PrimePro Projects in 2024 with one mission — to make real estate honest. Every project we list is RERA-verified, every document is checked by our legal desk, and every client receives the same advice I would give my own family. Whether it's your first home, a villa upgrade, a commercial asset or an NRI investment, I'm here to guide you end-to-end.",
  phone:     '+91 63048 29287',
  phoneRaw:  '916304829287',
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

const WA_TEXT = encodeURIComponent("Hi Prashanth, I'd like to discuss a property requirement.");
const WA_LINK = `https://wa.me/${FOUNDER.phoneRaw}?text=${WA_TEXT}`;
const CALL_LINK = `tel:${FOUNDER.phoneRaw.replace(/^91/, '')}`;

/* ── Key numbers ───────────────────────────────────────────── */
const STATS = [
  { num: '200+', label: 'Properties Listed' },
  { num: '35+',  label: 'Happy Families'    },
  { num: '5',    label: 'Major Cities'      },
  { num: '4.9★', label: 'Customer Rating'   },
];

const VISION  = "To craft exceptional residential and commercial communities that elevate living standards, blend comfort with sustainability and empower homeowners to feel proud of their property — across Hyderabad and beyond.";
const MISSION = "To set new benchmarks in transparency, quality and customer experience — building lifelong relationships through verified listings, honest advice and end-to-end execution that families can trust.";

/* ── What I help you with ──────────────────────────────────── */
const EXPERTISE = [
  { icon: '🏠', title: 'Villas & High-Rise Apartments', desc: "Premium 2/3/4 BHK apartments and gated villa communities across Kokapet, Gachibowli, Tellapur, Narsingi and Madhapur — hand-shortlisted for your lifestyle and budget." },
  { icon: '📐', title: 'HMDA & DTCP Open Plots',         desc: 'Only government-approved layouts with clean titles, RERA registration and demarcated boundaries — zero legal risk on your investment.' },
  { icon: '🌿', title: 'Concept Farmland',                desc: 'Curated farmland projects with strong appreciation belts around Shamshabad, Adibatla and Yadadri — perfect for end-use or long-term wealth.' },
  { icon: '🌏', title: 'NRI Investment Desk',             desc: 'FEMA-compliant guidance, remote site walkthroughs, PoA support and post-purchase property care — invest from anywhere in the world with confidence.' },
  { icon: '🏢', title: 'Commercial & Pre-Leased Assets',  desc: "Office floors, retail outlets and pre-leased deals in Hyderabad's IT corridors — built for stable 7–9% rental yields." },
  { icon: '🛡️', title: 'End-to-End Legal & Loans',        desc: 'Title verification, registration, home-loan tie-ups with top banks and post-purchase compliance — handled by my in-house desk, not outsourced.' },
];

/* ── My 4-step process ─────────────────────────────────────── */
const PROCESS = [
  { step: '01', title: 'Free Consultation',  desc: 'Tell me your budget, family size, locality preference and timeline. We talk on call, WhatsApp or in person — no pressure, no commitment.' },
  { step: '02', title: 'Curated Shortlist',  desc: 'Within 24 hours I share 3–5 verified options that match your brief — with full pricing, RERA status, builder reputation and resale potential.' },
  { step: '03', title: 'Escorted Site Visit', desc: 'I personally accompany you on site visits, negotiate the best price and explain every clause in the agreement before you sign.' },
  { step: '04', title: 'Paperwork & Handover', desc: 'My legal desk handles registration, stamp duty, loan disbursal and post-handover follow-ups — you only focus on moving in.' },
];

/* ── Recent wins / case-study snapshots ───────────────────── */
const WINS = [
  { tag: 'Luxury Villa',         price: '₹3.2 Cr', loc: 'Kollur, Hyderabad',      desc: '4 BHK gated villa closed in 18 days for an end-user family — ₹22 L below builder list price after negotiation.' },
  { tag: 'NRI Investment',       price: '4 Plots', loc: 'Adibatla & Tukkuguda',   desc: 'Handled an NRI client remotely from Dubai — site verification, registration and PoA execution completed in 3 weeks.' },
  { tag: 'Pre-Leased Commercial',price: '₹1.85 Cr',loc: 'Madhapur IT Corridor',   desc: 'Pre-leased office unit with a 9-year lock-in to a Fortune 500 tenant — delivering 8.4% gross rental yield to the investor.' },
];

/* ── Why work with me ─────────────────────────────────────── */
const WHY_ME = [
  { icon: '🔍', title: 'Transparent Pricing',      desc: 'Builder pricing shared upfront. Zero brokerage from buyers. No hidden charges, ever.' },
  { icon: '🤝', title: '87% Repeat & Referral',    desc: 'Most of my clients come from a previous client\'s recommendation — relationships > transactions.' },
  { icon: '⚡', title: '2-Hour Response SLA',       desc: 'Every enquiry receives a personal reply within 2 hours during business hours. Your time matters.' },
  { icon: '📋', title: 'In-House Legal Desk',      desc: 'Title checks, RERA verification, registration support — all under one roof, never outsourced.' },
  { icon: '🏆', title: 'Award-Winning in 2025',    desc: 'Recognised as one of Hyderabad\'s most trusted real-estate advisors — backed by 4.9★ client reviews.' },
  { icon: '💚', title: 'Honest Advice First',      desc: 'I\'ll tell you when not to buy too. My job is to protect your investment, not push inventory.' },
];

/* ── Founder journey ──────────────────────────────────────── */
const JOURNEY = [
  { year: '2024', title: 'PrimePro Projects Founded',  desc: "Launched in Hyderabad with one mission — make real estate transparent, trustworthy and accessible for every family in Telangana." },
  { year: '2024', title: 'First Verified Listings',     desc: 'Released our first HMDA & DTCP approved inventory across Madhapur, Kavuri Hills and Gachibowli — covering villas, apartments and plots.' },
  { year: '2025', title: 'NRI Desk & Farmland Launch',  desc: 'Opened a dedicated NRI advisory desk and concept-farmland vertical — helping global investors access Hyderabad with full FEMA compliance.' },
  { year: '2025', title: 'Award-Winning Recognition',   desc: 'Crossed 200+ verified listings, 35+ happy families and earned recognition as one of Hyderabad\'s most trusted real-estate platforms.' },
  { year: '2026', title: 'Scaling Across Telangana',    desc: 'Expanding into emerging corridors with AI-powered recommendations, virtual site tours and real-time RERA verification — five cities and counting.' },
];

/* ── Client testimonials ──────────────────────────────────── */
const TESTIMONIALS = [
  { name: 'Rajesh Kumar', city: 'Kondapur, Hyderabad',     initials: 'RK', color: '#C9A84C',
    text: "Prashanth walked us through every option, never pushed a project and waited patiently while we decided. Documentation was spotless and registration happened exactly on the promised date." },
  { name: 'Priya Reddy',  city: 'Dubai → Hyderabad',        initials: 'PR', color: '#1A2B4A',
    text: "Being an NRI, I needed someone I could trust 100%. Video site visits, instant WhatsApp updates, transparent paperwork — Prashanth and his team made remote buying feel effortless." },
  { name: 'Anil Mehta',   city: 'Kollur, Hyderabad',        initials: 'AM', color: '#3b82f6',
    text: "Bought my 4 BHK villa through PrimePro Projects. Honest advice, detailed information on every project and exceptional service throughout — exactly the kind of advisor you want." },
];

/* ── FAQs ─────────────────────────────────────────────────── */
const FAQS = [
  { q: 'Do you charge any brokerage from buyers?',
    a: 'No. PrimePro Projects operates on a zero-brokerage model for buyers, renters and investors. Our fees are disclosed upfront — there are no hidden charges at any stage.' },
  { q: 'How quickly can I get a response after enquiring?',
    a: 'Every enquiry receives a personal response within 2 hours during business hours (Mon–Sun 10 AM–7 PM, Tuesday closed). For urgent requirements, call or WhatsApp +91 63048 29287 directly.' },
  { q: 'Are all listed projects RERA approved?',
    a: 'Yes. Every project on our platform is RERA registered with HMDA or DTCP approvals. The RERA number is shown on each property detail page and verified by our in-house legal desk.' },
  { q: 'Do you help with home loans and registration?',
    a: 'Absolutely. We have tie-ups with all major banks (HDFC, SBI, ICICI, Axis, Bajaj) for home loans and handle registration, stamp duty calculation and post-handover compliance end-to-end.' },
  { q: 'Can you help an NRI invest remotely?',
    a: 'Yes. Our dedicated NRI desk handles FEMA compliance, video site walkthroughs, Power-of-Attorney execution and remote registration — investing from anywhere in the world is fully supported.' },
];

/* ── Trust badges shown in hero ────────────────────────────── */
const TRUST_PILLS = [
  '🏆 Est. 2024 · Award Winning',
  '✓ RERA Registered',
  '✓ HMDA & DTCP Approved',
  '✓ Zero Brokerage',
  '✓ NRI Desk',
  '✓ 4.9★ Rated',
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

              {/* Primary CTAs — directly under role card */}
              <div className="pf-hero__ctas">
                <a href={CALL_LINK} className="pf-cta-btn pf-cta-btn--gold">
                  <PhoneIcon /> Call Now
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                  className="pf-cta-btn pf-cta-btn--whatsapp">
                  <WhatsAppIcon /> WhatsApp Me
                </a>
                <Link to="/contact" className="pf-cta-btn pf-cta-btn--ghost">
                  <CalendarIcon /> Schedule Visit
                </Link>
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
                src="/Prashanth.jpeg"
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

        {/* ── ABOUT + IMMEDIATE CONTACT ───────────────── */}
        <section className="pf-detail">
          <div className="pf-about">
            <div className="pf-kicker">About Me</div>
            <p className="pf-about__quote">
              I don't sell properties —<br />
              I help families invest in growth,<br />
              lifestyle &amp; long-term value.
            </p>
            <p className="pf-about__body">{FOUNDER.blurb}</p>
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
              Have a property requirement?<br />Let's talk today.
            </h2>
            <p className="pf-query__lead">
              Free 15-minute consultation · Zero obligation · Reply within 2 hours.
            </p>
            <a href={`mailto:${FOUNDER.email}`} className="pf-query__link">
              {FOUNDER.email}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <div className="pf-query__contacts">
              <a href={CALL_LINK} className="pf-query__chip">
                <PhoneIcon />
                {FOUNDER.phone}
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="pf-query__chip pf-query__chip--whatsapp">
                <WhatsAppIcon />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── WHY WORK WITH ME ─────────────────────────── */}
        <section className="pf-creds">
          <div className="pf-section-head">
            <div className="pf-kicker">Why Work With Me</div>
            <h2 className="pf-section-title">
              Six reasons families choose <span className="pf-hi">PrimePro Projects</span>.
            </h2>
            <p className="pf-section-sub">
              No call-centre scripts, no aggressive follow-ups. Just verified inventory,
              transparent pricing and an advisor who treats your investment like his own.
            </p>
          </div>

          <div className="pf-cred-grid">
            {WHY_ME.map(c => (
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

        {/* ── HOW I WORK — 4-step process ──────────────── */}
        <section className="pf-process">
          <div className="pf-section-head">
            <div className="pf-kicker">How I Work</div>
            <h2 className="pf-section-title">
              From first call to <span className="pf-hi">house-warming</span> — in 4 simple steps.
            </h2>
            <p className="pf-section-sub">
              A proven playbook that's closed 35+ family deals since 2024 — most clients
              go from enquiry to registration in under 30 days.
            </p>
          </div>

          <ol className="pf-process-grid">
            {PROCESS.map(p => (
              <li key={p.step} className="pf-step">
                <div className="pf-step__num">{p.step}</div>
                <h3 className="pf-step__title">{p.title}</h3>
                <p className="pf-step__desc">{p.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── EXPERTISE ─────────────────────────────────── */}
        <section className="pf-expertise">
          <div className="pf-section-head">
            <div className="pf-kicker">What I Specialise In</div>
            <h2 className="pf-section-title">
              Six categories, <span className="pf-hi">one promise</span> — only verified deals.
            </h2>
            <p className="pf-section-sub">
              Whether you're buying your first home, upgrading to a villa, investing for
              rental yield or planning an NRI portfolio — there's a verified track record here.
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

        {/* ── RECENT WINS / CASE STUDIES ──────────────── */}
        <section className="pf-wins">
          <div className="pf-section-head">
            <div className="pf-kicker">Recent Wins</div>
            <h2 className="pf-section-title">
              Real deals, <span className="pf-hi">real outcomes</span>.
            </h2>
            <p className="pf-section-sub">
              A snapshot of what we've closed in the last few months — buyers, sellers,
              end-users and NRI investors, all happy at handover.
            </p>
          </div>

          <div className="pf-wins-grid">
            {WINS.map((w, i) => (
              <article key={i} className="pf-win-card">
                <span className="pf-win-card__tag">{w.tag}</span>
                <div className="pf-win-card__price">{w.price}</div>
                <div className="pf-win-card__loc">📍 {w.loc}</div>
                <p className="pf-win-card__desc">{w.desc}</p>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                  className="pf-win-card__cta">
                  Get a similar deal →
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────── */}
        <section className="pf-testi">
          <div className="pf-section-head">
            <div className="pf-kicker">Client Stories</div>
            <h2 className="pf-section-title">
              What my clients <span className="pf-hi">say after handover</span>.
            </h2>
          </div>

          <div className="pf-testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <article key={i} className="pf-testi-card">
                <div className="pf-testi-card__stars">★★★★★</div>
                <p className="pf-testi-card__text">"{t.text}"</p>
                <div className="pf-testi-card__foot">
                  <div className="pf-testi-card__av"
                    style={{ background:`linear-gradient(135deg, ${t.color}, ${t.color}88)` }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="pf-testi-card__name">{t.name}</div>
                    <div className="pf-testi-card__city">{t.city}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── VISION & MISSION ─────────────────────────── */}
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
              <li key={j.title} className="pf-tl-item">
                <span className="pf-tl-year">{j.year}</span>
                <div className="pf-tl-body">
                  <h4 className="pf-tl-title">{j.title}</h4>
                  <p className="pf-tl-desc">{j.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── FAQ ───────────────────────────────────────── */}
        <section className="pf-faq">
          <div className="pf-section-head">
            <div className="pf-kicker">Frequently Asked</div>
            <h2 className="pf-section-title">
              Answers to your <span className="pf-hi">first questions</span>.
            </h2>
          </div>

          <div className="pf-faq-list">
            {FAQS.map((f, i) => (
              <details key={i} className="pf-faq-item">
                <summary className="pf-faq-q">
                  <span>{f.q}</span>
                  <span className="pf-faq-icon" aria-hidden="true">+</span>
                </summary>
                <p className="pf-faq-a">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── OFFICE / BIO ─────────────────────────────── */}
        <section className="pf-office">
          <div className="pf-office__img">
            <img src="/Prashanth.jpeg" alt="At the PrimePro Projects office" />
          </div>
          <div className="pf-office__body">
            <div className="pf-kicker">Inside the Office</div>
            <h3>A trusted name in Hyderabad's real estate market — built on relationships, not commissions.</h3>
            <p>
              PrimePro Projects is a trusted name in Hyderabad's real estate market, established
              in 2024 and delivering quality projects and value-driven investment opportunities
              across villas, high-rise apartments, HMDA &amp; DTCP approved layouts and
              concept-based farmland.
            </p>
            <p>
              We take pride in transparent dealings, timely delivery and customer-centric
              solutions for both investors and end-users. With deep local market knowledge
              and a strong developer + channel-partner network, we continue to create
              value-driven experiences across Hyderabad and surrounding regions.
            </p>
            <div className="pf-office__addr">
              <span aria-hidden="true">📍</span>
              {FOUNDER.location}
            </div>
            <div className="pf-office__cta-row">
              <a href={CALL_LINK} className="btn btn-gold">
                Call {FOUNDER.phone}
              </a>
              <Link to="/contact" className="btn btn-outline-light">
                Visit My Office →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────── */}
        <section className="pf-cta">
          <div className="pf-cta__inner">
            <span className="pf-cta__kicker">Ready when you are</span>
            <h2 className="pf-cta__title">
              Let's find your next address — <span className="pf-hi">today</span>.
            </h2>
            <p className="pf-cta__sub">
              Browse 200+ verified properties or talk to me directly for a personalised shortlist.
              Free consultation. Zero brokerage. Full transparency. Reply within 2 hours.
            </p>
            <div className="pf-cta__actions">
              <a href={CALL_LINK} className="btn btn-gold">
                📞 Call {FOUNDER.phone}
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="btn btn-whatsapp">
                💬 WhatsApp Me
              </a>
              <Link to="/properties" className="btn btn-outline-light">
                Browse Properties →
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
