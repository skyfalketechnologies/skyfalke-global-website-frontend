import { generateProductMetadata } from '@/utils/metadata';
import { getProductBySlug } from '@/utils/serverApi';

/**
 * Generate metadata for product pages
 * Note: In Next.js 15+, params is a Promise and must be awaited
 */
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    
    if (!slug) {
      return generateProductMetadata(null);
    }

    const product = await getProductBySlug(slug);
    return generateProductMetadata(product);
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return generateProductMetadata(null);
  }
}

