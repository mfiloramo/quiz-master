'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { useAuth } from '@/contexts/AuthContext';
import { Quiz } from '@/types/Quiz.types';
import { motion } from 'framer-motion';
import MainQuizCard from '@/components/QuizCard/QuizCard';
import axiosInstance from '@/utils/axios';

export default function LibraryPage(): ReactElement {
  // STATE FOR ALL QUIZZES
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // CONTEXT HOOKS
  const { user } = useAuth();
  const { selectedQuiz, setSelectedQuiz } = useQuiz();

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

    const fetchQuizzes = async () => {
      try {
        const { data } = await axiosInstance.get<Quiz[]>(`/quizzes/user/${user.id}`);
        setQuizzes(data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      }
    };

    fetchQuizzes().then((response: any) => response);
  }, [user?.id, router]);

  // HANDLE SELECTING A QUIZ
  const handleSelectQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
  };

  // HANDLE DELETING A QUIZ FROM UI AFTER DELETE
  const handleDeleteQuiz = (quizId: number) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
  };

  // NAVIGATE TO HOST PAGE
  const navToHostQuiz = () => {
    if (!selectedQuiz) {
      alert('Please select a quiz to start!');
      return;
    }
    router.push('/dashboard/host');
  };

  // NAVIGATE TO EDIT PAGE
  const navToEdit = () => {
    if (!selectedQuiz || selectedQuiz.user_id !== user!.id) {
      alert('Please select a quiz to start!');
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
            onDelete={handleDeleteQuiz}
          />
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className='mt-8 flex gap-4'>
        <motion.button
          className='h-16 w-40 rounded-lg bg-green-500 font-bold text-white transition hover:bg-green-400 active:bg-green-500'
          onClick={navToHostQuiz}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.005 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          HOST QUIZ
        </motion.button>
        <motion.button
          className='h-16 w-40 rounded-lg bg-amber-500 font-bold text-white transition hover:bg-amber-400 active:bg-amber-500'
          onClick={navToEdit}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.005 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          EDIT QUIZ
        </motion.button>
      </div>
    </div>
  );
}
