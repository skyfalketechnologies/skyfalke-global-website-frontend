import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import DataAnalyticsPage from '@/pageComponents/DataAnalytics/DataAnalytics';


export const metadata = genMeta({
  title: 'Data Analytics Services | Skyfalke',
  description: 'Comprehensive data analytics services from Skyfalke. Analyze, visualize, and leverage your data to drive business growth.',
  keywords: 'data analytics, data analysis, business analytics, data insights, analytics consulting',
  url: 'https://skyfalke.com/services/data-analytics/data-analytics',
});

export default function DataAnalyticsSubPage() {
  return (
    <PageLayout>
      <DataAnalyticsPage />
    </PageLayout>
  );
}

