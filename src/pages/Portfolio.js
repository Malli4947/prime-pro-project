
import { Link } from 'react-router-dom';
import './Portfolio.css';

// ── Edit founder details here ────────────────────────────────
const FOUNDER = {
  firstName: 'Prashanth',
  lastName:  'Reddy',
  role:      'Founder & CEO',
  location:  'Hyderabad, India',
  tagline:   'Building trust in real estate, one verified deal at a time.',
  blurb:     "Real estate isn't just about property — it's about people, families, and life-long decisions. I founded PrimePro Projects to bring transparency, legal clarity, and a genuine human touch to every transaction.",
  phone:     '+91 63048 29287',
  email:     'primeproprojects@gmail.com',
  experience:'5',
  socials: [
    { label: 'FB', href: '#' },
    { label: 'IG', href: '#' },
    { label: 'LI', href: '#' },
  ],
};

export default function Portfolio() {
  return (
    <div className="portfolio-page">
      <div className="portfolio-inner">

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="pf-hero">
          <div className="pf-hero__left">
            <h1 className="pf-name">
              <span>{FOUNDER.firstName}</span>
              <span>{FOUNDER.lastName}</span>
            </h1>

            <div className="pf-rolecard">
              <div className="pf-rolecard__kicker">{FOUNDER.role}</div>
              <h2 className="pf-rolecard__title">
                Based in {FOUNDER.location.split(',')[0]},<br />
                real estate visionary &amp; founder.
              </h2>
              <p className="pf-rolecard__desc">
                {FOUNDER.tagline} Quality service, verified listings, and honest
                advice — that's the PrimePro promise.
              </p>
              <div className="pf-rolecard__contact">
                <p><span className="label">P :</span>{FOUNDER.phone}</p>
                <p><span className="label">E :</span>{FOUNDER.email}</p>
              </div>
            </div>

            <div className="pf-socials">
              {FOUNDER.socials.map(s => (
                <a key={s.label} href={s.href}>{s.label}</a>
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

        {/* ── DETAIL: About + Query ────────────────────── */}
        <section className="pf-detail">
          <div className="pf-about">
            <div className="pf-kicker">About Me</div>
            <p className="pf-about__quote">
              You can't use up creativity.<br />
              The more you use, the more<br />
              you have in your significant mind.
            </p>
            <p className="pf-about__body">
              {FOUNDER.blurb} Every project on PrimePro is RERA registered,
              HMDA or DTCP approved, and personally vetted — because your
              investment deserves nothing less than full transparency.
            </p>
            <div className="pf-exp">
              <span className="pf-exp__num">{FOUNDER.experience}</span>
              <span className="pf-exp__label">
                <span>Years Of</span>
                <span>Experience</span>
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
          </div>
        </section>

        {/* ── OFFICE / BIO ─────────────────────────────── */}
        <section className="pf-office">
          <div className="pf-office__img">
            <img src="/founder-office.png" alt="At the PrimePro office" />
          </div>
          <div className="pf-office__body">
            <div className="pf-kicker">The Mission</div>
            <h3>Hyderabad's most trusted real estate platform — built on relationships.</h3>
            <p>
              Since 2024, PrimePro Projects has helped 35+ families and NRI
              investors find homes, plots, and farmland across Hyderabad's
              fastest-growing corridors. From Madhapur to Gachibowli, every
              listing is legally vetted and personally walked through.
            </p>
            <p>
              Whether you're a first-time buyer or a seasoned investor, my
              door is open — let's build your real estate journey together.
            </p>
            <Link to="/contact" className="btn btn-gold" style={{ marginTop: 12 }}>
              Get in Touch →
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
