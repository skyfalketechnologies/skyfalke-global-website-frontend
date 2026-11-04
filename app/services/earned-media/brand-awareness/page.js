import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import BrandAwareness from '@/pageComponents/EarnedMedia/BrandAwareness';


export const metadata = genMeta({
  title: 'Brand Awareness Campaigns | Skyfalke',
  description: 'Increase your brand visibility and recognition with Skyfalke\'s brand awareness campaigns. Reach new audiences and build brand loyalty.',
  keywords: 'brand awareness, brand visibility, brand recognition, brand campaigns, brand marketing',
  url: 'https://skyfalke.com/services/earned-media/brand-awareness',
});

export default function BrandAwarenessPage() {
  return (
    <PageLayout>
      <BrandAwareness />
    </PageLayout>
  );
}

