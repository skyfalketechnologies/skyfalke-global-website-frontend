import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import BusinessIntelligence from '@/pageComponents/DataAnalytics/BusinessIntelligence';


export const metadata = genMeta({
  title: 'Business Intelligence Solutions | Skyfalke',
  description: 'Transform your data into actionable insights with Skyfalke\'s business intelligence solutions. Make data-driven decisions with advanced analytics and reporting.',
  keywords: 'business intelligence, BI solutions, data analytics, business insights, data visualization, reporting tools',
  url: 'https://skyfalke.com/services/data-analytics/business-intelligence',
});

export default function BusinessIntelligencePage() {
  return (
    <PageLayout>
      <BusinessIntelligence />
    </PageLayout>
  );
}

