'use client';

import { JSX, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import DashboardCard from '@/components/DashboardCard/DashboardCard';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardCardType } from '@/types/DashboardCard.type';
import { NavLinkType } from '@/types/NavLink.type';

export default function DashboardHome(): JSX.Element {
  const router = useRouter();
  const { resetQuiz } = useQuiz();
  const { user, setIsHost } = useAuth();

  const DashboardCards: DashboardCardType[] = [
    {
      label: '🎮 Join Game',
      href: '/dashboard/join',
      description: 'Join a game someone is hosting.',
    },
    {
      label: '✨ Create Quiz',
      href: '/dashboard/create',
      description: 'Create a new quiz and test your friends.',
    },
    {
      label: '🧭 Discover',
      href: '/dashboard/discover',
      description: 'Find new quizzes curated just for you.',
    },
    {
      label: '📚 My Quizzes',
      href: '/dashboard/library',
      description: 'Access all your saved and created quizzes.',
    },
    {
      label: '⚙️ Settings',
      href: '/dashboard/settings',
      description: 'Manage your profile and preferences.',
    },
    user?.account_type === 'admin' && {
      label: '🔑 Admin',
      href: '/dashboard/admin',
      description: 'Manage admin controls across application.',
    },
  ].filter(Boolean) as DashboardCardType[];

  // CHECK IF USER IS LOGGED IN
  useEffect(() => {
    setIsHost(false);
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/auth/login');
    } else {
      try {
        const decoded = jwtDecode(token);
      } catch (err) {
        console.error('Invalid token:', err);
        router.push('/auth/login');
      }
    }

    resetQuiz(); // CLEAR STALE QUIZ WHEN RETURNING TO DASHBOARD
  }, [router]);

  // RENDER PAGE
  return (
    <div className='flex w-fit flex-col gap-6'>
      <h1 className='text-4xl font-bold text-sky-950'>Welcome to Your Dashboard</h1>
      <p className='max-w-2xl rounded-xl bg-sky-50/50 p-5 text-lg text-slate-950'>
        Use the sidebar to navigate through your dashboard features like discovering new quizzes,
        managing your library, or adjusting settings.
      </p>
      <ul className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3'>
        {DashboardCards.map((card: DashboardCardType, index: number) => (
          <DashboardCard
            key={index}
            label={card.label}
            description={card.description}
            href={card.href}
          />
        ))}
      </ul>
    </div>
  );
}
