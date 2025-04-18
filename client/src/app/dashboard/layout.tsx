import SideNavbar from '@/components/side-navbar/side-navbar';
import { DashboardItem } from '@/types/DashboardItem.types';
import { QuizProvider } from '@/contexts/QuizContext';

const dashboardLinks: DashboardItem[] = [
  { path: '/', label: '🏠 Home' },
  { path: '/dashboard/discover', label: '🧭 Discover' },
  { path: '/dashboard/library', label: '📚 Library' },
  { path: '/dashboard/settings', label: '⚙️ Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuizProvider>
      <div className='flex min-h-[calc(100vh-4rem)] bg-gradient-to-b from-sky-300 to-sky-800 text-black caret-transparent'>
        <SideNavbar dashboardLinks={dashboardLinks} />
        <div className='flex-1 p-6'>{children}</div>
      </div>
    </QuizProvider>
  );
}
