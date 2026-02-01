'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import PageLayout from '../../../components/PageLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

const ApplicationSuccess = dynamic(() => import('@/pageComponents/ApplicationSuccess'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

export default function ApplicationSuccessPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <PageLayout>
      <ApplicationSuccess id={id} />
    </PageLayout>
  );
}

