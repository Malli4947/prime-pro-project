import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { PROPERTIES } from '../data/Properties';
import './Properties.css';

const TYPES    = ['All', 'Residential', 'Commercial', 'Agriculture'];
const STATUSES = ['All', 'For Sale', 'For Rent', 'For Lease'];
const SORTS    = ['Default', 'Price: Low to High', 'Price: High to Low', 'Highest Rated'];

export default function Properties() {
  const [params] = useSearchParams();

  const [type,   setType]   = useState(params.get('type')   || 'All');
  const [status, setStatus] = useState(params.get('status') || 'All');
  const [sort,   setSort]   = useState('Default');
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  /* ── Filter logic ────────────────────────────────────── */
  let results = PROPERTIES.filter(p => {
    if (type   !== 'All' && p.type   !== type)   return false;
    if (status !== 'All' && p.status !== status)  return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) &&
          !p.location.toLowerCase().includes(q) &&
          !p.subtype.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (sort === 'Price: Low to High')  results = [...results].sort((a,b) => a.priceRaw - b.priceRaw);
  if (sort === 'Price: High to Low')  results = [...results].sort((a,b) => b.priceRaw - a.priceRaw);
  if (sort === 'Highest Rated')       results = [...results].sort((a,b) => (b.rating||0) - (a.rating||0));

  const clearAll = () => { setType('All'); setStatus('All'); setSearch(''); setSort('Default'); };

  return (
    <div className="props-page">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="props-hero">
        <div className="props-hero__bg" />
        <div className="container props-hero__content">
          <div className={mounted ? 'anim-fade-up' : ''}>
            <span className="sec-tag">Explore</span>
            <h1 className="props-hero__title">
              Find Your <span className="hi">Perfect Property</span>
            </h1>
            <p className="props-hero__sub">
              {PROPERTIES.length} verified listings across Hyderabad's prime locations
            </p>
          </div>
        </div>
      </section>

      {/* ── Filters ──────────────────────────────────────── */}
      <div className="container">
        <div className={`props-filters${mounted ? ' anim-fade-up d-2' : ''}`}>
          {/* Search */}
          <div className="props-filters__search">
            <span className="props-filters__search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, location or type…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="props-filters__search-input"
            />
            {search && (
              <button className="props-filters__search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {/* Filter row */}
          <div className="props-filters__row">
            {/* Type pills */}
            <div className="props-filter-group">
              <span className="props-filter-label">Type</span>
              <div className="props-pills">
                {TYPES.map(t => (
                  <button key={t}
                    className={`props-pill${type === t ? ' active' : ''}`}
                    onClick={() => setType(t)}>{t}</button>
                ))}
              </div>
            </div>

            {/* Status pills */}
            <div className="props-filter-group">
              <span className="props-filter-label">Status</span>
              <div className="props-pills">
                {STATUSES.map(s => (
                  <button key={s}
                    className={`props-pill${status === s ? ' active' : ''}`}
                    onClick={() => setStatus(s)}>{s}</button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="props-filter-group props-filter-group--sort">
              <span className="props-filter-label">Sort by</span>
              <select value={sort} onChange={e => setSort(e.target.value)} className="props-sort-select">
                {SORTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Meta */}
          <div className="props-filters__meta">
            <span className="props-filters__count">
              <b>{results.length}</b> properties found
            </span>
            {(type !== 'All' || status !== 'All' || search || sort !== 'Default') && (
              <button className="props-filters__clear" onClick={clearAll}>Clear all ✕</button>
            )}
          </div>
        </div>

        {/* ── Results ────────────────────────────────────── */}
        {results.length === 0 ? (
          <div className="props-empty">
            <div className="props-empty__icon">🏚️</div>
            <h3 className="props-empty__title">No properties found</h3>
            <p className="props-empty__sub">Try adjusting your filters or search query.</p>
            <button className="btn btn-gold" onClick={clearAll}>Clear Filters</button>
          </div>
        ) : (
          <div className={`grid-3 props-grid${mounted ? ' anim-fade-up d-3' : ''}`}>
            {results.map((p, i) => (
              <PropertyCard
                key={p.id}
                property={p}
                style={{ animationDelay: `${Math.min(i, 5) * 60}ms` }}
              />
            ))}
          </div>
        )}

        {/* Bottom padding */}
        <div style={{ height: 64 }} />
      </div>
    </div>
  );
}