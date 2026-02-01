import { generateMetadata } from './metadata';
import PageLayout from '../../components/PageLayout';
import CaseStudyDetailClient from './CaseStudyDetailClient';

export { generateMetadata };

export default async function CaseStudyDetailPage({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  return (
    <PageLayout>
      <CaseStudyDetailClient slug={slug} />
    </PageLayout>
  );
}

