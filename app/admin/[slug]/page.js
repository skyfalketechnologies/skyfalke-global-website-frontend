import { generateMetadata as genMeta } from '@/utils/metadata';
import AccessDenied from '@/pageComponents/Admin/AccessDenied';

export const metadata = genMeta({
  title: 'Access Denied | Skyfalke',
  description: 'Access denied',
  noIndex: true,
});

export default function AdminAccessDeniedPage() {
  return <AccessDenied />;
}

