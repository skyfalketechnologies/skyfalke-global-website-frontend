import { generateBlogMetadata } from '@/utils/metadata';
import { getBlogBySlug } from '@/utils/serverApi';
import { notFound } from 'next/navigation';

const VALID_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

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

    if (!slug || !VALID_SLUG_PATTERN.test(slug)) {
      notFound();
    }

    // Fetch blog post data (server-side)
    const blog = await getBlogBySlug(slug);

    return generateBlogMetadata(blog);
  } catch (error) {
    console.error('Error generating blog metadata:', error);
    return generateBlogMetadata(null);
  }
}

