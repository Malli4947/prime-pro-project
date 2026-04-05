import { Link } from 'react-router-dom';
import './PropertyCard.css';

export default function PropertyCard({ property, style }) {
  if (!property) return null;

  // ── Map real API fields ─────────────────────────────────────────────────────
  // Backend returns: _id, title, priceLabel, price, location{locality,city},
  //                  image (virtual), images[], beds, baths, area, status,
  //                  type, subtype, badge, featured
  const {
    _id,
    title,
    priceLabel,
    price,
    location,
    image,
    images,
    beds,
    baths,
    area,
    status,
    type,
    subtype,
    badge,
    featured,
  } = property;

  const displayPrice   = priceLabel || (price ? `₹${Number(price).toLocaleString('en-IN')}` : 'Price on Request');
  const displayLoc     = location?.locality
    ? `${location.locality}${location.city ? ', ' + location.city : ''}`
    : location?.address || 'Hyderabad';
  const displayImage   = image || (images && images.length > 0 ? images[0] : null);
  const propertyLink   = `/properties/${_id}`;

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
    'Commercial': 'pill pill-amber',
  }[badge] || 'pill pill-navy';

  return (
    <div className="prop-card" style={style}>
      {/* Image */}
      <Link to={propertyLink} className="prop-card__img-wrap">
        {displayImage ? (
          <img src={displayImage} alt={title} className="prop-card__img" loading="lazy" />
        ) : (
          <div className="prop-card__img-placeholder">
            <span>🏠</span>
          </div>
        )}
        <div className="prop-card__overlay" />

        {/* Badges */}
        <div className="prop-card__badges">
          {badge    && <span className={badgeClass}>{badge}</span>}
          {featured && !badge && <span className="pill pill-gold">Featured</span>}
          <span className={statusClass}>{status}</span>
        </div>

        {/* Type chip */}
        <div className="prop-card__type">{subtype || type}</div>
      </Link>

      {/* Body */}
      <div className="prop-card__body">
        <div className="prop-card__price">{displayPrice}</div>
        <h3 className="prop-card__title">
          <Link to={propertyLink}>{title}</Link>
        </h3>
        <p className="prop-card__loc">📍 {displayLoc}</p>

        {/* Specs */}
        <div className="prop-card__specs">
          {beds  != null && (
            <span className="prop-card__spec">🛏️ {beds} {beds === 1 ? 'Bed' : 'Beds'}</span>
          )}
          {baths != null && (
            <span className="prop-card__spec">🚿 {baths} {baths === 1 ? 'Bath' : 'Baths'}</span>
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