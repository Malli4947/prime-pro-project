import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

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
    phone: '1800 500 600',
    email: 'hyderabad@primepro.in',
    hours: 'Mon – Sat: 9 AM – 7 PM',
    emoji: '🏢',
  },
  {
    city: 'Gachibowli Branch',
    address: '2nd Floor, Cyber Gateway,\nNanakramguda, Gachibowli,\nHyderabad – 500032',
    phone: '+91 40 4567 8900',
    email: 'gachi@primepro.in',
    hours: 'Mon – Sat: 9 AM – 7 PM',
    emoji: '🏙️',
  },
  {
    city: 'Banjara Hills Branch',
    address: '1st Floor, Road No. 12,\nBanjara Hills,\nHyderabad – 500034',
    phone: '+91 40 4567 8901',
    email: 'banjara@primepro.in',
    hours: 'Mon – Sat: 10 AM – 6 PM',
    emoji: '🌆',
  },
];

const FAQS = [
  {
    q: 'Are all properties on PrimePro RERA registered?',
    a: 'Yes. Every project listed on our platform is verified for RERA compliance before going live. You can find the RERA number on each property detail page.',
  },
  {
    q: 'Do you charge any brokerage or commission?',
    a: 'PrimePro operates on a zero-brokerage model for home buyers and renters. Our fees, if any, are transparently disclosed before you proceed.',
  },
  {
    q: 'How quickly will your team respond to my enquiry?',
    a: 'We guarantee a response within 2 hours during business hours (Mon–Sat, 9 AM–7 PM). For urgent queries, call 1800 500 600 directly.',
  },
  {
    q: 'Can I schedule a physical site visit?',
    a: 'Absolutely. Use the "Schedule Visit" button on any property page, or call us. We coordinate with developers to set up visits at your preferred time.',
  },
  {
    q: 'Do you handle NRI property purchases?',
    a: 'Yes, we have a dedicated NRI desk. Our legal team assists with all FEMA compliance, power of attorney, and remote documentation requirements.',
  },
];

const QUICK_LINKS = [
  { icon: '📞', label: 'Call Us',       val: '1800 500 600',          href: 'tel:18005006000' },
  { icon: '✉️',  label: 'Email Us',      val: 'info@primepro.in',       href: 'mailto:info@primepro.in' },
  { icon: '💬', label: 'WhatsApp',      val: '+91 98765 43210',        href: 'https://wa.me/919876543210' },
  { icon: '🕐', label: 'Working Hours', val: 'Mon–Sat: 9 AM – 7 PM',  href: null },
];

