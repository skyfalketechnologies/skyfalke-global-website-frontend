import { notFound } from 'next/navigation';
import PageLayout from '../../../components/PageLayout';
import CaseStudyDetailClient from '../../../case-studies/[slug]/CaseStudyDetailClient';
import { generateMetadata as genMeta } from '@/utils/metadata';
import { getCaseStudyBySlug, serverFetch } from '@/utils/serverApi';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

async function getCaseStudyDetail(slug) {
  if (!slug) return null;

  const response = await serverFetch(`/api/case-studies/${slug}`);
  if (!response || !response.success || !response.data || !response.data.caseStudy) {
    return null;
  }

  const { caseStudy, relatedCaseStudies = [] } = response.data;
  return { caseStudy, relatedCaseStudies };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return genMeta({ title: 'Read Case Study', noIndex: true });
  }

  return genMeta({
    title: `Read Case Study: ${caseStudy.title}`,
    titleAbsolute: true,
    description: caseStudy.summary || `Explore how ${caseStudy.client?.name || 'our client'} achieved measurable results.`,
    keywords: Array.isArray(caseStudy.tags) ? caseStudy.tags.join(', ') : 'case study, outcomes, transformation',
    url: `${BASE}/how-we-work/case-studies/${slug}`,
    canonical: `${BASE}/how-we-work/case-studies/${slug}`,
    image:
      caseStudy.images?.find((img) => img?.isPrimary)?.url ||
      caseStudy.images?.[0]?.url,
    ogTitle: `${caseStudy.title} | Read Case Study`,
    ogDescription: caseStudy.summary || 'Challenge, solution, and measurable business outcomes.',
    twitterTitle: `Read Case Study: ${caseStudy.title}`,
    twitterDescription: caseStudy.summary || 'Challenge, solution, and measurable business outcomes.',
    type: 'article',
    category: 'Case Studies',
  });
}

export default async function ReadCaseStudyPage({ params }) {
  const { slug } = await params;
  const initialServerData = await getCaseStudyDetail(slug);

  if (!initialServerData?.caseStudy) {
    notFound();
  }

  return (
    <PageLayout>
      <CaseStudyDetailClient slug={slug} initialServerData={initialServerData} />
    </PageLayout>
  );
}
