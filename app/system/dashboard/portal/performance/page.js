import PortalPerformance from '@/pageComponents/Admin/Portal/PortalPerformance';
import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Performance',
  description: 'Goals and reviews',
  noIndex: true,
});

export default function PortalPerformancePage() {
  return <PortalPerformance />;
}
