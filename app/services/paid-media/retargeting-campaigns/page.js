import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import RetargetingCampaigns from '@/pageComponents/PaidMedia/RetargetingCampaigns';


export const metadata = genMeta({
  title: 'Retargeting Campaigns | Skyfalke - Re-engage Your Audience',
  description: 'Re-engage visitors and convert them into customers with Skyfalke\'s retargeting campaigns. Smart remarketing strategies.',
  keywords: 'retargeting, remarketing, retargeting campaigns, pixel tracking, conversion optimization',
  url: 'https://skyfalke.com/services/paid-media/retargeting-campaigns',
});

export default function RetargetingCampaignsPage() {
  return (
    <PageLayout>
      <RetargetingCampaigns />
    </PageLayout>
  );
}

