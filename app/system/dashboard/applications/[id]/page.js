'use client';

import { useParams } from 'next/navigation';
import ApplicationDetail from '@/pageComponents/Admin/ApplicationDetail';

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params?.id;

  return <ApplicationDetail id={id} />;
}

