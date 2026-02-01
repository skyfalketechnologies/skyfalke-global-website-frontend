import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import ResourcesClient from './ResourcesClient';

export const metadata = genMeta({
  title: 'Resources | Skyfalke - Digital Marketing & Technology Resources',
  description: 'Access valuable resources, guides, and tools from Skyfalke to help grow your business with digital marketing and technology solutions.',
  url: 'https://skyfalke.com/resources',
});

export default function ResourcesPage() {
  return (
    <PageLayout>
      <ResourcesClient />
    </PageLayout>
  );
}

