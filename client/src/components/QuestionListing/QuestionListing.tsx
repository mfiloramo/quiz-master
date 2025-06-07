'use client';

import React from 'react';
import { QuestionListingType } from '@/types/QuestionListing.type';
import { Trash2, Pencil } from 'lucide-react';

export default function QuestionListing({
  id,
  question,
  options,
  correct,
  index,
  onDelete,
  onEdit,
}: QuestionListingType) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3030/api/questions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to delete question');
      onDelete!();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='mb-4 max-w-3xl rounded-lg border border-gray-300 bg-white p-4 shadow-md'>
      <div className='mb-2 flex justify-between'>
        <span className='font-semibold'>
          Q{index! + 1}: {question}
        </span>
        <div className='flex gap-2'>
          <Pencil className='cursor-pointer text-blue-500' onClick={onEdit} />
          <Trash2 className='cursor-pointer text-red-500' onClick={handleDelete} />
        </div>
      </div>

      <ul className='list-disc pl-5 text-gray-700'>
        {options.map((option, idx) => {
          const isCorrect = option === correct;
          return (
            <li key={idx} className={isCorrect ? 'font-bold text-green-600' : ''}>
              {option}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
