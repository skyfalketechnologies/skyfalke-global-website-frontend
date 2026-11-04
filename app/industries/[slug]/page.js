import { notFound } from 'next/navigation';
import PageLayout from '../../components/PageLayout';
import IndustryDetail from '@/pageComponents/IndustryDetail';
import { buildSectionSeoTitle, generateMetadata as genMeta } from '@/utils/metadata';
import { getIndustryPage, INDUSTRY_SLUGS } from '@/data/industryPages';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

export function generateStaticParams() {
  return INDUSTRY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const industry = getIndustryPage(slug);
  if (!industry) {
    return genMeta({ title: 'Industry', noIndex: true });
  }
  return genMeta({
    title: buildSectionSeoTitle(
      `${industry.title} Solutions`,
      'Industries',
      industry.seoTitle
    ),
    titleAbsolute: true,
    description: industry.metaDescription,
    keywords: `${industry.title}, industry solutions, digital transformation, Skyfalke`,
    url: `${BASE}/industries/${slug}`,
    canonical: `${BASE}/industries/${slug}`,
    image: industry.heroImage.src,
    ogTitle: `${industry.title} Industry Solutions | Skyfalke`,
    ogDescription: industry.metaDescription,
    twitterTitle: `${industry.title} | Industries`,
    twitterDescription: industry.metaDescription,
    category: 'Industries',
  });
}

export default async function IndustrySlugPage({ params }) {
  const { slug } = await params;
  const industry = getIndustryPage(slug);
  if (!industry) notFound();

  return (
    <PageLayout>
      <IndustryDetail industry={industry} />
    </PageLayout>
  );
}
