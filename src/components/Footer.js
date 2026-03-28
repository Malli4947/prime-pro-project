import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="contact">
      {/* ── CTA Banner ─────────────────────────────────────── */}
      <div className="footer__cta">
        <div className="container footer__cta-inner">
          <div className="footer__cta-text">
            <h2 className="footer__cta-title">Ready to Find Your <span className="footer__cta-gold">Dream Property?</span></h2>
            <p className="footer__cta-sub">Talk to our experts — no obligations, just personalised advice.</p>
          </div>
          <div className="footer__cta-actions">
            <Link to="/properties" className="btn btn-gold">Browse Properties</Link>
            <a href="tel:18005006000" className="btn btn-outline-light">📞 Call Now</a>
          </div>
        </div>
      </div>

      {/* ── Main footer ────────────────────────────────────── */}
      <div className="footer__main">
        <div className="container footer__grid">

          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-icon">⬡</span>
              <span>Prime<span className="footer__logo-gold">Pro</span></span>
            </div>
            <p className="footer__brand-desc">
              Hyderabad's most trusted real estate platform. Verified listings, expert agents, zero hidden charges.
            </p>
            <div className="footer__socials">
              {[
                { label: 'FB', href: '#!' },
                { label: 'IG', href: '#!' },
                { label: 'LI', href: '#!' },
                { label: 'YT', href: '#!' },
              ].map(s => (
                <a key={s.label} href={s.href} className="footer__social" aria-label={s.label}>{s.label}</a>
              ))}
            </div>
            <div className="footer__trust">
              <span className="footer__trust-pill">✓ RERA Compliant</span>
              <span className="footer__trust-pill">✓ ISO Certified</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Quick Links</h4>
            <ul className="footer__links">
              {[['Home', '/'], ['All Properties', '/properties'], ['Featured', '/properties?featured=true'], ['New Launches', '/properties?badge=New+Launch'], ['About Us', '#about'], ['Contact', '#contact']].map(([label, to]) => (
                <li key={label}>
                  {to.startsWith('#') ? (
                    <a href={to} className="footer__link">→ {label}</a>
                  ) : (
                    <Link to={to} className="footer__link">→ {label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Property types */}
          <div className="footer__col">
            <h4 className="footer__col-title">Property Types</h4>
            <ul className="footer__links">
              {['Apartments', 'Independent Villas', 'Row Houses', 'Penthouses', 'Commercial Offices', 'Retail Shops', 'Farmhouses'].map(t => (
                <li key={t}><Link to={`/properties?subtype=${encodeURIComponent(t)}`} className="footer__link">→ {t}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact Us</h4>
            <ul className="footer__contact">
              <li>
                <span className="footer__contact-icon">📍</span>
                <span>3rd Floor, Laxmi Cyber City,<br />Whitefields, Hyderabad – 500081</span>
              </li>
              <li>
                <span className="footer__contact-icon">📞</span>
                <a href="tel:18005006000">1800 500 600</a>
              </li>
              <li>
                <span className="footer__contact-icon">✉️</span>
                <a href="mailto:info@primepro.in">info@primepro.in</a>
              </li>
              <li>
                <span className="footer__contact-icon">🕐</span>
                <span>Mon – Sat: 9 AM – 7 PM</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="footer__newsletter">
              <p className="footer__newsletter-label">Get property alerts</p>
              <form className="footer__newsletter-form" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder="your@email.com" className="footer__newsletter-input" />
                <button type="submit" className="footer__newsletter-btn">→</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────── */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {year} PrimePro Realty Pvt. Ltd. All rights reserved.</p>
          <div className="footer__legal">
            <a href="#!">Privacy Policy</a>
            <a href="#!">Terms of Use</a>
            <a href="#!">RERA Compliance</a>
            <a href="#!">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}