import  { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import AnimatedBackground from '../components/AnimatedBackground';
import './Properties.css';

const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

// These match the backend enum values exactly
const TYPES    = ['All', 'Residential', 'Commercial', 'Agriculture', 'Industrial'];
const STATUSES = ['All', 'For Sale', 'For Rent', 'For Lease'];
const SORTS    = [
  { label:'Default',              val:'-createdAt'   },
  { label:'Price: Low to High',   val:'price'        },
  { label:'Price: High to Low',   val:'-price'       },
  { label:'Newest First',         val:'-createdAt'   },
  { label:'Most Popular',         val:'-views'       },
];

// Category quick-filter — maps to exact subtype values stored in the backend
const CATEGORIES = [
  { label: 'All',        value: '' },
  { label: 'Apartments', value: 'Apartment' },
  { label: 'Villas',     value: 'Villa' },
  { label: 'Plots',      value: 'Plot' },
];

export default function Properties() {
  const [params] = useSearchParams();

  const [type,        setType]       = useState(params.get('type')   || 'All');
  const [status,      setStatus]     = useState(params.get('status') || 'All');
  const [category,    setCategory]   = useState(params.get('subtype') || params.get('category') || '');
  const [sort,        setSort]       = useState('-createdAt');
  const [searchInput, setSearchInput]= useState('');   // raw input — updates instantly
  const [search,      setSearch]     = useState('');   // debounced — triggers fetch
  const [mounted,     setMounted]    = useState(false);

  const [properties, setProperties] = useState([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [pages,      setPages]      = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  const LIMIT = 12;

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  // Debounce search input — wait 400ms after user stops typing before fetching
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [type, status, sort, search, category]);

  // GET /api/properties — with filters mapped to backend query params.
  // Plot-family subtypes vary in the DB (Plot / Plots / Open Plot / Open Plots
  // / Farm Land etc.), so we strip the exact subtype filter for those and
  // match client-side on a substring instead — prevents "no data found".
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const cat = (category || '').trim();
      const catLower = cat.toLowerCase();
      const isPlotFamily = /\bplot/.test(catLower) || /farm/.test(catLower);

      const q = new URLSearchParams();
      q.set('page',  page);
      q.set('limit', isPlotFamily ? 60 : LIMIT);   // pull broader when filtering plots
      q.set('sort',  sort);
      if (type   !== 'All') q.set('type',   type);
      if (status !== 'All') q.set('status', status);
      if (search.trim())    q.set('search', search.trim());
      if (cat && !isPlotFamily) q.set('subtype', cat);

      const res  = await fetch(`${BASE}/api/properties?${q.toString()}`);
      const data = await res.json();

      if (data.success) {
        let list = data.properties || [];
        let listTotal = data.total || 0;
        let listPages = data.pages || 1;

        if (isPlotFamily) {
          const want = catLower.includes('farm') ? /farm/i : /plot/i;
          list = list.filter(p => want.test((p.subtype || '') + ' ' + (p.type || '')));
          // Re-paginate the filtered list locally
          listTotal = list.length;
          listPages = Math.max(1, Math.ceil(listTotal / LIMIT));
          const start = (page - 1) * LIMIT;
          list = list.slice(start, start + LIMIT);
        }

        setProperties(list);
        setTotal(listTotal);
        setPages(listPages);
      } else {
        setError(data.message || 'Failed to load properties');
      }
    } catch {
      setError('Network error — is the backend running?');
    }
    setLoading(false);
  }, [type, status, sort, search, page, category]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const clearAll = () => {
    setType('All'); setStatus('All'); setCategory('');
    setSearchInput(''); setSearch(''); setSort('-createdAt'); setPage(1);
  };

  const hasFilters = type !== 'All' || status !== 'All' || searchInput || sort !== '-createdAt' || category;

  return (
    <div className="props-page">
      {/* Hero */}
      <section className="props-hero">
        <AnimatedBackground variant="dark" density={0.8} showGrid showOrbs={false} showLines />
        <div className="props-hero__bg" />
        <div className="container props-hero__content">
          <div className={mounted ? 'anim-fade-up' : ''}>
            <span className="sec-tag">Explore</span>
            <h1 className="props-hero__title">
              Find Your <span className="hi">Perfect Property</span>
            </h1>
            <p className="props-hero__sub">
              {loading ? 'Loading listings…' : `${total} verified listings across Hyderabad's prime locations`}
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Filters */}
        <div className={`props-filters${mounted ? ' anim-fade-up d-2' : ''}`}>
          {/* Search */}
          <div className="props-filters__search">
            <span className="props-filters__search-icon">🔍</span>
            <input type="text"
              placeholder="Search by name, location or type…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="props-filters__search-input" />
            {searchInput && (
              <button className="props-filters__search-clear"
                onClick={() => { setSearchInput(''); setSearch(''); }}>✕</button>
            )}
          </div>

          {/* Filter row */}
          <div className="props-filters__row">
            {/* Category quick-filter */}
            <div className="props-filter-group">
              <span className="props-filter-label">Category</span>
              <div className="props-pills">
                {CATEGORIES.map(c => (
                  <button key={c.value}
                    className={`props-pill${category === c.value ? ' active' : ''}`}
                    onClick={() => setCategory(c.value)}>{c.label}</button>
                ))}
              </div>
            </div>

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

            <div className="props-filter-group props-filter-group--sort">
              <span className="props-filter-label">Sort by</span>
              <select value={sort} onChange={e => setSort(e.target.value)} className="props-sort-select">
                {SORTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Meta */}
          <div className="props-filters__meta">
            <span className="props-filters__count">
              {loading ? 'Loading…' : <><b>{total}</b> properties found</>}
            </span>
            {hasFilters && (
              <button className="props-filters__clear" onClick={clearAll}>Clear all ✕</button>
            )}
          </div>
        </div>

        {/* Results */}
        {error ? (
          <div className="props-empty">
            <div className="props-empty__icon">⚠️</div>
            <h3 className="props-empty__title">Could not load properties</h3>
            <p className="props-empty__sub">{error}</p>
            <button className="btn btn-gold" onClick={fetchProperties}>Try Again</button>
          </div>
        ) : loading ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ width:40, height:40, border:'3px solid #f0e6c8', borderTopColor:'#C9A84C', borderRadius:'50%', animation:'rotateSlow .7s linear infinite', margin:'0 auto 14px' }} />
            <div style={{ color:'#94a3b8', fontSize:15 }}>Loading properties…</div>
          </div>
        ) : properties.length === 0 ? (
          <div className="props-empty">
            <div className="props-empty__icon">🏚️</div>
            <h3 className="props-empty__title">No properties found</h3>
            <p className="props-empty__sub">Try adjusting your filters or search query.</p>
            <button className="btn btn-gold" onClick={clearAll}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div className={`grid-3 props-grid${mounted ? ' anim-fade-up d-3' : ''}`}>
              {properties.map((p, i) => (
                <PropertyCard key={p._id} property={p}
                  style={{ animationDelay:`${Math.min(i, 5) * 60}ms` }} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:8, padding:'32px 0', flexWrap:'wrap' }}>
                <button className="props-pill" disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}>‹ Prev</button>
                {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                  const pg = pages <= 7 ? i + 1 : page <= 4 ? i + 1 : page + i - 3;
                  if (pg < 1 || pg > pages) return null;
                  return (
                    <button key={pg}
                      className={`props-pill${page === pg ? ' active' : ''}`}
                      onClick={() => setPage(pg)}>{pg}</button>
                  );
                })}
                <button className="props-pill" disabled={page === pages}
                  onClick={() => setPage(p => Math.min(pages, p + 1))}>Next ›</button>
              </div>
            )}
          </>
        )}

        <div style={{ height:64 }} />
      </div>
    </div>
  );
}