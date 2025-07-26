import './globals.css';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Navbar from '@/components/Navbar/Navbar';
import { Poppins } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop';

const poppins = Poppins({ subsets: ['latin'], weight: ['200', '400'] });

export const metadata: Metadata = {
  title: 'QuizMaster',
  description: 'A Simple Quiz Platform for Learning',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={poppins.className}>
      <body className='bg-white antialiased'>
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <main className='pt-16'>{children}</main>
          <SpeedInsights />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
