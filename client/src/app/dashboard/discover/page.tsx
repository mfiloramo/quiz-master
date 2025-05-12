'use client';

import { ReactElement, useEffect, useState } from 'react';
import { Quiz } from '@/types/Quiz.types';
import { useQuiz } from '@/contexts/QuizContext';
import MainQuizCard from '@/components/quiz-card/quiz-card';
import { useRouter } from 'next/navigation';

export default function DiscoverPage(): ReactElement {
  // STATE FOR ALL QUIZZES
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // CONTEXT HOOKS
  const { selectedQuiz, setSelectedQuiz } = useQuiz();
  const router: any = useRouter();

  // FETCH ALL QUIZZES ON LOAD
  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        const response = await fetch(`http://localhost:3030/api/quizzes/`);
        const json = await response.json();
        setQuizzes(json);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      }
    };

    fetchAllQuizzes().then((r) => r);
  }, []);

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
    router.push('/dashboard/quiz');
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
              onDelete={() => {}}
            />
          ) : null
        )}
      </div>
      {/* ACTION BUTTONS */}
      <div className='mt-8 flex gap-4'>
        <button
          className='h-16 w-40 rounded-lg bg-green-500 font-bold text-white hover:bg-green-400'
          onClick={navToPlayQuiz}
        >
          HOST QUIZ
        </button>
      </div>
    </div>
  );
}
