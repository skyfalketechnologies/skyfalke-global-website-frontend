import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import ContentCreation from '@/pageComponents/Creative/ContentCreation';


export const metadata = genMeta({
  title: 'Content Creation Services | Skyfalke - Engaging Content',
  description: 'Create engaging content that resonates with your audience with Skyfalke\'s content creation services.',
  keywords: 'content creation, content writing, creative content, content development, content strategy',
  url: 'https://skyfalke.com/services/creative/content-creation',
});

export default function ContentCreationPage() {
  return (
    <PageLayout>
      <ContentCreation />
    </PageLayout>
  );
}

