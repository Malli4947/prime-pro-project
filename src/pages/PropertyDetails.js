import {useState, useEffect, useRef} from 'react';
import {useParams, Link} from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import './PropertyDetails.css';

/* ── Amenity icon map ─────────────────────────────────────────────────── */
const AMENITY_ICONS = {
  'swimming pool': '🏊', 'pool': '🏊',
  'gym': '💪', 'fitness': '💪', 'fitness center': '💪',
  'parking': '🅿️', 'car parking': '🅿️', 'covered parking': '🅿️',
  'security': '🔒', '24/7 security': '🔒', 'cctv': '📹', 'surveillance': '📹',
  'garden': '🌳', 'landscaped garden': '🌳', 'park': '🌳',
  'clubhouse': '🏛️', 'club house': '🏛️',
  'power backup': '⚡', 'generator': '⚡', 'ups': '⚡',
  'elevator': '🛗', 'lift': '🛗',
  'playground': '🎮', 'children play area': '🎮', 'kids play area': '🎮',
  'jogging track': '🏃', 'walking track': '🏃',
  'indoor games': '🎯', 'game room': '🎯',
  'wifi': '📶', 'internet': '📶', 'broadband': '📶',
  'water supply': '💧', '24/7 water': '💧', 'borewell': '💧',
  'rainwater harvesting': '🌧️',
  'solar': '☀️', 'solar panels': '☀️', 'solar water heater': '☀️',
  'intercom': '📞', 'video door phone': '📞',
  'fire safety': '🔥', 'fire fighting': '🔥', 'sprinklers': '🔥',
  'amphitheater': '🎭', 'amphitheatre': '🎭',
  'basketball': '🏀', 'tennis': '🎾', 'badminton': '🏸', 'cricket': '🏏',
  'yoga': '🧘', 'meditation': '🧘',
  'library': '📚', 'reading room': '📚',
  'banquet': '🎉', 'party hall': '🎉', 'multipurpose hall': '🎉',
  'spa': '💆', 'sauna': '💆',
  'rooftop': '🏙️', 'terrace': '🏙️',
  'vastu': '🕉️', 'vastu compliant': '🕉️',
  'gated community': '🏘️', 'gated': '🏘️',
  'modular kitchen': '🍳', 'kitchen': '🍳',
  'air conditioning': '❄️', 'ac': '❄️',
  'wooden flooring': '🪵', 'flooring': '🪵',
  'balcony': '🌅', 'terrace garden': '🌅',
  'servant room': '🛏️', 'utility room': '🛏️',
  'store room': '📦', 'storage': '📦',
  'visitor parking': '🚗', 'two wheeler parking': '🛵',
  'atm': '🏧', 'convenience store': '🏪',
  'school': '🏫', 'hospital': '🏥', 'temple': '⛪',
  'waste management': '♻️', 'sewage treatment': '♻️',
};

function getAmenityIcon(name) {
  const key = name.toLowerCase().trim();
  if (AMENITY_ICONS[key]) return AMENITY_ICONS[key];
  const partial = Object.keys(AMENITY_ICONS).find(k => key.includes(k) || k.includes(key));
  return partial ? AMENITY_ICONS[partial] : '✓';
}

/* ── Intersection observer reveal hook ───────────────────────────────── */
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

const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

// ── Auto-rotate interval (30 seconds) ────────────────────────────────────────
const AUTO_PLAY_INTERVAL = 30000;

// ── Safe image URL validator — handles objects OR strings ────────────────────
function toValidImgArray(images, image) {
  const isValidUrl = url =>
    typeof url === 'string' &&
    url.trim().length > 0 &&
    (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:image'));

  let fromArray = [];

  if (Array.isArray(images) && images.length > 0) {
    fromArray = images
      .map(item => {
        if (typeof item === 'string') {
          return isValidUrl(item) ? {url: item, isPrimary: false} : null;
        }
        if (item && typeof item === 'object') {
          const url = item.url || item.src || item.path;
          if (isValidUrl(url)) {
            return {url, isPrimary: item.isPrimary === true};
          }
        }
        return null;
      })
      .filter(Boolean);
  }

  fromArray.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));

  let urls = fromArray.map(i => i.url);
  if (urls.length === 0 && isValidUrl(image)) urls = [image];
  return [...new Set(urls)];
}

