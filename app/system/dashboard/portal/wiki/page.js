import PortalWiki from '@/pageComponents/Admin/Portal/PortalWiki';
import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Knowledge base',
  description: 'Internal wiki',
  noIndex: true,
});

export default function PortalWikiPage() {
  return <PortalWiki />;
}
