import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import CaseStudiesClient from './CaseStudiesClient';

export const metadata = genMeta({
  title: 'Case Studies | Skyfalke - Success Stories & Client Projects',
  description: 'Explore Skyfalke\'s case studies and success stories. See how we\'ve helped businesses transform with digital marketing, cloud hosting, and technology solutions.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/case-studies`,
});

export default function CaseStudiesPage() {
  return (
    <PageLayout>
      <CaseStudiesClient />
    </PageLayout>
  );
}

