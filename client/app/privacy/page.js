import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import PrivacyClient from './PrivacyClient';

export const metadata = genMeta({
  title: 'Privacy Policy | Skyfalke',
  description: 'Read Skyfalke\'s privacy policy to understand how we collect, use, and protect your personal information.',
  url: 'https://skyfalke.com/privacy',
});

export default function PrivacyPage() {
  return (
    <PageLayout>
      <PrivacyClient />
    </PageLayout>
  );
}

