'use client';

import { ReactElement, useEffect, useState } from 'react';
import { Quiz } from '@/types/Quiz.types';
import { useQuiz } from '@/contexts/QuizContext';
import { useRouter } from 'next/navigation';
import MainQuizCard from '@/components/QuizCard/QuizCard';
import axiosInstance from '@/utils/axios';

export default function DiscoverPage(): ReactElement {
  // STATE FOR ALL QUIZZES
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // CONTEXT HOOKS
  const { selectedQuiz, setSelectedQuiz } = useQuiz();
  const router: any = useRouter();

  // FETCH ALL QUIZZES ON LOAD
  useEffect(() => {
    setSelectedQuiz(null);

    const fetchAllQuizzes = async () => {
      try {
        const { data } = await axiosInstance.get<Quiz[]>('/quizzes');
        setQuizzes(data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      }
    };

    fetchAllQuizzes();
  }, [setSelectedQuiz]);

  // HANDLE SELECTING A QUIZ
  const handleSelectQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
  };

  // NAVIGATE TO PLAY PAGE
  const navToPlayQuiz = () => {
    if (!selectedQuiz) {
      alert('Please select a quiz to start!');
      return;
    }
    router.push('/dashboard/host');
  };

  return (
    <div className='flex flex-col items-start'>
      {/* QUIZ LIST */}
      <div className='flex flex-col items-start'>
        {quizzes.map((quiz) =>
          quiz.visibility === 'public' ? (
            <MainQuizCard
              key={quiz.id}
              quiz={quiz}
              selected={selectedQuiz?.id === quiz.id}
              onSelect={handleSelectQuiz}
            />
          ) : null
        )}
      </div>
      {/* ACTION BUTTONS */}
      <div className='mt-8 flex gap-4'>
        <button
          className='h-16 w-40 rounded-lg bg-green-500 font-bold text-white transition hover:bg-green-400'
          onClick={navToPlayQuiz}
        >
          HOST QUIZ
        </button>
      </div>
    </div>
  );
}
