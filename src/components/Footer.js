import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

/* ── SVG Social Icons ─────────────────────────────────────────────────── */
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);

/* ── Scroll-to-top button ─────────────────────────────────────────────── */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <button
      className={`scroll-top-btn${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  );
}

/* ── Intersection-observer reveal hook ───────────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

const SOCIALS = [
  { label: 'WhatsApp',  Icon: WhatsAppIcon,  href: 'https://whatsapp.com/channel/0029VbCPUUhKWEL0Emt89D2r', color: '#25D366' },
  { label: 'Facebook',  Icon: FacebookIcon,  href: 'https://www.facebook.com/share/1b2ZzeYLep/?mibextid=wwXIfr', color: '#1877F2' },
  { label: 'Instagram', Icon: InstagramIcon, href: 'https://www.instagram.com/primepro_projects?igsh=MThzdGtxeTY1MW83cQ%3D%3D&utm_source=qr', color: '#E1306C' },
  { label: 'YouTube',   Icon: YouTubeIcon,   href: 'https://youtube.com/@prasanth_reddy3?si=hWS69-H45xioU-RQ', color: '#FF0000' },
  { label: 'LinkedIn',  Icon: LinkedInIcon,  href: 'https://www.linkedin.com/in/prime-pro-projects-00b21640a?utm_source=share_via&utm_content=profile&utm_medium=member_ios', color: '#0A66C2' },
  { label: 'Twitter',   Icon: TwitterIcon,   href: 'https://x.com/primeproproject?s=21', color: '#000000' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [nlEmail, setNlEmail] = useState('');
  const [nlDone,  setNlDone]  = useState(false);

  const [ctaRef,   ctaVis]   = useReveal();
  const [mainRef,  mainVis]  = useReveal();
  const [botRef,   botVis]   = useReveal();

  const handleNewsletter = e => {
    e.preventDefault();
    if (nlEmail.trim()) { setNlDone(true); setNlEmail(''); setTimeout(() => setNlDone(false), 4000); }
  };

  return (
    <>
      {/* ── Scroll-to-top floating button ─────────────────── */}
      <ScrollToTop />

      <footer className="footer" id="contact">

        {/* ── CTA Banner ──────────────────────────────────── */}
        <div className="footer__cta" ref={ctaRef}>
          <div className="footer__cta-particles">
            {[...Array(6)].map((_, i) => <span key={i} className="footer__cta-particle" style={{ '--i': i }} />)}
          </div>
          <div className="container footer__cta-inner">
            <div className={`footer__cta-text${ctaVis ? ' footer-anim-left' : ''}`}>
              <span className="footer__cta-tag">🏠 Start Your Journey</span>
              <h2 className="footer__cta-title">
                Ready to Find Your{' '}
                <span className="footer__cta-gold">Dream Property?</span>
              </h2>
              <p className="footer__cta-sub">
                Talk to our experts — no obligations, just personalised advice tailored for you.
              </p>
            </div>
            <div className={`footer__cta-actions${ctaVis ? ' footer-anim-right' : ''}`}>
              <Link to="/properties" className="btn btn-gold footer__cta-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Browse Properties
              </Link>
              <a href="tel:6304829287" className="btn btn-outline-light footer__cta-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Call Now
              </a>
            </div>
          </div>
        </div>

        {/* ── Main footer ─────────────────────────────────── */}
        <div className="footer__main" ref={mainRef}>
          <div className="container footer__grid">

            {/* Brand column */}
            <div className={`footer__brand${mainVis ? ' footer-anim-up' : ''}`} style={{ animationDelay: '0ms' }}>
              <div className="footer__logo">
                <span className="footer__logo-icon">⬡</span>
                <span className="footer__logo-textblock">
                  <span className="footer__logo-line1">PRIME <span className="footer__logo-gold">PRO</span></span>
                  <span className="footer__logo-line2">PROJECTS</span>
                </span>
              </div>
              <p className="footer__brand-desc">
                Hyderabad's most trusted real estate platform. Verified listings, expert agents, zero hidden charges. Established 2024 · Journey 2024–2026.
              </p>

              {/* Follow Us */}
              <div className="footer__follow-label">Follow Us</div>
              <div className="footer__socials">
                {SOCIALS.map(({ label, Icon, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__social"
                    aria-label={label}
                    style={{ '--social-color': color }}
                    title={label}
                  >
                    <Icon />
                  </a>
                ))}
              </div>

              <div className="footer__trust">
                <span className="footer__trust-pill">✓ RERA Compliant</span>
                <span className="footer__trust-pill">✓ ISO Certified</span>
              </div>
            </div>

            {/* Quick links */}
            <div className={`footer__col${mainVis ? ' footer-anim-up' : ''}`} style={{ animationDelay: '80ms' }}>
              <h4 className="footer__col-title">Quick Links</h4>
              <ul className="footer__links">
                {[
                  ['Home',          '/'],
                  ['All Properties','/properties'],
                  ['Featured',      '/properties?featured=true'],
                  ['New Launches',  '/properties?badge=New+Launch'],
                  ['About Us',      '/about'],
                  ['Contact',       '/contact'],
                ].map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="footer__link">
                      <span className="footer__link-arrow">›</span>{label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Property types */}
            <div className={`footer__col${mainVis ? ' footer-anim-up' : ''}`} style={{ animationDelay: '160ms' }}>
              <h4 className="footer__col-title">Property Types</h4>
              <ul className="footer__links">
                {['Apartments','Independent Villas','Row Houses','Penthouses','Commercial Offices','Retail Shops','Farmhouses'].map(t => (
                  <li key={t}>
                    <Link to={`/properties?subtype=${encodeURIComponent(t)}`} className="footer__link">
                      <span className="footer__link-arrow">›</span>{t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className={`footer__col${mainVis ? ' footer-anim-up' : ''}`} style={{ animationDelay: '240ms' }}>
              <h4 className="footer__col-title">Contact Us</h4>
              <ul className="footer__contact">
                <li>
                  <span className="footer__contact-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </span>
                  <span>Madhapur, Kavuri Hills Phase,<br />Hyderabad, Telangana</span>
                </li>
                <li>
                  <span className="footer__contact-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </span>
                  <a href="tel:6304829287">6304829287</a>
                </li>
                <li>
                  <span className="footer__contact-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </span>
                  <a href="mailto:primeproprojects@gmail.com">primeproprojects@gmail.com</a>
                </li>
                <li>
                  <span className="footer__contact-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </span>
                  <span>Mon – Sat: 9 AM – 7 PM</span>
                </li>
              </ul>

              {/* Newsletter */}
              <div className="footer__newsletter">
                <p className="footer__newsletter-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  Get Property Alerts
                </p>
                {nlDone ? (
                  <div className="footer__newsletter-success">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Subscribed! We'll keep you posted.
                  </div>
                ) : (
                  <form className="footer__newsletter-form" onSubmit={handleNewsletter}>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="footer__newsletter-input"
                      value={nlEmail}
                      onChange={e => setNlEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="footer__newsletter-btn" aria-label="Subscribe">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────── */}
        <div className="footer__bottom" ref={botRef}>
          <div className="container footer__bottom-inner">
            <p className={botVis ? 'footer-anim-up' : ''}>
              © {year} PRIME PRO PROJECTS. All rights reserved. Est. 2024 · Journey 2024–2026.
            </p>
            <div className={`footer__legal${botVis ? ' footer-anim-up' : ''}`} style={{ animationDelay: '80ms' }}>
              <a href="#!">Privacy Policy</a>
              <a href="#!">Terms of Use</a>
              <a href="#!">RERA Compliance</a>
              <a href="#!">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}