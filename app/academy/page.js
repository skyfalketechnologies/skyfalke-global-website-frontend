import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import AcademyClient from './AcademyClient';

export const metadata = genMeta({
  title: 'Skyfalke Academy | Online Courses & Training Programs',
  description: 'Join Skyfalke Academy to learn digital marketing, cloud hosting, AI tools, and technology skills. Expert-led courses designed to advance your career.',
  keywords: 'online courses, digital marketing training, cloud hosting courses, AI training, technology courses, professional development, skills training',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/academy`,
});

export default function AcademyPage() {
  return (
    <PageLayout>
      <AcademyClient />
    </PageLayout>
  );
}

