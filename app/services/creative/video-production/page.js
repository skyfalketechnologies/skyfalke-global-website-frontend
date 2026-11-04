import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import VideoProduction from '@/pageComponents/Creative/VideoProduction';


export const metadata = genMeta({
  title: 'Video Production Services | Skyfalke - Professional Video Content',
  description: 'Create professional video content with Skyfalke\'s video production services. Commercials, explainer videos, and video marketing.',
  keywords: 'video production, video creation, video marketing, video content, video editing',
  url: 'https://skyfalke.com/services/creative/video-production',
});

export default function VideoProductionPage() {
  return (
    <PageLayout>
      <VideoProduction />
    </PageLayout>
  );
}

