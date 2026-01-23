import { generateBlogMetadata } from '@/utils/metadata';
import { getBlogBySlug } from '@/utils/serverApi';

/**
 * Generate metadata for blog post pages
 * This runs on the server side
 * Note: In Next.js 15+, params is a Promise and must be awaited
 */
export async function generateMetadata({ params }) {
  try {
    // Await params in Next.js 15+
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    
    if (!slug) {
      return generateBlogMetadata(null);
    }

    // Fetch blog post data (server-side)
    const blog = await getBlogBySlug(slug);

    return generateBlogMetadata(blog);
  } catch (error) {
    console.error('Error generating blog metadata:', error);
    return generateBlogMetadata(null);
  }
}

