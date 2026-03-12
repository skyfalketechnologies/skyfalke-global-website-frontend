import { notFound } from 'next/navigation';
import { generateMetadata } from './metadata';
import PageLayout from '../../../components/PageLayout';
import ProductDetailClient from './ProductDetailClient';
import { serverFetch } from '@/utils/serverApi';

export { generateMetadata };

// Revalidate product pages every 60 seconds for ISR-style updates
export const revalidate = 60;

async function getProductDetail(slug) {
  if (!slug) return null;

  const response = await serverFetch(`/api/shop/products/${slug}`);

  if (!response || !response.success || !response.data || !response.data.product) {
    return null;
  }

  const { product, relatedProducts = [] } = response.data;

  return {
    product,
    relatedProducts,
  };
}

export default async function ProductDetailPage({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const initialServerData = await getProductDetail(slug);

  if (!initialServerData?.product) {
    // Proper 404 for non-existent products – better for SEO than soft 404s
    notFound();
  }

  return (
    <PageLayout>
      <ProductDetailClient slug={slug} initialServerData={initialServerData} />
    </PageLayout>
  );
}

