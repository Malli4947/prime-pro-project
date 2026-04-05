import  { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import './PropertyDetails.css';

const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

// ── Safe image URL validator ──────────────────────────────────────────────────
// Filters out null, undefined, empty strings, and non-http URLs
function toValidImgArray(images, image) {
  const isValid = url =>
    typeof url === 'string' &&
    url.trim().length > 0 &&
    (url.startsWith('http') || url.startsWith('/'));

  // Collect from images array first, then fall back to single image field
  const fromArray = Array.isArray(images)
    ? images.filter(isValid)
    : [];

  if (fromArray.length > 0) return fromArray;

  // Try the single `image` field
  if (isValid(image)) return [image];

  return []; // truly no images
}

export default function PropertyDetails() {
  const { id }   = useParams();
  // const navigate = useNavigate();

  const [property,     setProperty]    = useState(null);
  const [related,      setRelated]     = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [notFound,     setNotFound]    = useState(false);

  const [mounted,      setMounted]     = useState(false);
  const [activeImg,    setActiveImg]   = useState(0);
  const [imgError,     setImgError]    = useState(false);   // single image load fail
  const [submitted,    setSubmitted]   = useState(false);
  const [submitting,   setSubmitting]  = useState(false);
  const [enquiryError, setEnquiryError]= useState('');
  const [showSticky,   setShowSticky]  = useState(false);

  const [form, setForm] = useState({
    name:'', phone:'', email:'', message:'', scheduleDate:'',
  });

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
    const onScroll = () => setShowSticky(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── GET /api/properties/:id ───────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setActiveImg(0);
    setImgError(false);
    window.scrollTo({ top: 0 });

    fetch(`${BASE}/api/properties/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.property) {
          setProperty(data.property);

          // Fetch 3 related properties of same type
          fetch(`${BASE}/api/properties?type=${data.property.type}&limit=4`)
            .then(r => r.json())
            .then(d => {
              if (d.success) {
                setRelated(
                  (d.properties || [])
                    .filter(p => p._id !== data.property._id)
                    .slice(0, 3)
                );
              }
            })
            .catch(() => {});
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  // ── POST /api/enquiries ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnquiryError('');
    if (!form.name.trim())  return setEnquiryError('Name is required');
    if (!form.phone.trim()) return setEnquiryError('Phone is required');

    setSubmitting(true);
    try {
      const token   = localStorage.getItem('pp_user_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const body = {
        propertyId: property._id,
        name:       form.name.trim(),
        phone:      form.phone.replace(/\D/, '').slice(-10),
        email:      form.email.trim().toLowerCase() || undefined,
        message:    form.message.trim() || `I'm interested in ${property.title}. Please share more details.`,
        type:       'Site Visit',
        subject:    `Site Visit — ${property.title}`,
      };
      if (form.scheduleDate) body.scheduleDate = form.scheduleDate;

      const res  = await fetch(`${BASE}/api/enquiries`, {
        method: 'POST', headers, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setForm({ name:'', phone:'', email:'', message:'', scheduleDate:'' });
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        setEnquiryError(data.message || 'Submission failed. Please try again.');
      }
    } catch {
      setEnquiryError('Network error — please try again.');
    }
    setSubmitting(false);
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:80 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:44, height:44, border:'3px solid #f0e6c8', borderTopColor:'#C9A84C', borderRadius:'50%', animation:'rotateSlow .7s linear infinite', margin:'0 auto 14px' }} />
        <div style={{ fontSize:14, color:'#94a3b8' }}>Loading property…</div>
      </div>
    </div>
  );

  // ── Not found state ───────────────────────────────────────────────────────
  if (notFound || !property) return (
    <div className="pd-not-found">
      <div className="pd-not-found__inner">
        <span>🏚️</span>
        <h2>Property Not Found</h2>
        <p>The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/properties" className="btn btn-gold">Browse Properties</Link>
      </div>
    </div>
  );

  // ── Derive display values ─────────────────────────────────────────────────
  const {
    _id, title, description, priceLabel, price,
    location, status, type, subtype,
    beds, baths, area, images, image,
    badge, amenities, developer, possession,
    rera, reraVerified, rating, reviews, views,
  } = property;

  // ✅ THE FIX: filter out null / empty / invalid URLs from images array
  const galleryImgs = toValidImgArray(images, image);
  const hasGallery  = galleryImgs.length > 0;

  // Ensure activeImg is always in-bounds (e.g. after data reload)
  const safeActiveImg = Math.min(activeImg, Math.max(0, galleryImgs.length - 1));

  const displayPrice = priceLabel || (price ? `₹${price.toLocaleString('en-IN')}` : 'Price on Request');
  const displayLoc   = location?.locality
    ? `${location.locality}, ${location.city || 'Hyderabad'}`
    : location?.address || 'Hyderabad';

  const statusClass = {
    'For Sale':  'pill pill-green',
    'For Rent':  'pill pill-amber',
    'For Lease': 'pill pill-purple',
  }[status] || 'pill pill-navy';

  const badgeClass = {
    'Premium':    'pill pill-gold',
    'Hot':        'pill pill-red',
    'New Launch': 'pill pill-green',
    'Featured':   'pill pill-navy',
    'Lease':      'pill pill-purple',
  }[badge] || 'pill pill-navy';

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={`pd-page${mounted ? ' mounted' : ''}`}>

      {/* Breadcrumb */}
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

        {/* ═══ MAIN COLUMN ═════════════════════════════ */}
        <div className="pd-main">

          {/* ── GALLERY ──────────────────────────────── */}
          <div className={`pd-gallery${mounted ? ' anim-fade-up' : ''}`}>
            {hasGallery && !imgError ? (
              <>
                {/* Main image */}
                <div className="pd-gallery__main">
                  <img
                    // ✅ Use safeActiveImg, not activeImg
                    src={galleryImgs[safeActiveImg]}
                    alt={`${title} — view ${safeActiveImg + 1}`}
                    className="pd-gallery__main-img"
                    // ✅ onError fallback: hide gallery if image fails to load
                    onError={() => {
                      // Try next image; if all fail, show placeholder
                      if (safeActiveImg < galleryImgs.length - 1) {
                        setActiveImg(safeActiveImg + 1);
                      } else {
                        setImgError(true);
                      }
                    }}
                    // ✅ Remove key={activeImg} — it caused remount flicker
                    // and would reset onError state on every click
                  />
                  <div className="pd-gallery__main-overlay" />

                  {/* Status + badge pills */}
                  <div className="pd-gallery__badges">
                    {badge  && <span className={badgeClass}>{badge}</span>}
                    {status && <span className={statusClass}>{status}</span>}
                  </div>

                  {/* Prev / Next arrows — only when multiple images */}
                  {galleryImgs.length > 1 && (
                    <>
                      <button
                        className="pd-gallery__nav pd-gallery__nav--prev"
                        onClick={() => {
                          setImgError(false);
                          setActiveImg(i => (i - 1 + galleryImgs.length) % galleryImgs.length);
                        }}>
                        ‹
                      </button>
                      <button
                        className="pd-gallery__nav pd-gallery__nav--next"
                        onClick={() => {
                          setImgError(false);
                          setActiveImg(i => (i + 1) % galleryImgs.length);
                        }}>
                        ›
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  <div className="pd-gallery__counter">
                    📷 {safeActiveImg + 1} / {galleryImgs.length}
                  </div>
                </div>

                {/* Thumbnail strip — only when > 1 image */}
                {galleryImgs.length > 1 && (
                  <div className="pd-gallery__thumbs">
                    {galleryImgs.map((img, i) => (
                      <button
                        key={i}
                        className={`pd-gallery__thumb${i === safeActiveImg ? ' active' : ''}`}
                        onClick={() => { setImgError(false); setActiveImg(i); }}>
                        <img
                          src={img}
                          alt={`Thumbnail ${i + 1}`}
                          onError={e => {
                            // Hide broken thumbnails gracefully
                            e.target.closest('button').style.display = 'none';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* ── No images / all images failed to load ── */
              <div
                className="pd-gallery__main"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f8fafc',
                  minHeight: 320,
                }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 64, opacity: 0.2, marginBottom: 12 }}>🏠</div>
                  <div style={{ fontSize: 14, color: '#94a3b8' }}>No photos available yet</div>
                </div>
                {/* Still show badges on placeholder */}
                <div className="pd-gallery__badges">
                  {badge  && <span className={badgeClass}>{badge}</span>}
                  {status && <span className={statusClass}>{status}</span>}
                </div>
              </div>
            )}
          </div>

          {/* ── TITLE + INFO ─────────────────────────── */}
          <div className={`pd-info-card${mounted ? ' anim-fade-up d-1' : ''}`}>
            <div className="pd-info-card__header">
              <div className="pd-info-card__header-left">
                <div className="pd-info-card__type">
                  {type}{subtype ? ` · ${subtype}` : ''}
                </div>
                <h1 className="pd-info-card__title">{title}</h1>
                <p className="pd-info-card__loc">📍 {displayLoc}</p>
              </div>
              <div className="pd-info-card__header-right">
                <div className="pd-info-card__price">{displayPrice}</div>
                {rating > 0 && (
                  <div className="pd-info-card__rating">
                    ⭐ {rating.toFixed(1)}
                    <span className="pd-info-card__reviews">({reviews} reviews)</span>
                  </div>
                )}
                {views > 0 && (
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                    👁 {views} views
                  </div>
                )}
              </div>
            </div>

            {/* Specs row */}
            <div className="pd-specs">
              {beds != null && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">🛏️</span>
                  <div><b>{beds}</b><p>Bedroom{beds > 1 ? 's' : ''}</p></div>
                </div>
              )}
              {baths != null && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">🚿</span>
                  <div><b>{baths}</b><p>Bathroom{baths > 1 ? 's' : ''}</p></div>
                </div>
              )}
              {area && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">📐</span>
                  <div><b>{area}</b><p>Total Area</p></div>
                </div>
              )}
              {possession && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">🗓️</span>
                  <div><b>{possession}</b><p>Possession</p></div>
                </div>
              )}
            </div>
          </div>

          {/* ── DESCRIPTION ──────────────────────────── */}
          {description && (
            <div className={`pd-section${mounted ? ' anim-fade-up d-2' : ''}`}>
              <h2 className="pd-section__title">About This Property</h2>
              <p className="pd-section__text">{description}</p>
            </div>
          )}

          {/* ── AMENITIES ────────────────────────────── */}
          {amenities?.length > 0 && (
            <div className={`pd-section${mounted ? ' anim-fade-up d-2' : ''}`}>
              <h2 className="pd-section__title">Amenities &amp; Features</h2>
              <div className="pd-amenities">
                {amenities.map((a, i) => (
                  <div key={i} className="pd-amenity">
                    <span className="pd-amenity__check">✓</span>{a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DETAILS TABLE ────────────────────────── */}
          <div className={`pd-section${mounted ? ' anim-fade-up d-2' : ''}`}>
            <h2 className="pd-section__title">Property Details</h2>
            <div className="pd-table">
              {[
                ['Property Type',  type],
                ['Sub-Type',       subtype],
                ['Status',         status],
                ['Total Area',     area],
                ['Bedrooms',       beds  != null ? `${beds} BHK` : '—'],
                ['Bathrooms',      baths != null ? String(baths) : '—'],
                ['Developer',      developer  || '—'],
                ['Possession',     possession || '—'],
                ['RERA Number',    rera       || 'Applied'],
                ['RERA Verified',  reraVerified ? '✓ Verified' : 'Pending'],
                ['Property ID',    `#${_id?.slice(-10)}`],
              ].filter(([, v]) => v && v !== 'undefined').map(([k, v]) => (
                <div key={k} className="pd-table__row">
                  <span className="pd-table__key">{k}</span>
                  <span className="pd-table__val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── LOCATION ─────────────────────────────── */}
          <div className={`pd-section${mounted ? ' anim-fade-up d-3' : ''}`}>
            <h2 className="pd-section__title">Location</h2>
            <div className="pd-location">
              <div className="pd-location__pin">📍</div>
              <div className="pd-location__info">
                <div className="pd-location__address">
                  {location?.address || displayLoc}
                </div>
                <div className="pd-location__sub">
                  {location?.city || 'Hyderabad'}, {location?.state || 'Telangana'}
                  {location?.pincode ? ` – ${location.pincode}` : ''}
                </div>
              </div>
            </div>
            <div className="pd-map-placeholder">
              <div className="pd-map-placeholder__inner">
                <span>🗺️</span>
                <p>Interactive map coming soon</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    (location?.address || displayLoc) + ', Hyderabad'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm">
                  View on Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SIDEBAR ═════════════════════════════════ */}
        <aside className="pd-sidebar">

          {/* Enquiry form */}
          <div className={`pd-enquiry${mounted ? ' anim-fade-up d-3' : ''}`}>
            <div className="pd-enquiry__header">
              <h3 className="pd-enquiry__title">Book a Free Site Visit</h3>
              <p className="pd-enquiry__sub">No obligations · Expert advice</p>
            </div>

            {submitted ? (
              <div className="pd-enquiry__success">
                <div className="pd-enquiry__success-icon">✅</div>
                <h4>Request Submitted!</h4>
                <p>Our team will call you within 2 hours.</p>
              </div>
            ) : (
              <form className="pd-enquiry__form" onSubmit={handleSubmit}>
                {enquiryError && (
                  <div style={{
                    background: '#fff5f5', border: '1px solid #fecaca',
                    borderRadius: 8, padding: '10px 14px',
                    fontSize: 13, color: '#c53030', marginBottom: 4,
                  }}>
                    ⚠️ {enquiryError}
                  </div>
                )}
                <div className="form-field">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text" placeholder="Arjun Mehta" required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel" placeholder="9876543210" maxLength={10}
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/, '').slice(0, 10) }))}
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
                    min={new Date().toISOString().split('T')[0]}
                    value={form.scheduleDate}
                    onChange={e => setForm(f => ({ ...f, scheduleDate: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Message</label>
                  <textarea
                    rows={3}
                    placeholder={`I'm interested in ${title}. Please share more details…`}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="form-input pd-enquiry__textarea"
                  />
                </div>
                <button
                  type="submit"
                  className={`btn btn-gold btn-full pd-enquiry__submit${submitting ? ' loading' : ''}`}
                  disabled={submitting}>
                  {submitting
                    ? <><span className="pd-enquiry__spinner" /> Submitting…</>
                    : <>📅 Schedule Visit</>}
                </button>
                <p className="pd-enquiry__note">
                  By submitting you agree to our{' '}
                  <a href="#!" className="pd-enquiry__link">Privacy Policy</a>
                </p>
              </form>
            )}
          </div>

          {/* Quick contacts */}
          <div className={`pd-contacts${mounted ? ' anim-fade-up d-4' : ''}`}>
            <a href="tel:9347870247" className="pd-contact pd-contact--call">
              <span className="pd-contact__icon">📞</span>
              <div>
                <div className="pd-contact__label">Call Us Now</div>
                <div className="pd-contact__val">9347870247</div>
              </div>
            </a>
            <a
              href={`https://wa.me/919347870247?text=Hi! I'm interested in ${encodeURIComponent(title)} at ${encodeURIComponent(displayLoc)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-contact pd-contact--whatsapp">
              <span className="pd-contact__icon">💬</span>
              <div>
                <div className="pd-contact__label">WhatsApp Us</div>
                <div className="pd-contact__val">Quick Response</div>
              </div>
            </a>
          </div>

          {/* RERA badge */}
          {rera && rera !== 'N/A' && rera !== 'Applied' && (
            <div className={`pd-rera${mounted ? ' anim-fade-up d-5' : ''}`}>
              <span className="pd-rera__icon">🛡️</span>
              <div>
                <div className="pd-rera__label">
                  RERA {reraVerified ? '✓ Verified' : 'Registered'}
                </div>
                <div className="pd-rera__num">{rera}</div>
              </div>
            </div>
          )}

          {/* Share */}
          <div className={`pd-share${mounted ? ' anim-fade-up d-5' : ''}`}>
            <p className="pd-share__label">Share this property</p>
            <div className="pd-share__btns">
              <button
                className="pd-share__btn"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                🔗 Copy Link
              </button>
              <a
                className="pd-share__btn"
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out ${title} at ${displayLoc}: ${window.location.href}`
                )}`}
                target="_blank"
                rel="noopener noreferrer">
                📱 WhatsApp
              </a>
              <a
                className="pd-share__btn"
                href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
                  `Check out this property: ${window.location.href}`
                )}`}>
                ✉️ Email
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* ── RELATED PROPERTIES ───────────────────────── */}
      {related.length > 0 && (
        <section className="pd-related">
          <div className="container">
            <div className="pd-related__header">
              <span className="sec-tag">You May Also Like</span>
              <h2 className="sec-title">
                Similar <span className="hi">Properties</span>
              </h2>
            </div>
            <div className="grid-3">
              {related.map((p, i) => (
                <PropertyCard
                  key={p._id}
                  property={p}
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
            <div className="pd-related__cta">
              <Link to="/properties" className="btn btn-outline">
                View All Properties →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── STICKY MOBILE BAR ────────────────────────── */}
      <div className={`pd-sticky${showSticky ? ' visible' : ''}`}>
        <div className="pd-sticky__price">{displayPrice}</div>
        <div className="pd-sticky__actions">
          <a href="tel:9347870247" className="btn btn-outline-light btn-sm">
            📞 Call
          </a>
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