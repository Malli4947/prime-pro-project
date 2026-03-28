import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { PROPERTIES } from '../data/Properties';
import './PropertyDetails.css';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = PROPERTIES.find(p => p.id === parseInt(id));

  const [mounted,   setMounted]   = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', message: '', schedule: '',
  });

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
    const onScroll = () => setShowStickyBar(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!property) {
    return (
      <div className="pd-not-found">
        <div className="pd-not-found__inner">
          <span>🏚️</span>
          <h2>Property Not Found</h2>
          <p>The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/properties" className="btn btn-gold">Browse Properties</Link>
        </div>
      </div>
    );
  }

  const {
    title, location, price, status, type, subtype,
    beds, baths, area, images, badge,
    amenities, description, developer,
    possession, rera, rating, reviews,
  } = property;

  const galleryImgs = images && images.length > 0 ? images : [property.image];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setForm({ name: '', phone: '', email: '', message: '', schedule: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  const related = PROPERTIES
    .filter(p => p.id !== property.id && p.type === property.type)
    .slice(0, 3);

  const statusClass = {
    'For Sale':  'pill pill-green',
    'For Rent':  'pill pill-amber',
    'For Lease': 'pill pill-purple',
  }[status] || 'pill pill-navy';

  return (
    <div className={`pd-page${mounted ? ' mounted' : ''}`}>

      {/* ── Breadcrumb ───────────────────────────────── */}
      <nav className="pd-breadcrumb">
        <div className="container pd-breadcrumb__inner">
          <Link to="/">Home</Link>
          <span className="pd-breadcrumb__sep">›</span>
          <Link to="/properties">Properties</Link>
          <span className="pd-breadcrumb__sep">›</span>
          <span>{title}</span>
        </div>
      </nav>

      <div className="container pd-body">

        {/* ═══ LEFT / MAIN COLUMN ══════════════════════ */}
        <div className="pd-main">

          {/* ── Gallery ──────────────────────────────── */}
          <div className={`pd-gallery${mounted ? ' anim-fade-up' : ''}`}>
            {/* Main image */}
            <div className="pd-gallery__main">
              <img
                key={activeImg}
                src={galleryImgs[activeImg]}
                alt={`${title} - view ${activeImg + 1}`}
                className="pd-gallery__main-img"
              />
              <div className="pd-gallery__main-overlay" />

              {/* Badges */}
              <div className="pd-gallery__badges">
                {badge && (
                  <span className={
                    badge === 'Premium'    ? 'pill pill-gold'  :
                    badge === 'Hot'        ? 'pill pill-red'   :
                    badge === 'New Launch' ? 'pill pill-green' :
                    badge === 'Lease'      ? 'pill pill-purple':
                    'pill pill-navy'
                  }>{badge}</span>
                )}
                <span className={statusClass}>{status}</span>
              </div>

              {/* Prev / Next */}
              {galleryImgs.length > 1 && (
                <>
                  <button className="pd-gallery__nav pd-gallery__nav--prev"
                    onClick={() => setActiveImg(i => (i - 1 + galleryImgs.length) % galleryImgs.length)}>
                    ‹
                  </button>
                  <button className="pd-gallery__nav pd-gallery__nav--next"
                    onClick={() => setActiveImg(i => (i + 1) % galleryImgs.length)}>
                    ›
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="pd-gallery__counter">
                📷 {activeImg + 1} / {galleryImgs.length}
              </div>
            </div>

            {/* Thumbnails */}
            {galleryImgs.length > 1 && (
              <div className="pd-gallery__thumbs">
                {galleryImgs.map((img, i) => (
                  <button key={i}
                    className={`pd-gallery__thumb${i === activeImg ? ' active' : ''}`}
                    onClick={() => setActiveImg(i)}>
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Title + Quick Info ────────────────────── */}
          <div className={`pd-info-card${mounted ? ' anim-fade-up d-1' : ''}`}>
            <div className="pd-info-card__header">
              <div className="pd-info-card__header-left">
                <div className="pd-info-card__type">{type} · {subtype}</div>
                <h1 className="pd-info-card__title">{title}</h1>
                <p className="pd-info-card__loc">📍 {location}</p>
              </div>
              <div className="pd-info-card__header-right">
                <div className="pd-info-card__price">{price}</div>
                {rating && (
                  <div className="pd-info-card__rating">
                    ⭐ {rating}
                    <span className="pd-info-card__reviews">({reviews} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick specs */}
            <div className="pd-specs">
              {beds  != null && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">🛏️</span>
                  <div>
                    <b>{beds}</b>
                    <p>Bedroom{beds > 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
              {baths != null && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">🚿</span>
                  <div>
                    <b>{baths}</b>
                    <p>Bathroom{baths > 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
              <div className="pd-spec">
                <span className="pd-spec__icon">📐</span>
                <div><b>{area}</b><p>Total Area</p></div>
              </div>
              <div className="pd-spec">
                <span className="pd-spec__icon">🗓️</span>
                <div><b>{possession}</b><p>Possession</p></div>
              </div>
            </div>
          </div>

          {/* ── Description ──────────────────────────── */}
          <div className={`pd-section${mounted ? ' anim-fade-up d-2' : ''}`}>
            <h2 className="pd-section__title">About This Property</h2>
            <p className="pd-section__text">{description}</p>
          </div>

          {/* ── Amenities ────────────────────────────── */}
          <div className={`pd-section${mounted ? ' anim-fade-up d-2' : ''}`}>
            <h2 className="pd-section__title">Amenities & Features</h2>
            <div className="pd-amenities">
              {amenities.map(a => (
                <div key={a} className="pd-amenity">
                  <span className="pd-amenity__check">✓</span>
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* ── Property Details Table ────────────────── */}
          <div className={`pd-section${mounted ? ' anim-fade-up d-2' : ''}`}>
            <h2 className="pd-section__title">Property Details</h2>
            <div className="pd-table">
              {[
                ['Property Type',  type],
                ['Sub-Type',       subtype],
                ['Status',         status],
                ['Total Area',     area],
                ['Bedrooms',       beds  != null ? `${beds} BHK`  : '—'],
                ['Bathrooms',      baths != null ? `${baths}`     : '—'],
                ['Developer',      developer],
                ['Possession',     possession],
                ['RERA Number',    rera],
              ].map(([k, v]) => (
                <div key={k} className="pd-table__row">
                  <span className="pd-table__key">{k}</span>
                  <span className="pd-table__val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Location section ─────────────────────── */}
          <div className={`pd-section${mounted ? ' anim-fade-up d-3' : ''}`}>
            <h2 className="pd-section__title">Location</h2>
            <div className="pd-location">
              <div className="pd-location__pin">📍</div>
              <div className="pd-location__info">
                <div className="pd-location__address">{location}</div>
                <div className="pd-location__sub">Hyderabad, Telangana, India</div>
              </div>
            </div>
            {/* Map placeholder — replace with actual map integration */}
            <div className="pd-map-placeholder">
              <div className="pd-map-placeholder__inner">
                <span>🗺️</span>
                <p>Interactive map coming soon</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(location + ', Hyderabad')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline btn-sm">
                  View on Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT / SIDEBAR ═════════════════════════ */}
        <aside className="pd-sidebar">

          {/* ── Enquiry Card ─────────────────────────── */}
          <div className={`pd-enquiry${mounted ? ' anim-fade-up d-3' : ''}`}>
            <div className="pd-enquiry__header">
              <h3 className="pd-enquiry__title">Book a Free Site Visit</h3>
              <p className="pd-enquiry__sub">No obligations • Expert advice</p>
            </div>

            {submitted ? (
              <div className="pd-enquiry__success">
                <div className="pd-enquiry__success-icon">✅</div>
                <h4>Request Submitted!</h4>
                <p>Our team will call you within 2 hours.</p>
              </div>
            ) : (
              <form className="pd-enquiry__form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text" required placeholder="Arjun Mehta"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel" required placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email" placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Preferred Visit Date</label>
                  <input
                    type="date"
                    value={form.schedule}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Message</label>
                  <textarea
                    placeholder={`I'm interested in ${title}. Please share more details…`}
                    rows={3}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="form-input pd-enquiry__textarea"
                  />
                </div>
                <button
                  type="submit"
                  className={`btn btn-gold btn-full pd-enquiry__submit${submitting ? ' loading' : ''}`}
                  disabled={submitting}>
                  {submitting ? (
                    <><span className="pd-enquiry__spinner" /> Submitting…</>
                  ) : (
                    <>📅 Schedule Visit</>
                  )}
                </button>
                <p className="pd-enquiry__note">
                  By submitting, you agree to our{' '}
                  <a href="#!" className="pd-enquiry__link">Privacy Policy</a>
                </p>
              </form>
            )}
          </div>

          {/* ── Quick Contact ─────────────────────────── */}
          <div className={`pd-contacts${mounted ? ' anim-fade-up d-4' : ''}`}>
            <a href="tel:18005006000" className="pd-contact pd-contact--call">
              <span className="pd-contact__icon">📞</span>
              <div>
                <div className="pd-contact__label">Call Us Now</div>
                <div className="pd-contact__val">1800 500 600</div>
              </div>
            </a>
            <a
              href={`https://wa.me/918005006000?text=Hi! I'm interested in ${encodeURIComponent(title)} at ${location}.`}
              target="_blank" rel="noopener noreferrer"
              className="pd-contact pd-contact--whatsapp">
              <span className="pd-contact__icon">💬</span>
              <div>
                <div className="pd-contact__label">WhatsApp Us</div>
                <div className="pd-contact__val">Quick Response</div>
              </div>
            </a>
          </div>

          {/* ── RERA badge ────────────────────────────── */}
          {rera !== 'N/A' && (
            <div className={`pd-rera${mounted ? ' anim-fade-up d-5' : ''}`}>
              <span className="pd-rera__icon">🛡️</span>
              <div>
                <div className="pd-rera__label">RERA Registered</div>
                <div className="pd-rera__num">{rera}</div>
              </div>
            </div>
          )}

          {/* ── Share ─────────────────────────────────── */}
          <div className={`pd-share${mounted ? ' anim-fade-up d-5' : ''}`}>
            <p className="pd-share__label">Share this property</p>
            <div className="pd-share__btns">
              {[
                { label: 'Copy Link', icon: '🔗', action: () => { navigator.clipboard?.writeText(window.location.href); } },
                { label: 'WhatsApp',  icon: '📱', href: `https://wa.me/?text=${encodeURIComponent(`Check out ${title} at ${location}: ${window.location.href}`)}` },
                { label: 'Email',     icon: '✉️',  href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this property: ${window.location.href}`)}` },
              ].map(s => s.href ? (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="pd-share__btn">
                  {s.icon} {s.label}
                </a>
              ) : (
                <button key={s.label} onClick={s.action} className="pd-share__btn">
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ── Related Properties ───────────────────────── */}
      {related.length > 0 && (
        <section className="pd-related">
          <div className="container">
            <div className="pd-related__header">
              <span className="sec-tag">You May Also Like</span>
              <h2 className="sec-title">Similar <span className="hi">Properties</span></h2>
            </div>
            <div className="grid-3">
              {related.map((p, i) => (
                <PropertyCard key={p.id} property={p}
                  style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
            <div className="pd-related__cta">
              <Link to="/properties" className="btn btn-outline">View All Properties →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Sticky bottom bar (mobile) ────────────────── */}
      <div className={`pd-sticky${showStickyBar ? ' visible' : ''}`}>
        <div className="pd-sticky__price">{price}</div>
        <div className="pd-sticky__actions">
          <a href="tel:18005006000" className="btn btn-outline-light btn-sm">📞 Call</a>
          <button
            className="btn btn-gold btn-sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            📅 Enquire
          </button>
        </div>
      </div>
    </div>
  );
}