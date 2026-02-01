import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import SocialMediaManagement from '@/pageComponents/EarnedMedia/SocialMediaManagement';


export const metadata = genMeta({
  title: 'Social Media Management | Skyfalke - Grow Your Social Presence',
  description: 'Manage and grow your social media presence with Skyfalke\'s social media management services. Consistent, engaging content across all platforms.',
  keywords: 'social media management, social media strategy, social media marketing, SMM, social media campaigns',
  url: 'https://skyfalke.com/services/earned-media/social-media-management',
});

export default function SocialMediaManagementPage() {
  return (
    <PageLayout>
      <SocialMediaManagement />
    </PageLayout>
  );
}

