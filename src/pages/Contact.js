import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

// ── API base
const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const OFFICES = [
  {
    city: 'Hyderabad (HQ)',
    address: '3rd Floor, Laxmi Cyber City,\nWhitefields, Kondapur,\nHyderabad – 500081',
    phone: '9347870247',
    email: 'hyderabad@primepro.in',
    hours: 'Mon–Sun: 10 AM – 7 PM  |  Tuesday: Closed',
    emoji: '🏢',
  },
  {
    city: 'Gachibowli Branch',
    address: '2nd Floor, Cyber Gateway,\nNanakramguda, Gachibowli,\nHyderabad – 500032',
    phone: '+91 40 4567 8900',
    email: 'gachi@primepro.in',
    hours: 'Mon–Sun: 10 AM – 7 PM  |  Tuesday: Closed',
    emoji: '🏙️',
  },
  {
    city: 'Banjara Hills Branch',
    address: '1st Floor, Road No. 12,\nBanjara Hills,\nHyderabad – 500034',
    phone: '+91 40 4567 8901',
    email: 'banjara@primepro.in',
    hours: 'Mon–Sun: 10 AM – 7 PM  |  Tuesday: Closed',
    emoji: '🌆',
  },
];

const FAQS = [
  {
    q: 'Are all properties RERA, HMDA or DTCP approved?',
    a: 'Yes. Every project listed on our platform is verified for RERA compliance and approved by HMDA or DTCP before going live. You will find the RERA registration number on each property detail page. We do not list any project that lacks proper legal clearances.',
  },
  {
    q: 'Do you charge any brokerage or commission?',
    a: 'We operate on a zero-brokerage model for home buyers, renters, and investors. There are no hidden charges. Our fees, if any, are clearly disclosed upfront before you take any step forward. Transparent dealings are at the core of everything we do.',
  },
  {
    q: 'How quickly will your team respond to my enquiry?',
    a: 'We guarantee a response within 2 hours during business hours (Mon–Sun 10 AM–7 PM, Tuesday closed). For urgent requirements, call us directly at 9347870247 or WhatsApp us for an instant response from our dedicated advisors.',
  },
  {
    q: 'Can I schedule a physical site visit?',
    a: 'Absolutely. Use the "Schedule Visit" button on any property listing, or submit this contact form with your preferred date. Our team coordinates directly with the developer to arrange a personalised site visit at a time that works for you.',
  },
  {
    q: 'Do you handle NRI property purchases?',
    a: 'Yes, we have a dedicated NRI Investment Desk. Our legal and advisory team provides end-to-end support including FEMA compliance, power of attorney documentation, home loan assistance, and regular project updates — so you can invest with confidence from anywhere in the world.',
  },
  {
    q: 'What types of properties do you offer?',
    a: 'We list a wide range of verified properties — High-Rise Apartments, Independent Villas, HMDA & DTCP approved Open Plots, Commercial Offices & Shops, and Concept-Based Farmland Projects. All across Hyderabad\'s prime localities and surrounding districts.',
  },
];

// Updated hours everywhere
const QUICK_LINKS = [
  { icon: '📞', label: 'Call Us',       val: '9347870247',            href: 'tel:9347870247' },
  { icon: '✉️',  label: 'Email Us',      val: 'info@primepro.in',      href: 'mailto:info@primepro.in' },
  { icon: '💬', label: 'WhatsApp',      val: '+91 93478 70247',        href: 'https://wa.me/919347870247' },
  { icon: '🕐', label: 'Working Hours', val: 'Mon–Sun 10AM–7PM  |  Tue Closed', href: null },
];

const ENQUIRY_TYPES = ['General Enquiry', 'Buy Property', 'Rent / Lease', 'Sell Property', 'NRI Enquiry', 'Site Visit'];

