import PortalOnboarding from '@/pageComponents/Admin/Portal/PortalOnboarding';
import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Onboarding',
  description: 'Onboarding checklist',
  noIndex: true,
});

export default function PortalOnboardingPage() {
  return <PortalOnboarding />;
}
