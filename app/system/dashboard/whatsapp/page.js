import WhatsApp from '@/pageComponents/Admin/WhatsApp';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'WhatsApp',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function WhatsAppPage() {
  return <WhatsApp />;
}

