import { generateMetadata } from './metadata';
import PageLayout from '../../components/PageLayout';
import BlogPostClient from './BlogPostClient';

// Export metadata generation function
export { generateMetadata };

export default async function BlogPostPage({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  return (
    <PageLayout>
      <BlogPostClient slug={slug} />
    </PageLayout>
  );
}