export default function PropertyDetails() {
  const {id} = useParams();

  const [property, setProperty] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [enquiryError, setEnquiryError] = useState('');
  const [showSticky, setShowSticky] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);
  const [brochureModal, setBrochureModal] = useState(false);
  const [brochureForm, setBrochureForm] = useState({ name: '', phone: '', email: '', message: '', scheduleDate: '' });
  const [brochureSubmitting, setBrochureSubmitting] = useState(false);
  const [brochureError, setBrochureError] = useState('');

  // Directions form gate — collect lead before sending to Google Maps
  const [directionsModal, setDirectionsModal] = useState(false);
  const [directionsForm, setDirectionsForm] = useState({ name: '', phone: '', email: '' });
  const [directionsSubmitting, setDirectionsSubmitting] = useState(false);
  const [directionsError, setDirectionsError] = useState('');

  /* reveal refs */
  const [infoRef,  infoVis]  = useReveal();
  const [descRef,  descVis]  = useReveal();
  const [amenRef,  amenVis]  = useReveal();
  const [detRef,   detVis]   = useReveal();
  const [locRef,   locVis]   = useReveal();
  const [relRef,   relVis]   = useReveal();

  const [form, setForm] = useState({
    name: '', phone: '', email: '', message: '', scheduleDate: '',
  });

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
    const onScroll = () => setShowSticky(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, {passive: true});
    /* keyboard nav for lightbox */
    const onKey = e => {
      if (!lightbox) return;
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox]);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setActiveImg(0);
    setImgError(false);
    window.scrollTo({top: 0});

    fetch(`${BASE}/api/properties/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.property) {
          setProperty(data.property);
          const cur = data.property;

          // Pull a wide candidate pool of the same subtype/type — filter strictly client-side.
          const q = new URLSearchParams();
          q.set('limit', '80');
          if (cur.subtype) q.set('subtype', cur.subtype);
          else if (cur.type) q.set('type', cur.type);

          fetch(`${BASE}/api/properties?${q.toString()}`)
            .then(r => r.json())
            .then(d => {
              if (!d.success) return;

              const norm = v => (v || '').toString().toLowerCase().trim().replace(/[\s\-_/]+/g, ' ');
              const curBadge    = norm(cur.badge);
              const curStatus   = norm(cur.status);
              const curLocality = norm(cur.location?.locality);
              const curCity     = norm(cur.location?.city);
              const curSubtype  = norm(cur.subtype);
              const curType     = norm(cur.type);
              const curFeatured = !!cur.isFeatured || !!cur.featured;

              // Category tags carried in the `badge` field
              const isReady   = /ready/.test(curBadge) || /ready/.test(curStatus);
              const isUC      = /under construction|under-construction|underconstruction/.test(curBadge)
                              || /under construction|under-construction|underconstruction/.test(curStatus);
              const isPremium = /premium/.test(curBadge);
              const isLuxury  = /luxury/.test(curBadge);
              const isNew     = /new launch|new-launch|newlaunch|new\b/.test(curBadge);

              const hasCategoryGate = isReady || isUC || isPremium || isLuxury || isNew || curFeatured;

              const matchesCategory = p => {
                const pb = norm(p.badge);
                const ps = norm(p.status);
                const pFeatured = !!p.isFeatured || !!p.featured;

                if (isReady   && !/ready/.test(pb) && !/ready/.test(ps)) return false;
                if (isUC      && !/under construction|under-construction|underconstruction/.test(pb)
                              && !/under construction|under-construction|underconstruction/.test(ps)) return false;
                if (isPremium && !/premium/.test(pb)) return false;
                if (isLuxury  && !/luxury/.test(pb))  return false;
                if (isNew     && !/new launch|new-launch|newlaunch|new\b/.test(pb)) return false;
                if (curFeatured && !pFeatured) return false;
                return true;
              };

              // Hard filter: same subtype/type AND same active category tag
              const pool = (d.properties || []).filter(p => {
                if (p._id === cur._id) return false;
                const s = norm(p.subtype);
                const t = norm(p.type);
                const typeMatch = curSubtype ? s === curSubtype : t === curType;
                if (!typeMatch) return false;
                if (hasCategoryGate && !matchesCategory(p)) return false;
                return true;
              });

              // Rank by locality → city → exact badge string equality (light boost)
              const scored = pool
                .map(p => {
                  let score = 0;
                  const l = norm(p.location?.locality);
                  const c = norm(p.location?.city);
                  const b = norm(p.badge);
                  if (curLocality && l === curLocality) score += 80;
                  if (curCity     && c === curCity)     score += 30;
                  if (curBadge    && b === curBadge)    score += 15;
                  return { p, score };
                })
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map(x => x.p);

              setRelated(scored);
            })
            .catch(() => {});
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    setEnquiryError('');
    if (!form.name.trim()) return setEnquiryError('Name is required');
    if (!form.phone.trim()) return setEnquiryError('Phone is required');

    setSubmitting(true);
    try {
      const token = localStorage.getItem('pp_user_token');
      const headers = {'Content-Type': 'application/json'};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const body = {
        propertyId: property._id,
        name: form.name.trim(),
        phone: form.phone.replace(/\D/, '').slice(-10),
        email: form.email.trim().toLowerCase() || undefined,
        message:
          form.message.trim() ||
          `I'm interested in ${property.title}. Please share more details.`,
        type: 'Site Visit',
        subject: `Site Visit — ${property.title}`,
      };
      if (form.scheduleDate) body.scheduleDate = form.scheduleDate;

      const res = await fetch(`${BASE}/api/enquiries`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setForm({name: '', phone: '', email: '', message: '', scheduleDate: ''});
        setTimeout(() => setSubmitted(false), 6000);
      } else {
        setEnquiryError(data.message || 'Submission failed. Please try again.');
      }
    } catch {
      setEnquiryError('Network error — please try again.');
    }
    setSubmitting(false);
  };

  // ── Brochure download handler ─────────────────────────────────────────
  const handleBrochureSubmit = async e => {
    e.preventDefault();
    setBrochureError('');
    if (!brochureForm.name.trim()) return setBrochureError('Name is required');
    if (!brochureForm.phone.trim() || brochureForm.phone.length < 10)
      return setBrochureError('Valid 10-digit phone number is required');
    if (!brochureForm.email.trim()) return setBrochureError('Email address is required');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(brochureForm.email.trim())) return setBrochureError('Enter a valid email address');

    setBrochureSubmitting(true);
    try {
      const token = localStorage.getItem('pp_user_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const body = {
        propertyId: property._id,
        name: brochureForm.name.trim(),
        phone: brochureForm.phone.replace(/\D/g, '').slice(-10),
        email: brochureForm.email.trim().toLowerCase(),
        message:
          brochureForm.message.trim() ||
          `Brochure download request for ${property.title}`,
        type: 'Site Visit',
        subject: `Site Visit — ${property.title}`,
      };
      if (brochureForm.scheduleDate) body.scheduleDate = brochureForm.scheduleDate;

      const res = await fetch(`${BASE}/api/enquiries`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) {
        setBrochureError(data.message || 'Submission failed. Please try again.');
        setBrochureSubmitting(false);
        return;
      }
    } catch {
      setBrochureError('Network error — please try again.');
      setBrochureSubmitting(false);
      return;
    }

    // Trigger download only after successful API call
    if (brochureLink) {
      const link = document.createElement('a');
      link.href = brochureLink;
      link.download = `${title.replace(/\s+/g, '_')}_Brochure`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setBrochureSubmitting(false);
    setBrochureModal(false);
    setBrochureForm({ name: '', phone: '', email: '', message: '', scheduleDate: '' });
  };

  // ── Directions handler: capture lead, then open Google Maps in a new tab ────
  const handleDirectionsSubmit = async e => {
    e.preventDefault();
    setDirectionsError('');
    if (!directionsForm.name.trim()) return setDirectionsError('Name is required');
    if (!directionsForm.phone.trim() || directionsForm.phone.length < 10)
      return setDirectionsError('Valid 10-digit phone number is required');
    if (!directionsForm.email.trim()) return setDirectionsError('Email address is required');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(directionsForm.email.trim())) return setDirectionsError('Enter a valid email address');

    setDirectionsSubmitting(true);
    try {
      const token = localStorage.getItem('pp_user_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const body = {
        propertyId: property._id,
        name: directionsForm.name.trim(),
        phone: directionsForm.phone.replace(/\D/g, '').slice(-10),
        email: directionsForm.email.trim().toLowerCase(),
        message: `Requested directions to ${property.title} at ${property.location?.address || property.location?.locality || 'Hyderabad'}`,
        type: 'Site Visit',
        subject: `Directions Request — ${property.title}`,
      };

      const res = await fetch(`${BASE}/api/enquiries`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) {
        setDirectionsError(data.message || 'Submission failed. Please try again.');
        setDirectionsSubmitting(false);
        return;
      }
    } catch {
      setDirectionsError('Network error — please try again.');
      setDirectionsSubmitting(false);
      return;
    }

    // Open Google Maps in a new tab AFTER successful lead capture
    const addr = property.location?.address || property.location?.locality || property.title;
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(addr + ', Hyderabad')}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');

    setDirectionsSubmitting(false);
    setDirectionsModal(false);
    setDirectionsForm({ name: '', phone: '', email: '' });
  };

  if (loading)
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80}}>
        <div style={{textAlign: 'center'}}>
          <div style={{width: 44, height: 44, border: '3px solid #f0e6c8', borderTopColor: '#C9A84C', borderRadius: '50%', animation: 'rotateSlow .7s linear infinite', margin: '0 auto 14px'}} />
          <div style={{fontSize: 14, color: '#94a3b8'}}>Loading property…</div>
        </div>
      </div>
    );

  if (notFound || !property)
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

  const {
    _id, title, description, priceLabel, totalPriceLabel, price, totalPrice,
    location, status, type, subtype,
    beds, area, minSft, maxSft, unitType, images, image,
    badge, amenities, developer, possession,
    rera, reraVerified, rating, reviews, views,
    floors, totalUnits, pricePerSft, facing, projectStatus, brochureLink,
  } = property;

  const galleryImgs = toValidImgArray(images, image);
  const hasGallery = galleryImgs.length > 0;
  const safeActiveImg = Math.min(activeImg, Math.max(0, galleryImgs.length - 1));

  const displayPrice =
    priceLabel ||
    totalPriceLabel ||
    (totalPrice > 0 ? `₹${Number(totalPrice).toLocaleString('en-IN')}` : null) ||
    (price     > 0 ? `₹${Number(price).toLocaleString('en-IN')}`      : null) ||
    'Price on Request';

  const displayArea =
    (area && area !== '0') ? area :
    (minSft > 0 && maxSft > 0) ? `${Number(minSft).toLocaleString()} – ${Number(maxSft).toLocaleString()} Sft` :
    (minSft > 0) ? `${Number(minSft).toLocaleString()} Sft` :
    null;

  const displayLoc = location?.locality
    ? `${location.locality}, ${location.city || 'Hyderabad'}`
    : location?.address || 'Hyderabad';

  const statusClass =
    {
      'For Sale': 'pill pill-green',
      'For Rent': 'pill pill-amber',
      'For Lease': 'pill pill-purple',
    }[status] || 'pill pill-navy';

  const badgeClass =
    {
      Premium: 'pill pill-gold',
      Hot: 'pill pill-red',
      'New Launch': 'pill pill-green',
      Featured: 'pill pill-navy',
      Lease: 'pill pill-purple',
    }[badge] || 'pill pill-navy';

  const goNext = () => {
    setImgError(false);
    setActiveImg(i => (i + 1) % galleryImgs.length);
  };
  const goPrev = () => {
    setImgError(false);
    setActiveImg(i => (i - 1 + galleryImgs.length) % galleryImgs.length);
  };
  const goTo = i => {
    setImgError(false);
    setActiveImg(i);
  };

  return (
    <div className={`pd-page${mounted ? ' mounted' : ''}`}>
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
        <div className="pd-main">
          <Gallery
            galleryImgs={galleryImgs}
            hasGallery={hasGallery}
            imgError={imgError}
            setImgError={setImgError}
            safeActiveImg={safeActiveImg}
            setActiveImg={setActiveImg}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            autoPlayRef={autoPlayRef}
            title={title}
            badge={badge}
            badgeClass={badgeClass}
            status={status}
            statusClass={statusClass}
            mounted={mounted}
            goNext={goNext}
            goPrev={goPrev}
            goTo={goTo}
            onOpenLightbox={() => setLightbox(true)}
          />

          <div className={`pd-info-card${infoVis ? ' pd-reveal' : ''}`} ref={infoRef}>
            <div className="pd-info-card__header">
              <div className="pd-info-card__header-left">
                <div className="pd-info-card__type">
                  {type}{subtype ? ` · ${subtype}` : ''}
                </div>
                <h1 className="pd-info-card__title">{title}</h1>
                <button
                  type="button"
                  onClick={() => setDirectionsModal(true)}
                  className="pd-info-card__loc pd-info-card__loc--btn"
                  aria-label={`Get directions to ${displayLoc}`}>
                  📍 {displayLoc}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                  </svg>
                </button>
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
                  <div style={{fontSize: 12, color: '#94a3b8', marginTop: 4}}>👁 {views} views</div>
                )}
              </div>
            </div>

            <div className="pd-specs">
              {/* Subtype — always shown as the leading spec when no Unit Type/Beds
                  apply (e.g. Open Plots, Farmland, Commercial Land) so plots
                  no longer look empty */}
              {!(beds > 0) && !unitType && subtype && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">🏷️</span>
                  <div><b>{subtype}</b><p>Property Type</p></div>
                </div>
              )}
              {!(beds > 0) && unitType && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">🏠</span>
                  <div><b>{unitType}</b><p>Unit Type</p></div>
                </div>
              )}
              {displayArea && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">📐</span>
                  <div><b>{displayArea}</b><p>Total Area</p></div>
                </div>
              )}
              {facing && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">🧭</span>
                  <div><b>{facing}</b><p>Facing</p></div>
                </div>
              )}
              {possession && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">🗓️</span>
                  <div><b>{possession}</b><p>Possession</p></div>
                </div>
              )}
              {floors > 0 && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">🏢</span>
                  <div><b>{floors}</b><p>Floors</p></div>
                </div>
              )}
              {totalUnits > 0 && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">🏘️</span>
                  <div><b>{totalUnits}</b><p>Total Units</p></div>
                </div>
              )}
              {pricePerSft > 0 && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">💰</span>
                  <div><b>₹{Number(pricePerSft).toLocaleString('en-IN')}</b><p>Per Sft</p></div>
                </div>
              )}
              {/* Status pill — last resort so the spec grid never looks empty */}
              {status && !possession && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">🏷️</span>
                  <div><b>{status}</b><p>Listing Status</p></div>
                </div>
              )}
              {reraVerified && (
                <div className="pd-spec">
                  <span className="pd-spec__icon">✅</span>
                  <div><b>RERA Verified</b><p>Compliance</p></div>
                </div>
              )}
            </div>
          </div>

          {description && (
            <div className={`pd-section${descVis ? ' pd-reveal' : ''}`} ref={descRef}>
              <h2 className="pd-section__title">About This Property</h2>
              <p className="pd-section__text">{description}</p>
            </div>
          )}

          {/* ── Download Brochure Banner — only when brochureLink exists ── */}
          {brochureLink && brochureLink.trim() !== '' && (
            <div className={`pd-brochure-banner${mounted ? ' anim-fade-up' : ''}`}>
              <div className="pd-brochure-banner__left">
                <div className="pd-brochure-banner__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div>
                  <h3 className="pd-brochure-banner__title">Download Brochure</h3>
                  <p className="pd-brochure-banner__sub">Get floor plans, pricing &amp; full project details</p>
                </div>
              </div>
              <button
                className="pd-brochure-banner__btn"
                onClick={() => setBrochureModal(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Now
              </button>
            </div>
          )}

          <div className={`pd-section${detVis ? ' pd-reveal' : ''}`} ref={detRef}>
            <h2 className="pd-section__title">Property Details</h2>
            <div className="pd-table">
              {[
                ['Property Type',  type],
                ['Sub-Type',       subtype],
                ['Status',         status],
                ['Project Status', projectStatus],
                ['Unit Type',      unitType],
                ['Total Area',     displayArea],
                ['Floors',         floors > 0 ? String(floors) : null],
                ['Total Units',    totalUnits > 0 ? String(totalUnits) : null],
                ['Facing',         facing],
                ['Price Per Sft',  pricePerSft > 0 ? `₹${Number(pricePerSft).toLocaleString('en-IN')}` : null],
                ['Developer',      developer],
                ['Possession',     possession],
                ['RERA Number',    rera && rera !== 'N/A' ? rera : null],
                ['RERA Verified',  reraVerified ? '✓ Verified' : null],
                ['Property ID',    _id ? `#${_id.slice(-10)}` : null],
              ]
                .filter(([, v]) => v && String(v).trim() !== '' && v !== 'undefined' && v !== 'null')
                .map(([k, v]) => (
                  <div key={k} className="pd-table__row">
                    <span className="pd-table__key">{k}</span>
                    <span className="pd-table__val">{v}</span>
                  </div>
                ))}
            </div>
          </div>
          
          {amenities?.length > 0 && (
            <div className={`pd-section${amenVis ? ' pd-reveal' : ''}`} ref={amenRef}>
              <h2 className="pd-section__title">Amenities &amp; Features</h2>
              <div className="pd-amenities">
                {amenities.map((a, i) => {
                  const icon = getAmenityIcon(a);
                  return (
                    <div key={i} className="pd-amenity" style={{ animationDelay: `${i * 40}ms` }}>
                      <span className="pd-amenity__icon">{icon}</span>
                      <span className="pd-amenity__name">{a}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          

          <div className={`pd-section${locVis ? ' pd-reveal' : ''}`} ref={locRef}>
            <h2 className="pd-section__title">Location &amp; Nearby</h2>
            <div className="pd-location">
              <div className="pd-location__pin">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div className="pd-location__info">
                <div className="pd-location__address">{location?.address || displayLoc}</div>
                <div className="pd-location__sub">
                  {location?.city || 'Hyderabad'}, {location?.state || 'Telangana'}
                  {location?.pincode ? ` – ${location.pincode}` : ''}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDirectionsModal(true)}
                className="pd-location__maps-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                Get Directions
              </button>
            </div>

            {/* Google Maps Embed — overlay intercepts clicks so all paths
                to Maps must go through the lead-capture form */}
            <div className="pd-map-embed" style={{ position: 'relative' }}>
              <iframe
                title="Property Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent((location?.address || displayLoc) + ', Hyderabad')}&output=embed&z=15`}
                width="100%"
                height="340"
                style={{ border: 0, borderRadius: '16px', display: 'block', pointerEvents: 'none' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <button
                type="button"
                onClick={() => setDirectionsModal(true)}
                aria-label="Get directions to this property"
                className="pd-map-embed__shield">
                <span className="pd-map-embed__shield-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  Open in Google Maps
                </span>
              </button>
            </div>

            {/* Nearby highlights */}
            <div className="pd-nearby">
              {[
                { icon: '🏫', label: 'Schools & Colleges', val: 'Within 2 km' },
                { icon: '🏥', label: 'Hospitals',          val: 'Within 3 km' },
                { icon: '🛒', label: 'Shopping Malls',     val: 'Within 4 km' },
                { icon: '🚇', label: 'Metro Station',      val: 'Within 1.5 km' },
                { icon: '✈️', label: 'Airport',            val: 'Within 25 km' },
                { icon: '🏢', label: 'IT Hubs',            val: 'Within 5 km' },
              ].map((item, i) => (
                <div key={i} className="pd-nearby__item" style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="pd-nearby__icon">{item.icon}</span>
                  <div>
                    <div className="pd-nearby__label">{item.label}</div>
                    <div className="pd-nearby__val">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ SIDEBAR ═════════════════════════════════ */}
        <aside className="pd-sidebar">
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
                  <div style={{background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#c53030', marginBottom: 4}}>
                    ⚠️ {enquiryError}
                  </div>
                )}
                <div className="form-field">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text" placeholder="Enter name" required
                    value={form.name}
                    onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel" placeholder="Enter number" maxLength={10}
                    value={form.phone}
                    onChange={e => setForm(f => ({...f, phone: e.target.value.replace(/\D/, '').slice(0, 10)}))}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email" placeholder="Enter email"
                    value={form.email}
                    onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Preferred Visit Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.scheduleDate}
                    onChange={e => setForm(f => ({...f, scheduleDate: e.target.value}))}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Message</label>
                  <textarea
                    rows={3}
                    placeholder={`I'm interested in ${title}. Please share more details…`}
                    value={form.message}
                    onChange={e => setForm(f => ({...f, message: e.target.value}))}
                    className="form-input pd-enquiry__textarea"
                  />
                </div>
                <button
                  type="submit"
                  className={`btn btn-gold btn-full pd-enquiry__submit${submitting ? ' loading' : ''}`}
                  disabled={submitting}>
                  {submitting ? (<><span className="pd-enquiry__spinner" /> Submitting…</>) : (<>📅 Schedule Visit</>)}
                </button>
                <p className="pd-enquiry__note">
                  By submitting you agree to our{' '}
                  <a href="#!" className="pd-enquiry__link">Privacy Policy</a>
                </p>
              </form>
            )}
          </div>

          {/* ── Download Brochure button — only when brochureLink exists ── */}
          {brochureLink && (
            <div className={`pd-brochure-wrap${mounted ? ' anim-fade-up d-4' : ''}`}>
              <button
                className="pd-brochure-btn"
                onClick={() => setBrochureModal(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Brochure
              </button>
            </div>
          )}

          <div className={`pd-contacts${mounted ? ' anim-fade-up d-4' : ''}`}>
            <a href="tel:6304829287" className="pd-contact pd-contact--call">
              <span className="pd-contact__icon">📞</span>
              <div>
                <div className="pd-contact__label">Call Us Now</div>
                <div className="pd-contact__val">6304829287</div>
              </div>
            </a>
            <a
              href={`https://wa.me/916304829287?text=Hi! I'm interested in ${encodeURIComponent(title)} at ${encodeURIComponent(displayLoc)}.`}
              target="_blank" rel="noopener noreferrer"
              className="pd-contact pd-contact--whatsapp">
              <span className="pd-contact__icon">💬</span>
              <div>
                <div className="pd-contact__label">WhatsApp Us</div>
                <div className="pd-contact__val">Quick Response</div>
              </div>
            </a>
          </div>

          {rera && rera !== 'N/A' && rera !== 'Applied' && (
            <div className={`pd-rera${mounted ? ' anim-fade-up d-5' : ''}`}>
              <span className="pd-rera__icon">🛡️</span>
              <div>
                <div className="pd-rera__label">RERA {reraVerified ? '✓ Verified' : 'Registered'}</div>
                <div className="pd-rera__num">{rera}</div>
              </div>
            </div>
          )}

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
                href={`https://wa.me/?text=${encodeURIComponent(`Check out ${title} at ${displayLoc}: ${window.location.href}`)}`}
                target="_blank" rel="noopener noreferrer">
                📱 WhatsApp
              </a>
              <a
                className="pd-share__btn"
                href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this property: ${window.location.href}`)}`}>
                ✉️ Email
              </a>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className={`pd-related${relVis ? ' pd-reveal' : ''}`} ref={relRef}>
          <div className="container">
            <div className="pd-related__header">
              <span className="sec-tag">You May Also Like</span>
              <h2 className="sec-title">Similar <span className="hi">Properties</span></h2>
            </div>
            <div className="grid-3">
              {related.map((p, i) => (
                <PropertyCard key={p._id} property={p} style={{animationDelay: `${i * 80}ms`}} />
              ))}
            </div>
            <div className="pd-related__cta">
              <Link to="/properties" className="btn btn-outline">View All Properties →</Link>
            </div>
          </div>
        </section>
      )}

      <div className={`pd-sticky${showSticky ? ' visible' : ''}`}>
        <div className="pd-sticky__price">{displayPrice}</div>
        <div className="pd-sticky__actions">
          <a href="tel:6304829287" className="btn btn-outline-light btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call
          </a>
          <button
            className="btn btn-gold btn-sm"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            📅 Enquire
          </button>
        </div>
      </div>

      {/* ── Brochure Modal ───────────────────────────────── */}
      {brochureModal && (
        <div
          style={{
            position:'fixed', inset:0, zIndex:9000,
            background:'rgba(6,13,24,0.75)', backdropFilter:'blur(6px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            padding:'16px',
          }}
          onClick={() => setBrochureModal(false)}>
          <div
            style={{
              background:'#fff', borderRadius:20, width:'100%', maxWidth:440,
              boxShadow:'0 32px 80px rgba(0,0,0,0.35)',
              overflow:'hidden', animation:'fadeUp .3s ease both',
            }}
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={{
              background:'linear-gradient(135deg,#1A2B4A,#243a60)',
              padding:'22px 24px 18px', position:'relative',
            }}>
              <button
                onClick={() => setBrochureModal(false)}
                style={{
                  position:'absolute', top:14, right:14,
                  background:'rgba(255,255,255,0.1)', border:'none',
                  borderRadius:'50%', width:32, height:32,
                  color:'#fff', cursor:'pointer', fontSize:16,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>✕</button>
              <div style={{fontSize:28, marginBottom:8}}>📄</div>
              <h3 style={{color:'#fff', fontSize:18, fontWeight:700, margin:'0 0 4px', fontFamily:'inherit'}}>
                Download Brochure
              </h3>
              <p style={{color:'rgba(255,255,255,0.6)', fontSize:13, margin:0}}>
                {title} — Fill in your details to get the brochure
              </p>            </div>

            {/* Form */}
            <form onSubmit={handleBrochureSubmit} style={{padding:'24px'}}>
              {brochureError && (
                <div style={{
                  background:'#fff5f5', border:'1px solid #fecaca',
                  borderRadius:8, padding:'10px 14px',
                  fontSize:13, color:'#c53030', marginBottom:14,
                }}>
                  ⚠️ {brochureError}
                </div>
              )}

              <div className="form-field" style={{marginBottom:14}}>
                <label className="form-label">Your Name *</label>
                <input
                  type="text" placeholder="Enter your name" required
                  value={brochureForm.name}
                  onChange={e => setBrochureForm(f => ({...f, name: e.target.value}))}
                  className="form-input"
                />
              </div>

              <div className="form-field" style={{marginBottom:14}}>
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel" placeholder="10-digit mobile number" maxLength={10}
                  value={brochureForm.phone}
                  onChange={e => setBrochureForm(f => ({...f, phone: e.target.value.replace(/\D/g,'').slice(0,10)}))}
                  className="form-input"
                />
              </div>

              <div className="form-field" style={{marginBottom:14}}>
                <label className="form-label">Email Address *</label>
                <input
                  type="email" placeholder="Enter your email" required
                  value={brochureForm.email}
                  onChange={e => setBrochureForm(f => ({...f, email: e.target.value}))}
                  className="form-input"
                />
              </div>

              {/* <div className="form-field" style={{marginBottom:14}}>
                <label className="form-label">Preferred Visit Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={brochureForm.scheduleDate}
                  onChange={e => setBrochureForm(f => ({...f, scheduleDate: e.target.value}))}
                  className="form-input"
                />
              </div> */}

              <div className="form-field" style={{marginBottom:20}}>
                <label className="form-label">Message</label>
                <textarea
                  rows={3}
                  placeholder={`I'm interested in ${title}. Please share more details…`}
                  value={brochureForm.message}
                  onChange={e => setBrochureForm(f => ({...f, message: e.target.value}))}
                  className="form-input"
                  style={{resize:'none', minHeight:72}}
                />
              </div>

              <button
                type="submit"
                disabled={brochureSubmitting}
                className="btn btn-gold btn-full"
                style={{height:48, fontSize:15, fontWeight:700}}>
                {brochureSubmitting ? (
                  <>
                    <span style={{
                      display:'inline-block', width:16, height:16,
                      border:'2px solid rgba(12,24,37,0.3)', borderTopColor:'#1A2B4A',
                      borderRadius:'50%', animation:'rotateSlow .7s linear infinite',
                      marginRight:8,
                    }} />
                    Submitting…
                  </>
                ) : brochureLink ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight:6}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download Brochure
                  </>
                ) : (
                  <>📅 Schedule Visit</>
                )}
              </button>

              <p style={{textAlign:'center', fontSize:12, color:'#94a3b8', marginTop:12}}>
                {brochureLink
                  ? 'Your details are safe with us. No spam, ever.'
                  : 'Our team will call you within 2 hours.'}
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ── Directions Modal ─────────────────────────────── */}
      {directionsModal && (
        <div
          style={{
            position:'fixed', inset:0, zIndex:9000,
            background:'rgba(6,13,24,0.75)', backdropFilter:'blur(6px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            padding:'16px',
          }}
          onClick={() => setDirectionsModal(false)}>
          <div
            style={{
              background:'#fff', borderRadius:20, width:'100%', maxWidth:440,
              boxShadow:'0 32px 80px rgba(0,0,0,0.35)',
              overflow:'hidden', animation:'fadeUp .3s ease both',
            }}
            onClick={e => e.stopPropagation()}>

            <div style={{
              background:'linear-gradient(135deg,#1A2B4A,#243a60)',
              padding:'22px 24px 18px', position:'relative',
            }}>
              <button
                onClick={() => setDirectionsModal(false)}
                style={{
                  position:'absolute', top:14, right:14,
                  background:'rgba(255,255,255,0.1)', border:'none',
                  borderRadius:'50%', width:32, height:32,
                  color:'#fff', cursor:'pointer', fontSize:16,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>✕</button>
              <div style={{fontSize:28, marginBottom:8}}>📍</div>
              <h3 style={{color:'#fff', fontSize:18, fontWeight:700, margin:'0 0 4px', fontFamily:'inherit'}}>
                Get Directions
              </h3>
              <p style={{color:'rgba(255,255,255,0.6)', fontSize:13, margin:0}}>
                {title} — share your details and we'll open the map for you.
              </p>
            </div>

            <form onSubmit={handleDirectionsSubmit} style={{padding:'24px'}}>
              {directionsError && (
                <div style={{
                  background:'#fff5f5', border:'1px solid #fecaca',
                  borderRadius:8, padding:'10px 14px',
                  fontSize:13, color:'#c53030', marginBottom:14,
                }}>
                  ⚠️ {directionsError}
                </div>
              )}

              <div className="form-field" style={{marginBottom:14}}>
                <label className="form-label">Your Name *</label>
                <input
                  type="text" placeholder="Enter your name" required
                  value={directionsForm.name}
                  onChange={e => setDirectionsForm(f => ({...f, name: e.target.value}))}
                  className="form-input"
                />
              </div>

              <div className="form-field" style={{marginBottom:14}}>
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel" placeholder="10-digit mobile number" maxLength={10}
                  value={directionsForm.phone}
                  onChange={e => setDirectionsForm(f => ({...f, phone: e.target.value.replace(/\D/g,'').slice(0,10)}))}
                  className="form-input"
                />
              </div>

              <div className="form-field" style={{marginBottom:20}}>
                <label className="form-label">Email Address *</label>
                <input
                  type="email" placeholder="Enter your email" required
                  value={directionsForm.email}
                  onChange={e => setDirectionsForm(f => ({...f, email: e.target.value}))}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={directionsSubmitting}
                className="btn btn-gold btn-full"
                style={{height:48, fontSize:15, fontWeight:700}}>
                {directionsSubmitting ? (
                  <>
                    <span style={{
                      display:'inline-block', width:16, height:16,
                      border:'2px solid rgba(12,24,37,0.3)', borderTopColor:'#1A2B4A',
                      borderRadius:'50%', animation:'rotateSlow .7s linear infinite',
                      marginRight:8,
                    }} />
                    Submitting…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight:6}}><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                    Open in Google Maps
                  </>
                )}
              </button>

              <p style={{textAlign:'center', fontSize:12, color:'#94a3b8', marginTop:12}}>
                Our advisor will follow up within 2 hours to assist your site visit.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────────── */}
      {lightbox && hasGallery && (
        <div className="pd-lightbox" onClick={() => setLightbox(false)}>
          <button className="pd-lightbox__close" onClick={() => setLightbox(false)} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <button className="pd-lightbox__nav pd-lightbox__nav--prev" onClick={e => { e.stopPropagation(); goPrev(); }} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="pd-lightbox__img-wrap" onClick={e => e.stopPropagation()}>
            <img src={galleryImgs[safeActiveImg]} alt={`${title} — ${safeActiveImg + 1}`} className="pd-lightbox__img" />
            <div className="pd-lightbox__counter">{safeActiveImg + 1} / {galleryImgs.length}</div>
          </div>
          <button className="pd-lightbox__nav pd-lightbox__nav--next" onClick={e => { e.stopPropagation(); goNext(); }} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Gallery subcomponent ──────────────────────────────────────────────────────
function Gallery({
  galleryImgs, hasGallery, imgError, setImgError,
  safeActiveImg, setActiveImg, isPaused, setIsPaused,
  autoPlayRef, title, badge, badgeClass, status, statusClass,
  mounted, goNext, goPrev, goTo, onOpenLightbox,
}) {
  useEffect(() => {
    if (!hasGallery || galleryImgs.length <= 1 || isPaused || imgError) return;
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActiveImg(i => (i + 1) % galleryImgs.length);
    }, AUTO_PLAY_INTERVAL);
    return () => { if (autoPlayRef.current) { clearInterval(autoPlayRef.current); autoPlayRef.current = null; } };
  }, [hasGallery, galleryImgs.length, isPaused, imgError, setActiveImg, autoPlayRef]);

  if (!hasGallery || imgError) {
    return (
      <div className={`pd-gallery${mounted ? ' anim-fade-up' : ''}`}>
        <div className="pd-gallery__main pd-gallery__main--empty">
          <div className="pd-gallery__empty">
            <div className="pd-gallery__empty-icon">🏠</div>
            <div className="pd-gallery__empty-text">No photos available yet</div>
          </div>
          <div className="pd-gallery__badges">
            {badge && <span className={badgeClass}>{badge}</span>}
            {status && <span className={statusClass}>{status}</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`pd-gallery${mounted ? ' anim-fade-up' : ''}`}>
      <div
        className="pd-gallery__main"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}>
        <img
          key={safeActiveImg}
          src={galleryImgs[safeActiveImg]}
          alt={`${title} — view ${safeActiveImg + 1}`}
          className="pd-gallery__main-img"
          onClick={() => onOpenLightbox && onOpenLightbox()}
          style={{ cursor: 'zoom-in' }}
          onError={() => {
            if (safeActiveImg < galleryImgs.length - 1) setActiveImg(safeActiveImg + 1);
            else setImgError(true);
          }}
        />
        <div className="pd-gallery__main-overlay" />

        {/* Expand icon */}
        <button className="pd-gallery__expand" onClick={() => onOpenLightbox && onOpenLightbox()} aria-label="View fullscreen">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        </button>

        <div className="pd-gallery__badges">
          {badge && <span className={badgeClass}>{badge}</span>}
          {status && <span className={statusClass}>{status}</span>}
        </div>

        {galleryImgs.length > 1 && (
          <>
            <button className="pd-gallery__nav pd-gallery__nav--prev" onClick={goPrev} aria-label="Previous image">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="pd-gallery__nav pd-gallery__nav--next" onClick={goNext} aria-label="Next image">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </>
        )}

        {galleryImgs.length > 1 && galleryImgs.length <= 10 && (
          <div className="pd-gallery__dots">
            {galleryImgs.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`pd-gallery__dot${i === safeActiveImg ? ' active' : ''}`}
                aria-label={`Go to image ${i + 1}`} />
            ))}
          </div>
        )}

        <div className="pd-gallery__counter">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          {safeActiveImg + 1} / {galleryImgs.length}
        </div>
      </div>

      {galleryImgs.length > 1 && (
        <div className="pd-gallery__thumbs">
          {galleryImgs.map((img, i) => (
            <button key={i} className={`pd-gallery__thumb${i === safeActiveImg ? ' active' : ''}`} onClick={() => goTo(i)}>
              <img src={img} alt={`Thumbnail ${i + 1}`} onError={e => { e.target.closest('button').style.display = 'none'; }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}