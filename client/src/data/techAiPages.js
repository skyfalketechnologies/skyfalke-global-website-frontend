import { getMarketingExpansion } from './marketingExpansions';

const u = (photoPath, w = 2000) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${w}&q=80`;

export const TECH_AI_PAGES = {
  'ai-strategy': {
    slug: 'ai-strategy',
    title: 'AI Strategy',
    metaDescription:
      'Responsible AI strategy, governance, and implementation roadmaps that convert ambition into measurable outcomes.',
    headline: 'AI strategy built for trust, speed, and business value',
    lede: 'We help leadership teams define high-impact use cases, governance guardrails, and delivery pathways that scale responsibly.',
    heroImage: { src: u('photo-1677442136019-21780ecad995'), alt: 'AI visual data landscape' },
    spotlightImage: { src: u('photo-1515879218367-8466d910aaa4', 1600), alt: 'Engineer reviewing AI workflow' },
    pillars: ['AI opportunity and readiness assessment', 'Governance, ethics, and risk controls', 'Implementation roadmap and operating model'],
    stats: [
      { value: 'Risk-aware', label: 'Governance by design' },
      { value: 'Use-case first', label: 'Prioritized by business value' },
      { value: 'Scalable', label: 'Pilot to enterprise rollout' },
    ],
  },
  'data-platforms': {
    slug: 'data-platforms',
    title: 'Data Platforms',
    metaDescription:
      'Modern data platforms and governance foundations that improve decision quality, reliability, and speed.',
    headline: 'Data platforms that leadership can trust',
    lede: 'From architecture to governance, we build data foundations that connect systems and deliver actionable insight.',
    heroImage: { src: u('photo-1518770660439-4636190af475'), alt: 'Technology motherboard close-up' },
    spotlightImage: { src: u('photo-1461749280684-dccba630e2f6', 1600), alt: 'Code and data engineering workspace' },
    pillars: ['Unified data architecture and integration', 'Data governance and quality standards', 'Analytics enablement for decision teams'],
    stats: [
      { value: 'Unified', label: 'Cross-system visibility' },
      { value: 'Reliable', label: 'Quality and governance controls' },
      { value: 'Actionable', label: 'Analytics embedded in workflows' },
    ],
  },
  'cloud-modernization': {
    slug: 'cloud-modernization',
    title: 'Cloud Modernization',
    metaDescription:
      'Cloud strategy, migration, and operational modernization to improve resilience, performance, and cost governance.',
    headline: 'Cloud modernization with operational discipline',
    lede: 'We modernize infrastructure and application environments through phased migration, reliability engineering, and continuous optimization.',
    heroImage: { src: u('photo-1451187580459-43490279c0fa'), alt: 'Cloud and network connectivity concept' },
    spotlightImage: { src: u('photo-1558494949-ef010cbdcc31', 1600), alt: 'Server infrastructure and cloud operations' },
    pillars: ['Cloud architecture and migration planning', 'Security and compliance hardening', 'Performance, reliability, and cost optimization'],
    stats: [
      { value: 'Resilient', label: 'Reliable and secure platforms' },
      { value: 'Optimized', label: 'Performance and cost balance' },
      { value: 'Managed', label: 'Operational readiness and governance' },
    ],
  },
};

export const TECH_AI_SLUGS = Object.keys(TECH_AI_PAGES);
export const getTechAiPage = (slug) => {
  const page = TECH_AI_PAGES[slug];
  if (!page) return null;
  return { ...page, ...getMarketingExpansion('techAi', slug) };
};
export const getAllTechAiPages = () => TECH_AI_SLUGS.map((slug) => TECH_AI_PAGES[slug]);
