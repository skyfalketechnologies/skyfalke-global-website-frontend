import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skyfalke.com'),
  title: {
    default: 'Skyfalke | Digital Growth & Automation Systems for Modern Organizations',
    template: '%s | Skyfalke',
  },
  description:
    'Skyfalke helps businesses in Africa and beyond simplify operations, automate workflows, and scale smarter — combining AI, cloud, data, and digital marketing into one connected system.',
  keywords: [
    'business automation Kenya',
    'digital transformation Africa',
    'AI solutions for SMEs',
    'cloud services Nairobi',
    'workflow automation',
    'digital marketing agency Kenya',
    'enterprise backup',
    'data systems',
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
    title: 'Skyfalke | Digital Growth & Automation Systems',
    description:
      'We help forward-thinking organizations automate workflows, leverage AI, and build scalable digital systems that drive real growth.',
    images: [
      {
        url: 'https://ik.imagekit.io/g3nahgeeu/hero/skyfalke-digital-tech-firm.webp',
        width: 1200,
        height: 630,
        alt: 'Skyfalke — digital growth and automation systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skyfalke | Digital Growth & Automation Systems',
    description:
      'AI, cloud, automation, and digital marketing — unified into one growth system for modern organizations.',
    images: ['https://ik.imagekit.io/g3nahgeeu/hero/skyfalke-digital-tech-firm.webp'],
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

