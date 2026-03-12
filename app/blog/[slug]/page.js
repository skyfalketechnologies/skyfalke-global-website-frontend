import { generateMetadata } from './metadata';
import PageLayout from '../../components/PageLayout';
import BlogPostClient from './BlogPostClient';
import { getBlogBySlug } from '@/utils/serverApi';

// Export metadata generation function
export { generateMetadata };

export default async function BlogPostPage({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  let initialServerData = null;

  if (slug) {
    try {
      const blog = await getBlogBySlug(slug);
      if (blog) {
        initialServerData = { post: blog };
      }
    } catch (error) {
      console.error('Error loading blog post for page render:', error);
    }
  }

  return (
    <PageLayout>
      <BlogPostClient slug={slug} initialServerData={initialServerData} />
    </PageLayout>
  );
}

