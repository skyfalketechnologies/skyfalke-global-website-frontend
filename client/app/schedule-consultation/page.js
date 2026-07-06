import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import ScheduleConsultation from '@/pageComponents/ScheduleConsultation';
import ServerPageIntro from '@/components/marketing/ServerPageIntro';
import { SCHEDULE_CONSULTATION_INTRO } from '@/data/serverPageIntros';

export const metadata = genMeta({
  title: 'Schedule a Consultation | Skyfalke - Free Business Consultation',
  description: 'Schedule a free consultation with Skyfalke to discuss your digital marketing, cloud hosting, and technology needs. Let\'s transform your business together.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/schedule-consultation`,
  noIndex: false,
});

export default function ScheduleConsultationPage() {
  return (
    <PageLayout>
      <ServerPageIntro {...SCHEDULE_CONSULTATION_INTRO} titleAs="h1" />
      <ScheduleConsultation />
    </PageLayout>
  );
}

