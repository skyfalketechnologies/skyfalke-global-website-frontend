import PortalIT from '@/pageComponents/Admin/Portal/PortalIT';
import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'IT & support',
  description: 'Assets and tickets',
  noIndex: true,
});

export default function PortalITPage() {
  return <PortalIT />;
}
