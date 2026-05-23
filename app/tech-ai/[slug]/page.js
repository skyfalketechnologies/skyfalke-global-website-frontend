import { notFound } from 'next/navigation';
import PageLayout from '../../components/PageLayout';
import TechAiDetail from '@/pageComponents/TechAiDetail';
import { generateMetadata as genMeta } from '@/utils/metadata';
import { TECH_AI_SLUGS, getTechAiPage } from '@/data/techAiPages';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

export function generateStaticParams() {
  return TECH_AI_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getTechAiPage(slug);
  if (!page) return genMeta({ title: 'Tech & AI', noIndex: true });

  return genMeta({
    title: page.title,
    titleAbsolute: true,
    description: page.metaDescription,
    keywords: `${page.title}, tech consulting, AI strategy, cloud modernization, Skyfalke`,
    url: `${BASE}/tech-ai/${slug}`,
    canonical: `${BASE}/tech-ai/${slug}`,
    image: page.heroImage.src,
    ogTitle: `${page.title} | Tech & AI by Skyfalke`,
    ogDescription: page.metaDescription,
    twitterTitle: `${page.title} | Tech & AI`,
    twitterDescription: page.metaDescription,
    category: 'Tech & AI',
  });
}

export default async function TechAiSlugPage({ params }) {
  const { slug } = await params;
  const page = getTechAiPage(slug);
  if (!page) notFound();

  return (
    <PageLayout>
      <TechAiDetail page={page} />
    </PageLayout>
  );
}
