import { notFound } from 'next/navigation';
import PageLayout from '../../components/PageLayout';
import CapabilityDetail from '@/pageComponents/CapabilityDetail';
import { generateMetadata as genMeta } from '@/utils/metadata';
import { CAPABILITY_SLUGS, getCapabilityPage } from '@/data/capabilityPages';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';

export function generateStaticParams() {
  return CAPABILITY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const capability = getCapabilityPage(slug);
  if (!capability) return genMeta({ title: 'Capability', noIndex: true });

  return genMeta({
    title: capability.title,
    titleAbsolute: true,
    description: capability.metaDescription,
    keywords: `${capability.title}, business capabilities, technology consulting, Skyfalke`,
    url: `${BASE}/capabilities/${slug}`,
    canonical: `${BASE}/capabilities/${slug}`,
    image: capability.heroImage.src,
    ogTitle: `${capability.title} Capability | Skyfalke`,
    ogDescription: capability.metaDescription,
    twitterTitle: `${capability.title} | Capabilities`,
    twitterDescription: capability.metaDescription,
    category: 'Capabilities',
  });
}

export default async function CapabilitySlugPage({ params }) {
  const { slug } = await params;
  const capability = getCapabilityPage(slug);
  if (!capability) notFound();

  return (
    <PageLayout>
      <CapabilityDetail capability={capability} />
    </PageLayout>
  );
}
