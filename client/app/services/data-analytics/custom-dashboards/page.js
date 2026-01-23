import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import CustomDashboards from '@/pageComponents/DataAnalytics/CustomDashboards';


export const metadata = genMeta({
  title: 'Custom Dashboards | Skyfalke - Tailored Data Visualization',
  description: 'Get custom dashboards tailored to your business needs. Visualize your data with interactive, real-time dashboards from Skyfalke.',
  keywords: 'custom dashboards, data visualization, business dashboards, interactive dashboards, dashboard design',
  url: 'https://skyfalke.com/services/data-analytics/custom-dashboards',
});

export default function CustomDashboardsPage() {
  return (
    <PageLayout>
      <CustomDashboards />
    </PageLayout>
  );
}

