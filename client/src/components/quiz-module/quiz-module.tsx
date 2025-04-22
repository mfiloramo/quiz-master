'use client';

import { QuizModuleProps } from '@/types/Quiz.types';
import { motion } from 'framer-motion';

// DEFINE OPTION COLORS
const colorMap = ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500'];
const hoverMap = [
  'hover:bg-red-600',
  'hover:bg-blue-600',
  'hover:bg-yellow-500',
  'hover:bg-green-600',
];
const activeMap = [
  'active:bg-red-700',
  'active:bg-blue-700',
  'active:bg-yellow-600',
  'active:bg-green-700',
];

export default function QuizModule({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
}: QuizModuleProps) {
  return (
    // MAIN CONTAINER
    <div className='flex w-full max-w-3xl flex-col items-center rounded-xl bg-white p-6 shadow-2xl'>
      {/* QUESTION HEADER */}
      <h2 className='mb-2 text-xl font-bold text-gray-700'>
        QUESTION {questionNumber} / {totalQuestions}
      </h2>

      {/* MAIN QUESTION BOX */}
      <div className='mb-8 w-full rounded-lg bg-sky-100 p-6 text-center text-2xl font-bold text-black shadow-md'>
        {question.question}
      </div>

      {/* OPTIONS GRID */}
      <div className='grid w-full grid-cols-2 gap-3'>
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.001 }}
            onClick={() => onSubmit(option)}
            className={`rounded-lg py-6 text-lg font-bold text-white shadow-md transition-all duration-200 ${colorMap[index % colorMap.length]} ${hoverMap[index % hoverMap.length]} ${activeMap[index % activeMap.length]} `}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
