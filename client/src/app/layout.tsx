import './globals.css';
import Navbar from '@/components/navbar/navbar';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';

const poppins = Poppins({ subsets: ['latin'], weight: ['200', '400'] });

export const metadata: Metadata = {
  title: 'QuizMaster',
  description: 'A Simple Quiz Platform for Learning',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-white antialiased">
        <AuthProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
