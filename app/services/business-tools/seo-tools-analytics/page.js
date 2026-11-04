import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import SEOToolsAnalytics from '@/pageComponents/BusinessTools/SEOToolsAnalytics';


export const metadata = genMeta({
  title: 'SEO Tools & Analytics | Skyfalke - Optimize Your Visibility',
  description: 'Improve your search engine visibility with Skyfalke\'s SEO tools and analytics. Track performance and optimize your rankings.',
  keywords: 'SEO tools, SEO analytics, search engine optimization, SEO software, SEO tracking',
  url: 'https://skyfalke.com/services/business-tools/seo-tools-analytics',
});

export default function SEOToolsAnalyticsPage() {
  return (
    <PageLayout>
      <SEOToolsAnalytics />
    </PageLayout>
  );
}

