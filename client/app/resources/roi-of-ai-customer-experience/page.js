import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import ReportLandingClient from './ReportLandingClient';

export const metadata = genMeta({
  title: 'The ROI of AI in Customer Experience | Skyfalke',
  description:
    'How AI agents are helping boost engagement and delight customers. Based on a survey of 3,466 senior leaders of global enterprises, discover where AI is delivering the most value.',
  url: 'https://skyfalke.com/resources/roi-of-ai-customer-experience',
});

export default function ReportLandingPage() {
  return (
    <PageLayout>
      <ReportLandingClient />
    </PageLayout>
  );
}
