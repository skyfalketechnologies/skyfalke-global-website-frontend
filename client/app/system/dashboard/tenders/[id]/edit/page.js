'use client';

import { useParams } from 'next/navigation';
import TenderForm from '@/pageComponents/Admin/TenderForm';

export default function EditTenderPage() {
  const params = useParams();
  const id = params?.id;

  return <TenderForm id={id} />;
}

