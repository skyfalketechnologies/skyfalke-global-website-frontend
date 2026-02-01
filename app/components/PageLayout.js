'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function PageLayout({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

