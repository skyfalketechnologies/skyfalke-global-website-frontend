import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import PaidMedia from '@/pageComponents/PaidMedia';

export const metadata = genMeta({
  title: 'Paid Media Services | Skyfalke - Google Ads, Social Media Advertising & Display Ads',
  description: 'Skyfalke provides paid media advertising services including Google Ads, social media ads, display advertising, video advertising, and retargeting campaigns to drive qualified leads.',
  keywords: 'paid media, Google Ads, social media advertising, display advertising, video advertising, retargeting campaigns, PPC advertising, paid search',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/services/paid-media`,
});

export default function PaidMediaPage() {
  return (
    <PageLayout>
      <PaidMedia />
    </PageLayout>
  );
}