export default function Contact() {
  const [mounted, setMounted] = useState(false);
  const [formRef,   formVis]   = useReveal();
  const [officeRef, officeVis] = useReveal();
  const [faqRef,    faqVis]    = useReveal();
  const [openFaq,   setOpenFaq] = useState(null);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
    type: 'General Enquiry', scheduleDate: '',
  });
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError,   setApiError]   = useState('');
  const [errors,     setErrors]     = useState({});

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim())   e.phone   = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s|\+91|-/g,'')))
      e.phone = 'Enter a valid 10-digit mobile number';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  // ── POST /api/enquiries ──────────────────────────────────────────────────────
  // Body: { name, email, phone, message, subject?, type?, scheduleDate? }
  // Optional: propertyId (not needed on contact page)
  // Returns: { success, message, enquiryId }
  // Token optional — sends if user is logged in
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    try {
      // Include user token if logged in (links enquiry to account)
      const token = localStorage.getItem('pp_user_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const body = {
        name:    form.name.trim(),
        email:   form.email.trim().toLowerCase(),
        phone:   form.phone.replace(/\s|\+91|-/g, '').slice(-10),
        message: form.message.trim(),
        subject: form.subject.trim() || form.type,
        type:    form.type,
      };
      // Only include scheduleDate if Site Visit and date provided
      if (form.type === 'Site Visit' && form.scheduleDate) {
        body.scheduleDate = form.scheduleDate;
      }

      const res  = await fetch(`${BASE}/api/enquiries`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setForm({ name:'', email:'', phone:'', subject:'', message:'', type:'General Enquiry', scheduleDate:'' });
        // Auto-reset after 7 seconds
        setTimeout(() => setSubmitted(false), 7000);
      } else {
        setApiError(data.message || 'Submission failed. Please try again.');
      }
    } catch {
      setApiError('Network error — please check your connection and try again.');
    }
    setSubmitting(false);
  };

  const setField = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
    if (apiError) setApiError('');
  };

  return (
    <div className="contact-page" id="contact">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="contact-hero">
        <div className="contact-hero__bg" />
        <div className="contact-hero__pattern" />
        <div className="container contact-hero__content">
          <div className={mounted ? 'anim-fade-up' : ''}>
            <span className="sec-tag">Get In Touch</span>
            <h1 className="contact-hero__title">
              We'd Love to <span className="hi">Hear From You</span>
            </h1>
            <p className="contact-hero__sub">
              Whether you're buying, renting, investing, or just exploring — our team of experts
              is here to guide you every step of the way.
            </p>
          </div>

          {/* Quick contact chips */}
          <div className={`contact-hero__quick${mounted ? ' anim-fade-up d-3' : ''}`}>
            {QUICK_LINKS.map((q, i) => (
              q.href ? (
                <a key={i} href={q.href}
                  target={q.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer" className="contact-hero__quick-item">
                  <span className="contact-hero__quick-icon">{q.icon}</span>
                  <div>
                    <div className="contact-hero__quick-label">{q.label}</div>
                    <div className="contact-hero__quick-val">{q.val}</div>
                  </div>
                </a>
              ) : (
                <div key={i} className="contact-hero__quick-item">
                  <span className="contact-hero__quick-icon">{q.icon}</span>
                  <div>
                    <div className="contact-hero__quick-label">{q.label}</div>
                    <div className="contact-hero__quick-val">{q.val}</div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + SIDEBAR ────────────────────────────────── */}
      <section className="section contact-main" ref={formRef}>
        <div className="container contact-main__grid">

          {/* Contact form */}
          <div className={`contact-form-wrap${formVis ? ' anim-fade-left' : ''}`}>
            <div className="contact-form-card">
              <div className="contact-form-card__header">
                <h2 className="contact-form-card__title">Send Us a Message</h2>
                <p className="contact-form-card__sub">We reply within 2 business hours</p>
              </div>

              {submitted ? (
                /* ── Success state */
                <div className="contact-success">
                  <div className="contact-success__icon">✅</div>
                  <h3 className="contact-success__title">Enquiry Submitted!</h3>
                  <p className="contact-success__sub">
                    Thank you! Our team will contact you within 2 hours.<br />
                    <small style={{ color:'#94a3b8', fontSize:12 }}>
                      (Mon–Sun 10 AM–7 PM, Tuesday closed)
                    </small>
                  </p>
                  <button className="btn btn-gold" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>

                  {/* API error banner */}
                  {apiError && (
                    <div className="contact-api-error">
                      <span>⚠️</span> {apiError}
                    </div>
                  )}

                  {/* Enquiry type pills */}
                  <div className="form-field">
                    <label className="form-label">Enquiry Type</label>
                    <div className="contact-type-pills">
                      {ENQUIRY_TYPES.map(t => (
                        <button type="button" key={t}
                          className={`contact-type-pill${form.type === t ? ' active' : ''}`}
                          onClick={() => setField('type', t)}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name + Phone */}
                  <div className="contact-form__row">
                    <div className="form-field">
                      <label className="form-label">Full Name *</label>
                      <input type="text" placeholder="Arjun Mehta"
                        value={form.name}
                        onChange={e => setField('name', e.target.value)}
                        className={`form-input${errors.name ? ' form-input--error' : ''}`} />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    <div className="form-field">
                      <label className="form-label">Phone Number *</label>
                      <input type="tel" placeholder="9876543210" maxLength={10}
                        value={form.phone}
                        onChange={e => setField('phone', e.target.value.replace(/\D/,'').slice(0,10))}
                        className={`form-input${errors.phone ? ' form-input--error' : ''}`} />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Email + Subject */}
                  <div className="contact-form__row">
                    <div className="form-field">
                      <label className="form-label">Email Address *</label>
                      <input type="email" placeholder="you@example.com"
                        value={form.email}
                        onChange={e => setField('email', e.target.value)}
                        className={`form-input${errors.email ? ' form-input--error' : ''}`} />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                    <div className="form-field">
                      <label className="form-label">Subject</label>
                      <input type="text" placeholder="e.g. Looking for 3BHK in Gachibowli"
                        value={form.subject}
                        onChange={e => setField('subject', e.target.value)}
                        className="form-input" />
                    </div>
                  </div>

                  {/* Schedule date — shown only for Site Visit */}
                  {form.type === 'Site Visit' && (
                    <div className="form-field">
                      <label className="form-label">
                        Preferred Visit Date
                        <span style={{ color:'#94a3b8', fontWeight:400, marginLeft:6, fontSize:11 }}>
                          (Tue closed)
                        </span>
                      </label>
                      <input type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={form.scheduleDate}
                        onChange={e => setField('scheduleDate', e.target.value)}
                        className="form-input" />
                    </div>
                  )}

                  {/* Message */}
                  <div className="form-field">
                    <label className="form-label">Your Message *</label>
                    <textarea
                      placeholder="Tell us what you're looking for, your budget, preferred location, or any questions…"
                      rows={5}
                      value={form.message}
                      onChange={e => setField('message', e.target.value)}
                      className={`form-input contact-form__textarea${errors.message ? ' form-input--error' : ''}`}
                    />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  <button type="submit"
                    className={`btn btn-gold btn-full contact-form__submit${submitting ? ' loading' : ''}`}
                    disabled={submitting}>
                    {submitting
                      ? <><span className="contact-spinner" /> Sending…</>
                      : <>✉️ Send Message</>}
                  </button>

                  <p className="contact-form__note">
                    By submitting, you agree to our{' '}
                    <a href="#!" className="contact-form__link">Privacy Policy</a>.
                    We never share your data.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className={`contact-sidebar${formVis ? ' anim-fade-right' : ''}`}>
            <div className="contact-map">
              <div className="contact-map__placeholder">
                <span>🗺️</span>
                <p>Laxmi Cyber City, Kondapur</p>
                <p className="contact-map__sub">Hyderabad – 500081</p>
                <a href="https://maps.google.com/?q=Kondapur+Hyderabad"
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-dark btn-sm">
                  Open in Google Maps →
                </a>
              </div>
            </div>

            <div className="contact-direct">
              <a href="tel:9347870247" className="contact-direct__item contact-direct__item--call">
                <div className="contact-direct__icon">📞</div>
                <div>
                  <div className="contact-direct__label">Call Us</div>
                  <div className="contact-direct__val">9347870247</div>
                  <div className="contact-direct__note">Mon–Sun 10 AM–7 PM  ·  Tue Closed</div>
                </div>
              </a>
              <a href="https://wa.me/919347870247" target="_blank" rel="noopener noreferrer"
                className="contact-direct__item contact-direct__item--whatsapp">
                <div className="contact-direct__icon">💬</div>
                <div>
                  <div className="contact-direct__label">WhatsApp Us</div>
                  <div className="contact-direct__val">+91 93478 70247</div>
                  <div className="contact-direct__note">Instant response</div>
                </div>
              </a>
              <a href="mailto:info@primepro.in"
                className="contact-direct__item contact-direct__item--email">
                <div className="contact-direct__icon">✉️</div>
                <div>
                  <div className="contact-direct__label">Email Us</div>
                  <div className="contact-direct__val">info@primepro.in</div>
                  <div className="contact-direct__note">Reply within 4 hours</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFFICE LOCATIONS ──────────────────────────────── */}
      <section className="section section--mid contact-offices" ref={officeRef}>
        <div className="container">
          <div className={`contact-offices__header${officeVis ? ' anim-fade-up' : ''}`}>
            <span className="sec-tag">Find Us</span>
            <h2 className="sec-title">Our <span className="hi">Office Locations</span></h2>
          </div>
          <div className={`contact-offices__grid${officeVis ? ' anim-fade-up d-2' : ''}`}>
            {OFFICES.map((office, i) => (
              <div key={i} className="office-card" style={{ animationDelay:`${i * 80}ms` }}>
                <div className="office-card__emoji">{office.emoji}</div>
                <h3 className="office-card__city">{office.city}</h3>
                <p className="office-card__address">
                  {office.address.split('\n').map((line, j) => (
                    <React.Fragment key={j}>{line}<br /></React.Fragment>
                  ))}
                </p>
                <div className="office-card__divider" />
                <ul className="office-card__info">
                  <li><span>📞</span>
                    <a href={`tel:${office.phone.replace(/\s/g,'')}`}>{office.phone}</a>
                  </li>
                  <li><span>✉️</span>
                    <a href={`mailto:${office.email}`}>{office.email}</a>
                  </li>
                  <li><span>🕐</span><span>{office.hours}</span></li>
                </ul>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(office.city + ' ' + office.address)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline btn-sm office-card__btn">
                  Get Directions →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="section contact-faq" ref={faqRef}>
        <div className="container contact-faq__inner">
          <div className={`contact-faq__header${faqVis ? ' anim-fade-left' : ''}`}>
            <span className="sec-tag">FAQ</span>
            <h2 className="sec-title">Frequently Asked <span className="hi">Questions</span></h2>
            <p className="sec-sub">
              Can't find your answer?{' '}
              <a href="tel:9347870247" style={{ color:'var(--gold)' }}>Call 9347870247</a>
            </p>
            <Link to="/properties" className="btn btn-gold" style={{ marginTop:24 }}>
              Browse Properties →
            </Link>
          </div>

          <div className={`contact-faq__list${faqVis ? ' anim-fade-right' : ''}`}>
            {FAQS.map((faq, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <button className="faq-item__q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className="faq-item__icon">{openFaq === i ? '−' : '+'}</span>
                </button>
                <div className="faq-item__a-wrap">
                  <p className="faq-item__a">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}