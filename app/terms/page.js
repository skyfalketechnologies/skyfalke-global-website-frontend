import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import TermsClient from './TermsClient';

export const metadata = genMeta({
  title: 'Terms of Service | Skyfalke',
  description: 'Read Skyfalke\'s terms of service to understand the rules and regulations for using our services.',
  url: 'https://skyfalke.com/terms',
});

export default function TermsPage() {
  return (
    <PageLayout>
      <TermsClient />
    </PageLayout>
  );
}

