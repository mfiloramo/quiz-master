'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { useAuth } from '@/contexts/AuthContext';
import { Quiz } from '@/types/Quiz.types';
import MainQuizCard from '@/components/quiz-card/quiz-card';

export default function LibraryPage(): ReactElement {
  // STATE FOR ALL QUIZZES
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // CONTEXT HOOKS
  const { user } = useAuth();
  const { selectedQuiz, setSelectedQuiz } = useQuiz();

  const router = useRouter();

  // FETCH QUIZZES ON LOAD
  useEffect(() => {
    if (!user?.id) return;

    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`http://localhost:3030/api/quizzes/user/${user.id}`);
        const json = await response.json();
        setQuizzes(json);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      }
    };

    fetchQuizzes();
  }, [user]);

  // HANDLE SELECTING A QUIZ
  const handleSelectQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
  };

  // HANDLE DELETING A QUIZ FROM UI AFTER DELETE
  const handleDeleteQuiz = (quizId: number) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
  };

  // NAVIGATE TO PLAY PAGE
  const navToQuiz = () => {
    if (!selectedQuiz) {
      alert('Please select a quiz to start!');
      return;
    }
    router.push('/dashboard/library/quiz');
  };

  // NAVIGATE TO EDIT PAGE
  const navToEdit = () => {
    if (!selectedQuiz) {
      alert('Please select a quiz to edit!');
      return;
    }
    router.push('/dashboard/edit');
  };

  return (
    <div className='flex flex-col items-start'>
      {/* QUIZ LIST */}
      <div className='flex flex-col items-start'>
        {quizzes.map((quiz) => (
          <MainQuizCard
            key={quiz.id}
            quiz={quiz}
            selected={selectedQuiz?.id === quiz.id}
            onSelect={handleSelectQuiz}
            onDelete={handleDeleteQuiz}
          />
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className='mt-8 flex gap-4'>
        <button
          className='h-16 w-40 rounded-lg bg-green-500 font-bold text-white hover:bg-green-400'
          onClick={navToQuiz}
        >
          START QUIZ
        </button>
        <button
          className='h-16 w-40 rounded-lg bg-amber-500 font-bold text-white hover:bg-amber-400'
          onClick={navToEdit}
        >
          EDIT QUIZ
        </button>
      </div>
    </div>
  );
}
