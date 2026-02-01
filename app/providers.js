'use client';

import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import AnalyticsProvider from '@/components/Analytics/AnalyticsProvider';
import CookieBanner from '@/components/CookieBanner';
import GlobalMetaManager from '@/components/SEO/GlobalMetaManager';
import FontLoader from '@/components/FontLoader';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import ChristmasDecorations from '@/components/Christmas/ChristmasDecorations';

export default function Providers({ children }) {
  return (
    <HelmetProvider>
      <AnalyticsProvider>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <NotificationProvider>
                <div className="App min-h-screen bg-gray-50">
                  <FontLoader />
                  <PerformanceMonitor />
                  <ChristmasDecorations />
                  {children}
                  <CookieBanner />
                  <GlobalMetaManager />
                </div>
              </NotificationProvider>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </AnalyticsProvider>
    </HelmetProvider>
  );
}

