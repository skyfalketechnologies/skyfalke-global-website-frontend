import AdminEvents from '@/pageComponents/Admin/Events';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Events - Upcoming Events & Webinars',
  description: 'Join Skyfalke at upcoming events, webinars, and conferences. Learn about digital marketing, cloud hosting, and technology trends.',
  url: 'https://skyfalke.com/events',
});

export default function AdminEventsPage() {
  return <AdminEvents />;
}

