const u = (photoPath, w = 2000) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${w}&q=80`;

export const CAPABILITY_PAGES = {
  ai: {
    slug: 'ai',
    title: 'AI',
    metaDescription:
      'Responsible AI strategy, operating models, and practical implementations that create measurable business value.',
    headline: 'AI programs built for trust and business impact',
    lede: 'We help leadership teams move from pilots to scaled outcomes with clear governance, practical use cases, and robust data foundations.',
    heroImage: { src: u('photo-1677442136019-21780ecad995'), alt: 'Artificial intelligence visualization' },
    spotlightImage: { src: u('photo-1515879218367-8466d910aaa4', 1600), alt: 'Engineer working with AI systems' },
    stats: [
      { value: 'Use-case first', label: 'Prioritized by value and feasibility' },
      { value: 'Governed', label: 'Risk, security, and policy by design' },
      { value: 'Scalable', label: 'From pilot to enterprise adoption' },
    ],
    pillars: ['AI strategy and roadmap', 'Responsible AI governance', 'Model integration and MLOps'],
    gallery: [
      { src: u('photo-1620712943543-bcc4688e7485', 1200), alt: 'AI neural network concept' },
      { src: u('photo-1555949963-ff9fe0c870eb', 1200), alt: 'Developer typing on laptop' },
      { src: u('photo-1516321318423-f06f85e504b3', 1200), alt: 'Team workshop around technology strategy' },
    ],
  },
  digital: {
    slug: 'digital',
    title: 'Digital',
    metaDescription:
      'Digital strategy and experience design that aligns channels, products, and operations around growth.',
    headline: 'Digital transformation focused on outcomes, not noise',
    lede: 'We connect customer experience, product delivery, and operational execution so digital investment translates into revenue and resilience.',
    heroImage: { src: u('photo-1460925895917-afdab827c52f'), alt: 'Digital dashboards on laptop screen' },
    spotlightImage: { src: u('photo-1454165804606-c3d57bc86b40', 1600), alt: 'Leadership strategy meeting' },
    stats: [
      { value: 'End-to-end', label: 'Strategy through implementation' },
      { value: 'Customer-led', label: 'Journeys tied to commercial goals' },
      { value: 'Execution-ready', label: 'Roadmaps with clear ownership' },
    ],
    pillars: ['Digital strategy and portfolio design', 'Experience and product modernization', 'Operating model and delivery governance'],
    gallery: [
      { src: u('photo-1486406146926-c627a92ad1ab', 1200), alt: 'Modern city and digital economy' },
      { src: u('photo-1520607162513-77705c0f0d4a', 1200), alt: 'Team collaboration with digital boards' },
      { src: u('photo-1498050108023-c5249f4df085', 1200), alt: 'Product engineering setup' },
    ],
  },
  'data-technology': {
    slug: 'data-technology',
    title: 'Data & Technology',
    metaDescription:
      'Data platforms, engineering foundations, and analytics capabilities that support better decisions at speed.',
    headline: 'Data and technology foundations that scale',
    lede: 'We modernize architecture, pipelines, and analytics so teams trust their data and move faster with confidence.',
    heroImage: { src: u('photo-1518770660439-4636190af475'), alt: 'Circuit board and technology detail' },
    spotlightImage: { src: u('photo-1518186233392-c232efbf2373', 1600), alt: 'Data engineering workspace' },
    stats: [
      { value: 'Reliable', label: 'Data quality and governance standards' },
      { value: 'Connected', label: 'Unified platforms and integrations' },
      { value: 'Actionable', label: 'Analytics embedded in workflows' },
    ],
    pillars: ['Cloud data platform architecture', 'Analytics and BI acceleration', 'Engineering excellence and integration'],
    gallery: [
      { src: u('photo-1461749280684-dccba630e2f6', 1200), alt: 'Code and data screens' },
      { src: u('photo-1504384308090-c894fdcc538d', 1200), alt: 'Technology team planning' },
      { src: u('photo-1558494949-ef010cbdcc31', 1200), alt: 'Server racks and infrastructure' },
    ],
  },
  'marketing-sales': {
    slug: 'marketing-sales',
    title: 'Marketing & Sales',
    metaDescription:
      'Growth systems that align marketing, sales, and analytics to improve pipeline quality and conversion.',
    headline: 'Commercial performance through integrated growth systems',
    lede: 'We design and run full-funnel programs that connect demand generation, sales enablement, and revenue intelligence.',
    heroImage: { src: u('photo-1552664730-d307ca884978'), alt: 'Marketing and sales team in discussion' },
    spotlightImage: { src: u('photo-1460925895917-afdab827c52f', 1600), alt: 'Marketing analytics dashboard' },
    stats: [
      { value: 'Full-funnel', label: 'Brand, demand, and conversion alignment' },
      { value: 'Measurable', label: 'Attribution and ROI transparency' },
      { value: 'Sustainable', label: 'Repeatable growth playbooks' },
    ],
    pillars: ['Campaign strategy and optimization', 'CRM and pipeline acceleration', 'Sales and marketing analytics'],
    gallery: [
      { src: u('photo-1432888622747-4eb9a8efeb07', 1200), alt: 'Digital campaign management' },
      { src: u('photo-1533750516457-a7f992034fec', 1200), alt: 'Sales presentation meeting' },
      { src: u('photo-1557804506-669a67965ba0', 1200), alt: 'Team collaborating at whiteboard' },
    ],
  },
  'managed-services': {
    slug: 'managed-services',
    title: 'Managed Services',
    metaDescription:
      'Managed operations for cloud, platforms, and business-critical systems with continuous improvement.',
    headline: 'Run and optimize critical platforms with confidence',
    lede: 'We provide managed support and continuous optimization that keeps systems secure, available, and aligned with evolving business needs.',
    heroImage: { src: u('photo-1451187580459-43490279c0fa'), alt: 'Global network and cloud infrastructure' },
    spotlightImage: { src: u('photo-1550751827-4bd374c3f58b', 1600), alt: 'Cybersecurity and managed operations center' },
    stats: [
      { value: '24/7 ready', label: 'Monitoring and incident response' },
      { value: 'Secure', label: 'Hardening, controls, and compliance' },
      { value: 'Optimized', label: 'Performance and cost governance' },
    ],
    pillars: ['Cloud and infrastructure operations', 'Security and compliance management', 'SLA-driven support and optimization'],
    gallery: [
      { src: u('photo-1516321165247-4aa89a48be28', 1200), alt: 'Operations team monitoring systems' },
      { src: u('photo-1563013544-824ae1b704d3', 1200), alt: 'Secure data center operations' },
      { src: u('photo-1484417894907-623942c8ee29', 1200), alt: 'Cloud architecture visualization' },
    ],
  },
};

export const CAPABILITY_SLUGS = Object.keys(CAPABILITY_PAGES);

export const getCapabilityPage = (slug) => CAPABILITY_PAGES[slug] || null;

export const getAllCapabilityPages = () => CAPABILITY_SLUGS.map((slug) => CAPABILITY_PAGES[slug]);
