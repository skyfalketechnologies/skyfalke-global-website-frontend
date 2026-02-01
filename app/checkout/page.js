import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../components/PageLayout';
import CheckoutClient from './CheckoutClient';

export const metadata = genMeta({
  title: 'Checkout | Skyfalke - Complete Your Purchase',
  description: 'Complete your purchase at Skyfalke. Secure checkout for digital products and services.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/checkout`,
  noIndex: true, // Checkout pages typically shouldn't be indexed
});

export default function CheckoutPage() {
  return (
    <PageLayout>
      <CheckoutClient />
    </PageLayout>
  );
}

