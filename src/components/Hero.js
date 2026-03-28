import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HERO_SLIDES, STATS } from '../data/Properties';
import './Hero.css';

export default function Hero() {
  const navigate = useNavigate();
  const [slide, setSlide]         = useState(0);
  const [transitioning, setTrans] = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [searchType, setSearchType] = useState('Buy');
  const [searchForm, setSearchForm] = useState({ propertyType: '', location: '', budget: '' });

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
    const id = setInterval(() => {
      setTrans(true);
      setTimeout(() => { setSlide(s => (s + 1) % HERO_SLIDES.length); setTrans(false); }, 400);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const current = HERO_SLIDES[slide];

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (searchForm.propertyType) p.set('subtype', searchForm.propertyType);
    if (searchForm.location)     p.set('location', searchForm.location);
    if (searchType === 'Rent')   p.set('status', 'For Rent');
    if (searchType === 'Lease')  p.set('status', 'For Lease');
    navigate(`/properties?${p.toString()}`);
  };

  return (
    <section className="hero">
      {/* ── Background slideshow ──────────────────────── */}
      <div className={`hero__bg${transitioning ? ' hero__bg--fade' : ''}`}>
        {HERO_SLIDES.map((s, i) => (
          <div key={s.id} className={`hero__bg-slide${i === slide ? ' active' : ''}`}
            style={{ backgroundImage: `url(${s.img})` }} />
        ))}
        <div className="hero__overlay" />
        <div className="hero__pattern" />
      </div>

      {/* ── Slide indicators ─────────────────────────── */}
      <div className="hero__indicators">
        {HERO_SLIDES.map((s, i) => (
          <button key={s.id} className={`hero__indicator${i === slide ? ' active' : ''}`}
            onClick={() => setSlide(i)} />
        ))}
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="container hero__content">
        <div className={`hero__text${mounted ? ' mounted' : ''}`}>

          <div className={`hero__tag anim-fade-up${mounted ? '' : ' hidden'}`}>
            <span className="hero__tag-dot" />
            {current.tag}
          </div>

          <h1 className={`hero__title anim-fade-up d-2${mounted ? '' : ' hidden'}`}>
            {current.title.split('\n').map((line, i) => (
              <span key={i} className={i === 1 ? 'hero__title-italic' : ''}>
                {line}<br />
              </span>
            ))}
          </h1>

          <div className={`hero__price-tag anim-fade-up d-3${mounted ? '' : ' hidden'}`}>
            <span className="hero__price-label">Starting</span>
            <span className="hero__price-val">{current.price}</span>
          </div>

          <div className={`hero__btns anim-fade-up d-4${mounted ? '' : ' hidden'}`}>
            <Link to="/properties" className="btn btn-gold btn-lg">
              Explore Properties
            </Link>
            <a href="tel:18005006000" className="btn btn-outline-light btn-lg">
              📞 Talk to Expert
            </a>
          </div>
        </div>

        {/* ── Stats strip ──────────────────────────────── */}
        <div className={`hero__stats anim-fade-up d-5${mounted ? '' : ' hidden'}`}>
          {STATS.map((s, i) => (
            <div key={i} className="hero__stat">
              <span className="hero__stat-icon">{s.icon}</span>
              <span className="hero__stat-val">{s.value}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search box ───────────────────────────────── */}
      <div className="hero__search-wrap">
        <div className="container">
          <div className={`hero__search anim-fade-up d-6${mounted ? '' : ' hidden'}`}>
            {/* Tabs */}
            <div className="hero__search-tabs">
              {['Buy', 'Rent', 'Lease'].map(t => (
                <button key={t}
                  className={`hero__search-tab${searchType === t ? ' active' : ''}`}
                  onClick={() => setSearchType(t)}>
                  {t}
                </button>
              ))}
            </div>

            {/* Form */}
            <form className="hero__search-form" onSubmit={handleSearch}>
              <div className="hero__search-field">
                <label>Property Type</label>
                <select value={searchForm.propertyType}
                  onChange={e => setSearchForm(f => ({ ...f, propertyType: e.target.value }))}>
                  <option value="">All Types</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Row House</option>
                  <option>Duplex</option>
                  <option>Penthouse</option>
                  <option>Office Space</option>
                  <option>Farmhouse</option>
                  <option>Retail Shop</option>
                </select>
              </div>

              <div className="hero__search-sep" />

              <div className="hero__search-field">
                <label>Location</label>
                <select value={searchForm.location}
                  onChange={e => setSearchForm(f => ({ ...f, location: e.target.value }))}>
                  <option value="">All Locations</option>
                  <option>Banjara Hills</option>
                  <option>Jubilee Hills</option>
                  <option>Gachibowli</option>
                  <option>Madhapur</option>
                  <option>Kondapur</option>
                  <option>Hitec City</option>
                  <option>Narsingi</option>
                  <option>Begumpet</option>
                  <option>Shamshabad</option>
                </select>
              </div>

              <div className="hero__search-sep" />

              <div className="hero__search-field">
                <label>Budget</label>
                <select value={searchForm.budget}
                  onChange={e => setSearchForm(f => ({ ...f, budget: e.target.value }))}>
                  <option value="">Any Budget</option>
                  <option>Under ₹50 Lakh</option>
                  <option>₹50L – ₹1 Cr</option>
                  <option>₹1 Cr – ₹2 Cr</option>
                  <option>₹2 Cr – ₹5 Cr</option>
                  <option>Above ₹5 Cr</option>
                </select>
              </div>

              <button type="submit" className="hero__search-btn">
                🔍 Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}