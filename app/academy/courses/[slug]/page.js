import { generateMetadata } from './metadata';
import PageLayout from '../../../components/PageLayout';
import CourseDetailClient from './CourseDetailClient';

export { generateMetadata };

export default async function CourseDetailPage({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  return (
    <PageLayout>
      <CourseDetailClient slug={slug} />
    </PageLayout>
  );
}

