import { Link } from 'react-router-dom';
import './LegalPage.css';

const SECTIONS = [
  {
    num: '01',
    title: 'Our RERA Commitment',
    body: (
      <>
        <p>
          PrimePro Projects operates in strict compliance with the{' '}
          <strong>Real Estate (Regulation &amp; Development) Act, 2016</strong> and the rules
          notified by the Telangana State Real Estate Regulatory Authority (TS RERA). Every
          project listed on this platform is RERA-registered before it goes live — no
          unregistered project is ever advertised or marketed by us.
        </p>
        <p>
          We believe transparency at the point of sale is the single best protection home buyers
          have. That is why we display the developer's RERA number on every property detail page
          and link it to the official TS RERA registration page wherever possible.
        </p>
      </>
    ),
  },
  {
    num: '02',
    title: 'How We Verify Every Project',
    body: (
      <>
        <p>Before a project appears on primeproprojects.in, our in-house legal desk checks:</p>
        <ul>
          <li><strong>Valid RERA registration</strong> — registration number, validity dates and project scope on the TS RERA portal.</li>
          <li><strong>HMDA or DTCP approval</strong> — sanctioned layout / building permit with the correct survey numbers.</li>
          <li><strong>Title chain</strong> — minimum 30-year title trace, encumbrance certificate and parent document validation.</li>
          <li><strong>Land use &amp; zoning</strong> — match against the Master Plan to confirm permissible usage.</li>
          <li><strong>Construction approvals</strong> — building permit, commencement certificate and where applicable, partial / final occupancy certificate.</li>
          <li><strong>Financial sanctions</strong> — verify the project is approved by at least one major bank for home-loan disbursal.</li>
        </ul>
        <p>Only after every box is ticked does a listing become publicly searchable.</p>
      </>
    ),
  },
  {
    num: '03',
    title: 'Where to Find the RERA Number',
    body: (
      <>
        <p>
          On every property detail page you will see a row labelled <strong>"RERA Number"</strong>{' '}
          in the Property Details table, along with a <strong>"✓ Verified"</strong> badge when the
          project is current in the TS RERA database. Click the number to open the official TS RERA
          page for that project in a new tab.
        </p>
        <div className="legal-callout">
          <strong>Tip:</strong> always cross-check the RERA number directly on the regulator's
          portal — <a href="https://rera.telangana.gov.in/" target="_blank" rel="noopener noreferrer">rera.telangana.gov.in</a>{' '}
          — before paying any amount, even when our team has already verified it.
        </div>
      </>
    ),
  },
  {
    num: '04',
    title: 'Your Rights as a RERA-Protected Buyer',
    body: (
      <>
        <p>The RERA Act gives every home buyer a set of statutory rights you should know:</p>
        <ul>
          <li><strong>Carpet-area pricing</strong> — quotes must be on carpet area, not super-built-up area.</li>
          <li><strong>Possession deadline</strong> — declared in the registered agreement; delays attract interest paid to you by the developer.</li>
          <li><strong>Specification fidelity</strong> — the developer cannot alter the sanctioned plan or amenities without two-thirds buyer consent.</li>
          <li><strong>Defect liability</strong> — developer is liable for structural defects for five years from handover.</li>
          <li><strong>Escrow protection</strong> — 70% of buyer collections must be held in a project-specific escrow account, used only for that project.</li>
          <li><strong>Dispute redressal</strong> — file complaints directly with TS RERA without going to court first.</li>
        </ul>
      </>
    ),
  },
  {
    num: '05',
    title: 'HMDA & DTCP Approvals for Plots',
    body: (
      <p>
        Open plots and farmland on our platform are sanctioned by either the{' '}
        <strong>Hyderabad Metropolitan Development Authority (HMDA)</strong> or the{' '}
        <strong>Directorate of Town &amp; Country Planning (DTCP)</strong>. Approved layouts come
        with demarcated plot boundaries, internal roads, drainage and a clear LP (Layout Permit)
        number that you can verify on the respective authority's portal before booking.
      </p>
    ),
  },
  {
    num: '06',
    title: 'What We Will Not Do',
    body: (
      <ul>
        <li>List a project without a valid RERA registration.</li>
        <li>Quote prices on super-built-up area when RERA mandates carpet area.</li>
        <li>Collect cash or token amounts in our name on behalf of any developer.</li>
        <li>Hide developer changes, delays or specification revisions from a booked buyer.</li>
        <li>Recommend a project our legal desk would not buy into for our own family.</li>
      </ul>
    ),
  },
  {
    num: '07',
    title: 'Reporting Concerns',
    body: (
      <>
        <p>
          If you spot a listing on our site that lacks proper RERA documentation, or if you've
          experienced a compliance issue with any project introduced through us, please raise it
          with us within 7 days. We will investigate, take down the listing if warranted, and
          provide a written response within 7 business days.
        </p>
        <p>
          Email <a href="mailto:primeproprojects@gmail.com">primeproprojects@gmail.com</a> with the
          subject line <strong>"RERA Compliance Concern"</strong> and include the project name,
          RERA number (if known) and a brief description.
        </p>
      </>
    ),
  },
];

export default function RERACompliance() {
  return (
    <div className="legal-page">
      <section className="legal-hero">
        <div className="legal-hero__inner">
          <div className="legal-hero__crumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>RERA Compliance</span>
          </div>
          <h1 className="legal-hero__title">
            RERA <span className="hi">Compliance</span>
          </h1>
          <p className="legal-hero__sub">
            How PrimePro Projects upholds the Real Estate (Regulation &amp; Development) Act, 2016
            — and what that means for every buyer who works with us.
          </p>
          <span className="legal-hero__updated">⏱ Last reviewed: May 2026</span>
        </div>
      </section>

      <div className="legal-body">
        <div className="legal-callout">
          <strong>The short version:</strong> every project we list is RERA-registered with TS
          RERA and approved by HMDA or DTCP. The RERA number is displayed on the property page
          and verifiable on the regulator's portal.
        </div>

        {SECTIONS.map(s => (
          <article key={s.num} className="legal-section">
            <span className="legal-section__num">{s.num}</span>
            <h2>{s.title}</h2>
            {s.body}
          </article>
        ))}

        <div className="legal-cta">
          <h3>Want us to verify a project for you?</h3>
          <p>
            Share the developer or project name. Our legal desk will independently confirm RERA
            registration, approvals, title and current escrow status — completely free, before
            you commit a single rupee.
          </p>
          <div className="legal-cta__actions">
            <a href="tel:6304829287" className="btn btn-gold">📞 Talk to Legal Desk</a>
            <a href="https://rera.telangana.gov.in/" target="_blank" rel="noopener noreferrer"
              className="btn btn-outline-light">
              Visit TS RERA Portal →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
