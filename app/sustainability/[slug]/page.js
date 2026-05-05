import { notFound } from 'next/navigation';
import PageLayout from '../../components/PageLayout';
import SustainabilityDetail from '@/pageComponents/SustainabilityDetail';
import { generateMetadata as genMeta } from '@/utils/metadata';
import { SUSTAINABILITY_SLUGS, getSustainabilityPage } from '@/data/sustainabilityPages';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

export function generateStaticParams() {
  return SUSTAINABILITY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getSustainabilityPage(slug);
  if (!page) return genMeta({ title: 'Sustainability', noIndex: true });

  return genMeta({
    title: page.title,
    description: page.metaDescription,
    keywords: `${page.title}, sustainability consulting, environmental strategy, Skyfalke`,
    url: `${BASE}/sustainability/${slug}`,
    canonical: `${BASE}/sustainability/${slug}`,
    image: page.heroImage.src,
    ogTitle: `${page.title} | Sustainability at Skyfalke`,
    ogDescription: page.metaDescription,
    twitterTitle: `${page.title} | Sustainability`,
    twitterDescription: page.metaDescription,
    category: 'Sustainability',
  });
}

export default async function SustainabilitySlugPage({ params }) {
  const { slug } = await params;
  const page = getSustainabilityPage(slug);
  if (!page) notFound();

  return (
    <PageLayout>
      <SustainabilityDetail page={page} />
    </PageLayout>
  );
}
