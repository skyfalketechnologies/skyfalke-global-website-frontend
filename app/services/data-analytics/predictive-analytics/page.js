import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import PredictiveAnalytics from '@/pageComponents/DataAnalytics/PredictiveAnalytics';


export const metadata = genMeta({
  title: 'Predictive Analytics | Skyfalke - Forecast Future Trends',
  description: 'Leverage predictive analytics to forecast trends, anticipate customer behavior, and make proactive business decisions with Skyfalke.',
  keywords: 'predictive analytics, forecasting, predictive modeling, trend analysis, predictive insights',
  url: 'https://skyfalke.com/services/data-analytics/predictive-analytics',
});

export default function PredictiveAnalyticsPage() {
  return (
    <PageLayout>
      <PredictiveAnalytics />
    </PageLayout>
  );
}

