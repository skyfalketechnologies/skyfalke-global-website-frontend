import { Suspense } from 'react';
import { generateMetadata as genMeta } from '@/utils/metadata';
import SecureLogin from '@/pageComponents/Admin/SecureLogin';

export const metadata = genMeta({
  title: 'Secure Login | Skyfalke',
  description: 'Secure admin login',
  noIndex: true,
});

export default function SecureLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <SecureLogin />
    </Suspense>
  );
}

