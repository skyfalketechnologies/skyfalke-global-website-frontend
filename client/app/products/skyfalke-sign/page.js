import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import SkyfalkeSignLanding from '@/pageComponents/SkyfalkeSignLanding';

export const metadata = genMeta({
  title: 'Skyfalke Sign - Electronic Signature Platform',
  description:
    'Legally binding electronic signatures for teams and enterprises. Sign, send, and manage documents from anywhere with Skyfalke Sign.',
  url: 'https://skyfalke.com/products/skyfalke-sign',
});

export default function SkyfalkeSignPage() {
  return (
    <PageLayout>
      <SkyfalkeSignLanding />
    </PageLayout>
  );
}
