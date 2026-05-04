/**
 * Human-readable sitemap sections (public marketing routes).
 * Kept in sync with primary nav / services where possible.
 */

export const siteMapPrimary = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services overview', href: '/services' },
  { name: 'Case studies', href: '/case-studies' },
  { name: 'Blog', href: '/blog' },
  { name: 'Shop', href: '/shop' },
  { name: 'Contact', href: '/contact' },
];

export const siteMapServiceCategories = [
  {
    title: 'Data & Analytics',
    href: '/services/data-analytics',
    links: [
      { name: 'Business intelligence', href: '/services/data-analytics/business-intelligence' },
      { name: 'Data analytics', href: '/services/data-analytics/data-analytics' },
      { name: 'Predictive analytics', href: '/services/data-analytics/predictive-analytics' },
      { name: 'Performance tracking', href: '/services/data-analytics/performance-tracking' },
      { name: 'Custom dashboards', href: '/services/data-analytics/custom-dashboards' },
    ],
  },
  {
    title: 'Earned media',
    href: '/services/earned-media',
    links: [
      { name: 'Public relations', href: '/services/earned-media/public-relations' },
      { name: 'Influencer marketing', href: '/services/earned-media/influencer-marketing' },
      { name: 'Content marketing', href: '/services/earned-media/content-marketing' },
      { name: 'Social media management', href: '/services/earned-media/social-media-management' },
      { name: 'Brand awareness', href: '/services/earned-media/brand-awareness' },
    ],
  },
  {
    title: 'Paid media',
    href: '/services/paid-media',
    links: [
      { name: 'Google Ads', href: '/services/paid-media/google-ads' },
      { name: 'Social media ads', href: '/services/paid-media/social-media-ads' },
      { name: 'Display advertising', href: '/services/paid-media/display-advertising' },
      { name: 'Video advertising', href: '/services/paid-media/video-advertising' },
      { name: 'Retargeting campaigns', href: '/services/paid-media/retargeting-campaigns' },
    ],
  },
  {
    title: 'Creative',
    href: '/services/creative',
    links: [
      { name: 'Brand design', href: '/services/creative/brand-design' },
      { name: 'UI/UX design', href: '/services/creative/ui-ux-design' },
      { name: 'Graphic design', href: '/services/creative/graphic-design' },
      { name: 'Video production', href: '/services/creative/video-production' },
      { name: 'Content creation', href: '/services/creative/content-creation' },
    ],
  },
  {
    title: 'Business tools',
    href: '/services/business-tools',
    links: [
      { name: 'SEO tools & analytics', href: '/services/business-tools/seo-tools-analytics' },
      { name: 'Process automation', href: '/services/business-tools/process-automation' },
      { name: 'Custom applications', href: '/services/business-tools/custom-applications' },
      { name: 'Business intelligence', href: '/services/business-tools/business-intelligence' },
      { name: 'Performance optimization', href: '/services/business-tools/performance-optimization' },
    ],
  },
  {
    title: 'ICT strategy',
    href: '/services/ict-strategy',
    links: [],
  },
  {
    title: 'Cloud solutions',
    href: '/cloud-solutions',
    links: [{ name: 'Cloud', href: '/cloud' }],
  },
];

export const siteMapResources = [
  { name: 'Resources & insights', href: '/resources' },
  { name: 'Support', href: '/support' },
  { name: 'Academy', href: '/academy' },
  { name: 'Events', href: '/events' },
];

export const siteMapCompany = [
  { name: 'Careers', href: '/careers' },
  { name: 'Schedule a consultation', href: '/schedule-consultation' },
  { name: 'Partners', href: '/partners' },
];

export const siteMapLegal = [
  { name: 'Privacy policy', href: '/privacy' },
  { name: 'Terms of use', href: '/terms' },
];
