'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quiz } from '@/types/Quiz.types';
import { useQuiz } from '@/contexts/QuizContext';

export default function LibraryPage(): ReactElement {
  // COMPONENT STATE
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // QUIZ CONTEXT
  const { selectedQuiz, setSelectedQuiz } = useQuiz();

  // ROUTER INSTANCE
  const router = useRouter();

  // FETCH ALL USER QUIZZES ON LOAD
  useEffect(() => {
    const fetchQuizzes = async () => {
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
    <div className='flex flex-col items-center'>
      {/* QUIZ BUTTONS ROW */}
      <div className='flex justify-center'>
        {quizzes.map((quiz: Quiz) => (
          <button
            key={quiz.id}
            className={`m-4 h-24 w-48 rounded-lg px-4 shadow-xl transition ${
              selectedQuiz?.id === quiz.id
                ? 'bg-blue-500 text-white'
                : 'bg-amber-300 hover:bg-amber-200 active:bg-amber-400'
            }`}
            onClick={() => handleSelectQuiz(quiz)}
          >
            {quiz.title}
          </button>
        ))}
      </div>

      {/* START GAME BUTTON */}
      <button
        className='m-4 h-24 w-48 rounded-lg bg-green-500 px-4 font-bold text-white shadow-xl transition hover:bg-green-400 active:bg-green-600'
        onClick={navToQuiz}
      >
        START GAME
      </button>
    </div>
  );
}
