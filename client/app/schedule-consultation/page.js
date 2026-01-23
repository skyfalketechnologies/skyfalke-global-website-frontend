import { Suspense } from 'react';
import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import ScheduleConsultation from '@/pageComponents/ScheduleConsultation';

export const metadata = genMeta({
  title: 'Schedule a Consultation | Skyfalke - Free Business Consultation',
  description: 'Schedule a free consultation with Skyfalke to discuss your digital marketing, cloud hosting, and technology needs. Let\'s transform your business together.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/schedule-consultation`,
  noIndex: false,
});

export default function ScheduleConsultationPage() {
  return (
    <PageLayout>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      }>
        <ScheduleConsultation />
      </Suspense>
    </PageLayout>
  );
}

