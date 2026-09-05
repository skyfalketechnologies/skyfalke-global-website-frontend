import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import SkyfalkeConnectLanding from '@/pageComponents/SkyfalkeConnectLanding';

export const metadata = genMeta({
  title: 'Skyfalke Connect - Unified Communications Platform',
  description:
    'SMS, WhatsApp, voice, email, and push — unified under a single API and dashboard. Reach every customer, on every channel, with Skyfalke Connect.',
  url: 'https://skyfalke.com/products/skyfalke-connect',
});

export default function SkyfalkeConnectPage() {
  return (
    <PageLayout>
      <SkyfalkeConnectLanding />
    </PageLayout>
  );
}
