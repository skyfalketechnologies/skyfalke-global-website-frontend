'use client';

import { useParams } from 'next/navigation';
import CaseStudyForm from '@/components/Admin/CaseStudyForm';

export default function EditCaseStudyPage() {
  const params = useParams();
  const id = params?.id;

  return <CaseStudyForm id={id} />;
}

