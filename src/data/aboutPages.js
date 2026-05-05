const u = (photoPath, w = 2000) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${w}&q=80`;

export const ABOUT_PAGES = {
  commitments: {
    slug: 'commitments',
    title: 'Our Commitments',
    metaDescription:
      'Our commitments on delivery quality, innovation, reliability, and sustainable value creation for clients.',
    headline: 'Commitments that guide how we deliver',
    lede: 'We commit to practical strategy, disciplined execution, and long-term value creation for every engagement.',
    heroImage: { src: u('photo-1454165804606-c3d57bc86b40'), alt: 'Leadership team planning commitments' },
    spotlightImage: { src: u('photo-1520607162513-77705c0f0d4a', 1600), alt: 'Strategic roadmap and commitments workshop' },
    pillars: [
      {
        title: 'Innovation with purpose',
        body: 'We challenge conventional approaches and apply creative thinking to solve complex business problems.',
      },
      {
        title: 'Consistency in execution',
        body: 'We deliver with clear governance, dependable communication, and rigorous follow-through.',
      },
      {
        title: 'Sustainable outcomes',
        body: 'We build solutions designed for long-term resilience, adoption, and measurable business impact.',
      },
    ],
    stats: [
      { value: 'Reliable', label: 'Steady delivery across the lifecycle' },
      { value: 'Pragmatic', label: 'Prioritized by business value' },
      { value: 'Long-term', label: 'Built to sustain and scale' },
    ],
  },
  meritocracy: {
    slug: 'meritocracy',
    title: 'Our Diverse Meritocracy',
    metaDescription:
      'A meritocratic culture where diverse perspectives, collaboration, and continuous learning drive better outcomes.',
    headline: 'Diverse teams, high standards, shared ownership',
    lede: 'We believe strong outcomes come from inclusive collaboration, rigorous thinking, and empowering people to do their best work.',
    heroImage: { src: u('photo-1521737604893-d14cc237f11d'), alt: 'Diverse team collaborating at table' },
    spotlightImage: { src: u('photo-1552664730-d307ca884978', 1600), alt: 'Cross-functional team discussion' },
    pillars: [
      {
        title: 'Merit with inclusion',
        body: 'Performance and ideas are evaluated on quality, while diverse perspectives strengthen our decision-making.',
      },
      {
        title: 'Empowerment and growth',
        body: 'We invest in continuous learning and create opportunities for people to lead meaningful work.',
      },
      {
        title: 'Collaborative accountability',
        body: 'Teams own outcomes together and maintain high standards of professionalism and respect.',
      },
    ],
    stats: [
      { value: 'Inclusive', label: 'Different perspectives in every engagement' },
      { value: 'Growth-led', label: 'Continuous learning and capability building' },
      { value: 'High-trust', label: 'Shared ownership of outcomes' },
    ],
  },
  'social-responsibility': {
    slug: 'social-responsibility',
    title: 'Social Responsibility',
    metaDescription:
      'How we contribute to communities through responsible technology, ethical partnerships, and capacity building.',
    headline: 'Technology with positive social impact',
    lede: 'Beyond delivery, we aim to create value for communities through ethical practice, skills transfer, and responsible partnerships.',
    heroImage: { src: u('photo-1529107386315-e1a2b48e34f2'), alt: 'Community collaboration and outreach' },
    spotlightImage: { src: u('photo-1469571486292-b53601020cfa', 1600), alt: 'People working together in community program' },
    pillars: [
      {
        title: 'Community-centered thinking',
        body: 'We design solutions that consider social context, accessibility, and equitable outcomes.',
      },
      {
        title: 'Ethical partnerships',
        body: 'We partner with organizations that align to integrity, fairness, and long-term value creation.',
      },
      {
        title: 'Capability transfer',
        body: 'We help client teams build internal capacity so progress continues well beyond project completion.',
      },
    ],
    stats: [
      { value: 'Ethical', label: 'Responsible delivery and partnerships' },
      { value: 'Inclusive', label: 'People-centered technology choices' },
      { value: 'Sustainable', label: 'Long-term community value' },
    ],
  },
  'environmental-sustainability': {
    slug: 'environmental-sustainability',
    title: 'Environmental Sustainability',
    metaDescription:
      'Our approach to environmentally responsible technology delivery, efficient systems, and sustainable operations.',
    headline: 'Environmental responsibility built into delivery',
    lede: 'We pursue sustainability through efficient architectures, responsible technology decisions, and practical operational improvements.',
    heroImage: { src: u('photo-1473448912268-2022ce9509d8'), alt: 'Green landscape and sustainable future' },
    spotlightImage: { src: u('photo-1497436072909-60f360e1d4b1', 1600), alt: 'Sustainable city and environmental planning' },
    pillars: [
      {
        title: 'Efficient digital systems',
        body: 'We optimize infrastructure and workloads to reduce waste while preserving reliability and performance.',
      },
      {
        title: 'Responsible design choices',
        body: 'We consider lifecycle impact in architecture, tooling, and platform decisions.',
      },
      {
        title: 'Continuous improvement',
        body: 'We help teams embed sustainability metrics into operational and technology governance.',
      },
    ],
    stats: [
      { value: 'Efficient', label: 'Optimized infrastructure and operations' },
      { value: 'Responsible', label: 'Sustainability-aware decision making' },
      { value: 'Future-ready', label: 'Long-term environmental posture' },
    ],
  },
};

export const ABOUT_SLUGS = Object.keys(ABOUT_PAGES);
export const getAboutPage = (slug) => ABOUT_PAGES[slug] || null;
export const getAllAboutPages = () => ABOUT_SLUGS.map((slug) => ABOUT_PAGES[slug]);
