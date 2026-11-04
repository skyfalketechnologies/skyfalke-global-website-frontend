import SitemapManager from '@/pageComponents/Admin/SitemapManager';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Sitemap Manager',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function SitemapManagerPage() {
  return <SitemapManager />;
}

