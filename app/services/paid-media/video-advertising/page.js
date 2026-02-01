import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import VideoAdvertising from '@/pageComponents/PaidMedia/VideoAdvertising';


export const metadata = genMeta({
  title: 'Video Advertising | Skyfalke - Engaging Video Campaigns',
  description: 'Create engaging video advertising campaigns with Skyfalke. YouTube ads, video content, and video marketing solutions.',
  keywords: 'video advertising, YouTube ads, video marketing, video campaigns, video content',
  url: 'https://skyfalke.com/services/paid-media/video-advertising',
});

export default function VideoAdvertisingPage() {
  return (
    <PageLayout>
      <VideoAdvertising />
    </PageLayout>
  );
}

