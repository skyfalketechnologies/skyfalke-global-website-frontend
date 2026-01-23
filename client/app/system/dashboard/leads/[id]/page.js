'use client';

import { useParams } from 'next/navigation';
import LeadDetail from '@/pageComponents/Admin/LeadDetail';

export default function LeadDetailPage() {
  const params = useParams();
  const id = params?.id;

  return <LeadDetail id={id} />;
}

