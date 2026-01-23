import { generateJobMetadata } from '@/utils/metadata';
import { getJobById } from '@/utils/serverApi';

/**
 * Generate metadata for job pages
 * Note: In Next.js 15+, params is a Promise and must be awaited
 */
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    
    if (!id) {
      return generateJobMetadata(null);
    }

    const job = await getJobById(id);
    return generateJobMetadata(job);
  } catch (error) {
    console.error('Error generating job metadata:', error);
    return generateJobMetadata(null);
  }
}

