'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import PageLayout from '../../../components/PageLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

const JobApplication = dynamic(() => import('@/pageComponents/JobApplication'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function JobApplicationPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <PageLayout>
      <JobApplication id={id} />
    </PageLayout>
  );
}

