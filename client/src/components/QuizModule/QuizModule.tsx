'use client';

import { useState } from 'react';
import { QuizModuleProps } from '@/types/Quiz.types';
import { motion } from 'framer-motion';
import { useQuiz } from '@/contexts/QuizContext';
// import { PacmanLoader } from 'react-spinners';

const colorMap = ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500'];

export default function QuizModule({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
}: QuizModuleProps) {
  // LOCAL STATE
  const [selected, setSelected] = useState<string | null>(null);

  // CUSTOM HOOKS
  const { lockedIn, setLockedIn } = useQuiz();

  // HANDLER FUNCTIONS
  const handleClick = (option: string): void => {
    if (lockedIn) return;
    setSelected(option);
    setLockedIn(true);
    onSubmit(option);
  };

  // RENDER COMPONENTS
  return (
    <div className='flex w-full max-w-3xl flex-col items-center rounded-xl bg-white p-6 shadow-2xl'>
      <h2 className='mb-2 text-xl font-bold text-gray-700'>
        Question {questionNumber} / {totalQuestions}
      </h2>
      <div className='mb-8 w-full rounded-lg bg-sky-100 p-6 text-center text-2xl font-bold text-black shadow-md'>
        {question.question}
      </div>
      <div className='grid w-full grid-cols-2 gap-3'>
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: lockedIn ? 1 : 1.03 }}
            whileTap={{ scale: lockedIn ? 1 : 0.97 }}
            transition={{ duration: 0.001 }}
            onClick={() => handleClick(option)}
            disabled={lockedIn}
            className={`cursor-pointer rounded-lg py-6 text-lg font-bold text-white shadow-md transition-all duration-200 ${colorMap[index % colorMap.length]} ${
              selected === option ? 'ring-4 ring-black' : ''
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
      {lockedIn && (
        <>
          <p className='mt-4 font-semibold text-green-700'>
            Answer submitted. Waiting for other players to answer...
          </p>
          {/*<PacmanLoader*/}
          {/*  color={'96FFFFFF'}*/}
          {/*  loading={lockedIn}*/}
          {/*  size={150}*/}
          {/*  aria-label='Loading Spinner'*/}
          {/*  data-testid='loader'*/}
          {/*/>*/}
        </>
      )}
    </div>
  );
}
