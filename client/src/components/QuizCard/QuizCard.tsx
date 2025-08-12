'use client';

import React, { ReactElement } from 'react';
import { QuizCardProps } from '@/types/Quiz.types';
import { motion } from 'framer-motion';

export default function MainQuizCard({ quiz, selected, onSelect }: QuizCardProps): ReactElement {
  return (
    // QUIZ CARD CONTAINER
    <motion.div
      key={quiz.id}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.001 }}
      onClick={() => onSelect(quiz)}
      className={`mb-4 w-[85vw] max-w-[650px] cursor-pointer rounded-lg p-4 shadow-md transition md:w-[65vw] ${
        selected ? 'bg-sky-300/75' : 'bg-white/75 hover:bg-cyan-100/75'
      }`}
    >
      {/* HEADER (TITLE) */}
      <div className='mb-2 flex w-full items-center justify-between'>
        <span className='font-semibold'>{quiz.title}</span>
      </div>

      {/* DESCRIPTION */}
      <p className={`${selected} ? 'text-white' : 'text-black'`}>{quiz.description}</p>
    </motion.div>
  );
}
