import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import CoursesClient from './CoursesClient';

export const metadata = genMeta({
  title: 'Courses | Skyfalke Academy - Browse All Courses',
  description: 'Browse all courses available at Skyfalke Academy. Learn digital marketing, cloud hosting, AI tools, and technology skills from industry experts.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/academy/courses`,
});

export default function CoursesPage() {
  return (
    <PageLayout>
      <CoursesClient />
    </PageLayout>
  );
}

