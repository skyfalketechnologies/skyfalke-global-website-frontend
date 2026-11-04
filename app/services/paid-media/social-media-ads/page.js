import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import SocialMediaAds from '@/pageComponents/PaidMedia/SocialMediaAds';


export const metadata = genMeta({
  title: 'Social Media Advertising | Skyfalke - Targeted Ad Campaigns',
  description: 'Reach your target audience with Skyfalke\'s social media advertising services. Targeted ad campaigns on Facebook, Instagram, LinkedIn, and more.',
  keywords: 'social media advertising, Facebook ads, Instagram ads, LinkedIn ads, social ads',
  url: 'https://skyfalke.com/services/paid-media/social-media-ads',
});

export default function SocialMediaAdsPage() {
  return (
    <PageLayout>
      <SocialMediaAds />
    </PageLayout>
  );
}

