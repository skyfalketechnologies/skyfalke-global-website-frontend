import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import PerformanceOptimization from '@/pageComponents/BusinessTools/PerformanceOptimization';


export const metadata = genMeta({
  title: 'Performance Optimization | Skyfalke - Boost Your Performance',
  description: 'Optimize your website, applications, and business processes for peak performance with Skyfalke\'s optimization services.',
  keywords: 'performance optimization, speed optimization, performance tuning, optimization services',
  url: 'https://skyfalke.com/services/business-tools/performance-optimization',
});

export default function PerformanceOptimizationPage() {
  return (
    <PageLayout>
      <PerformanceOptimization />
    </PageLayout>
  );
}

