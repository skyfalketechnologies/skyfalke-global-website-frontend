import { generateMetadata } from './metadata';
import PageLayout from '../../components/PageLayout';
import JobDetailClient from './JobDetailClient';

export { generateMetadata };

export default async function JobDetailPage({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  return (
    <PageLayout>
      <JobDetailClient id={id} />
    </PageLayout>
  );
}

