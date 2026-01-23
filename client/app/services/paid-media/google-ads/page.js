import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import GoogleAds from '@/pageComponents/PaidMedia/GoogleAds';


export const metadata = genMeta({
  title: 'Google Ads Management | Skyfalke - Maximize Your ROI',
  description: 'Maximize your ROI with Skyfalke\'s Google Ads management services. Expert PPC campaigns that drive qualified leads and conversions.',
  keywords: 'Google Ads, Google AdWords, PPC management, search advertising, paid search',
  url: 'https://skyfalke.com/services/paid-media/google-ads',
});

export default function GoogleAdsPage() {
  return (
    <PageLayout>
      <GoogleAds />
    </PageLayout>
  );
}

