import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import CheckoutCancelClient from './CheckoutCancelClient';

export const metadata = genMeta({
  title: 'Payment Cancelled | Skyfalke',
  description: 'Your payment was cancelled. No charges have been made. You can try again or contact support.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/checkout/cancel`,
  noIndex: true, // Cancel pages typically shouldn't be indexed
});

export default function CheckoutCancelPage() {
  return (
    <PageLayout>
      <CheckoutCancelClient />
    </PageLayout>
  );
}

