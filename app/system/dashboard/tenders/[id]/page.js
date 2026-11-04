'use client';

import { useParams } from 'next/navigation';
import TenderDetail from '@/pageComponents/Admin/TenderDetail';

export default function TenderDetailPage() {
  const params = useParams();
  const id = params?.id;

  return <TenderDetail id={id} />;
}

