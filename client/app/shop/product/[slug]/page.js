import { generateMetadata } from './metadata';
import PageLayout from '../../../components/PageLayout';
import ProductDetailClient from './ProductDetailClient';

export { generateMetadata };

export default async function ProductDetailPage({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  return (
    <PageLayout>
      <ProductDetailClient slug={slug} />
    </PageLayout>
  );
}

