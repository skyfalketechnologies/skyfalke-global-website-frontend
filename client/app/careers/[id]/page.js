import { notFound } from 'next/navigation';
import { generateMetadata } from './metadata';
import PageLayout from '../../components/PageLayout';
import JobDetailClient from './JobDetailClient';
import { getJobById } from '@/utils/serverApi';

export { generateMetadata };

// Revalidate job pages every 60 seconds for fresher listings with ISR
export const revalidate = 60;

export default async function JobDetailPage({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  const job = id ? await getJobById(id) : null;

  if (!job) {
    // Proper 404 when a job does not exist – avoids soft 404s
    notFound();
  }

  const initialServerData = { job };

  return (
    <PageLayout>
      <JobDetailClient id={id} initialServerData={initialServerData} />
    </PageLayout>
  );
}

