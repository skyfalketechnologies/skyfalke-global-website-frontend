import PortalIntegrations from '@/pageComponents/Admin/Portal/PortalIntegrations';
import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Integrations',
  description: 'Slack, Jira, GitHub, Google',
  noIndex: true,
});

export default function PortalIntegrationsPage() {
  return <PortalIntegrations />;
}
