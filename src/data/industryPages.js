/**
 * Industry landing pages — content for /industries/[slug]
 * Imagery: Unsplash (professional / editorial tone)
 */

const u = (photoPath, w = 2000) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${w}&q=80`;

export const INDUSTRY_PAGES = {
  agriculture: {
    slug: 'agriculture',
    title: 'Agriculture',
    metaDescription:
      'Digitize agronomy, supply chains, and rural commerce with platforms that improve yield visibility, traceability, and partner coordination.',
    eyebrow: 'Industries',
    headline: 'Resilient food systems and smarter rural commerce',
    lede: 'We help agribusinesses and cooperatives connect field operations to markets—through data, channels, and secure transactions that scale across seasons.',
    heroImage: {
      src: u('photo-1625246333195-78d9c38ad449'),
      alt: 'Golden crop field at sunrise',
    },
    spotlightImage: {
      src: u('photo-1464226184884-fa280b87c399'),
      alt: 'Agronomist reviewing crop data on a tablet',
    },
    gallery: [
      { src: u('photo-1574943320219-553eb213f72d', 1200), alt: 'Greenhouse and modern farming' },
      { src: u('photo-1592982537447-7440770cbfc9', 1200), alt: 'Agricultural logistics and storage' },
      { src: u('photo-1416339306562-f3d6fef7b2e0', 1200), alt: 'Farm landscape and equipment' },
    ],
    stats: [
      { value: 'End-to-end', label: 'Traceability & quality signals' },
      { value: 'Omnichannel', label: 'Farmer, buyer & partner portals' },
      { value: 'Forecast-ready', label: 'Yield, inventory & demand views' },
    ],
    challenges: [
      'Fragmented data across farms, cooperatives, and off-takers',
      'Price volatility and opaque supply chains',
      'Last-mile logistics and cold-chain visibility',
    ],
    capabilities: [
      'Commerce and partner portals for inputs and offtake',
      'Field data, IoT integrations, and operational dashboards',
      'Payments, reconciliation, and audit-friendly records',
    ],
    approach: [
      {
        title: 'Diagnose the value chain',
        body: 'Map actors, data flows, and margin leakage from farm to shelf.',
      },
      {
        title: 'Design the digital backbone',
        body: 'Prioritize platforms that improve decisions in-season—not shelf-ware.',
      },
      {
        title: 'Implement and scale',
        body: 'Roll out in waves with adoption metrics tied to commercial outcomes.',
      },
    ],
    relatedHref: '/services',
    relatedLabel: 'Explore solutions',
  },
  'law-justice': {
    slug: 'law-justice',
    title: 'Law & Justice',
    metaDescription:
      'Modernize legal operations with secure systems for matter management, compliance workflows, and client collaboration.',
    eyebrow: 'Industries',
    headline: 'Secure operations for firms and justice institutions',
    lede: 'From boutique practices to complex caseloads, we implement technology that protects privilege, streamlines matter work, and improves transparency where it matters.',
    heroImage: {
      src: u('photo-1589829545856-d10d557cf95f'),
      alt: 'Law library with legal volumes',
    },
    spotlightImage: {
      src: u('photo-1450101499163-c8848c66ca85'),
      alt: 'Professional reviewing documents at a desk',
    },
    gallery: [
      { src: u('photo-1505664194779-8beaceb93744', 1200), alt: 'Courthouse columns' },
      { src: u('photo-1454165804606-c3d57bc86b40', 1200), alt: 'Team reviewing compliance materials' },
      { src: u('photo-1521791055366-05d729732e54', 1200), alt: 'Contract and signature workflow' },
    ],
    stats: [
      { value: 'Zero-trust', label: 'Aligned access & encryption' },
      { value: 'Workflow', label: 'Matter intake to closure' },
      { value: 'Audit-ready', label: 'Logging & retention policies' },
    ],
    challenges: [
      'Rising client expectations on speed and transparency',
      'Manual handoffs between fee-earners and business services',
      'Regulatory change and evidence handling across jurisdictions',
    ],
    capabilities: [
      'Document automation, DMS, and collaboration guardrails',
      'CRM and intake tuned to professional services',
      'Analytics on utilization, pipeline, and profitability',
    ],
    approach: [
      {
        title: 'Risk-first architecture',
        body: 'Start with data classification, access patterns, and vendor posture.',
      },
      {
        title: 'Process modernization',
        body: 'Standardize the journeys that consume the most senior time.',
      },
      {
        title: 'Continuous compliance',
        body: 'Instrument controls so change becomes measurable, not aspirational.',
      },
    ],
    relatedHref: '/services/business-tools',
    relatedLabel: 'Business tools & automation',
  },
  automobile: {
    slug: 'automobile',
    title: 'Automobile',
    metaDescription:
      'Connected customer journeys, dealer systems, and aftermarket experiences for mobility brands and networks.',
    eyebrow: 'Industries',
    headline: 'Customer experience across the full ownership lifecycle',
    lede: 'We unify marketing, retail, and service touchpoints so brands convert demand, retain owners, and monetize loyalty with clarity.',
    heroImage: {
      src: u('photo-1492144534655-ae79c964c9d7'),
      alt: 'Performance vehicle on an open road',
    },
    spotlightImage: {
      src: u('photo-1486262715619-67b85e0a08d3'),
      alt: 'Automotive design and engineering environment',
    },
    gallery: [
      { src: u('photo-1487754180451-c456f719a1fc', 1200), alt: 'Vehicle showroom' },
      { src: u('photo-1631292780980-ab8b3ac50707', 1200), alt: 'Electric vehicle charging' },
      { src: u('photo-1503376780353-7e6692767b70', 1200), alt: 'Sports car detail' },
    ],
    stats: [
      { value: 'Omnichannel', label: 'Retail & aftersales alignment' },
      { value: 'Lifecycle', label: 'From lead to loyal owner' },
      { value: 'Measurable', label: 'Attribution across touchpoints' },
    ],
    challenges: [
      'Long purchase cycles and fragmented dealer data',
      'Aftermarket revenue leakage and service retention',
      'Rapid shift to EV ecosystems and new partnerships',
    ],
    capabilities: [
      'Dealer and partner portals with consistent brand experience',
      'CRM, marketing automation, and service scheduling',
      'Analytics on funnel, inventory, and customer lifetime value',
    ],
    approach: [
      {
        title: 'Journey mapping',
        body: 'Identify breakpoints between digital intent and showroom reality.',
      },
      {
        title: 'Platform integration',
        body: 'Connect retail, service, and enterprise systems without brittle glue code.',
      },
      {
        title: 'Growth loops',
        body: 'Design programs that compound—referrals, accessories, and service contracts.',
      },
    ],
    relatedHref: '/services/paid-media',
    relatedLabel: 'Paid media & growth',
  },
  education: {
    slug: 'education',
    title: 'Education',
    metaDescription:
      'Student information systems, learning platforms, and institutional digital strategy at scale.',
    eyebrow: 'Industries',
    headline: 'Learning outcomes supported by modern digital infrastructure',
    lede: 'Institutions need secure, inclusive systems that support learners, faculty, and administrators—without compromising accreditation or privacy.',
    heroImage: {
      src: u('photo-1523050854058-8df90110c9f1'),
      alt: 'University graduation ceremony',
    },
    spotlightImage: {
      src: u('photo-1523240795612-9a054b0db644', 1600),
      alt: 'Students collaborating in a modern classroom',
    },
    gallery: [
      { src: u('photo-1503676260728-1c00da094a0b', 1200), alt: 'Library study space' },
      { src: u('photo-1434030216411-0b793f4b4173', 1200), alt: 'Lecture and learning' },
      { src: u('photo-1516321318423-f06f85e504b3', 1200), alt: 'Campus architecture' },
    ],
    stats: [
      { value: 'Student-first', label: 'Portals & self-service' },
      { value: 'Secure', label: 'Privacy-by-design patterns' },
      { value: 'Insight-led', label: 'Retention & performance views' },
    ],
    challenges: [
      'Siloed systems across admissions, finance, and academics',
      'Digital equity and accessibility expectations',
      'Operational pressure to do more without larger teams',
    ],
    capabilities: [
      'Portals, LMS integrations, and unified communications',
      'Data platforms for enrollment, retention, and outcomes',
      'Change management for faculty and staff adoption',
    ],
    approach: [
      {
        title: 'Stakeholder alignment',
        body: 'Co-design with academic and administrative leadership on outcomes.',
      },
      {
        title: 'Phased modernization',
        body: 'Sequence investments where risk is low and impact is visible.',
      },
      {
        title: 'Governance',
        body: 'Establish ownership for data, integrations, and vendor relationships.',
      },
    ],
    relatedHref: '/services/data-analytics',
    relatedLabel: 'Data & analytics',
  },
  'engineering-construction': {
    slug: 'engineering-construction',
    title: 'Engineering & Construction',
    metaDescription:
      'Project controls, field mobility, and capital efficiency for engineering and construction enterprises.',
    eyebrow: 'Industries',
    headline: 'Delivery certainty on complex capital programs',
    lede: 'We connect site execution to enterprise planning—improving visibility on cost, schedule, safety, and subcontractor performance.',
    heroImage: {
      src: u('photo-1541888946425-d81bb19240f5'),
      alt: 'Construction site with cranes',
    },
    spotlightImage: {
      src: u('photo-1504307651254-35680f356dfd'),
      alt: 'Engineers reviewing blueprints',
    },
    gallery: [
      { src: u('photo-1581092160562-40aa08f78840', 1200), alt: 'Heavy machinery at work' },
      { src: u('photo-1581094794329-c8112a89af12', 1200), alt: 'Safety equipment and team briefing' },
      { src: u('photo-1541976590-713941681591', 1200), alt: 'Infrastructure and steel framework' },
    ],
    stats: [
      { value: 'Real-time', label: 'Site-to-office visibility' },
      { value: 'Controls', label: 'Cost, risk & change discipline' },
      { value: 'Integrated', label: 'ERP, PM & supply chain links' },
    ],
    challenges: [
      'Margin pressure and subcontractor fragmentation',
      'Safety and compliance documentation burden',
      'Disconnected tools between field teams and finance',
    ],
    capabilities: [
      'Mobile field workflows and digital forms',
      'Dashboards for project health and executive reporting',
      'Integrations across ERP, scheduling, and procurement',
    ],
    approach: [
      {
        title: 'Single source of truth',
        body: 'Define the minimum viable data model that leadership trusts.',
      },
      {
        title: 'Field adoption',
        body: 'Design for foremen first—speed beats feature depth on day one.',
      },
      {
        title: 'Continuous improvement',
        body: 'Tie releases to lagging indicators: incidents, rework, and cash flow.',
      },
    ],
    relatedHref: '/cloud-solutions',
    relatedLabel: 'Managed platforms',
  },
  'financial-services': {
    slug: 'financial-services',
    title: 'Financial Services',
    metaDescription:
      'Digital channels, risk-aware architecture, and customer trust for banks, insurers, and fintechs.',
    eyebrow: 'Industries',
    headline: 'Trusted experiences in regulated markets',
    lede: 'We help financial institutions modernize customer journeys while strengthening controls—balancing growth with resilience.',
    heroImage: {
      src: u('photo-1611974789855-9c2a0a7236a3'),
      alt: 'Financial charts and market displays',
    },
    spotlightImage: {
      src: u('photo-1554224155-6726b3ff858f'),
      alt: 'Professional banking and advisory meeting',
    },
    gallery: [
      { src: u('photo-1563986768609-322da13575f3', 1200), alt: 'Mobile banking on smartphone' },
      { src: u('photo-1454165804606-c3d57bc86b40', 1200), alt: 'Team analyzing financial reports' },
      { src: u('photo-1579621970563-ebec7560ff3e', 1200), alt: 'Coins and finance concept' },
    ],
    stats: [
      { value: 'Secure', label: 'Identity, fraud & data protection' },
      { value: 'Composable', label: 'APIs & core adjacency' },
      { value: 'Insightful', label: 'Customer & risk analytics' },
    ],
    challenges: [
      'Rising digital expectations versus legacy cores',
      'Fraud sophistication and regulatory scrutiny',
      'Cost-to-serve pressure across segments',
    ],
    capabilities: [
      'Digital onboarding and servicing journeys',
      'Data platforms for risk, marketing, and operations',
      'Cloud migration patterns with strong operational resilience',
    ],
    approach: [
      {
        title: 'Control agenda',
        body: 'Embed security, privacy, and resilience into the roadmap—not as an afterthought.',
      },
      {
        title: 'Customer episodes',
        body: 'Prioritize journeys with the highest attrition or servicing cost.',
      },
      {
        title: 'Industrialized delivery',
        body: 'Use repeatable playbooks for integration, testing, and release.',
      },
    ],
    relatedHref: '/services/ict-strategy',
    relatedLabel: 'ICT strategy',
  },
  'health-care': {
    slug: 'health-care',
    title: 'Health Care',
    metaDescription:
      'Clinical workflows, patient access, and interoperable systems for providers and health enterprises.',
    eyebrow: 'Industries',
    headline: 'Better care coordination through purposeful technology',
    lede: 'We align patient access, clinical operations, and back-office systems so teams spend time on care—not paperwork.',
    heroImage: {
      src: u('photo-1519494026892-80bbd2d6fd0d'),
      alt: 'Modern hospital interior',
    },
    spotlightImage: {
      src: u('photo-1576091160399-112ba8d25d1d'),
      alt: 'Healthcare professionals in clinical setting',
    },
    gallery: [
      { src: u('photo-1579684385127-1ef15d508118', 1200), alt: 'Medical technology and monitors' },
      { src: u('photo-1551601651-2a8555f1a136', 1200), alt: 'Patient consultation' },
      { src: u('photo-1532938911079-1b09ac7d8e7b', 1200), alt: 'Hospital corridor' },
    ],
    stats: [
      { value: 'Patient-first', label: 'Access & navigation' },
      { value: 'Interoperable', label: 'Systems that share meaningfully' },
      { value: 'Operational', label: 'Throughput & workforce leverage' },
    ],
    challenges: [
      'Workforce burnout and administrative load',
      'Fragmented records and referral leakage',
      'Revenue cycle complexity and payer dynamics',
    ],
    capabilities: [
      'Patient portals, scheduling, and communication workflows',
      'Integration layers between EMR, labs, and finance',
      'Analytics on access, outcomes, and operations',
    ],
    approach: [
      {
        title: 'Clinical co-design',
        body: 'Embed frontline input so tools fit real shifts and handoffs.',
      },
      {
        title: 'Safety and privacy',
        body: 'Engineer for HIPAA-grade patterns and breach-resistant operations.',
      },
      {
        title: 'Measured adoption',
        body: 'Tie rollouts to utilization, wait times, and denials—not go-live dates alone.',
      },
    ],
    relatedHref: '/services/business-tools',
    relatedLabel: 'Automation & tools',
  },
  logistics: {
    slug: 'logistics',
    title: 'Logistics',
    metaDescription:
      'Network design, visibility, and resilience for logistics operators, 3PLs, and shippers.',
    eyebrow: 'Industries',
    headline: 'Networks that stay visible when conditions shift',
    lede: 'From first mile to last mile, we build visibility, partner coordination, and analytics that protect service levels and margin.',
    heroImage: {
      src: u('photo-1586528116311-ad8dd3c8310d'),
      alt: 'Warehouse aisles and inventory',
    },
    spotlightImage: {
      src: u('photo-1519003722824-cd2e773ed223', 1600),
      alt: 'Freight truck on highway at dusk',
    },
    gallery: [
      { src: u('photo-1494412510700-4e90a79561e0', 1200), alt: 'Shipping containers at port' },
      { src: u('photo-1578575437130-527eed3ccc64', 1200), alt: 'Supply chain planning' },
      { src: u('photo-1601584115197-04ecc0da31d7', 1200), alt: 'Delivery and fleet operations' },
    ],
    stats: [
      { value: 'End-to-end', label: 'Tracking & exception handling' },
      { value: 'Partner-ready', label: 'Carrier & 3PL collaboration' },
      { value: 'Optimized', label: 'Cost-to-serve analytics' },
    ],
    challenges: [
      'Volatility in lanes, fuel, and labor',
      'Opaque subcontractor performance',
      'Customer expectations set by consumer logistics leaders',
    ],
    capabilities: [
      'Control towers and operational dashboards',
      'TMS/WMS integrations and event streaming',
      'Commercial systems for quoting, billing, and SLAs',
    ],
    approach: [
      {
        title: 'Signal over noise',
        body: 'Prioritize exceptions that impact OTIF and margin.',
      },
      {
        title: 'Orchestration',
        body: 'Design workflows that connect planners, yards, and drivers.',
      },
      {
        title: 'Continuous tuning',
        body: 'Use experiments on routes, nodes, and inventory placement.',
      },
    ],
    relatedHref: '/services/data-analytics',
    relatedLabel: 'Analytics & BI',
  },
  'public-service': {
    slug: 'public-service',
    title: 'Public Service',
    metaDescription:
      'Citizen-centric digital services and secure infrastructure for public sector organizations.',
    eyebrow: 'Industries',
    headline: 'Services citizens can navigate with confidence',
    lede: 'We help agencies modernize touchpoints, improve case throughput, and strengthen cybersecurity—without losing accountability.',
    heroImage: {
      src: u('photo-1560472354-b33ff0c44a43'),
      alt: 'Modern civic building facade',
    },
    spotlightImage: {
      src: u('photo-1454165804606-c3d57bc86b40', 1600),
      alt: 'Public sector team in strategy session',
    },
    gallery: [
      { src: u('photo-1529107386315-e1a2b48e34f2', 1200), alt: 'Community and civic engagement' },
      { src: u('photo-1450101499163-c8848c66ca85', 1200), alt: 'Policy and document review' },
      { src: u('photo-1504384308090-c894fdcc538d', 1200), alt: 'Team collaboration' },
    ],
    stats: [
      { value: 'Accessible', label: 'Inclusive digital journeys' },
      { value: 'Secure', label: 'Zero-trust patterns' },
      { value: 'Accountable', label: 'Audit trails & transparency' },
    ],
    challenges: [
      'Legacy systems and procurement constraints',
      'Expectations for consumer-grade experiences',
      'Workforce skills and change capacity',
    ],
    capabilities: [
      'Citizen portals and case management modernization',
      'Identity, consent, and data governance',
      'Analytics on service levels and equitable access',
    ],
    approach: [
      {
        title: 'Outcome funding',
        body: 'Tie milestones to measurable service improvements.',
      },
      {
        title: 'Incremental modernization',
        body: 'Prefer interfaces and shared services over risky big-bang cuts.',
      },
      {
        title: 'Vendor neutrality',
        body: 'Architect so agencies retain optionality across suppliers.',
      },
    ],
    relatedHref: '/services/ict-strategy',
    relatedLabel: 'Digital strategy',
  },
  retail: {
    slug: 'retail',
    title: 'Retail',
    metaDescription:
      'Omnichannel commerce, loyalty, and store operations for retailers building durable customer relationships.',
    eyebrow: 'Industries',
    headline: 'Commerce that feels coherent everywhere',
    lede: 'We connect merchandising, stores, and digital so brands earn repeat purchases—not one-off transactions.',
    heroImage: {
      src: u('photo-1441986300917-64674bd600d8'),
      alt: 'Retail store interior with apparel',
    },
    spotlightImage: {
      src: u('photo-1556742049-0cfed4f6a45d', 1600),
      alt: 'Checkout and retail technology',
    },
    gallery: [
      { src: u('photo-1472851294608-062f824d29cc', 1200), alt: 'Shopping bags and fashion retail' },
      { src: u('photo-1555529908-865e8e9d3c0e', 1200), alt: 'E-commerce on laptop' },
      { src: u('photo-1445205170230-053b83016050', 1200), alt: 'Boutique display' },
    ],
    stats: [
      { value: 'Unified', label: 'Inventory & customer views' },
      { value: 'Personalized', label: 'Segments & lifecycle marketing' },
      { value: 'Performant', label: 'Attribution & trade spend' },
    ],
    challenges: [
      'Channel conflict and inconsistent pricing',
      'Rising acquisition costs and promo dependency',
      'Labor productivity in stores and DCs',
    ],
    capabilities: [
      'E-commerce, OMS, and marketplace integrations',
      'CRM, loyalty, and marketing automation',
      'Store operations tools and workforce scheduling',
    ],
    approach: [
      {
        title: 'Customer clarity',
        body: 'Define the segments and journeys that drive margin, not just revenue.',
      },
      {
        title: 'Operational glue',
        body: 'Fix the integrations that break promises at pickup and returns.',
      },
      {
        title: 'Test-and-learn',
        body: 'Run disciplined experiments on merchandising and messaging.',
      },
    ],
    relatedHref: '/services/creative',
    relatedLabel: 'Creative & brand',
  },
  'real-estate': {
    slug: 'real-estate',
    title: 'Real Estate',
    metaDescription:
      'Portfolio analytics, transaction workflows, and digital experience for developers, agencies, and investors.',
    eyebrow: 'Industries',
    headline: 'Experience and velocity across the asset lifecycle',
    lede: 'From marketing suites to investor reporting, we digitize the workflows that accelerate transactions and improve portfolio transparency.',
    heroImage: {
      src: u('photo-1560518883-ce09059eeffa'),
      alt: 'Modern residential property exterior',
    },
    spotlightImage: {
      src: u('photo-1486406146926-c627a92ad1ab'),
      alt: 'Urban skyline and high-rise buildings',
    },
    gallery: [
      { src: u('photo-1600596542815-ffad4c1539a9', 1200), alt: 'Luxury home interior' },
      { src: u('photo-1600585154340-be6161a56a0c', 1200), alt: 'Architectural residential design' },
      { src: u('photo-1600047509807-ba8f99d2cdde', 1200), alt: 'Property keys and handover' },
    ],
    stats: [
      { value: 'Pipeline', label: 'Lead-to-lease visibility' },
      { value: 'Investor-grade', label: 'Reporting & dashboards' },
      { value: 'Branded', label: 'Digital experiences that convert' },
    ],
    challenges: [
      'Long sales cycles and fragmented lead sources',
      'Manual contract and compliance steps',
      'Investor demand for timely, trustworthy data',
    ],
    capabilities: [
      'Listing sites, portals, and CRM for brokers and developers',
      'Document workflows and e-signature patterns',
      'Analytics on absorption, pricing, and marketing ROI',
    ],
    approach: [
      {
        title: 'Revenue architecture',
        body: 'Align marketing, sales, and operations on one funnel truth.',
      },
      {
        title: 'Trust builders',
        body: 'Use transparency—progress updates, documentation, and service—to differentiate.',
      },
      {
        title: 'Scale playbooks',
        body: 'Repeatable launches for new phases, assets, and geographies.',
      },
    ],
    relatedHref: '/services/paid-media',
    relatedLabel: 'Growth marketing',
  },
  'media-communications': {
    slug: 'media-communications',
    title: 'Media & Communications',
    metaDescription:
      'Audience intelligence, content operations, and monetization systems for media and communications leaders.',
    eyebrow: 'Industries',
    headline: 'Audience relationships that compound',
    lede: 'We help publishers, creators, and communications teams modernize content supply chains and prove commercial impact.',
    heroImage: {
      src: u('photo-1492691527719-9d1e07e534b4'),
      alt: 'Video production studio lighting',
    },
    spotlightImage: {
      src: u('photo-1598488035139-bdbb2231ce04', 1600),
      alt: 'Broadcast and media control room',
    },
    gallery: [
      { src: u('photo-1516035069371-29a1b244cc32', 1200), alt: 'Camera and creative production' },
      { src: u('photo-1504711434969-e33886168f5c', 1200), alt: 'News and publishing desk' },
      { src: u('photo-1611162616475-46b635cb6868', 1200), alt: 'Streaming and digital content' },
    ],
    stats: [
      { value: 'Data-led', label: 'Audience & engagement insight' },
      { value: 'Efficient', label: 'Content operations & DAM' },
      { value: 'Monetized', label: 'Subscriptions & partnerships' },
    ],
    challenges: [
      'Platform dependency and algorithm shifts',
      'Operational cost of always-on content',
      'Measurement gaps across channels',
    ],
    capabilities: [
      'Analytics stacks for content, campaigns, and revenue',
      'Workflow tooling for editorial and creative teams',
      'Subscription, paywall, and ad-tech integrations',
    ],
    approach: [
      {
        title: 'North-star metrics',
        body: 'Anchor teams on durable audience and revenue signals.',
      },
      {
        title: 'Operating model',
        body: 'Clarify roles between creative, growth, and technology.',
      },
      {
        title: 'Tech that flexes',
        body: 'Prefer modular stacks that adapt as formats evolve.',
      },
    ],
    relatedHref: '/services/earned-media',
    relatedLabel: 'Earned media & PR',
  },
};

export const INDUSTRY_SLUGS = Object.keys(INDUSTRY_PAGES);

export function getIndustryPage(slug) {
  return INDUSTRY_PAGES[slug] || null;
}

export function getAllIndustryPages() {
  return INDUSTRY_SLUGS.map((s) => INDUSTRY_PAGES[s]);
}
