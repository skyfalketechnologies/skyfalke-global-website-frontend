import CampaignForm from '@/pageComponents/Admin/CampaignForm';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'New Campaign',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function NewCampaignPage() {
  return <CampaignForm />;
}

