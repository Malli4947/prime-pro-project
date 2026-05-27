/* ═══════════════════════════════════════════════════════════════
   ChatBot Knowledge Base
   ───────────────────────────────────────────────────────────────
   Rule-based intent matcher. Each intent has:
     - patterns:  array of regexes matched against the user message
     - reply:     plain text (markdown-style **bold** / *italic*)
     - links:     optional array of action chips rendered with the reply
     - suggest:   optional follow-up suggested chips (quick replies)

   Add new intents above DEFAULT_FALLBACK. The first matching intent wins,
   so place more specific ones (e.g. "nri") above broader ones ("about").
   ═══════════════════════════════════════════════════════════════ */

export const QUICK_SUGGESTIONS = [
  'Contact details',
  'Office address',
  'Working hours',
  'Property categories',
  'Founder portfolio',
  'NRI services',
  'Zero brokerage',
  'Schedule a visit',
];

export const WELCOME = {
  text:
    "👋 Hi! I'm the **PrimePro Assistant**. Ask me anything about our properties, services, agents, timings or office — I reply instantly.",
  suggest: QUICK_SUGGESTIONS.slice(0, 4),
};

const PHONE = '6304829287';
const WA_LINK = `https://wa.me/91${PHONE}?text=${encodeURIComponent("Hi PrimePro, I'd like to know more.")}`;
const EMAIL = 'primeproprojects@gmail.com';

