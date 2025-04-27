'use client';

import React, { ReactElement } from 'react';
import { Quiz } from '@/types/Quiz.types';
import { Pencil, Trash2 } from 'lucide-react';

type Props = {
  quiz: Quiz;
  selected: boolean;
  onSelect: (quiz: Quiz) => void;
  onDelete: (quizId: number) => void;
};

export default function MainQuizCard({ quiz, selected, onSelect, onDelete }: Props): ReactElement {
  // DELETE SELECTED QUIZ
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // PREVENT onSelect WHEN CLICKING DELETE

    try {
      const response = await fetch(`http://localhost:3030/api/quizzes/${quiz.id}`, {
        method: 'DELETE',
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
    <div
      onClick={() => onSelect(quiz)}
      className={`mb-4 cursor-pointer rounded-lg p-4 shadow-md transition ${
        selected ? 'bg-blue-500 text-white' : 'bg-white hover:bg-cyan-100'
      }`}
    >
      {/* HEADER (TITLE + ICONS) */}
      <div className='min-w-lg mb-2 flex w-[40vw] max-w-xl items-center justify-between'>
        <span className='font-semibold'>{quiz.title}</span>
        <div className='flex gap-2'>
          <Pencil
            className='cursor-pointer text-blue-500'
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit modal coming soon!');
            }}
          />
          <Trash2 className='cursor-pointer text-red-500' onClick={handleDelete} />
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className={`${selected} ? 'text-white' : 'text-black'`}>{quiz.description}</p>
    </div>
  );
}
