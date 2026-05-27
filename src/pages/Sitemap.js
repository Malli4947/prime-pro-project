import { Link } from 'react-router-dom';
import './LegalPage.css';

const COLUMNS = [
  {
    title: 'Main Pages',
    links: [
      { label: 'Home',              to: '/' },
      { label: 'All Properties',    to: '/properties' },
      { label: 'About Us',          to: '/about' },
      { label: 'Founder Portfolio', to: '/portfolio' },
      { label: 'Contact Us',        to: '/contact' },
      { label: 'My Profile',        to: '/profile' },
    ],
  },
  {
    title: 'Property Categories',
    links: [
      { label: 'Apartments',     to: '/properties?subtype=Apartment' },
      { label: 'Villas',         to: '/properties?subtype=Villa' },
      { label: 'Open Plots',     to: '/properties?subtype=Plot' },
      { label: 'Farm Lands',     to: '/properties?subtype=Farm+Land' },
      { label: 'Commercial',     to: '/properties?type=Commercial' },
      { label: 'Industrial',     to: '/properties?type=Industrial' },
    ],
  },
  {
    title: 'Quick Filters',
    links: [
      { label: 'Featured Projects',       to: '/properties?featured=true' },
      { label: 'New Launches',            to: '/properties?badge=New+Launch' },
      { label: 'Ready to Move',           to: '/properties?subtype=Ready+to+Move' },
      { label: 'Under Construction',      to: '/properties?subtype=Under+Construction' },
      { label: 'Premium Listings',        to: '/properties?badge=Premium' },
      { label: 'Luxury Listings',         to: '/properties?badge=Luxury' },
    ],
  },
  {
    title: 'Popular Localities',
    links: [
      { label: 'Kokapet',            to: '/properties?search=Kokapet' },
      { label: 'Gachibowli',         to: '/properties?search=Gachibowli' },
      { label: 'Tellapur',           to: '/properties?search=Tellapur' },
      { label: 'Narsingi',           to: '/properties?search=Narsingi' },
      { label: 'Madhapur',           to: '/properties?search=Madhapur' },
      { label: 'Financial District', to: '/properties?search=Financial+District' },
      { label: 'Kollur',             to: '/properties?search=Kollur' },
      { label: 'Adibatla',           to: '/properties?search=Adibatla' },
      { label: 'Shamshabad',         to: '/properties?search=Shamshabad' },
      { label: 'Yadadri',            to: '/properties?search=Yadadri' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Register Free', to: '/profile' },
      { label: 'Sign In',       to: '/profile' },
      { label: 'My Enquiries',  to: '/profile' },
      { label: 'Saved Properties', to: '/profile' },
    ],
  },
  {
    title: 'Legal & Policies',
    links: [
      { label: 'Privacy Policy',    to: '/privacy-policy' },
      { label: 'Terms of Use',      to: '/terms' },
      { label: 'RERA Compliance',   to: '/rera-compliance' },
      { label: 'Sitemap',           to: '/sitemap' },
    ],
  },
];

export default function Sitemap() {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div className="legal-hero__inner">
          <div className="legal-hero__crumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Sitemap</span>
          </div>
          <h1 className="legal-hero__title">
            Site<span className="hi">map</span>
          </h1>
          <p className="legal-hero__sub">
            Every page, category and quick filter on primeproprojects.in — organised so you can
            jump straight to what you're looking for.
          </p>
        </div>
      </section>

      <div className="legal-body">
        <div className="legal-callout">
          <strong>Can't find what you need?</strong> Use the search bar on the{' '}
          <Link to="/properties">All Properties</Link> page, or{' '}
          <a href="tel:6304829287">call us at 6304829287</a> and we'll help you find it directly.
        </div>

        <div className="sitemap-grid">
          {COLUMNS.map(col => (
            <div key={col.title} className="sitemap-col">
              <h3>{col.title}</h3>
              <ul>
                {col.links.map(link => (
                  <li key={link.to + link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="legal-cta">
          <h3>Looking for something specific?</h3>
          <p>
            Our advisors know every project, locality and price point in Hyderabad. Tell us what
            you need and we'll handcraft a shortlist within 2 hours.
          </p>
          <div className="legal-cta__actions">
            <Link to="/contact" className="btn btn-gold">Contact Us →</Link>
            <a href="https://wa.me/916304829287?text=Hi%20PrimePro%2C%20I%27m%20looking%20for%20a%20property."
              target="_blank" rel="noopener noreferrer"
              className="btn btn-outline-light">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
