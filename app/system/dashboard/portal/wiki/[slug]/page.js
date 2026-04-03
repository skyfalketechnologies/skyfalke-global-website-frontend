import PortalWikiArticle from '@/pageComponents/Admin/Portal/PortalWikiArticle';
import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Wiki article',
  description: 'Knowledge base article',
  noIndex: true,
});

export default function PortalWikiArticlePage() {
  return <PortalWikiArticle />;
}
