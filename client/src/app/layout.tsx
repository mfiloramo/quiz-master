import './globals.css';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Navbar from '@/components/Navbar/Navbar';
import { Poppins } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';
import React from 'react';

const poppins = Poppins({ subsets: ['latin'], weight: ['200', '400'] });

export const metadata: Metadata = {
  title: 'QuizMaster',
  description: 'A Simple Quiz Platform for Learning',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`${poppins.className} h-full bg-white`}>
      <body className='h-full overflow-hidden bg-white antialiased'>
        <AuthProvider>
          <ScrollToTop />

          <div className='flex h-full flex-col'>
            {/* NAVBAR (fixed height assumed: 4rem = mt-16) */}
            <Navbar />

            {/* MAIN CONTENT AREA SCROLLS */}
            <main className='mt-16 flex-1 overflow-y-auto overscroll-contain'>{children}</main>
          </div>

          {/* VERCEL SPEED INSIGHTS */}
          <SpeedInsights />

          {/* VERCEL APP TELEMETRY */}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
