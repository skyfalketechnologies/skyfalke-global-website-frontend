import { generateMetadata as genMeta } from '@/utils/metadata';
import PageLayout from '../../components/PageLayout';
import CheckoutSuccessClient from './CheckoutSuccessClient';

export const metadata = genMeta({
  title: 'Order Confirmed | Skyfalke - Thank You for Your Purchase',
  description: 'Your order has been confirmed. Thank you for your purchase from Skyfalke.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/checkout/success`,
  noIndex: true, // Success pages typically shouldn't be indexed
});

export default function CheckoutSuccessPage() {
  return (
    <PageLayout>
      <CheckoutSuccessClient />
    </PageLayout>
  );
}

