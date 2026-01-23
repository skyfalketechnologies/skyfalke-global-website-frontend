'use client';

import { useParams } from 'next/navigation';
import CampaignForm from '@/pageComponents/Admin/CampaignForm';

export default function EditCampaignPage() {
  const params = useParams();
  const id = params?.id;

  return <CampaignForm id={id} />;
}

