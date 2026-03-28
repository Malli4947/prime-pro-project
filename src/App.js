import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

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
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/properties"     element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/about"          element={<About />} />
            <Route path="/contact"        element={<Contact />} />
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
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}