export default function Contact() {
  const [mounted, setMounted] = useState(false);
  const [formRef,   formVis]   = useReveal();
  const [officeRef, officeVis] = useReveal();
  const [faqRef,    faqVis]    = useReveal();
  const [openFaq,   setOpenFaq] = useState(null);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '', type: 'General Enquiry',
  });
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors,     setErrors]     = useState({});

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim())   e.phone   = 'Phone number is required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setForm({ name:'', email:'', phone:'', subject:'', message:'', type:'General Enquiry' });
      setTimeout(() => setSubmitted(false), 6000);
    }, 1400);
  };

  const setField = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
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
              Whether you're buying, renting, investing, or just exploring — our team of experts is here to guide you every step of the way.
            </p>
          </div>

          {/* Quick contact chips */}
          <div className={`contact-hero__quick${mounted ? ' anim-fade-up d-3' : ''}`}>
            {QUICK_LINKS.map((q, i) => (
              q.href ? (
                <a key={i} href={q.href} target={q.href.startsWith('http') ? '_blank' : undefined}
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

      {/* ── FORM + MAP ────────────────────────────────────── */}
      <section className="section contact-main" ref={formRef}>
        <div className="container contact-main__grid">

          {/* ── Contact form ──────────────────────────────── */}
          <div className={`contact-form-wrap${formVis ? ' anim-fade-left' : ''}`}>
            <div className="contact-form-card">
              <div className="contact-form-card__header">
                <h2 className="contact-form-card__title">Send Us a Message</h2>
                <p className="contact-form-card__sub">We reply within 2 business hours</p>
              </div>

              {submitted ? (
                <div className="contact-success">
                  <div className="contact-success__icon">✅</div>
                  <h3 className="contact-success__title">Message Received!</h3>
                  <p className="contact-success__sub">
                    Thank you! Our team will get back to you within 2 hours.
                  </p>
                  <button className="btn btn-gold" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>

                  {/* Enquiry type */}
                  <div className="form-field">
                    <label className="form-label">Enquiry Type</label>
                    <div className="contact-type-pills">
                      {['General Enquiry', 'Buy Property', 'Rent / Lease', 'Sell Property', 'NRI Enquiry'].map(t => (
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
                      <input
                        type="text" placeholder="Arjun Mehta"
                        value={form.name}
                        onChange={e => setField('name', e.target.value)}
                        className={`form-input${errors.name ? ' form-input--error' : ''}`}
                      />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    <div className="form-field">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel" placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => setField('phone', e.target.value)}
                        className={`form-input${errors.phone ? ' form-input--error' : ''}`}
                      />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Email + Subject */}
                  <div className="contact-form__row">
                    <div className="form-field">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email" placeholder="you@example.com"
                        value={form.email}
                        onChange={e => setField('email', e.target.value)}
                        className={`form-input${errors.email ? ' form-input--error' : ''}`}
                      />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                    <div className="form-field">
                      <label className="form-label">Subject</label>
                      <input
                        type="text" placeholder="e.g. Looking for 3BHK in Gachibowli"
                        value={form.subject}
                        onChange={e => setField('subject', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

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

                  <button
                    type="submit"
                    className={`btn btn-gold btn-full contact-form__submit${submitting ? ' loading' : ''}`}
                    disabled={submitting}>
                    {submitting ? (
                      <><span className="contact-spinner" /> Sending…</>
                    ) : (
                      <>✉️ Send Message</>
                    )}
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

          {/* ── Map + Info sidebar ─────────────────────────── */}
          <div className={`contact-sidebar${formVis ? ' anim-fade-right' : ''}`}>
            {/* Map placeholder */}
            <div className="contact-map">
              <div className="contact-map__placeholder">
                <span>🗺️</span>
                <p>Laxmi Cyber City, Kondapur</p>
                <p className="contact-map__sub">Hyderabad – 500081</p>
                <a
                  href="https://maps.google.com/?q=Kondapur+Hyderabad"
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-dark btn-sm">
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Direct contact cards */}
            <div className="contact-direct">
              <a href="tel:18005006000" className="contact-direct__item contact-direct__item--call">
                <div className="contact-direct__icon">📞</div>
                <div>
                  <div className="contact-direct__label">Call Toll-Free</div>
                  <div className="contact-direct__val">1800 500 600</div>
                  <div className="contact-direct__note">Mon – Sat, 9 AM – 7 PM</div>
                </div>
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                 className="contact-direct__item contact-direct__item--whatsapp">
                <div className="contact-direct__icon">💬</div>
                <div>
                  <div className="contact-direct__label">WhatsApp Us</div>
                  <div className="contact-direct__val">+91 98765 43210</div>
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
              <div key={i} className="office-card" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="office-card__emoji">{office.emoji}</div>
                <h3 className="office-card__city">{office.city}</h3>
                <p className="office-card__address">
                  {office.address.split('\n').map((line, j) => (
                    <React.Fragment key={j}>{line}<br /></React.Fragment>
                  ))}
                </p>
                <div className="office-card__divider" />
                <ul className="office-card__info">
                  <li>
                    <span>📞</span>
                    <a href={`tel:${office.phone.replace(/\s/g,'')}`}>{office.phone}</a>
                  </li>
                  <li>
                    <span>✉️</span>
                    <a href={`mailto:${office.email}`}>{office.email}</a>
                  </li>
                  <li>
                    <span>🕐</span>
                    <span>{office.hours}</span>
                  </li>
                </ul>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(office.city + ' ' + office.address)}`}
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
              Can't find your answer here? Call us at <a href="tel:18005006000" style={{color:'var(--gold)'}}>1800 500 600</a>.
            </p>
            <Link to="/properties" className="btn btn-gold" style={{ marginTop: 24 }}>
              Browse Properties →
            </Link>
          </div>

          <div className={`contact-faq__list${faqVis ? ' anim-fade-right' : ''}`}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <button
                  className="faq-item__q"
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