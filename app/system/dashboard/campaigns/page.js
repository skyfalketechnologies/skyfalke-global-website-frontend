import EmailCampaigns from '@/pageComponents/Admin/EmailCampaigns';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Email Campaigns',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function EmailCampaignsPage() {
  return <EmailCampaigns />;
}

