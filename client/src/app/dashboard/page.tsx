'use client';

import { JSX, useEffect } from 'react';
import DashboardCard from '@/components/dashboard-card/dashboard-card';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { jwtDecode } from 'jwt-decode';

export default function DashboardHome(): JSX.Element {
  const router = useRouter();
  const { resetQuiz } = useQuiz();

  const DashboardCards = [
    {
      label: '🎮 Join Game',
      href: '/dashboard/join',
      description: 'Join a game someone is hosting.',
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
  ];

  // CHECK IF USER IS LOGGED IN
  useEffect(() => {
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
    <div className='flex flex-col gap-6'>
      <h1 className='text-4xl font-bold text-sky-950'>Welcome to Your Dashboard</h1>
      <p className='max-w-2xl text-lg text-slate-900'>
        Use the sidebar to navigate through your dashboard features like discovering new quizzes,
        managing your library, or adjusting settings.
      </p>
      <ul className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {DashboardCards.map((card, index) => (
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
