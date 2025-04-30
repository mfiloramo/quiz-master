'use client';

import React, { ReactElement } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { QuizCardProps } from '@/types/Quiz.types';
import { usePathname } from 'next/navigation';

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
        selected ? 'bg-sky-300' : 'bg-white hover:bg-cyan-100'
      }`}
    >
      {/* HEADER (TITLE + ICONS) */}
      <div className='mb-2 flex w-[70vw] max-w-2xl items-center justify-between'>
        <span className='font-semibold'>{quiz.title}</span>
        <div className='flex gap-2'>
          {!pathname.includes('discover') ? (
            <Trash2 className='cursor-pointer text-red-500' onClick={handleDelete} />
          ) : null}
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className={`${selected} ? 'text-white' : 'text-black'`}>{quiz.description}</p>
    </div>
  );
}
