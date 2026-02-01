import AdminContacts from '@/pageComponents/Admin/Contacts';

import { generateMetadata as genMeta } from '@/utils/metadata';

export const metadata = genMeta({
  title: 'Contacts',
  description: 'Skyfalke Admin Dashboard',
  noIndex: true,
});

export default function AdminContactsPage() {
  return <AdminContacts />;
}

