import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import DisplayAdvertising from '@/pageComponents/PaidMedia/DisplayAdvertising';


export const metadata = genMeta({
  title: 'Display Advertising | Skyfalke - Visual Ad Campaigns',
  description: 'Increase brand visibility with Skyfalke\'s display advertising services. Eye-catching banner ads and visual campaigns.',
  keywords: 'display advertising, banner ads, display ads, visual advertising, display campaigns',
  url: 'https://skyfalke.com/services/paid-media/display-advertising',
});

export default function DisplayAdvertisingPage() {
  return (
    <PageLayout>
      <DisplayAdvertising />
    </PageLayout>
  );
}

