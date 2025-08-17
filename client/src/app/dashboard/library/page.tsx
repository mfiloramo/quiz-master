'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { useAuth } from '@/contexts/AuthContext';
import { Quiz } from '@/types/Quiz.types';
import { motion } from 'framer-motion';
import MainQuizCard from '@/components/QuizCard/QuizCard';
import axiosInstance from '@/utils/axios';
import { useToast } from '@/contexts/ToastContext';

export default function LibraryPage(): ReactElement {
  // STATE HOOKS
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // CONTEXT HOOKS
  const { user } = useAuth();
  const { selectedQuiz, setSelectedQuiz } = useQuiz();
  const { toastSuccess, toastError } = useToast();

  // CUSTOM HOOKS
  const router = useRouter();

  // FETCH QUIZZES ON LOAD
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (!user?.id) return;

    setSelectedQuiz(null);

    const fetchQuizzes = async (): Promise<void> => {
      try {
        const { data } = await axiosInstance.get<Quiz[]>(`/quizzes/user/${user.id}`);
        setQuizzes(data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      }
    };

    fetchQuizzes().then((response: any) => response);
  }, [user!.id, router]);

  // HANDLE SELECTING A QUIZ
  const handleSelectQuiz = (quiz: Quiz): void => {
    setSelectedQuiz(quiz);
  };

  // HANDLE DELETING A QUIZ FROM UI AFTER DELETE
  const handleDeleteQuiz = async (): Promise<void> => {
    if (!selectedQuiz) {
      toastError('Please select a quiz to start!');
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
      toastError('Please select a quiz to start!');
      return;
    }
    router.push('/dashboard/host');
  };

  // NAVIGATE TO EDIT PAGE
  const navToEdit = (): void => {
    if (!selectedQuiz || selectedQuiz.user_id !== user!.id) {
      toastError('Please select a quiz to start!');
      return;
    }
    router.push('/dashboard/edit');
  };

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
        <motion.button
          className='w-sm sm:w-2xl h-16 rounded-lg bg-green-500 px-7 font-bold text-white transition hover:bg-green-400 active:bg-green-500'
          onClick={navToHostQuiz}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.005 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          HOST QUIZ
        </motion.button>

        {/* EDIT QUIZ BUTTON */}
        <motion.button
          className='w-sm sm:w-2xl h-16 rounded-lg bg-amber-500 px-7 font-bold text-white transition hover:bg-amber-400 active:bg-amber-500'
          onClick={navToEdit}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.005 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          EDIT QUIZ
        </motion.button>

        {/* DELETE QUIZ BUTTON */}
        <motion.button
          className='w-sm sm:w-2xl h-16 rounded-lg bg-red-600 px-7 font-bold text-white transition hover:bg-red-500 active:bg-red-600'
          onClick={handleDeleteQuiz}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.005 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          DELETE QUIZ
        </motion.button>
      </div>
    </div>
  );
}
