'use client';

import { useParams } from 'next/navigation';
import JobForm from '@/components/Admin/JobForm';

export default function EditJobPage() {
  const params = useParams();
  const id = params?.id;

  return <JobForm id={id} />;
}

