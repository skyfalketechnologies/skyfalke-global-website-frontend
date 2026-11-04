import { generateMetadata as genMeta } from '@/utils/metadata';
import Fake404 from '@/pageComponents/Admin/Fake404';

export const metadata = genMeta({
  title: '404 - Page Not Found | Skyfalke',
  description: 'Page not found',
  noIndex: true,
});

export default function PortalFake404Page() {
  return <Fake404 />;
}

