'use client';

import { useParams } from 'next/navigation';
import LeadForm from '@/pageComponents/Admin/LeadForm';

export default function EditLeadPage() {
  const params = useParams();
  const id = params?.id;

  return <LeadForm id={id} />;
}

