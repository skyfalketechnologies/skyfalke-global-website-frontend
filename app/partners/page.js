import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import PartnersClient from './PartnersClient';

export const metadata = genMeta({
  title: 'Partners | Skyfalke - Partner With Us',
  description: 'Partner with Skyfalke to expand your reach and offer comprehensive digital marketing and technology solutions to your clients.',
  url: 'https://skyfalke.com/partners',
});

export default function PartnersPage() {
  return (
    <PageLayout>
      <PartnersClient />
    </PageLayout>
  );
}

