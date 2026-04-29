'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import { Quiz } from '@/types/Quiz.types';
import { useQuiz } from '@/contexts/QuizContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import MainQuizCard from '@/components/QuizCard/QuizCard';
import axiosInstance from '@/utils/axios';
import ActionButton from '@/components/ActionButton/ActionButton';

export default function DiscoverPage(): ReactElement {
  // STATE FOR ALL QUIZZES
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // CONTEXT HOOKS/CUSTOM HOOKS
  const { selectedQuiz, setSelectedQuiz } = useQuiz();
  const { toastError } = useToast();
  const router = useRouter();

  // FETCH ALL QUIZZES ON LOAD
  useEffect(() => {
    setSelectedQuiz(null);

    const fetchAllQuizzes = async () => {
      try {
        const { data } = await axiosInstance.get<Quiz[]>('/quizzes');
        setQuizzes(data);
      } catch (error: any) {
        // LOG/TOAST ERROR IF FETCH FAILS
        const errorMsg: string = `Error fetching quizzes: ${error}`;
        toastError(errorMsg);
        console.error(error);
      }
    };

    fetchAllQuizzes().then((response: any): void => response);
  }, [setSelectedQuiz]);

  // HANDLE SELECTING A QUIZ
  const handleSelectQuiz = (quiz: Quiz) => {
    quiz.id === selectedQuiz?.id ? setSelectedQuiz(null) : setSelectedQuiz(quiz);
    return;
  };

  // NAVIGATE TO PLAY PAGE
  const navToPlayQuiz = () => {
    if (!selectedQuiz) {
      toastError('Please select a quiz to start');
      return;
    }
    router.push('/dashboard/host');
  };

  // RENDER PAGE
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
      <ActionButton color={'green'} text={'HOST QUIZ'} handlerFn={navToPlayQuiz} />
    </div>
  );
}
