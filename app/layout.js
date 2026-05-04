import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { getGlobalSchemaJsonLd } from '@/utils/schemaMarkup';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com';
const globalJsonLd = getGlobalSchemaJsonLd(siteUrl);

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'),
  title: {
    default: 'Skyfalke | Turn Your Business Into a High-Performing Digital Asset',
    template: '%s | Skyfalke',
  },
  description:
    'Growth-focused digital partner: online presence, customer acquisition, CRM, automation, and AI roadmaps — one strategy to scale revenue without fragmented vendors.',
  keywords: [
    'digital growth partner',
    'business automation Kenya',
    'SEO and digital ads',
    'CRM workflows',
    'AI roadmap',
    'digital transformation Africa',
    'Skyfalke',
  ],
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
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/`,
    siteName: 'Skyfalke',
    title: 'Skyfalke | High-Performing Digital Growth Systems',
    description:
      'Build online presence, acquire customers, and streamline operations with strategic technology — one partner, clear execution.',
    images: [
      {
        url: 'https://ik.imagekit.io/g3nahgeeu/hero/skyfalke-digital-tech-firm.webp?tr=w-1200,h-630,f-auto,q-auto:good',
        width: 1200,
        height: 630,
        alt: 'Skyfalke — digital growth partner for websites, marketing, automation, and AI strategy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skyfalke | High-Performing Digital Growth Systems',
    description:
      'Websites, marketing, automation, and AI — unified into one growth engine for serious businesses.',
    images: [
      'https://ik.imagekit.io/g3nahgeeu/hero/skyfalke-digital-tech-firm.webp?tr=w-1200,h-630,f-auto,q-auto:good',
    ],
    site: '@skyfalke',
    creator: '@skyfalke',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'}/`,
  },
  // Favicon / app icons for all pages
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', rel: 'icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalJsonLd),
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

