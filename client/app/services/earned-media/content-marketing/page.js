import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import ContentMarketing from '@/pageComponents/EarnedMedia/ContentMarketing';


export const metadata = genMeta({
  title: 'Content Marketing Services | Skyfalke',
  description: 'Create compelling content that drives engagement and conversions with Skyfalke\'s content marketing services.',
  keywords: 'content marketing, content strategy, content creation, content planning, content campaigns',
  url: 'https://skyfalke.com/services/earned-media/content-marketing',
});

export default function ContentMarketingPage() {
  return (
    <PageLayout>
      <ContentMarketing />
    </PageLayout>
  );
}

