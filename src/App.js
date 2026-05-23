import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

// ── Code-split all pages — only load what the user navigates to ──────────────
const Home           = lazy(() => import('./pages/Home'));
const Properties     = lazy(() => import('./pages/Properties'));
const PropertyDetails= lazy(() => import('./pages/PropertyDetails'));
const About          = lazy(() => import('./pages/About'));
const Contact        = lazy(() => import('./pages/Contact'));
const Profile        = lazy(() => import('./pages/Profile'));
const Portfolio      = lazy(() => import('./pages/Portfolio'));

// ── Minimal page-level loading fallback ─────────────────────────────────────
const PageLoader = () => (
  <div style={{
    minHeight: '60vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      width: 40, height: 40,
      border: '3px solid #f0e6c8',
      borderTopColor: '#C9A84C',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollReset />
      <div className="app-wrapper">
        <Navbar />
        <main className="app-main">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/properties"     element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/about"          element={<About />} />
              <Route path="/contact"        element={<Contact />} />
              <Route path="/profile"        element={<Profile />} />
              <Route path="/portfolio"      element={<Portfolio />} />
              <Route path="*" element={
                <div style={{
                  minHeight:'80vh', display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center', gap:16,
                  fontFamily:'var(--font-body)'
                }}>
                  <span style={{fontSize:64}}>🏚️</span>
                  <h2 style={{fontFamily:'var(--font-display)', fontSize:32, color:'var(--navy)'}}>
                    Page Not Found
                  </h2>
                  <a href="/" style={{color:'var(--gold)', fontWeight:700}}>← Back to Home</a>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}