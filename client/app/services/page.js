import { pageMetadata } from '@/utils/metadata';
import dynamic from 'next/dynamic';
import PageLayout from '../components/PageLayout';
import LoadingSpinner from '@/components/LoadingSpinner';

export const metadata = pageMetadata.services;

const Services = dynamic(() => import('@/pageComponents/Services'), {
  loading: () => <LoadingSpinner />,
  ssr: true
});

export default function ServicesPage() {
  return (
    <PageLayout>
      <Services />
    </PageLayout>
  );
}

