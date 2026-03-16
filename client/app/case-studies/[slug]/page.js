import { notFound } from 'next/navigation';
import { generateMetadata } from './metadata';
import PageLayout from '../../components/PageLayout';
import CaseStudyDetailClient from './CaseStudyDetailClient';
import { serverFetch } from '@/utils/serverApi';

export { generateMetadata };

async function getCaseStudyDetail(slug) {
  if (!slug) return null;

  const response = await serverFetch(`/api/case-studies/${slug}`);

  if (!response || !response.success || !response.data || !response.data.caseStudy) {
    return null;
  }

  const { caseStudy, relatedCaseStudies = [] } = response.data;

  return {
    caseStudy,
    relatedCaseStudies,
  };
}

export default async function CaseStudyDetailPage({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const initialServerData = await getCaseStudyDetail(slug);

  if (!initialServerData?.caseStudy) {
    // Proper 404 for non-existent case studies – avoids soft 404s
    notFound();
  }

  return (
    <PageLayout>
      <CaseStudyDetailClient slug={slug} initialServerData={initialServerData} />
    </PageLayout>
  );
}

