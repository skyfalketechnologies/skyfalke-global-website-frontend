import { notFound } from 'next/navigation';
import PageLayout from '../../components/PageLayout';
import AboutDetail from '@/pageComponents/AboutDetail';
import { generateMetadata as genMeta } from '@/utils/metadata';
import { ABOUT_SLUGS, getAboutPage } from '@/data/aboutPages';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

export function generateStaticParams() {
  return ABOUT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getAboutPage(slug);
  if (!page) return genMeta({ title: 'About Us', noIndex: true });

  return genMeta({
    title: page.title,
    description: page.metaDescription,
    keywords: `${page.title}, Skyfalke values, culture, responsibility, sustainability`,
    url: `${BASE}/about-us/${slug}`,
    canonical: `${BASE}/about-us/${slug}`,
    image: page.heroImage.src,
    ogTitle: `${page.title} | About Skyfalke`,
    ogDescription: page.metaDescription,
    twitterTitle: `${page.title} | About Us`,
    twitterDescription: page.metaDescription,
    category: 'About Us',
  });
}

export default async function AboutSlugPage({ params }) {
  const { slug } = await params;
  const page = getAboutPage(slug);
  if (!page) notFound();

  return (
    <PageLayout>
      <AboutDetail page={page} />
    </PageLayout>
  );
}
