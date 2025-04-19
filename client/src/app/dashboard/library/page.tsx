'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { useAuth } from '@/contexts/AuthContext';
import { Quiz } from '@/types/Quiz.types';
import MainQuizCard from '@/components/quiz-card/quiz-card';

export default function LibraryPage(): ReactElement {
  // COMPONENT STATE
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // AUTH CONTEXT
  const { user } = useAuth();

  // QUIZ CONTEXT
  const { selectedQuiz, setSelectedQuiz } = useQuiz();

  // ROUTER INSTANCE
  const router = useRouter();

  // FETCH ALL USER QUIZZES ON LOAD
  useEffect(() => {
    const fetchQuizzes = async () => {
      // TODO: UPDATE ENDPOINT TO REFLECT USER BASED ON AUTHCONTEXT
      const response = await fetch('http://localhost:3030/api/quizzes');
      const json = await response.json();
      setQuizzes(json);
    };

    fetchQuizzes();
  }, []);

  // HANDLE QUIZ SELECTION TO CONTEXT
  const handleSelectQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
  };

  // NAVIGATE TO QUIZ GAME PAGE
  const navToQuiz = () => {
    if (!selectedQuiz) {
      alert('Please select a quiz to start!');
      return;
    }

    router.push('/dashboard/library/quiz');
  };

  // RENDER COMPONENT
  return (
    <>
      {/* QUIZ CARD LIST */}
      <div className='flex flex-col items-start'>
        {quizzes.map((quiz) => (
          <MainQuizCard
            key={quiz.id}
            quiz={quiz}
            onSelect={handleSelectQuiz}
            selected={selectedQuiz?.id === quiz.id}
          />
        ))}
      </div>

      {/* START GAME BUTTON */}
      <button
        className='m-4 h-24 w-48 rounded-lg bg-green-500 px-4 font-bold text-white shadow-xl transition hover:bg-green-400 active:bg-green-600'
        onClick={navToQuiz}
      >
        START GAME
      </button>
    </>
  );
}
