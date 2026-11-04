import PageLayout from '../../../components/PageLayout';
import { generateMetadata as genMeta } from '@/utils/metadata';
import PublicRelations from '@/pageComponents/EarnedMedia/PublicRelations';


export const metadata = genMeta({
  title: 'Public Relations Services | Skyfalke',
  description: 'Build and maintain your brand reputation with Skyfalke\'s public relations services. Strategic PR campaigns and media relations.',
  keywords: 'public relations, PR services, media relations, brand reputation, PR campaigns',
  url: 'https://skyfalke.com/services/earned-media/public-relations',
});

export default function PublicRelationsPage() {
  return (
    <PageLayout>
      <PublicRelations />
    </PageLayout>
  );
}

