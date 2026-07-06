import { pageMetadata } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import CareersClient from './CareersClient';
import ServerPageIntro from '@/components/marketing/ServerPageIntro';
import { CAREERS_PAGE_INTRO } from '@/data/serverPageIntros';

export const metadata = pageMetadata.careers;

export default function CareersPage() {
  return (
    <PageLayout>
      <CareersClient />
      <ServerPageIntro {...CAREERS_PAGE_INTRO} />
    </PageLayout>
  );
}

