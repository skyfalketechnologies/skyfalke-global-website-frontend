import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'),
  title: {
    default: 'Skyfalke • Leading Digital Marketing & Technology Solutions Partner in Africa',
    template: '%s | Skyfalke',
  },
  description: 'Skyfalke - Leading digital marketing & technology solutions partner in Africa. Sustainable cloud hosting, AI-powered business tools, creative services & data analytics. Serving Africa & beyond with eco-friendly solutions.',
  keywords: ['digital marketing agency Africa', 'sustainable cloud hosting Kenya', 'AI business solutions', 'eco-friendly web hosting', 'renewable energy servers', 'digital transformation Africa', 'IT consultancy Kenya', 'creative services Africa', 'data analytics', 'business intelligence'],
  authors: [{ name: 'Skyfalke' }],
  creator: 'Skyfalke',
  publisher: 'Skyfalke',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com',
    siteName: 'Skyfalke',
    title: 'Skyfalke • Leading Digital Marketing & Technology Solutions Partner in Africa',
    description: 'Skyfalke - Leading digital marketing & technology solutions partner in Africa. Sustainable cloud hosting, AI-powered business tools, creative services & data analytics.',
    images: [
      {
        url: '/favicon-512x512.png',
        width: 1200,
        height: 630,
        alt: 'Skyfalke - Digital Marketing & Technology Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skyfalke • Leading Digital Marketing & Technology Solutions',
    description: 'Leading digital marketing & technology solutions partner in Africa',
    images: ['/favicon-512x512.png'],
    site: '@skyfalke',
    creator: '@skyfalke',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

