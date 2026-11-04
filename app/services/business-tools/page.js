import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import BusinessTools from '@/pageComponents/BusinessTools';

export const metadata = genMeta({
  title: 'Business Tools & AI Solutions | Skyfalke - Automation, Analytics & Custom Applications',
  description: 'Skyfalke provides AI-powered business tools including process automation, SEO tools, custom applications, business intelligence, and performance optimization solutions.',
  keywords: 'business tools, AI solutions, process automation, SEO tools, custom applications, business intelligence, performance optimization, AI business tools',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/services/business-tools`,
});

export default function BusinessToolsPage() {
  return (
    <PageLayout>
      <BusinessTools />
    </PageLayout>
  );
}

