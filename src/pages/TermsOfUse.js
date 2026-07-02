import { Link } from 'react-router-dom';
import './LegalPage.css';

const SECTIONS = [
  {
    num: '01',
    title: 'Acceptance of Terms',
    body: (
      <p>
        By accessing or using <strong>primeproprojects.in</strong> ("the Website"), you agree to be
        bound by these Terms of Use, our Privacy Policy and any additional policies referenced
        within. If you do not agree with any part of these terms, please discontinue use of the
        site.
      </p>
    ),
  },
  {
    num: '02',
    title: 'About Our Services',
    body: (
      <>
        <p>
          PrimePro Projects is a Hyderabad-based real-estate advisory platform established in 2024.
          Through this website we list and market:
        </p>
        <ul>
          <li>Premium apartments and gated villa communities (RERA-registered)</li>
          <li>HMDA &amp; DTCP approved open plots and concept farmland</li>
          <li>Pre-leased commercial offices, retail outlets and office floors</li>
          <li>NRI investment advisory and end-to-end registration support</li>
        </ul>
        <p>
          We act as an advisor between you and the developer / land owner. Final pricing,
          allotment and possession are governed by the agreement you sign with the developer.
        </p>
      </>
    ),
  },
  {
    num: '03',
    title: 'Listings & Information Accuracy',
    body: (
      <>
        <p>
          Every project on our platform is verified for RERA registration and HMDA / DTCP approval
          before going live. Listing details — price, configuration, amenities, possession date —
          are sourced directly from the developer and refreshed periodically.
        </p>
        <p>
          That said, developers occasionally revise prices, inventory or possession schedules.
          We recommend you confirm the current details with our advisor before finalising any
          purchase decision. Photographs and floor plans are representational; final delivered
          product may differ in line with the signed agreement.
        </p>
      </>
    ),
  },
  {
    num: '04',
    title: 'User Conduct',
    body: (
      <>
        <p>When using this website you agree NOT to:</p>
        <ul>
          <li>Submit fake names, phone numbers or email addresses in enquiry forms.</li>
          <li>Scrape, copy or republish listings, photographs or content without written permission.</li>
          <li>Attempt to gain unauthorised access to any part of the platform, including admin panels and API endpoints.</li>
          <li>Use the contact channels to send spam, harassment or any content prohibited under Indian law.</li>
          <li>Misrepresent your relationship with PrimePro Projects to third parties.</li>
        </ul>
      </>
    ),
  },
  {
    num: '05',
    title: 'Fees & Brokerage',
    body: (
      <>
        <p>
          PrimePro Projects operates on a <strong>zero-brokerage model for buyers, renters and
          investors</strong>. Our advisory services are free for end-users. Any fees applicable to
          a transaction — registration, stamp duty, GST, loan processing — are charged by the
          respective statutory or financial institutions and are disclosed upfront before you act.
        </p>
        <p>
          We never collect cash or token amounts on behalf of developers. All payments are made
          directly to the developer's registered bank account against an official receipt.
        </p>
      </>
    ),
  },
  {
    num: '06',
    title: 'Intellectual Property',
    body: (
      <p>
        All trademarks, logos, page layouts, written content and original photography on this
        website are the property of PrimePro Projects or licensed to us by the respective
        developers. Re-use without written permission is prohibited. Developer logos and project
        names appear under fair-dealing for identification purposes only.
      </p>
    ),
  },
  {
    num: '07',
    title: 'Third-Party Links',
    body: (
      <p>
        Our site occasionally links to third-party services — Google Maps for directions, WhatsApp
        for chat, banking partners for loans, social media profiles, and developer microsites.
        PrimePro Projects is not responsible for the content, privacy practices or availability of
        those external sites.
      </p>
    ),
  },
  {
    num: '08',
    title: 'Limitation of Liability',
    body: (
      <p>
        To the extent permitted by law, PrimePro Projects, its founders, employees and partners
        shall not be liable for any indirect, incidental or consequential damages arising from your
        use of the website or reliance on listing information. Our maximum liability in any
        circumstance shall not exceed the value of services explicitly paid to us, which for most
        end-users is zero.
      </p>
    ),
  },
  {
    num: '09',
    title: 'Governing Law & Jurisdiction',
    body: (
      <p>
        These terms are governed by the laws of India. Any dispute arising in connection with the
        website or our services shall be subject to the exclusive jurisdiction of the courts of
        <strong> Hyderabad, Telangana</strong>.
      </p>
    ),
  },
  {
    num: '10',
    title: 'Changes to These Terms',
    body: (
      <p>
        We may revise these Terms of Use occasionally. Continued use of the website after a
        revision means you accept the updated terms. We will note the effective date at the top
        of this page whenever material changes are made.
      </p>
    ),
  },
];

export default function TermsOfUse() {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div className="legal-hero__inner">
          <div className="legal-hero__crumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Terms of Use</span>
          </div>
          <h1 className="legal-hero__title">
            Terms of <span className="hi">Use</span>
          </h1>
          <p className="legal-hero__sub">
            The ground rules for using primeproprojects.in. Reading these takes about three minutes
            — it covers what we promise, what we ask of you, and how disputes are handled.
          </p>
          <span className="legal-hero__updated">⏱ Effective: May 2026</span>
        </div>
      </section>

      <div className="legal-body">
        <div className="legal-callout">
          <strong>In plain English:</strong> we list only RERA-verified projects, charge zero
          brokerage from buyers, never collect cash on developer's behalf, and operate under the
          jurisdiction of Hyderabad courts.
        </div>

        {SECTIONS.map(s => (
          <article key={s.num} className="legal-section">
            <span className="legal-section__num">{s.num}</span>
            <h2>{s.title}</h2>
            {s.body}
          </article>
        ))}

        <div className="legal-cta">
          <h3>Need clarification on any clause?</h3>
          <p>
            Speak directly to our advisory team for help interpreting any term as it applies to
            your specific transaction.
          </p>
          <div className="legal-cta__actions">
            <Link to="/contact" className="btn btn-gold">Contact Us →</Link>
            <a href="tel:9866212211" className="btn btn-outline-light">📞 Call 9866212211</a>
          </div>
        </div>
      </div>
    </div>
  );
}
