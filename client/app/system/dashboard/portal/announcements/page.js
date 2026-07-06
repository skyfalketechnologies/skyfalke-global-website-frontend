import PortalAnnouncements from '@/pageComponents/Admin/Portal/PortalAnnouncements';
import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Announcements',
  description: 'Company announcements',
  noIndex: true,
});

export default function PortalAnnouncementsPage() {
  return <PortalAnnouncements />;
}
