const u = (photoPath, w = 2000) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${w}&q=80`;

export const SUSTAINABILITY_PAGES = {
  'environmental-stewardship': {
    slug: 'environmental-stewardship',
    title: 'Environmental Stewardship',
    metaDescription:
      'How we integrate environmental stewardship into technology strategy, delivery, and operations.',
    headline: 'Environmental stewardship embedded in delivery decisions',
    lede: 'We help organizations improve environmental performance through efficient architectures, responsible platform choices, and practical operational policies.',
    heroImage: { src: u('photo-1473448912268-2022ce9509d8'), alt: 'Green landscape and renewable future' },
    spotlightImage: { src: u('photo-1497436072909-60f360e1d4b1', 1600), alt: 'Sustainable city with green infrastructure' },
    pillars: ['Efficient infrastructure and workload design', 'Sustainability-aware architecture governance', 'Operational policies for continuous improvement'],
    stats: [
      { value: 'Efficient', label: 'Lower waste through optimized systems' },
      { value: 'Responsible', label: 'Environmental impact considered upfront' },
      { value: 'Trackable', label: 'Governance linked to measurable indicators' },
    ],
  },
  'responsible-technology': {
    slug: 'responsible-technology',
    title: 'Responsible Technology',
    metaDescription:
      'Responsible technology principles covering ethics, data governance, and long-term societal impact.',
    headline: 'Responsible technology for durable trust',
    lede: 'We design and deploy technology with safeguards for privacy, fairness, security, and transparency—so innovation remains sustainable and trusted.',
    heroImage: { src: u('photo-1451187580459-43490279c0fa'), alt: 'Digital network representing responsible technology' },
    spotlightImage: { src: u('photo-1550751827-4bd374c3f58b', 1600), alt: 'Secure technology operations center' },
    pillars: ['Ethics and governance by default', 'Privacy, security, and compliance controls', 'Transparent operating models and accountability'],
    stats: [
      { value: 'Ethical', label: 'Policy-led implementation guardrails' },
      { value: 'Secure', label: 'Data and systems protected by design' },
      { value: 'Trusted', label: 'Stakeholder confidence through transparency' },
    ],
  },
  'sustainable-operations': {
    slug: 'sustainable-operations',
    title: 'Sustainable Operations',
    metaDescription:
      'Operational models that improve resilience, resource efficiency, and long-term business sustainability.',
    headline: 'Operational sustainability that strengthens performance',
    lede: 'We help teams align operational excellence with sustainability goals through measurable policies, processes, and platform optimization.',
    heroImage: { src: u('photo-1466611653911-95081537e5b7'), alt: 'Wind turbines and sustainable operations' },
    spotlightImage: { src: u('photo-1497215728101-856f4ea42174', 1600), alt: 'Operations team reviewing performance metrics' },
    pillars: ['Sustainable operating model design', 'Process optimization and resource stewardship', 'Continuous performance and resilience management'],
    stats: [
      { value: 'Resilient', label: 'Stronger operations under changing conditions' },
      { value: 'Optimized', label: 'Resource use aligned to strategic priorities' },
      { value: 'Scalable', label: 'Sustainability embedded into growth plans' },
    ],
  },
};

export const SUSTAINABILITY_SLUGS = Object.keys(SUSTAINABILITY_PAGES);
export const getSustainabilityPage = (slug) => SUSTAINABILITY_PAGES[slug] || null;
export const getAllSustainabilityPages = () => SUSTAINABILITY_SLUGS.map((slug) => SUSTAINABILITY_PAGES[slug]);
