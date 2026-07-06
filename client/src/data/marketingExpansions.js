/** Supplemental copy merged into marketing detail pages for SEO depth. */

const p = (paragraphs, practices) => ({ overview: paragraphs, practices });

export const MARKETING_EXPANSIONS = {
  capability: {
    ai: p(
      [
        'Artificial intelligence is moving from experimentation to core operations. Leaders need clarity on where AI creates defensible value, how to govern risk, and how to connect models to real workflows — not isolated demos.',
        'Skyfalke helps organizations prioritize use cases by feasibility and impact, establish governance that satisfies security and compliance teams, and build data foundations that make models reliable in production.',
        'We work across strategy, architecture, and delivery so AI initiatives scale with accountable owners, measurable KPIs, and adoption plans that include the teams who will use the tools daily.',
      ],
      [
        { title: 'Use-case portfolio design', body: 'We map opportunities across functions, score them by value and readiness, and sequence delivery so early wins fund larger programs.' },
        { title: 'Governance and guardrails', body: 'Policies, access controls, and review workflows are defined before scale — covering data use, model behavior, and human oversight.' },
        { title: 'Production integration', body: 'We connect models to CRM, operations, and analytics stacks with monitoring, fallbacks, and clear ownership for ongoing improvement.' },
      ]
    ),
    digital: p(
      [
        'Digital transformation fails when channels, products, and operations are optimized in isolation. Customers experience fragmentation; internal teams duplicate effort and data.',
        'We align digital strategy with commercial goals — designing journeys, platforms, and operating models that connect marketing, sales, product, and service delivery.',
        'Our work spans discovery, experience design, platform modernization, and governance so investments translate into revenue, retention, and operational resilience rather than disconnected projects.',
      ],
      [
        { title: 'Journey and experience design', body: 'We map critical journeys, identify friction, and prioritize improvements tied to conversion, satisfaction, and cost-to-serve.' },
        { title: 'Platform modernization', body: 'We upgrade CMS, portals, and applications with architectures that support speed, security, and integration with core systems.' },
        { title: 'Operating model alignment', body: 'Roles, rituals, and metrics are clarified so digital teams and business units share ownership of outcomes.' },
      ]
    ),
    'data-technology': p(
      [
        'Most organizations have data — fewer have data they trust at the speed decisions require. Siloed systems, inconsistent definitions, and fragile pipelines slow analytics and AI alike.',
        'We modernize data platforms, integration patterns, and governance so teams spend less time reconciling spreadsheets and more time acting on reliable insight.',
        'Engineering discipline matters: observability, quality checks, and documentation are part of delivery, not afterthoughts, so platforms remain maintainable as complexity grows.',
      ],
      [
        { title: 'Platform architecture', body: 'We design lakehouse, warehouse, and streaming patterns matched to your latency, volume, and skill constraints.' },
        { title: 'Data quality and governance', body: 'Ownership, lineage, and validation rules are established so metrics mean the same thing everywhere they are used.' },
        { title: 'Analytics enablement', body: 'Dashboards, self-serve datasets, and embedded analytics are built for the decisions your teams actually make.' },
      ]
    ),
    'marketing-sales': p(
      [
        'Growth stalls when marketing generates volume sales cannot convert, or when attribution is too opaque to invest confidently. Integrated growth systems connect brand, demand, pipeline, and revenue intelligence.',
        'We design full-funnel programs with shared definitions of qualified demand, aligned messaging, and analytics that show what drives pipeline and revenue — not just clicks.',
        'Execution includes campaign operations, CRM configuration, sales enablement, and optimization cycles so improvements compound quarter over quarter.',
      ],
      [
        { title: 'Demand generation', body: 'We build campaigns across search, social, content, and partnerships with clear offers and landing experiences that convert.' },
        { title: 'CRM and pipeline acceleration', body: 'Stages, automation, and enablement materials are tuned so sales teams focus on the right opportunities at the right time.' },
        { title: 'Revenue analytics', body: 'Attribution models and dashboards connect spend to outcomes, informing budget decisions with evidence.' },
      ]
    ),
    'managed-services': p(
      [
        'Critical platforms cannot depend on heroic manual effort. Managed services provide monitoring, incident response, security hygiene, and continuous optimization so teams focus on change, not firefighting.',
        'We operate cloud and business systems with defined SLAs, runbooks, and improvement backlogs — balancing availability, cost, and compliance.',
        'Transparency is central: clients see health metrics, incident history, and recommended changes, with governance that fits regulated and growth environments alike.',
      ],
      [
        { title: 'Monitoring and response', body: 'Alerts, on-call processes, and post-incident reviews reduce downtime and repeat failures.' },
        { title: 'Security and compliance', body: 'Patching, access reviews, and control evidence support audits without disrupting delivery.' },
        { title: 'Cost and performance optimization', body: 'Regular reviews right-size resources and tune workloads for efficiency and speed.' },
      ]
    ),
  },
  howWeWork: {
    solutions: p(
      [
        'Solutions work begins with the business problem, not the technology catalog. We frame opportunities, constraints, and success metrics before recommending architecture or vendors.',
        'Integrated squads combine strategy, engineering, and change leadership so designs are implementable and adoptable — with milestones that stakeholders can track.',
        'We deliver iteratively: prototypes validate assumptions, pilots prove value, and scale phases embed governance, security, and operational handover.',
      ],
      [
        { title: 'Discovery and prioritization', body: 'Workshops and assessments align leadership on the highest-value problems and realistic sequencing.' },
        { title: 'Solution design', body: 'Architecture, integrations, and experience designs are documented with clear decision records and trade-offs.' },
        { title: 'Implementation governance', body: 'Sprint rhythms, risk registers, and steering forums keep delivery visible and accountable.' },
      ]
    ),
    'case-studies': p(
      [
        'Case studies document how we navigate complexity — stakeholder alignment, technical debt, regulatory context, and adoption challenges — not just final metrics.',
        'Each engagement establishes baselines, tracks leading indicators during delivery, and measures impact after launch so results are credible and comparable.',
        'Patterns from prior work inform new programs, but we adapt playbooks to sector, maturity, and risk tolerance rather than forcing templates.',
      ],
      [
        { title: 'Baseline and KPI design', body: 'We define what will be measured before work begins, avoiding retrofitted success stories.' },
        { title: 'Milestone transparency', body: 'Major decisions, scope changes, and outcomes are recorded for client and internal learning.' },
        { title: 'Post-launch measurement', body: 'Adoption, performance, and commercial impact are tracked beyond go-live to confirm sustained value.' },
      ]
    ),
    'from-idea-to-impact': p(
      [
        'Ideas fail when they skip diagnosis or scale before adoption is proven. Our lifecycle moves initiatives through discovery, design, implementation, and scale with explicit gates.',
        'Discovery clarifies current state, stakeholders, and value hypotheses. Design validates feasibility and experience. Implementation delivers working capability. Scale embeds operations, training, and optimization.',
        'Change management runs throughout — communications, training, and feedback loops so people understand why change is happening and how to succeed in new ways of working.',
      ],
      [
        { title: 'Discovery sprints', body: 'Short, focused efforts map problems, data, and constraints before major investment.' },
        { title: 'Pilot and learn', body: 'Controlled pilots test value with real users, informing scale decisions with evidence.' },
        { title: 'Scale and handover', body: 'Runbooks, ownership, and support models are established before enterprise rollout.' },
      ]
    ),
  },
  sustainability: {
    'environmental-stewardship': p(
      [
        'Environmental stewardship in technology means reducing waste without compromising reliability — right-sized infrastructure, efficient applications, and responsible hosting choices.',
        'We help clients understand the footprint of digital operations and implement practical improvements: utilization reviews, architecture changes, and policies teams can maintain.',
        'Stewardship is ongoing. Metrics and review cycles make inefficiency visible before it becomes cost and emissions drag.',
      ],
      [
        { title: 'Infrastructure efficiency', body: 'Right-sizing, scheduling, and architectural patterns lower energy use while meeting SLAs.' },
        { title: 'Lifecycle-aware design', body: 'Platform and build decisions consider longevity, maintainability, and end-of-life impact.' },
        { title: 'Operational governance', body: 'Policies and dashboards track usage, cost, and improvement actions over time.' },
      ]
    ),
    'responsible-technology': p(
      [
        'Responsible technology balances innovation with privacy, security, fairness, and transparency. Trust erodes quickly when data practices or AI behavior surprise users or regulators.',
        'We embed ethics and controls into delivery: data minimization, access management, model oversight, and clear documentation for stakeholders.',
        'Responsible defaults reduce rework — security and compliance are designed in, not bolted on after launch.',
      ],
      [
        { title: 'Privacy and consent', body: 'Collection, retention, and communication align with policy and user expectations.' },
        { title: 'AI and automation oversight', body: 'Human review, logging, and boundaries are defined for high-impact automated decisions.' },
        { title: 'Transparent operations', body: 'Clients and users understand how systems work and who is accountable for outcomes.' },
      ]
    ),
    'sustainable-operations': p(
      [
        'Sustainable operations align efficiency, resilience, and environmental goals. Processes and platforms should use resources wisely while adapting to change.',
        'We design operating models with clear ownership, measurable resource use, and improvement cycles — connecting sustainability KPIs to how teams run day to day.',
        'Operational sustainability supports growth: leaner operations scale better and recover faster from disruption.',
      ],
      [
        { title: 'Process optimization', body: 'Workflows are streamlined to reduce waste, handoffs, and redundant tooling.' },
        { title: 'Resilience planning', body: 'Continuity, backup, and incident practices protect critical services and data.' },
        { title: 'Performance management', body: 'Dashboards link operational metrics to sustainability and commercial priorities.' },
      ]
    ),
  },
  techAi: {
    'ai-strategy': p(
      [
        'AI strategy must answer three questions: where value is real, what must be true for success, and how risk is managed at scale. Without that clarity, pilots stall and leadership loses confidence.',
        'We facilitate executive alignment on ambition, guardrails, and investment — producing roadmaps tied to data readiness, talent, and change capacity.',
        'Strategy connects to delivery: owners, milestones, and metrics are defined so progress is visible and governance is actionable.',
      ],
      [
        { title: 'Readiness assessment', body: 'Data, skills, and process maturity are evaluated to set realistic timelines and investments.' },
        { title: 'Roadmap and operating model', body: 'Prioritized initiatives, roles, and funding phases turn strategy into executable plans.' },
        { title: 'Risk and ethics framework', body: 'Policies and review forums address security, bias, and regulatory expectations before scale.' },
      ]
    ),
    'data-platforms': p(
      [
        'Modern data platforms unify sources, enforce quality, and deliver insight where decisions happen. Fragmented spreadsheets and ad hoc extracts cannot support AI or real-time operations.',
        'We architect platforms for your scale — batch and streaming, self-serve analytics, and governed datasets — with integration patterns that respect existing systems.',
        'Success means analysts and operators trust the numbers and can act without waiting on central IT for every request.',
      ],
      [
        { title: 'Unified architecture', body: 'Ingestion, storage, and consumption layers are designed for clarity, cost, and growth.' },
        { title: 'Governance embedded', body: 'Catalogs, lineage, and access policies keep data understandable and secure.' },
        { title: 'Decision-team enablement', body: 'Tools and training help business users work confidently with approved datasets.' },
      ]
    ),
    'cloud-modernization': p(
      [
        'Cloud modernization is more than migration — it is an opportunity to improve security, reliability, and cost discipline while enabling faster product delivery.',
        'We plan phased moves that reduce risk: assess, migrate, optimize, and operate with clear rollback and validation at each stage.',
        'Post-migration, FinOps, reliability engineering, and security hardening keep environments aligned with business change.',
      ],
      [
        { title: 'Migration planning', body: 'Workloads are categorized by complexity and value; waves are sequenced to limit disruption.' },
        { title: 'Security and compliance', body: 'Identity, network, and control frameworks are modernized for cloud-native operations.' },
        { title: 'Run and optimize', body: 'Monitoring, autoscaling, and cost reviews maintain performance without runaway spend.' },
      ]
    ),
  },
};

export function getMarketingExpansion(section, slug) {
  return MARKETING_EXPANSIONS[section]?.[slug] ?? { overview: [], practices: [] };
}
