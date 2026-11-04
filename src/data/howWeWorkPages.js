import { getMarketingExpansion } from './marketingExpansions';

const u = (photoPath, w = 2000) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${w}&q=80`;

export const HOW_WE_WORK_PAGES = {
  solutions: {
    slug: 'solutions',
    title: 'Solutions',
    metaDescription:
      'End-to-end solution delivery from strategy and design to implementation and optimization.',
    headline: 'Solutions that integrate strategy, technology, and execution',
    lede: 'We design integrated solutions around your business priorities, then execute with clear milestones, accountable ownership, and measurable outcomes.',
    heroImage: { src: u('photo-1454165804606-c3d57bc86b40'), alt: 'Team aligning on solution strategy' },
    spotlightImage: { src: u('photo-1497366216548-37526070297c', 1600), alt: 'Collaborative problem-solving session' },
    stats: [
      { value: 'Integrated', label: 'Business, tech, and operations in one model' },
      { value: 'Accountable', label: 'Clear governance and milestone ownership' },
      { value: 'Outcome-focused', label: 'Metrics tied to business value' },
    ],
    principles: ['Prioritize highest-value business problems first', 'Design architecture for adoption and scale', 'Deliver iteratively with measurable checkpoints'],
    gallery: [
      { src: u('photo-1552664730-d307ca884978', 1200), alt: 'Executive working session' },
      { src: u('photo-1521737604893-d14cc237f11d', 1200), alt: 'Cross-functional team collaboration' },
      { src: u('photo-1551434678-e076c223a692', 1200), alt: 'Implementation planning on whiteboard' },
    ],
  },
  'case-studies': {
    slug: 'case-studies',
    title: 'Case Studies',
    metaDescription:
      'Proof of impact through real client engagements, transformation programs, and measurable outcomes.',
    headline: 'Evidence from real engagements and measurable impact',
    lede: 'Our case studies show how we approach complexity, align stakeholders, and convert strategy into sustained operational and commercial performance.',
    heroImage: { src: u('photo-1460925895917-afdab827c52f'), alt: 'Business dashboard with performance analytics' },
    spotlightImage: { src: u('photo-1542744173-8e7e53415bb0', 1600), alt: 'Team presenting performance results' },
    stats: [
      { value: 'Measured', label: 'Outcomes tracked across delivery phases' },
      { value: 'Replicable', label: 'Playbooks adapted across industries' },
      { value: 'Transparent', label: 'Clear baseline and post-impact reporting' },
    ],
    principles: ['Start with baseline metrics and risk profile', 'Document transformation milestones and decisions', 'Measure impact beyond launch into adoption'],
    gallery: [
      { src: u('photo-1554224154-22dec7ec8818', 1200), alt: 'Data-driven reporting setup' },
      { src: u('photo-1522202176988-66273c2fd55f', 1200), alt: 'Client workshop discussion' },
      { src: u('photo-1504384308090-c894fdcc538d', 1200), alt: 'Team reviewing outcome metrics' },
    ],
  },
  'from-idea-to-impact': {
    slug: 'from-idea-to-impact',
    title: 'From Idea to Impact',
    metaDescription:
      'Our delivery lifecycle from discovery to scale, designed to de-risk transformation and accelerate outcomes.',
    headline: 'A disciplined journey from idea to measurable impact',
    lede: 'We move initiatives through discovery, design, implementation, and scale with structured governance, change enablement, and continuous optimization.',
    heroImage: { src: u('photo-1520607162513-77705c0f0d4a'), alt: 'Roadmap planning and execution board' },
    spotlightImage: { src: u('photo-1517048676732-d65bc937f952', 1600), alt: 'Leadership alignment workshop' },
    stats: [
      { value: '4-phase', label: 'Discovery, design, implementation, scale' },
      { value: 'Risk-aware', label: 'Controls embedded from day one' },
      { value: 'Adoption-led', label: 'Change management as core workstream' },
    ],
    principles: ['Diagnose current state and strategic priorities', 'Prototype quickly, then scale with guardrails', 'Embed adoption loops and operational handover'],
    gallery: [
      { src: u('photo-1517248135467-4c7edcad34c4', 1200), alt: 'Execution planning session' },
      { src: u('photo-1450101499163-c8848c66ca85', 1200), alt: 'Strategic discussion over documentation' },
      { src: u('photo-1556761175-5973dc0f32e7', 1200), alt: 'Team evaluating implementation progress' },
    ],
  },
};

export const HOW_WE_WORK_SLUGS = Object.keys(HOW_WE_WORK_PAGES);
export const getHowWeWorkPage = (slug) => {
  const page = HOW_WE_WORK_PAGES[slug];
  if (!page) return null;
  return { ...page, ...getMarketingExpansion('howWeWork', slug) };
};
export const getAllHowWeWorkPages = () => HOW_WE_WORK_SLUGS.map((slug) => HOW_WE_WORK_PAGES[slug]);
