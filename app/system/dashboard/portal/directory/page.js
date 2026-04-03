import PortalDirectory from '@/pageComponents/Admin/Portal/PortalDirectory';
import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Directory',
  description: 'Employee directory',
  noIndex: true,
});

export default function PortalDirectoryPage() {
  return <PortalDirectory />;
}
