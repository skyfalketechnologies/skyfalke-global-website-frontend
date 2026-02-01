import PageLayout from '../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import CloudSolutions from '@/pageComponents/CloudSolutions';


export const metadata = genMeta({
  title: 'Cloud Solutions | Skyfalke - Enterprise Cloud Infrastructure',
  description: 'Comprehensive cloud solutions from Skyfalke. Scalable, secure, and sustainable cloud infrastructure for businesses of all sizes.',
  url: 'https://skyfalke.com/cloud-solutions',
});

export default function CloudSolutionsPage() {
  return (
    <PageLayout>
      <CloudSolutions />
    </PageLayout>
  );
}

