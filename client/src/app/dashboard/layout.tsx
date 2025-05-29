'use client';

import SideNavbar from '@/components/side-navbar/side-navbar';
import { DashboardItem } from '@/types/DashboardItem.type';
import { QuizProvider } from '@/contexts/QuizContext';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const dashboardLinks: DashboardItem[] = [
  { path: '/', label: '🏠 Home' },
  { path: '/dashboard/create', label: '✨ Create' },
  { path: '/dashboard/join', label: '🎮 Join Game' },
  { path: '/dashboard/discover', label: '🧭 Discover' },
  { path: '/dashboard/library', label: '📚 My Quizzes' },
  { path: '/dashboard/settings', label: '⚙️ Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();

  const pathname = usePathname();

  // DEFINE PATHS WHERE SIDEBAR SHOULD BE HIDDEN
  const hideSidebar =
    pathname.startsWith('/dashboard/lobby') ||
    pathname.startsWith('/dashboard/quiz') ||
    !isLoggedIn;

  return (
    <WebSocketProvider>
      <SessionProvider>
        <QuizProvider>
          <div className='flex min-h-[calc(100vh-4rem)] bg-gradient-to-b from-sky-300 to-sky-800 text-black caret-transparent'>
            {!hideSidebar && <SideNavbar dashboardLinks={dashboardLinks} />}
            <div className='flex-1 p-6'>{children}</div>
          </div>
        </QuizProvider>
      </SessionProvider>
    </WebSocketProvider>
  );
}
