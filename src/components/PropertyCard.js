import React from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

const BADGE_CLASS = {
  Premium:    'pill pill-gold',
  Featured:   'pill pill-navy',
  Hot:        'pill pill-red',
  'New Launch':'pill pill-green',
  Lease:      'pill pill-purple',
  Commercial: 'pill pill-amber',
};
const STATUS_CLASS = {
  'For Sale':  'prop-card__status prop-card__status--sale',
  'For Rent':  'prop-card__status prop-card__status--rent',
  'For Lease': 'prop-card__status prop-card__status--lease',
};

export default function PropertyCard({ property, style }) {
  const { id, title, location, price, type, subtype, status, beds, baths, area, image, badge, rating, reviews } = property;

  return (
    <Link to={`/properties/${id}`} className="prop-card card" style={style}>

      {/* ── Image ────────────────────────────────────────── */}
      <div className="prop-card__img-wrap">
        <img src={image} alt={title} className="prop-card__img" loading="lazy" />
        <div className="prop-card__img-overlay" />

        {/* Top row badges */}
        <div className="prop-card__top">
          {badge && <span className={BADGE_CLASS[badge] || 'pill pill-navy'}>{badge}</span>}
          <span className={STATUS_CLASS[status] || 'prop-card__status'}>{status}</span>
        </div>

        {/* Price */}
        <div className="prop-card__price-wrap">
          <span className="prop-card__price">{price}</span>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="prop-card__body">
        <div className="prop-card__meta">
          <span className="prop-card__type">{type} · {subtype}</span>
          {rating && (
            <span className="prop-card__rating">
              ⭐ {rating} <span className="prop-card__reviews">({reviews})</span>
            </span>
          )}
        </div>

        <h3 className="prop-card__title">{title}</h3>

        <p className="prop-card__loc">
          <span className="prop-card__loc-pin">📍</span>
          {location}
        </p>

        <div className="prop-card__sep" />

        <div className="prop-card__specs">
          {beds  != null && <span className="prop-card__spec">🛏 {beds} Bed{beds > 1 ? 's' : ''}</span>}
          {baths != null && <span className="prop-card__spec">🚿 {baths} Bath{baths > 1 ? 's' : ''}</span>}
          <span className="prop-card__spec">📐 {area}</span>
        </div>

        <div className="prop-card__footer">
          <span className="prop-card__cta">View Details →</span>
        </div>
      </div>
    </Link>
  );
}