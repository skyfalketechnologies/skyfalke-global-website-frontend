import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import PerformanceTracking from '@/pageComponents/DataAnalytics/PerformanceTracking';


export const metadata = genMeta({
  title: 'Performance Tracking & Monitoring | Skyfalke',
  description: 'Track and monitor your business performance with Skyfalke\'s performance tracking solutions. Real-time insights and KPI monitoring.',
  keywords: 'performance tracking, KPI monitoring, performance metrics, business performance, analytics tracking',
  url: 'https://skyfalke.com/services/data-analytics/performance-tracking',
});

export default function PerformanceTrackingPage() {
  return (
    <PageLayout>
      <PerformanceTracking />
    </PageLayout>
  );
}

