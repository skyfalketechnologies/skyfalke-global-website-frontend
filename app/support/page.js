import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import SupportClient from './SupportClient';

export const metadata = genMeta({
  title: 'Support | Skyfalke - Get Help & Support',
  description: 'Get help and support from Skyfalke. Contact our support team for assistance with digital marketing, cloud hosting, and technology solutions.',
  url: 'https://skyfalke.com/support',
});

export default function SupportPage() {
  return (
    <PageLayout>
      <SupportClient />
    </PageLayout>
  );
}

