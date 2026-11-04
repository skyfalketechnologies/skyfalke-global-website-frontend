import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import ReportLandingClient from './ReportLandingClient';

export const metadata = genMeta({
  title: 'Your Guide to the Gemini Enterprise App | Skyfalke',
  description:
    'Build, use, and govern custom AI agents connected to your data and systems to tackle data silos and get better productivity and outcomes. A guide from our partner Google Cloud.',
  url: 'https://skyfalke.com/resources/gemini-enterprise-guide',
});

export default function ReportLandingPage() {
  return (
    <PageLayout>
      <ReportLandingClient />
    </PageLayout>
  );
}
