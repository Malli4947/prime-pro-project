import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import './PropertyCard.css';

// ── Auto-rotate every 30 seconds ─────────────────────────────────────────────
const AUTO_PLAY_INTERVAL = 30000;

// ── Safe image URL extractor — handles objects OR strings ────────────────────
function toValidImgArray(images, image) {
  const isValidUrl = url =>
    typeof url === 'string' &&
    url.trim().length > 0 &&
    (url.startsWith('http') || url.startsWith('/'));

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

  // Primary images go to the front
  fromArray.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));

  let urls = fromArray.map(i => i.url);
  if (urls.length === 0 && isValidUrl(image)) urls = [image];
  return [...new Set(urls)];
}

export default function PropertyCard({property, style}) {
  // ⚠️ ALL hooks must be called BEFORE any conditional return.
  // Even if property is null, we still call hooks in the same order.

  // Safely extract image data up front — even from a missing property
  const images = property?.images;
  const image = property?.image;
  const galleryImgs = toValidImgArray(images, image);
  const hasGallery = galleryImgs.length > 0;

  const [activeImg, setActiveImg] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);

  const safeActiveImg = Math.min(activeImg, Math.max(0, galleryImgs.length - 1));

  // Auto-rotate every 30s (pauses on hover, stops if single image)
  useEffect(() => {
    if (!hasGallery || galleryImgs.length <= 1 || isPaused || imgError) return;

    if (autoPlayRef.current) clearInterval(autoPlayRef.current);

    autoPlayRef.current = setInterval(() => {
      setActiveImg(i => (i + 1) % galleryImgs.length);
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [hasGallery, galleryImgs.length, isPaused, imgError]);

  // ✅ Now it's safe to early-return — all hooks above have run in consistent order
  if (!property) return null;

  const {
    _id,
    title,
    priceLabel,
    price,
    location,
    beds,
    baths,
    area,
    status,
    type,
    subtype,
    badge,
    featured,
  } = property;

  // Derived display values
  const displayPrice =
    priceLabel ||
    (price ? `₹${Number(price).toLocaleString('en-IN')}` : 'Price on Request');
  const displayLoc = location?.locality
    ? `${location.locality}${location.city ? ', ' + location.city : ''}`
    : location?.address || 'Hyderabad';
  const propertyLink = `/properties/${_id}`;

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
      Commercial: 'pill pill-amber',
    }[badge] || 'pill pill-navy';

  // Carousel handlers — stopPropagation prevents nav to details page
  const goNext = e => {
    e.preventDefault();
    e.stopPropagation();
    setImgError(false);
    setActiveImg(i => (i + 1) % galleryImgs.length);
  };
  const goPrev = e => {
    e.preventDefault();
    e.stopPropagation();
    setImgError(false);
    setActiveImg(i => (i - 1 + galleryImgs.length) % galleryImgs.length);
  };
  const goTo = (e, i) => {
    e.preventDefault();
    e.stopPropagation();
    setImgError(false);
    setActiveImg(i);
  };

  const currentImg = hasGallery && !imgError ? galleryImgs[safeActiveImg] : null;

  return (
    <div className="prop-card" style={style}>
      {/* ── Image carousel ─────────────────────────────────── */}
      <Link
        to={propertyLink}
        className="prop-card__img-wrap"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}>
        {currentImg ? (
          <img
            key={safeActiveImg}
            src={currentImg}
            alt={`${title} — view ${safeActiveImg + 1}`}
            className="prop-card__img"
            loading="lazy"
            onError={() => {
              if (safeActiveImg < galleryImgs.length - 1) {
                setActiveImg(safeActiveImg + 1);
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          <div className="prop-card__img-placeholder">
            <span>🏠</span>
          </div>
        )}

        <div className="prop-card__img-overlay" />

        {/* Top row: badges + status */}
        <div className="prop-card__top">
          <div className="prop-card__badges">
            {badge && <span className={badgeClass}>{badge}</span>}
            {featured && !badge && <span className="pill pill-gold">Featured</span>}
          </div>
          {status && <span className={statusClass}>{status}</span>}
        </div>

        {/* Type chip (bottom-left) */}
        <div className="prop-card__type-chip">{subtype || type}</div>

        {/* Prev / Next arrows — only when multiple images */}
        {galleryImgs.length > 1 && !imgError && (
          <>
            <button
              className="prop-card__nav prop-card__nav--prev"
              onClick={goPrev}
              aria-label="Previous image">
              ‹
            </button>
            <button
              className="prop-card__nav prop-card__nav--next"
              onClick={goNext}
              aria-label="Next image">
              ›
            </button>
          </>
        )}

        {/* Dots (capped at 6) */}
        {galleryImgs.length > 1 && galleryImgs.length <= 6 && !imgError && (
          <div className="prop-card__dots">
            {galleryImgs.map((_, i) => (
              <button
                key={i}
                onClick={e => goTo(e, i)}
                className={`prop-card__dot${i === safeActiveImg ? ' active' : ''}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Counter (for > 6 images) */}
        {galleryImgs.length > 6 && !imgError && (
          <div className="prop-card__counter">
            📷 {safeActiveImg + 1}/{galleryImgs.length}
          </div>
        )}
      </Link>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="prop-card__body">
        <div className="prop-card__price">{displayPrice}</div>

        <h3 className="prop-card__title">
          <Link to={propertyLink}>{title}</Link>
        </h3>

        <p className="prop-card__loc">📍 {displayLoc}</p>

        {/* Specs */}
        <div className="prop-card__specs">
          {beds != null && (
            <span className="prop-card__spec">
              🛏️ {beds} {beds === 1 ? 'Bed' : 'Beds'}
            </span>
          )}
          {baths != null && (
            <span className="prop-card__spec">
              🚿 {baths} {baths === 1 ? 'Bath' : 'Baths'}
            </span>
          )}
          {area && (
            <span className="prop-card__spec">📐 {area}</span>
          )}
        </div>

        <Link to={propertyLink} className="btn btn-gold btn-sm prop-card__cta">
          View Details →
        </Link>
      </div>
    </div>
  );
}