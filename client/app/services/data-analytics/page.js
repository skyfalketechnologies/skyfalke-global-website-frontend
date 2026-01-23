import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import DataAnalytics from '@/pageComponents/DataAnalytics';

export const metadata = genMeta({
  title: 'Data Analytics Services | Skyfalke - Business Intelligence & Data Insights',
  description: 'Skyfalke provides comprehensive data analytics services including business intelligence, predictive analytics, custom dashboards, and performance tracking to help businesses make data-driven decisions.',
  keywords: 'data analytics, business intelligence, predictive analytics, data visualization, custom dashboards, performance tracking, data insights, business analytics',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/services/data-analytics`,
});

export default function DataAnalyticsPage() {
  return (
    <PageLayout>
      <DataAnalytics />
    </PageLayout>
  );
}

