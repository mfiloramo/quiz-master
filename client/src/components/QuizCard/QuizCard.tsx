'use client';

import React, { ReactElement } from 'react';
import { Trash2 } from 'lucide-react';
import { QuizCardProps } from '@/types/Quiz.types';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function MainQuizCard({
  quiz,
  selected,
  onSelect,
  onDelete,
}: QuizCardProps): ReactElement {
  const pathname: string = usePathname();

  // DELETE SELECTED QUIZ
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // PREVENT onSelect WHEN CLICKING DELETE

    try {
      const response = await fetch(`http://localhost:3030/api/quizzes/${quiz.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ?? '',
        },
      });

      if (!response.ok) throw new Error('Failed to delete quiz');

      // TRIGGER PARENT STATE UPDATE
      onDelete(quiz.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // QUIZ CARD CONTAINER
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.001 }}
      onClick={() => onSelect(quiz)}
      className={`mb-4 w-[85vw] max-w-[650px] cursor-pointer rounded-lg p-4 shadow-md transition md:w-[65vw] ${
        selected ? 'bg-sky-300/75' : 'bg-white/75 hover:bg-cyan-100/75'
      }`}
    >
      {/* HEADER (TITLE + ICONS) */}
      <div className='mb-2 flex w-full items-center justify-between'>
        <span className='font-semibold'>{quiz.title}</span>
        <div className='flex gap-2'>
          {!pathname.includes('discover') ? (
            <Trash2 className='cursor-pointer text-red-500' onClick={handleDelete} />
          ) : null}
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className={`${selected} ? 'text-white' : 'text-black'`}>{quiz.description}</p>
    </motion.div>
  );
}
