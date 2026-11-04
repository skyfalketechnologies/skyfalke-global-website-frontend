const u = (photoPath, w = 2000) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=${w}&q=80`;

export const ABOUT_PAGES = {
  commitments: {
    slug: 'commitments',
    title: 'Our Commitments',
    metaDescription:
      'Our commitments on delivery quality, innovation, reliability, and sustainable value creation for clients across Africa and beyond.',
    headline: 'Commitments that guide how we deliver',
    lede: 'We commit to practical strategy, disciplined execution, and long-term value creation for every engagement — from first workshop to post-launch support.',
    heroImage: { src: u('photo-1454165804606-c3d57bc86b40'), alt: 'Leadership team planning commitments' },
    spotlightImage: { src: u('photo-1520607162513-77705c0f0d4a', 1600), alt: 'Strategic roadmap and commitments workshop' },
    overview: [
      'At Skyfalke, commitments are not slogans on a slide deck. They are operating principles we use to scope work, make trade-offs, and hold ourselves accountable when timelines tighten or requirements shift.',
      'Every client engagement begins with clarity on outcomes, ownership, and how success will be measured. We document assumptions early, communicate risks honestly, and adjust plans transparently rather than letting small issues compound into delivery failures.',
      'Our team is structured to support continuity: the people who help define your strategy are connected to the people who build, launch, and optimize your systems. That continuity reduces rework, preserves context, and keeps momentum through complex programs.',
    ],
    pillars: [
      {
        title: 'Innovation with purpose',
        body: 'We challenge conventional approaches when they no longer serve the business, but we do not innovate for novelty alone. Creative thinking is directed at measurable problems — acquisition bottlenecks, manual workflows, fragmented data, or underperforming digital channels. Ideas are evaluated against feasibility, cost, and expected impact before they enter a roadmap.',
      },
      {
        title: 'Consistency in execution',
        body: 'Reliable delivery depends on clear governance: defined milestones, shared documentation, and regular checkpoints that surface blockers early. We maintain dependable communication rhythms so stakeholders always know what was completed, what is in progress, and what decisions are needed next. Consistency builds trust, and trust accelerates decision-making.',
      },
      {
        title: 'Sustainable outcomes',
        body: 'We design solutions for adoption and longevity — architectures teams can maintain, processes they can run without constant vendor dependency, and metrics that remain useful after launch. Short-term wins matter, but we prioritize work that compounds: stronger internal capability, cleaner data foundations, and platforms that scale as the business grows.',
      },
    ],
    practices: [
      {
        title: 'Outcome-led scoping',
        body: 'We frame projects around business outcomes first, then map technology, marketing, and operations to those outcomes. Scope documents tie deliverables to success criteria so everyone aligns on what “done” means.',
      },
      {
        title: 'Transparent delivery',
        body: 'Clients receive visibility into progress, risks, and dependencies through structured updates — not ad-hoc messages. When priorities change, we re-baseline plans openly and document the impact on timeline and budget.',
      },
      {
        title: 'Knowledge transfer',
        body: 'We document decisions, configurations, and runbooks so your team can operate confidently after handover. Training and walkthroughs are built into delivery rather than treated as optional add-ons.',
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
      'A meritocratic culture where diverse perspectives, collaboration, and continuous learning drive better outcomes for clients and teams.',
    headline: 'Diverse teams, high standards, shared ownership',
    lede: 'We believe strong outcomes come from inclusive collaboration, rigorous thinking, and empowering people to do their best work — regardless of background or tenure.',
    heroImage: { src: u('photo-1521737604893-d14cc237f11d'), alt: 'Diverse team collaborating at table' },
    spotlightImage: { src: u('photo-1552664730-d307ca884978', 1600), alt: 'Cross-functional team discussion' },
    overview: [
      'A diverse meritocracy means ideas are judged on quality and evidence, while we actively seek perspectives that challenge blind spots. Homogeneous teams often optimize for speed at the expense of depth; mixed disciplines and backgrounds produce more resilient strategies and fewer costly oversights.',
      'Skyfalke invests in people who combine technical skill with business judgment. Consultants, engineers, designers, and strategists work in integrated squads so client problems are viewed from multiple angles — not siloed into disconnected workstreams.',
      'Performance is recognized through contribution and impact, not politics or visibility alone. We create pathways for growth through mentorship, stretch assignments, and clear expectations, so talent can advance based on demonstrated capability and leadership.',
    ],
    pillars: [
      {
        title: 'Merit with inclusion',
        body: 'We evaluate proposals, designs, and recommendations on substance: clarity of reasoning, alignment with client goals, and feasibility under real constraints. Inclusion is structural — diverse voices in planning sessions, review forums, and client workshops — because better decisions emerge when assumptions are tested from more than one viewpoint.',
      },
      {
        title: 'Empowerment and growth',
        body: 'People are trusted with meaningful ownership early. Junior team members contribute to client delivery with coaching; senior practitioners mentor without micromanaging. We support continuous learning through internal knowledge sharing, external training where relevant, and exposure to varied industries and problem types.',
      },
      {
        title: 'Collaborative accountability',
        body: 'Teams own outcomes together. Credit and responsibility are shared across disciplines, which reduces finger-pointing and encourages proactive problem-solving. Professionalism and respect are non-negotiable — disagreement is welcomed when it improves the work, not when it undermines colleagues.',
      },
    ],
    practices: [
      {
        title: 'Cross-functional delivery',
        body: 'Client work is staffed with complementary skills — strategy, technology, creative, and operations — so recommendations are implementable, not theoretical.',
      },
      {
        title: 'Constructive review culture',
        body: 'Internal reviews focus on strengthening deliverables: clearer messaging, more robust architecture, better user flows. Feedback is specific, timely, and oriented toward the client’s success.',
      },
      {
        title: 'Fair opportunity',
        body: 'Assignments and leadership opportunities are allocated based on capability and development goals, with attention to equitable access across the team.',
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
      'How Skyfalke contributes to communities through responsible technology, ethical partnerships, and capacity building across Africa.',
    headline: 'Technology with positive social impact',
    lede: 'Beyond delivery, we aim to create value for communities through ethical practice, skills transfer, and partnerships that extend opportunity — not extract it.',
    heroImage: { src: u('photo-1529107386315-e1a2b48e34f2'), alt: 'Community collaboration and outreach' },
    spotlightImage: { src: u('photo-1469571486292-b53601020cfa', 1600), alt: 'People working together in community program' },
    overview: [
      'Technology can widen access to markets, education, and services — or it can reinforce inequality when deployed without context. Social responsibility at Skyfalke means asking who benefits, who is excluded, and what happens after we leave before we recommend a platform or campaign.',
      'We work with businesses, nonprofits, and public-facing organizations that serve diverse populations. That experience shapes how we approach accessibility, language, connectivity constraints, and data privacy in markets where regulatory frameworks are still evolving.',
      'Our responsibility extends to how we hire, partner, and source. We favor vendors and collaborators who meet clear standards on labor practices and integrity, and we avoid engagements that conflict with our values or create undue harm to communities.',
    ],
    pillars: [
      {
        title: 'Community-centered thinking',
        body: 'Solutions are designed with the end user’s reality in mind: device types, bandwidth, literacy levels, and local norms. We avoid one-size-fits-all templates when they ignore context. Where possible, we involve client teams and community stakeholders in validation so products and campaigns reflect actual needs rather than assumptions.',
      },
      {
        title: 'Ethical partnerships',
        body: 'We partner with organizations that demonstrate integrity in how they treat customers, employees, and suppliers. Contracts and statements of work include expectations on data use, consent, and honest marketing. When a proposed tactic or data practice raises ethical concerns, we surface them early and recommend alternatives.',
      },
      {
        title: 'Capability transfer',
        body: 'Lasting impact comes from strengthened local capacity. We prioritize training, documentation, and co-delivery models that leave client teams more self-sufficient. Academy programs and workshops extend this further by making practical digital skills accessible to professionals who might otherwise be priced out of quality training.',
      },
    ],
    practices: [
      {
        title: 'Accessible digital experiences',
        body: 'We apply accessibility and usability principles so more people can navigate websites, portals, and applications effectively — including users on older devices or slower networks.',
      },
      {
        title: 'Responsible data practices',
        body: 'We help clients collect only what they need, protect it appropriately, and communicate clearly how information is used — especially in CRM, marketing automation, and analytics implementations.',
      },
      {
        title: 'Skills and mentorship',
        body: 'Through Skyfalke Academy and client enablement, we share knowledge on digital marketing, cloud, and automation so organizations can grow internal expertise over time.',
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
      'Skyfalke’s approach to environmentally responsible technology delivery, efficient systems, and sustainable operations for modern businesses.',
    headline: 'Environmental responsibility built into delivery',
    lede: 'We pursue sustainability through efficient architectures, responsible technology decisions, and practical operational improvements clients can maintain over time.',
    heroImage: { src: u('photo-1473448912268-2022ce9509d8'), alt: 'Green landscape and sustainable future' },
    spotlightImage: { src: u('photo-1497436072909-60f360e1d4b1', 1600), alt: 'Sustainable city and environmental planning' },
    overview: [
      'Digital services have a physical footprint: data centers, network infrastructure, and devices all consume energy. Environmental sustainability in our work means reducing waste where it does not compromise reliability — right-sizing cloud resources, optimizing applications, and choosing providers and patterns that align with a lower-impact posture.',
      'We advise clients on trade-offs between performance, cost, and environmental efficiency. Not every workload belongs on the largest instance tier; not every archive needs hot storage. Thoughtful architecture often improves all three dimensions at once.',
      'Sustainability is an ongoing practice, not a one-time checklist. We help teams embed simple governance: review cycles for unused assets, policies for retention and deletion, and metrics that make inefficiency visible before it becomes expensive and wasteful.',
    ],
    pillars: [
      {
        title: 'Efficient digital systems',
        body: 'We right-size infrastructure, tune applications, and reduce redundant processing so systems use only the resources they need. Caching, batch jobs, and serverless patterns can lower consumption when applied appropriately. Monitoring helps catch drift — orphaned environments, over-provisioned databases, and always-on services with no traffic.',
      },
      {
        title: 'Responsible design choices',
        body: 'Lifecycle thinking informs platform selection, hosting regions, and build-versus-buy decisions. We consider how long a solution will run, who maintains it, and what happens at end-of-life. Lighter frontends, optimized media, and efficient APIs reduce bandwidth and device load for users as well as backend demand.',
      },
      {
        title: 'Continuous improvement',
        body: 'Teams benefit from periodic sustainability reviews alongside cost and security reviews. We document recommendations clients can execute internally — retiring legacy systems, consolidating tools, and adopting greener defaults in CI/CD and cloud policies — so progress continues after the engagement ends.',
      },
    ],
    practices: [
      {
        title: 'Cloud efficiency reviews',
        body: 'We assess utilization, reserved capacity, and architectural patterns to identify quick wins that cut waste without risking uptime.',
      },
      {
        title: 'Sustainable hosting guidance',
        body: 'Where clients choose hosting and CDN partners, we factor energy transparency, regional efficiency, and redundancy needs into recommendations.',
      },
      {
        title: 'Operational habits',
        body: 'We promote shutdown schedules for non-production environments, sensible retention policies, and automated alerts for cost and usage anomalies.',
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
