import PortalOrgChart from '@/pageComponents/Admin/Portal/PortalOrgChart';
import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Org chart',
  description: 'Organizational chart',
  noIndex: true,
});

export default function PortalOrgChartPage() {
  return <PortalOrgChart />;
}
