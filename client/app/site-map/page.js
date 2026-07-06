import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import SiteMap from '@/pageComponents/SiteMap';

export const metadata = genMeta({
  title: 'Sitemap | All Pages, Services & Resources',
  description:
    'Browse all main pages, services, and resources on Skyfalke.com. Quick links for visitors and a pointer to our XML sitemap for search engines.',
  url: 'https://skyfalke.com/site-map',
});

export default function SiteMapPage() {
  return (
    <PageLayout>
      <SiteMap />
    </PageLayout>
  );
}
