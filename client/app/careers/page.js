import { pageMetadata } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import CareersClient from './CareersClient';

export const metadata = pageMetadata.careers;

export default function CareersPage() {
  return (
    <PageLayout>
      <CareersClient />
    </PageLayout>
  );
}

