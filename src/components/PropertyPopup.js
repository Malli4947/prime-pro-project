import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './PropertyPopup.css';

const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

const SHOW_DURATION  = 5500;
const PAUSE_DURATION = 4000;
const INITIAL_DELAY  = 3500;

function getImg(p) {
  if (Array.isArray(p.images) && p.images.length > 0) {
    const first = p.images[0];
    const url = typeof first === 'string' ? first : first?.url;
    if (url && url.startsWith('http')) return url;
  }
  if (p.image && p.image.startsWith('http')) return p.image;
  return null;
}

function getPrice(p) {
  return p.priceLabel || p.totalPriceLabel ||
    (p.totalPrice > 0 ? `₹${Number(p.totalPrice).toLocaleString('en-IN')}` : null) ||
    (p.price > 0 ? `₹${Number(p.price).toLocaleString('en-IN')}` : null) ||
    'Price on Request';
}

function getLoc(p) {
  if (p.location?.locality) {
    return `${p.location.locality}${p.location.city ? ', ' + p.location.city : ''}`;
  }
  return p.location?.address || p.location || 'Hyderabad';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PropertyPopup() {
  const [properties, setProperties] = useState([]);
  const [current, setCurrent]       = useState(null);
  const [visible, setVisible]       = useState(false);
  const [progress, setProgress]     = useState(0);
  const [dismissed, setDismissed]   = useState(false);

  const queueRef = useRef([]);
  const timerRef = useRef(null);
  const progRef  = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    fetch(`${BASE}/api/properties?page=1&limit=20`)
      .then(r => r.json())
      .then(d => {
        if (d?.success && Array.isArray(d.properties) && d.properties.length > 0) {
          setProperties(d.properties);
        }
      })
      .catch(() => {});
  }, []);

  const clearTimers = useCallback(() => {
    clearTimeout(timerRef.current);
    cancelAnimationFrame(progRef.current);
  }, []);

  const showNext = useCallback(() => {
    if (dismissed) return;
    if (queueRef.current.length === 0) {
      if (properties.length === 0) return;
      queueRef.current = shuffle(properties);
    }
    const prop = queueRef.current.shift();
    setCurrent(prop);
    setProgress(0);
    setVisible(true);
    startRef.current = Date.now();

    const tick = () => {
      const pct = Math.min(((Date.now() - startRef.current) / SHOW_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) progRef.current = requestAnimationFrame(tick);
    };
    progRef.current = requestAnimationFrame(tick);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      timerRef.current = setTimeout(showNext, PAUSE_DURATION);
    }, SHOW_DURATION);
  }, [properties, dismissed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (properties.length === 0 || dismissed) return;
    clearTimers();
    timerRef.current = setTimeout(showNext, INITIAL_DELAY);
    return clearTimers;
  }, [properties, dismissed, showNext, clearTimers]);

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimers();
    setVisible(false);
    setDismissed(true);
  };

  if (!current || dismissed) return null;

  const img   = getImg(current);
  const price = getPrice(current);
  const loc   = getLoc(current);
  const badge = current.badge || current.status || 'Featured';
  const type  = current.subtype || current.type || 'Property';
  const link  = `/properties/${current._id}`;

  return (
    <div
      className={`prop-popup${visible ? ' prop-popup--visible' : ''}`}
      role="status"
      aria-live="polite"
    >
      {/* ── Header strip ── */}
      <div className="prop-popup__header">
        <div className="prop-popup__live">
          <span className="prop-popup__dot" />
          <span className="prop-popup__live-text">New Listing</span>
        </div>
        <button className="prop-popup__close" onClick={handleClose} aria-label="Close">×</button>
      </div>

      {/* ── Horizontal body ── */}
      <Link to={link} className="prop-popup__body">
        {/* Image left */}
        <div className="prop-popup__img-wrap">
          {img
            ? <img src={img} alt={current.title} className="prop-popup__img" loading="lazy" />
            : <div className="prop-popup__img-placeholder">🏠</div>
          }
          {/* <span className="prop-popup__badge">{badge}</span> */}
        </div>

        {/* Info right */}
        <div className="prop-popup__info">
          <div className="prop-popup__price">{price}</div>
          <div className="prop-popup__title">{current.title}</div>
          <div className="prop-popup__loc">📍 {loc}</div>
          <span className="prop-popup__type">{type}</span>
          {/* <span className="prop-popup__view">View Property →</span> */}
        </div>
      </Link>

      {/* ── Progress bar ── */}
      <div className="prop-popup__progress">
        <div className="prop-popup__progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