const INTENTS = [
  /* ── Greetings ───────────────────────────────── */
  {
    name: 'greet',
    patterns: [/^\s*(hi|hello|hey|hola|namaste|good\s*(morning|afternoon|evening))\b/i],
    reply: "Hi there! 👋 I'm here to help. You can ask me about our properties, contact info, timings, founder portfolio or anything else about PrimePro Projects.",
    suggest: ['Contact details', 'Property categories', 'About PrimePro', 'Schedule visit'],
  },

  /* ── Contact / Phone / Call / Email / WhatsApp ───── */
  {
    name: 'contact',
    patterns: [
      /\b(contact|reach|phone|call|whats\s*app|whatsapp|email|mobile|number)\b/i,
      /\bhow.*(reach|contact)\b/i,
    ],
    reply:
      "Here's the fastest way to reach us:\n\n📞 **Phone:** +91 63048 29287\n💬 **WhatsApp:** Tap below — replies in under 2 hours\n✉️ **Email:** primeproprojects@gmail.com\n📍 **Office:** Madhapur, Kavuri Hills Phase 1, Hyderabad, Telangana",
    links: [
      { type: 'tel',  label: '📞 Call Now',     href: `tel:${PHONE}` },
      { type: 'wa',   label: '💬 WhatsApp',     href: WA_LINK },
      { type: 'mail', label: '✉️ Email Us',     href: `mailto:${EMAIL}` },
      { type: 'page', label: 'Contact Page →',  href: '/contact' },
    ],
    suggest: ['Working hours', 'Office address', 'Schedule visit'],
  },

  /* ── Address / Office / Location / Directions ────── */
  {
    name: 'address',
    patterns: [
      /\b(address|office|location|where.*(office|located|find))\b/i,
      /\b(directions?|map|maps)\b/i,
    ],
    reply:
      "📍 **Our Office**\nMadhapur, Kavuri Hills Phase 1,\nHyderabad, Telangana\n\nVisit us in person — just call ahead so we can keep your file ready and a coffee on the table.",
    links: [
      { type: 'page', label: 'Get Directions →', href: '/contact' },
      { type: 'tel',  label: '📞 Call Before Visit', href: `tel:${PHONE}` },
    ],
    suggest: ['Working hours', 'Schedule visit'],
  },

  /* ── Hours / Timings / Open / Closed ─────────────── */
  {
    name: 'hours',
    patterns: [
      /\b(hours?|timing|timings|open|close|closed|when.*open|working\s*day|business\s*hours)\b/i,
    ],
    reply:
      "🕐 **Working Hours**\n• Mon–Sun: 10 AM – 7 PM\n• **Tuesday closed**\n\nFor urgent needs outside hours, drop a WhatsApp — our advisors check messages even on Tuesday.",
    links: [
      { type: 'wa', label: '💬 WhatsApp Now', href: WA_LINK },
    ],
    suggest: ['Contact details', 'Schedule visit'],
  },

  /* ── About / Company / Founder / Who are you ─────── */
  {
    name: 'about',
    patterns: [
      /\b(about|who.*(are|is)|company|firm|founded|established|history|story)\b/i,
      /\bprime\s*pro\b/i,
    ],
    reply:
      "**About PrimePro Projects**\n\nFounded in 2024 by Prashanth Reddy, we're a Hyderabad-based real-estate platform with one mission — to make property buying transparent, RERA-compliant and zero-brokerage for every family and investor.\n\n• 200+ verified listings\n• 35+ happy families\n• 4.9★ client rating\n• 5 major cities served",
    links: [
      { type: 'page', label: 'About Us →',      href: '/about' },
      { type: 'page', label: 'Founder Portfolio →', href: '/portfolio' },
    ],
    suggest: ['Founder portfolio', 'Why choose us', 'Awards & recognition'],
  },

  /* ── Portfolio / Founder / Prashanth ─────────────── */
  {
    name: 'portfolio',
    patterns: [
      /\b(portfolio|founder|prashanth|ceo|owner)\b/i,
    ],
    reply:
      "**Prashanth Reddy** — Founder & CEO\n\n5+ years in Hyderabad real estate · 130+ deals closed · Senior Property Advisor.\n\nHis story, vision, recent wins and step-by-step process are all on the portfolio page.",
    links: [
      { type: 'page', label: 'Open Portfolio →', href: '/portfolio' },
      { type: 'tel',  label: '📞 Talk to Prashanth', href: `tel:${PHONE}` },
    ],
    suggest: ['Our team', 'Recent deals'],
  },

  /* ── Team / Agents / Advisors ───────────────────── */
  {
    name: 'team',
    patterns: [
      /\b(team|agents?|advisors?|staff|staff|employees?|members?)\b/i,
    ],
    reply:
      "**Our Team**\n\n🔹 **Prashanth Reddy** — Senior Property Advisor · 5 yrs · 130 deals · +91 93478 70247\n🔹 **Vaishnavi Chowdary** — Senior Property Advisor · 4 yrs · 100 deals · +91 86888 74521\n🔹 **K Arun Kumar Reddy** — Property Advisor · 3 yrs · 75 deals · +91 93907 98969",
    links: [
      { type: 'page', label: 'Meet the Team →', href: '/about' },
    ],
    suggest: ['Schedule visit', 'Founder portfolio'],
  },

  /* ── Apartments — specific category drill-down ──── */
  {
    name: 'cat-apartments',
    patterns: [
      /\bapart(ment|ments)?\b/i,
      /\b(\d)\s*bhk\b/i,
      /\bflat(s)?\b/i,
    ],
    reply:
      "🏢 **Apartments** — 2, 3 & 4 BHK\n\nWe have **80+ RERA-verified apartments** across Hyderabad's top corridors:\n\n• Kokapet · Financial District · Gachibowli\n• Tellapur · Narsingi · Madhapur · Kondapur\n\nRange: ₹65 L (2 BHK) to ₹4.5 Cr (luxury 4 BHK).",
    links: [
      { type: 'page', label: 'Browse Apartments →', href: '/properties?subtype=Apartment' },
      { type: 'tel',  label: '📞 Talk to Advisor',  href: `tel:${PHONE}` },
      { type: 'wa',   label: '💬 WhatsApp',          href: WA_LINK },
    ],
    suggest: ['Apartments in Kokapet', 'Ready to move', 'Home loan help'],
  },

  /* ── Villas — drill-down ────────────────────────── */
  {
    name: 'cat-villas',
    patterns: [
      /\bvilla(s)?\b/i,
      /\bbungalow(s)?\b/i,
      /\bindependent\s*hous/i,
    ],
    reply:
      "🏠 **Villas** — Gated communities\n\nIndependent villas with private pools, clubhouse and 24/7 security:\n\n• Kollur · Kokapet · Tellapur · Narsingi\n• Vastu-compliant 3/4/5 BHK\n• Price band: ₹1.8 Cr – ₹6 Cr",
    links: [
      { type: 'page', label: 'Browse Villas →',   href: '/properties?subtype=Villa' },
      { type: 'tel',  label: '📞 Talk to Advisor', href: `tel:${PHONE}` },
      { type: 'wa',   label: '💬 WhatsApp',         href: WA_LINK },
    ],
    suggest: ['Premium villas', 'Schedule visit', 'NRI services'],
  },

  /* ── Plots / Open Plots — drill-down ────────────── */
  {
    name: 'cat-plots',
    patterns: [
      /\b(open\s*plot|plots?|plot|land(s)?)\b/i,
    ],
    reply:
      "📐 **Open Plots** — HMDA & DTCP approved\n\nClear-title plots in high-appreciation belts:\n\n• Shamshabad · Adibatla · Tukkuguda · Yadadri\n• Sizes from 200 sq.yd – 1000 sq.yd\n• Per sq.yd rate: ₹18 K – ₹85 K depending on locality",
    links: [
      { type: 'page', label: 'Browse Plots →',     href: '/properties?subtype=Plot' },
      { type: 'tel',  label: '📞 Talk to Advisor',  href: `tel:${PHONE}` },
      { type: 'wa',   label: '💬 WhatsApp',          href: WA_LINK },
    ],
    suggest: ['Plots in Adibatla', 'Farm land', 'Schedule visit'],
  },

  /* ── Farm Land — drill-down ─────────────────────── */
  {
    name: 'cat-farm',
    patterns: [
      /\b(farm\s*land|farmland|farm\s*house|agriculture|agri)\b/i,
    ],
    reply:
      "🌿 **Farm Land** — Concept projects\n\nGated farm-land communities with managed agro-tourism, eco-living and strong long-term appreciation. Ideal for NRIs and second-home investors.\n\n• Yadadri · Shamshabad belt · Srisailam Highway\n• Acre sizes available · 8–12% YoY appreciation",
    links: [
      { type: 'page', label: 'Browse Farm Land →',  href: '/properties?subtype=Farm+Land' },
      { type: 'tel',  label: '📞 Talk to Advisor',  href: `tel:${PHONE}` },
      { type: 'wa',   label: '💬 WhatsApp',          href: WA_LINK },
    ],
    suggest: ['NRI services', 'Schedule visit'],
  },

  /* ── Commercial — drill-down ────────────────────── */
  {
    name: 'cat-commercial',
    patterns: [
      /\b(commercial|office\s*space|retail|shop(s)?|pre[- ]?leased|leased)\b/i,
    ],
    reply:
      "🏬 **Commercial Spaces**\n\nOffice floors, retail outlets and pre-leased assets in Hyderabad's IT corridors:\n\n• Madhapur · HITEC City · Gachibowli · Financial District\n• Pre-leased: 7–9% gross rental yield\n• 9-year lock-in tenants available",
    links: [
      { type: 'page', label: 'Browse Commercial →', href: '/properties?type=Commercial' },
      { type: 'tel',  label: '📞 Talk to Advisor',  href: `tel:${PHONE}` },
      { type: 'wa',   label: '💬 WhatsApp',          href: WA_LINK },
    ],
    suggest: ['Pre-leased deals', 'Schedule visit'],
  },

  /* ── Property Categories landing — high-priority ── */
  {
    name: 'categories',
    patterns: [
      /\bcategor(y|ies)\b/i,
      /\bpropert(y|ies)\s*(categor|type|kind)/i,
      /\bproperty\s+categories\b/i,
      /\bwhat.*(propert|categor)/i,
      /\btype.*property/i,
      /\bbrowse\b/i,
    ],
    reply:
      "We list **200+ verified properties** across 5 categories — tap any to see details:\n\n🏢 **Apartments** — 80+ listings (2/3/4 BHK)\n🏠 **Villas** — 35+ gated villas with pools\n📐 **Open Plots** — HMDA & DTCP approved\n🌿 **Farm Land** — concept projects, NRI-friendly\n🏬 **Commercial** — offices, retail, pre-leased",
    links: [
      { type: 'page', label: 'All Properties →',  href: '/properties' },
      { type: 'page', label: '🏢 Apartments',     href: '/properties?subtype=Apartment' },
      { type: 'page', label: '🏠 Villas',         href: '/properties?subtype=Villa' },
      { type: 'page', label: '📐 Plots',          href: '/properties?subtype=Plot' },
      { type: 'page', label: '🌿 Farm Land',      href: '/properties?subtype=Farm+Land' },
      { type: 'page', label: '🏬 Commercial',     href: '/properties?type=Commercial' },
    ],
    suggest: ['Apartments', 'Villas', 'Plots', 'Commercial'],
  },

  /* ── Properties / Listings / general inventory ──── */
  {
    name: 'properties',
    patterns: [
      /\bpropert(y|ies)\b/i,
      /\b(listing|listings|projects?|inventory|catalog)\b/i,
    ],
    reply:
      "We list **200+ verified properties** across these categories:\n\n🏢 Apartments (2/3/4 BHK)\n🏠 Villas (gated communities)\n📐 Open Plots (HMDA / DTCP approved)\n🌿 Farm Land (concept projects)\n🏬 Commercial (offices, retail, pre-leased)\n\nTap any category to drill in.",
    links: [
      { type: 'page', label: 'All Properties →',  href: '/properties' },
      { type: 'page', label: 'Apartments',        href: '/properties?subtype=Apartment' },
      { type: 'page', label: 'Villas',            href: '/properties?subtype=Villa' },
      { type: 'page', label: 'Plots',             href: '/properties?subtype=Plot' },
      { type: 'page', label: 'Commercial',        href: '/properties?type=Commercial' },
    ],
    suggest: ['Featured projects', 'New launches', 'Ready to move'],
  },

  /* ── Featured / Premium / Luxury / New Launch ────── */
  {
    name: 'featured',
    patterns: [
      /\b(featured|premium|luxury|new\s*launch|highlight|hand[- ]?picked)\b/i,
    ],
    reply:
      "Our **hand-picked** lists update weekly:\n\n⭐ Featured Projects — top picks across categories\n💎 Premium — high-value 3/4 BHK and villas\n👑 Luxury — penthouses, farmhouses, signature villas\n🚀 New Launches — ground-floor pricing",
    links: [
      { type: 'page', label: '⭐ Featured',     href: '/properties?featured=true' },
      { type: 'page', label: '💎 Premium',      href: '/properties?badge=Premium' },
      { type: 'page', label: '👑 Luxury',       href: '/properties?badge=Luxury' },
      { type: 'page', label: '🚀 New Launches', href: '/properties?badge=New+Launch' },
    ],
    suggest: ['Browse all', 'Ready to move'],
  },

  /* ── Ready to Move / Under Construction ──────────── */
  {
    name: 'status',
    patterns: [
      /\b(ready\s*to\s*move|under\s*construction|possession|move\s*in)\b/i,
    ],
    reply:
      "Sort properties by completion stage:\n\n✅ **Ready to Move** — get keys immediately, perfect for end-users\n🏗️ **Under Construction** — best pricing, longer possession",
    links: [
      { type: 'page', label: 'Ready to Move →',      href: '/properties?subtype=Ready+to+Move' },
      { type: 'page', label: 'Under Construction →', href: '/properties?subtype=Under+Construction' },
    ],
    suggest: ['Schedule visit', 'Home loan help'],
  },

  /* ── Locations / Areas / Localities ──────────────── */
  {
    name: 'locations',
    patterns: [
      /\b(location|area|locality|where.*(propert|invest)|kokapet|gachibowli|tellapur|narsingi|madhapur|kollur|shamshabad|adibatla)\b/i,
    ],
    reply:
      "We cover Hyderabad's prime corridors:\n\n• **West:** Kokapet · Financial District · Gachibowli · Narsingi · Tellapur · Kollur\n• **North:** Bachupally · Kompally · Medchal · Shamirpet · Dundigal\n• **South:** Shamshabad · Adibatla · Tukkuguda · Yadadri\n• **East:** Uppal · Pocharam · Ghatkesar · LB Nagar",
    links: [
      { type: 'page', label: 'Browse by Location →', href: '/properties' },
    ],
    suggest: ['Apartments in Kokapet', 'Plots near Adibatla'],
  },

  /* ── Brokerage / Pricing / Hidden charges ────────── */
  {
    name: 'brokerage',
    patterns: [
      /\b(brokerage|commission|fees?|charges?|hidden|cost|pricing|expensive)\b/i,
    ],
    reply:
      "💰 **Zero brokerage from buyers, ever.**\n\nOur advisory service is free for end-users. The only fees you pay are direct to the developer / bank / statutory body (stamp duty, registration, GST, loan processing) — and every charge is disclosed upfront before you commit.",
    links: [
      { type: 'page', label: 'Why Choose Us →', href: '/about' },
    ],
    suggest: ['Home loan help', 'RERA verified'],
  },

  /* ── RERA / Legal / Compliance ───────────────────── */
  {
    name: 'rera',
    patterns: [
      /\b(rera|hmda|dtcp|legal|approval|registration|verified|compliance|title)\b/i,
    ],
    reply:
      "Every listing on PrimePro is **RERA registered** and approved by HMDA or DTCP. Our in-house legal desk verifies title, layout, escrow and bank sanctions before a project goes live.\n\nYou can also cross-check the RERA number on the regulator's portal directly.",
    links: [
      { type: 'page', label: 'RERA Compliance →', href: '/rera-compliance' },
      { type: 'ext',  label: 'TS RERA Portal →',  href: 'https://rera.telangana.gov.in/' },
    ],
    suggest: ['Why choose us', 'Schedule visit'],
  },

  /* ── NRI / Overseas / Remote / Power of Attorney ── */
  {
    name: 'nri',
    patterns: [
      /\b(nri|overseas|abroad|usa|dubai|uae|uk|canada|australia|fema|power\s*of\s*attorney|poa)\b/i,
    ],
    reply:
      "🌏 **Dedicated NRI Desk**\n\nWe handle remote real-estate end-to-end for NRIs:\n• FEMA-compliant transactions\n• Video site walkthroughs\n• Power-of-Attorney execution\n• Remote registration & document signing\n• Post-purchase property care\n\nInvest from anywhere with full transparency.",
    links: [
      { type: 'wa', label: '💬 WhatsApp NRI Desk', href: WA_LINK },
      { type: 'page', label: 'Portfolio →', href: '/portfolio' },
    ],
    suggest: ['Contact details', 'Working hours'],
  },

  /* ── Home Loan / EMI / Bank ──────────────────────── */
  {
    name: 'loan',
    patterns: [
      /\b(loan|emi|mortgage|finance|bank|hdfc|sbi|icici|axis|bajaj)\b/i,
    ],
    reply:
      "🏦 **Home Loans — handled in-house**\n\nWe have tie-ups with HDFC, SBI, ICICI, Axis and Bajaj Finance. Our advisor will:\n• Match you with the best rate (currently 8.4–8.75% range)\n• Pre-approve eligibility before site visits\n• Co-ordinate document collection and disbursal\n\nNo extra processing fees from us.",
    links: [
      { type: 'tel', label: '📞 Talk to Loan Desk', href: `tel:${PHONE}` },
    ],
    suggest: ['Zero brokerage', 'Schedule visit'],
  },

  /* ── Schedule / Site Visit / Booking ─────────────── */
  {
    name: 'visit',
    patterns: [
      /\b(visit|schedule|book|tour|appointment|see.*property|walkthrough)\b/i,
    ],
    reply:
      "📅 **Schedule a free site visit**\n\nWe accompany you on every site visit, explain pricing and clauses, and help negotiate. Free, no obligation, picked up from your location if needed.",
    links: [
      { type: 'page', label: 'Schedule Visit →', href: '/contact' },
      { type: 'tel',  label: '📞 Call to Book',  href: `tel:${PHONE}` },
      { type: 'wa',   label: '💬 WhatsApp',      href: WA_LINK },
    ],
    suggest: ['Working hours', 'Office address'],
  },

  /* ── Why Choose Us / USP / Differentiator ─────────── */
  {
    name: 'why',
    patterns: [
      /\b(why.*(choose|prime|you)|differ|usp|unique|special|better)\b/i,
    ],
    reply:
      "Six reasons families pick PrimePro:\n\n🔍 Transparent pricing — no hidden charges\n🤝 87% repeat & referral business\n⚡ 2-hour response SLA on every enquiry\n📋 In-house legal desk — never outsourced\n🏆 Award-winning in 2025\n💚 Honest advice — we'll tell you when NOT to buy too",
    links: [
      { type: 'page', label: 'About Us →',      href: '/about' },
      { type: 'page', label: 'Founder Portfolio →', href: '/portfolio' },
    ],
    suggest: ['Recent deals', 'Client reviews'],
  },

  /* ── Reviews / Testimonials / Ratings ─────────────── */
  {
    name: 'reviews',
    patterns: [
      /\b(review|testimonial|rating|feedback|client|customer\s*say)\b/i,
    ],
    reply:
      "⭐ **4.9 / 5 from 35+ happy families**\n\nClients consistently highlight our transparent paperwork, honest advice and end-to-end execution — including NRIs who buy remotely from Dubai, UK and the US.",
    links: [
      { type: 'page', label: 'Read Stories →', href: '/about' },
      { type: 'page', label: 'Founder Portfolio →', href: '/portfolio' },
    ],
    suggest: ['Recent wins', 'About PrimePro'],
  },

  /* ── Awards / Recognition ─────────────────────────── */
  {
    name: 'awards',
    patterns: [
      /\b(award|recogni[sz]e|prize|achievement|trophy)\b/i,
    ],
    reply:
      "🏆 Awarded one of **Hyderabad's most trusted real-estate platforms in 2025** within a year of founding — backed by 200+ verified listings, 35+ happy clients and a 4.9★ rating.",
    links: [
      { type: 'page', label: 'Our Journey →', href: '/portfolio' },
    ],
    suggest: ['About PrimePro', 'Why choose us'],
  },

  /* ── Privacy / Terms / Legal pages ────────────────── */
  {
    name: 'policies',
    patterns: [
      /\b(privacy|terms|policy|policies|sitemap|legal)\b/i,
    ],
    reply:
      "Quick links to our legal pages:",
    links: [
      { type: 'page', label: 'Privacy Policy', href: '/privacy-policy' },
      { type: 'page', label: 'Terms of Use',    href: '/terms' },
      { type: 'page', label: 'RERA Compliance', href: '/rera-compliance' },
      { type: 'page', label: 'Sitemap',         href: '/sitemap' },
    ],
    suggest: ['Contact details'],
  },

  /* ── Thanks ──────────────────────────────────────── */
  {
    name: 'thanks',
    patterns: [/\b(thanks?|thank\s*you|thx|ty)\b/i],
    reply: "You're very welcome 🙏 — whenever you want to chat, I'm right here. For anything bigger, our advisors are one call away.",
    links: [
      { type: 'tel', label: '📞 Talk to Advisor', href: `tel:${PHONE}` },
    ],
  },

  /* ── Goodbye ─────────────────────────────────────── */
  {
    name: 'bye',
    patterns: [/^(bye|goodbye|see\s*ya|see\s*you|tata|cya)\b/i],
    reply: "Bye! 👋 Reach out anytime — call, WhatsApp or just open this chat again.",
  },
];

/* Default fallback when nothing matches.
   Kept warm and engagement-first — we never tell the visitor to "go away";
   we offer relevant topics and a direct human touch-point in the same breath. */
export const DEFAULT_FALLBACK = {
  reply:
    "I want to give you the right answer 🙂 — could you tell me a bit more, or pick one of these popular topics? You can also tap **WhatsApp** below and our advisor will pick it up straight away.",
  links: [
    { type: 'wa',   label: '💬 WhatsApp Us',     href: WA_LINK },
    { type: 'tel',  label: '📞 Call Advisor',    href: `tel:${PHONE}` },
  ],
  suggest: ['Property categories', 'Contact details', 'Working hours', 'Schedule visit'],
};

/**
 * Match a user message against the intent list.
 * Returns the first matching intent's response object or DEFAULT_FALLBACK.
 */
export function matchIntent(message) {
  const text = (message || '').toLowerCase().trim();
  if (!text) return DEFAULT_FALLBACK;
  for (const intent of INTENTS) {
    if (intent.patterns.some(p => p.test(text))) {
      return intent;
    }
  }
  return DEFAULT_FALLBACK;
}
