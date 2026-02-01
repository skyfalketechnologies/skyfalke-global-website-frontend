import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import EarnedMedia from '@/pageComponents/EarnedMedia';

export const metadata = genMeta({
  title: 'Earned Media Services | Skyfalke - PR, Content Marketing & Brand Awareness',
  description: 'Skyfalke offers earned media services including public relations, content marketing, influencer marketing, social media management, and brand awareness campaigns.',
  keywords: 'earned media, public relations, content marketing, influencer marketing, social media management, brand awareness, PR services, content strategy',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/services/earned-media`,
});

export default function EarnedMediaPage() {
  return (
    <PageLayout>
      <EarnedMedia />
    </PageLayout>
  );
}

