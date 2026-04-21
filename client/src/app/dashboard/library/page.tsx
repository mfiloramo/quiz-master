'use client';

// CORE MODULES
import React, { ReactElement, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// CONTEXT HOOK/CUSTOM HOOKS
import { useQuiz } from '@/contexts/QuizContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

// COMPONENTS
import MainQuizCard from '@/components/QuizCard/QuizCard';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

// UTILITIES
import axiosInstance from '@/utils/axios';

// TYPES
import { Quiz } from '@/types/Quiz.types';
import ActionButton from '@/components/ActionButton/ActionButton';
import { AccessibilityIcon } from 'lucide-react';

export default function LibraryPage(): ReactElement {
  // STATE HOOKS
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // CONTEXT HOOKS/CUSTOM HOOKS
  const { user } = useAuth();
  const { selectedQuiz, setSelectedQuiz } = useQuiz();
  const { toastSuccess, toastError } = useToast();

  // CONTEXT HOOKS/CUSTOM HOOKS
  const router = useRouter();

  // FETCH QUIZZES ON LOAD
  // IMPORTANT: EFFECT DEPENDS ON user.id SO IT RE-RUNS AFTER AUTH POPULATES
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // WAIT UNTIL USER IS AVAILABLE FROM AUTH PROVIDER
    if (!user?.id) return;

    setSelectedQuiz(null);

    const fetchQuizzes = async (): Promise<void> => {
      try {
        const { data } = await axiosInstance.get<Quiz[]>(`/quizzes/user/${user.id}`);
        setQuizzes(data);
      } catch (error: any) {
        const errorMsg: string = `Error fetching quizzes: ${error}`;
        toastError(errorMsg);
        console.error(error);
      }
    };

    fetchQuizzes().then((response: any): void => response);
  }, [user?.id, router, setSelectedQuiz, toastError]);

  // HANDLE SELECTING A QUIZ
  const handleSelectQuiz = (quiz: Quiz): void => {
    setSelectedQuiz(quiz);
  };

  // HANDLE DELETING A QUIZ FROM UI AFTER DELETE
  const handleDeleteQuiz = async (): Promise<void> => {
    if (!selectedQuiz) {
      toastError('Please select a quiz to delete');
      return;
    }

    const quizId = selectedQuiz?.id;
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
    await axiosInstance
      .delete(`/quizzes/${quizId}`)
      .then(() => toastSuccess(`Quiz deleted successfully`));
  };

  // NAVIGATE TO HOST PAGE
  const navToHostQuiz = (): void => {
    if (!selectedQuiz) {
      toastError('Please select a quiz to host');
      return;
    }

    console.log(selectedQuiz);

    // if (selectedQuiz.questions === 0) {
    //   toastError('Quiz does not yet have questions. Please add at least 1 question to host quiz.');
    //   return;
    // }
    router.push('/dashboard/host');
  };

  // NAVIGATE TO EDIT PAGE
  const navToEdit = (): void => {
    if (!selectedQuiz || !user || selectedQuiz.user_id !== user.id) {
      toastError('Please select a quiz to edit');
      return;
    }
    router.push('/dashboard/edit');
  };

  // SHOW LOADING STATE WHILE USER IS BEING RESOLVED
  // TODO: ADD NOT OPERATOR TO user (DEBUG)
  if (!user) {
    return <LoadingSpinner color={'#ffffff'} loadingMessage={'Loading your quizzes...'} />;
  }

  // RENDER PAGE
  return (
    // MAIN CONTAINER
    <div className='flex flex-col items-center md:items-start'>
      {/* QUIZ LIST */}
      <div className='flex flex-col'>
        {quizzes.map((quiz) => (
          <MainQuizCard
            key={quiz.id}
            quiz={quiz}
            selected={selectedQuiz?.id === quiz.id}
            onSelect={handleSelectQuiz}
          />
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className='mt-8 flex gap-4'>
        {/* HOST QUIZ BUTTON */}
        <ActionButton color={'green'} text={'HOST QUIZ'} handlerFn={navToHostQuiz} />

        {/* EDIT QUIZ BUTTON */}
        <ActionButton color={'amber'} text={'EDIT QUIZ'} handlerFn={navToEdit} />

        {/* DELETE QUIZ BUTTON */}
        <ActionButton color={'red'} text={'DELETE QUIZ'} handlerFn={handleSelectQuiz} />
      </div>
    </div>
  );
}
