import { generateMetadata } from './metadata';
import PageLayout from '../../components/PageLayout';
import BlogPostClient from './BlogPostClient';
import { getBlogBySlug } from '@/utils/serverApi';
import { notFound } from 'next/navigation';

// Export metadata generation function
export { generateMetadata };

export default async function BlogPostPage({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  let initialServerData = null;

  if (slug) {
    const blog = await getBlogBySlug(slug);

    // If the blog post doesn't exist, return a proper 404.
    // This prevents Google from treating the URL as a "soft 404"
    // when we render a "not found" message with a 200 status.
    if (!blog) {
      notFound();
    }

    initialServerData = { post: blog };
  }

  return (
    <PageLayout>
      <BlogPostClient slug={slug} initialServerData={initialServerData} />
    </PageLayout>
  );
}

