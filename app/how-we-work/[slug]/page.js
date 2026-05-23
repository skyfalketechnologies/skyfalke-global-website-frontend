import { notFound } from 'next/navigation';
import PageLayout from '../../components/PageLayout';
import HowWeWorkDetail from '@/pageComponents/HowWeWorkDetail';
import HowWeWorkCaseStudiesPage from '@/pageComponents/HowWeWorkCaseStudiesPage';
import { buildSectionSeoTitle, generateMetadata as genMeta } from '@/utils/metadata';
import { HOW_WE_WORK_SLUGS, getHowWeWorkPage } from '@/data/howWeWorkPages';
import { getCaseStudiesList } from '@/utils/serverApi';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

export function generateStaticParams() {
  return HOW_WE_WORK_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getHowWeWorkPage(slug);
  if (!page) return genMeta({ title: 'How We Work', noIndex: true });

  return genMeta({
    title: buildSectionSeoTitle(page.title, 'How We Work', page.seoTitle),
    titleAbsolute: true,
    description: page.metaDescription,
    keywords: `${page.title}, delivery model, operating model, consulting, Skyfalke`,
    url: `${BASE}/how-we-work/${slug}`,
    canonical: `${BASE}/how-we-work/${slug}`,
    image: page.heroImage.src,
    ogTitle: `${page.title} | How We Work at Skyfalke`,
    ogDescription: page.metaDescription,
    twitterTitle: `${page.title} | How We Work`,
    twitterDescription: page.metaDescription,
    category: 'How We Work',
  });
}

export default async function HowWeWorkSlugPage({ params }) {
  const { slug } = await params;
  const page = getHowWeWorkPage(slug);
  if (!page) notFound();
  let caseStudies = [];

  if (slug === 'case-studies') {
    const response = await getCaseStudiesList({
      page: 1,
      limit: 6,
      sortBy: 'publishedAt',
      sortOrder: 'desc',
    });
    caseStudies = response?.caseStudies || [];
  }

  return (
    <PageLayout>
      {slug === 'case-studies' ? (
        <HowWeWorkCaseStudiesPage page={page} caseStudies={caseStudies} />
      ) : (
        <HowWeWorkDetail page={page} />
      )}
    </PageLayout>
  );
}
