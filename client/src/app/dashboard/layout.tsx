'use client';

import SideNavbar from '@/components/SideNavbar/SideNavbar';
import { DashboardItem } from '@/types/DashboardItem.type';
import { QuizProvider } from '@/contexts/QuizContext';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AudioProvider } from '@/contexts/AudioContext';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // CONTEXT HOOKS/CUSTOM HOOKS
  const { isLoggedIn, user } = useAuth();
  const pathname = usePathname();

  // COMPONENT VARIABLES
  const dashboardLinks: DashboardItem[] = [
    { path: '/', label: '🏠 Home' },
    { path: '/dashboard', label: '🎛️ Dashboard' },
    { path: '/dashboard/create', label: '✨ Create' },
    { path: '/dashboard/join', label: '🎮 Join Game' },
    { path: '/dashboard/discover', label: '🧭 Discover' },
    { path: '/dashboard/library', label: '📚 My Quizzes' },
    // { path: '/dashboard/settings', label: '⚙️ Settings' },
    user?.account_type === 'admin' && {
      path: '/dashboard/admin',
      label: '🔑 Admin',
    },
  ].filter(Boolean) as DashboardItem[];

  const isLobbyPage = pathname.startsWith('/dashboard/lobby');

  // DEFINE PATHS WHERE SIDEBAR SHOULD BE HIDDEN
  const hideSidebar =
    pathname.startsWith('/dashboard/lobby') ||
    pathname.startsWith('/dashboard/quiz') ||
    !isLoggedIn;

  return (
    <WebSocketProvider>
      <SessionProvider>
        <QuizProvider>
          <AudioProvider>
            <div
              className={`bg-cover bg-center bg-no-repeat ${isLobbyPage ? 'bg-stub-background-lobby' : 'bg-stub-background-dashboard'} flex min-h-[calc(100vh-4rem)] text-black caret-transparent`}
            >
              {!hideSidebar && <SideNavbar dashboardLinks={dashboardLinks} />}
              <div className='flex-1 p-6'>{children}</div>
            </div>
          </AudioProvider>
        </QuizProvider>
      </SessionProvider>
    </WebSocketProvider>
  );
}
