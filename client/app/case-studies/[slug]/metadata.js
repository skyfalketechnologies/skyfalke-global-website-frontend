import { generateCaseStudyMetadata } from '@/utils/metadata';
import { getCaseStudyBySlug } from '@/utils/serverApi';

/**
 * Generate metadata for case study pages
 * Note: In Next.js 15+, params is a Promise and must be awaited
 */
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    
    if (!slug) {
      return generateCaseStudyMetadata(null);
    }

    const caseStudy = await getCaseStudyBySlug(slug);
    return generateCaseStudyMetadata(caseStudy);
  } catch (error) {
    console.error('Error generating case study metadata:', error);
    return generateCaseStudyMetadata(null);
  }
}

