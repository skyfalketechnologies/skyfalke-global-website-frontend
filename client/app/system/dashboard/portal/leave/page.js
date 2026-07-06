import PortalLeave from '@/pageComponents/Admin/Portal/PortalLeave';
import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Leave',
  description: 'Leave management',
  noIndex: true,
});

export default function PortalLeavePage() {
  return <PortalLeave />;
}
