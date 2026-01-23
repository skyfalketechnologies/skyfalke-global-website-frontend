import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import CloudClient from './CloudClient';

export const metadata = genMeta({
  title: 'Cloud Hosting | Skyfalke - Sustainable Cloud Solutions',
  description: 'Skyfalke offers sustainable cloud hosting solutions powered by renewable energy. Reliable, eco-friendly cloud infrastructure for your business.',
  url: 'https://skyfalke.com/cloud',
});

export default function CloudPage() {
  return (
    <PageLayout>
      <CloudClient />
    </PageLayout>
  );
}

