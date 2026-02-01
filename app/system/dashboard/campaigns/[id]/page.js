'use client';

import { useParams } from 'next/navigation';
import CampaignDetail from '@/pageComponents/Admin/CampaignDetail';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params?.id;

  return <CampaignDetail id={id} />;
}

