import { Link } from 'react-router-dom';
import './LegalPage.css';

const SECTIONS = [
  {
    num: '01',
    title: 'Information We Collect',
    body: (
      <>
        <p>
          When you interact with PrimePro Projects — by browsing listings, submitting an enquiry,
          requesting a brochure or asking for site directions — we collect the minimum information
          needed to assist you:
        </p>
        <ul>
          <li><strong>Contact details</strong> — name, phone number and email address you submit in our forms.</li>
          <li><strong>Property preferences</strong> — budget range, locality, BHK requirement, NRI status or any free-text message you share.</li>
          <li><strong>Technical data</strong> — IP address, browser type, device and the pages you view, captured by standard server logs and analytics cookies.</li>
          <li><strong>Account data</strong> — only when you register: your name, phone, email and a hashed password.</li>
        </ul>
      </>
    ),
  },
  {
    num: '02',
    title: 'How We Use Your Information',
    body: (
      <>
        <p>We use the information you share strictly to deliver the service you came to us for:</p>
        <ul>
          <li>Respond to enquiries within our 2-hour SLA (Mon–Sun, 10 AM–7 PM, Tuesday closed).</li>
          <li>Share verified property options, brochures, floor plans and pricing that match your brief.</li>
          <li>Co-ordinate site visits, registration paperwork and home-loan tie-ups.</li>
          <li>Send occasional service updates — new launches in your preferred locality, RERA updates or response confirmations.</li>
          <li>Improve our website experience through aggregate, non-identifying analytics.</li>
        </ul>
        <p>We <strong>do not</strong> sell, rent or trade your personal data to third parties for marketing purposes.</p>
      </>
    ),
  },
  {
    num: '03',
    title: 'Who We Share It With',
    body: (
      <>
        <p>Your details are shared only with the parties needed to fulfil your request:</p>
        <ul>
          <li><strong>Verified developers / channel partners</strong> — only when you specifically request information about a project they own.</li>
          <li><strong>Home-loan banking partners</strong> (HDFC, SBI, ICICI, Axis, Bajaj Finance) — only when you ask us to facilitate a loan.</li>
          <li><strong>Service providers</strong> — payment gateway, cloud hosting and SMS/email delivery vendors operating under strict confidentiality.</li>
          <li><strong>Statutory authorities</strong> — RERA, registration office or income-tax — only when legally required.</li>
        </ul>
      </>
    ),
  },
  {
    num: '04',
    title: 'Cookies & Analytics',
    body: (
      <p>
        We use first-party cookies to remember your session and preferences, plus standard
        analytics (Google Analytics-style aggregate data) to understand which pages, listings and
        localities are most useful. You can disable cookies at any time from your browser settings —
        the site will continue to function with a slightly reduced experience.
      </p>
    ),
  },
  {
    num: '05',
    title: 'How We Protect Your Data',
    body: (
      <>
        <p>We treat your information with the same care we'd want for our own family:</p>
        <ul>
          <li>HTTPS / TLS encryption on every page across the website.</li>
          <li>Passwords stored as one-way salted hashes — never in plain text.</li>
          <li>Access to enquiry records is restricted to the senior advisor handling your case.</li>
          <li>Periodic security reviews and timely patching of all software dependencies.</li>
        </ul>
      </>
    ),
  },
  {
    num: '06',
    title: 'Your Rights',
    body: (
      <>
        <p>You can, at any time:</p>
        <ul>
          <li>Request a copy of the personal data we hold on you.</li>
          <li>Ask us to correct outdated information.</li>
          <li>Request deletion of your account or enquiry history (subject to legal retention rules).</li>
          <li>Opt out of marketing communications — every email has an unsubscribe link.</li>
        </ul>
        <p>
          To exercise any of these rights, email{' '}
          <a href="mailto:primeproprojects@gmail.com">primeproprojects@gmail.com</a> with the
          subject line "Data Request" and we'll respond within 7 business days.
        </p>
      </>
    ),
  },
  {
    num: '07',
    title: 'Updates to This Policy',
    body: (
      <p>
        We may update this policy from time to time to reflect changes in services, regulation or
        industry best practice. Material changes will be highlighted on this page; continued use of
        the website after an update constitutes acceptance.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div className="legal-hero__inner">
          <div className="legal-hero__crumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Privacy Policy</span>
          </div>
          <h1 className="legal-hero__title">
            Privacy <span className="hi">Policy</span>
          </h1>
          <p className="legal-hero__sub">
            How PrimePro Projects collects, uses and protects the information you share with us.
            We believe transparency in privacy is as important as transparency in property dealings.
          </p>
          <span className="legal-hero__updated">⏱ Last updated: May 2026</span>
        </div>
      </section>

      <div className="legal-body">
        <div className="legal-callout">
          <strong>The short version:</strong> we collect only what's needed to help you find the
          right property, never sell your data, and let you delete it on request. The detailed terms
          are below.
        </div>

        {SECTIONS.map(s => (
          <article key={s.num} className="legal-section">
            <span className="legal-section__num">{s.num}</span>
            <h2>{s.title}</h2>
            {s.body}
          </article>
        ))}

        <div className="legal-cta">
          <h3>Questions about your privacy?</h3>
          <p>
            Our team is just a call away. Speak directly to our Data Protection lead for any
            request — disclosure, correction or deletion of your information.
          </p>
          <div className="legal-cta__actions">
            <a href="tel:6304829287" className="btn btn-gold">📞 Call 6304829287</a>
            <a href="mailto:primeproprojects@gmail.com" className="btn btn-outline-light">
              ✉ Email Data Officer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
