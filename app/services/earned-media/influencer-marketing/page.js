import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import InfluencerMarketing from '@/pageComponents/EarnedMedia/InfluencerMarketing';


export const metadata = genMeta({
  title: 'Influencer Marketing | Skyfalke - Connect with Your Audience',
  description: 'Amplify your brand reach with Skyfalke\'s influencer marketing services. Partner with the right influencers to engage your target audience.',
  keywords: 'influencer marketing, influencer campaigns, brand partnerships, social media influencers',
  url: 'https://skyfalke.com/services/earned-media/influencer-marketing',
});

export default function InfluencerMarketingPage() {
  return (
    <PageLayout>
      <InfluencerMarketing />
    </PageLayout>
  );
}

