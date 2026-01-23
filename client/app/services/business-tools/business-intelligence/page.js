import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import BusinessIntelligenceTools from '@/pageComponents/BusinessTools/BusinessIntelligence';


export const metadata = genMeta({
  title: 'Business Intelligence Tools | Skyfalke - Data-Driven Decisions',
  description: 'Make data-driven decisions with Skyfalke\'s business intelligence tools. Advanced analytics and reporting solutions.',
  keywords: 'business intelligence, BI tools, data analytics, business insights, reporting tools',
  url: 'https://skyfalke.com/services/business-tools/business-intelligence',
});

export default function BusinessIntelligenceToolsPage() {
  return (
    <PageLayout>
      <BusinessIntelligenceTools />
    </PageLayout>
  );
}

