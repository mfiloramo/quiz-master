import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Poppins } from 'next/font/google';
import Navbar from '@/components/Navbar/Navbar';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import ToastNotification from '@/components/ToastNotification/ToastNotification';

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
          <ToastProvider>
            <div className='flex h-full flex-col'>
              {/* NAVBAR */}
              <Navbar />

              {/* MAIN CONTENT AREA SCROLLS */}
              <main className='mt-16 flex-1 overflow-y-auto overscroll-contain'>{children}</main>

              {/* TOAST NOTIFICATION VIEWPORT (PORTAL) */}
              <ToastNotification />
            </div>

            {/* VERCEL INTERNALS */}
            <SpeedInsights />
            <Analytics />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
