import { generateMetadata as genMeta } from '@/utils/metadata';
import { serverFetch } from '@/utils/serverApi';

/**
 * Generate metadata for course detail pages
 * Note: In Next.js 15+, params is a Promise and must be awaited
 */
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    
    if (!slug) {
      return genMeta({
        title: 'Course | Skyfalke Academy',
        description: 'View course details at Skyfalke Academy',
      });
    }

    // Fetch course data
    const course = await serverFetch(`/api/courses/slug/${slug}`).catch(() => null);
    const courseData = course?.data || course;

    if (!courseData) {
      return genMeta({
        title: 'Course | Skyfalke Academy',
        description: 'View course details at Skyfalke Academy',
      });
    }

    return genMeta({
      title: `${courseData.title} | Skyfalke Academy`,
      description: courseData.description || courseData.excerpt || `Learn ${courseData.title} at Skyfalke Academy`,
      keywords: courseData.tags?.join(', ') || courseData.category || '',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/academy/courses/${slug}`,
      type: 'article',
      image: courseData.featuredImage?.url || courseData.image,
    });
  } catch (error) {
    console.error('Error generating course metadata:', error);
    return genMeta({
      title: 'Course | Skyfalke Academy',
      description: 'View course details at Skyfalke Academy',
    });
  }
}

