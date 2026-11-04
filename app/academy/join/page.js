import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import JoinClient from './JoinClient';
import ServerPageIntro from '@/components/marketing/ServerPageIntro';
import { ACADEMY_JOIN_INTRO } from '@/data/serverPageIntros';

export const metadata = genMeta({
  title: 'Enroll | Skyfalke Academy - Join a Course',
  description:
    'Enroll in Skyfalke Academy courses in ICT, AI, cloud, data analytics, and digital transformation. Submit your enrollment request and our team will confirm your place.',
  keywords:
    'enroll academy, Skyfalke Academy enrollment, online course registration, professional training Kenya',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/academy/join`,
});

export default function AcademyJoinPage() {
  return (
    <PageLayout>
      <ServerPageIntro {...ACADEMY_JOIN_INTRO} titleAs="h1" />
      <JoinClient />
    </PageLayout>
  );
}
