import { Suspense } from 'react';
import { generateMetadata as genMeta } from '@/utils/metadata';
import HiddenLogin from '@/pageComponents/Admin/HiddenLogin';

export const metadata = genMeta({
  title: 'Portal Access | Skyfalke',
  description: 'Portal access login',
  noIndex: true,
});

export default function HiddenLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <HiddenLogin />
    </Suspense>
  );
}

