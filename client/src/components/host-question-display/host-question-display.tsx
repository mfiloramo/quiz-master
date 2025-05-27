import React, { JSX } from 'react';
import { motion } from 'framer-motion';

// TODO: EXTRACT TO EXPORTED TYPE
type Props = {
  question: string;
  options: string[];
  correctAnswer?: string;
  colorMap: string[];
};

export default function HostQuestionDisplay({
  question,
  options,
  correctAnswer,
  colorMap,
}: Props): JSX.Element {
  return (
    <div className='my-8 w-full max-w-3xl rounded-xl bg-slate-200 p-7 text-center text-5xl font-bold text-slate-900 shadow-xl'>
      <h2 className='mb-2 text-xl font-bold text-gray-700'>Question</h2>

      <div className='mb-8 w-full rounded-lg bg-sky-100 p-6 text-center text-2xl font-bold text-black shadow-md'>
        {question}
      </div>

      <div className='grid w-full grid-cols-2 gap-3'>
        {options.map((option, index) => {
          const isIncorrect = correctAnswer && option !== correctAnswer;

          return (
            <div
              key={index}
              className={`relative rounded-lg p-6 text-lg font-bold text-white shadow-md transition-all duration-500 ${colorMap[index % colorMap.length]}`}
            >
              {option}

              {/* SHADE IF INCORRECT */}
              {isIncorrect && (
                <motion.div
                  className='absolute inset-0 rounded-lg bg-gray-800'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
