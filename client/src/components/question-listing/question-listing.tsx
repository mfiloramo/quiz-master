'use client';

import React, { ReactElement } from 'react';
import { QuestionListingType } from '@/types/QuestionListing.type';
import { Trash2, Pencil } from 'lucide-react';

export default function QuestionListing({
  id,
  question,
  options,
  correct,
  index,
  onDelete,
}: QuestionListingType & { index: number; onDelete: () => void }) {
  // EDIT SELECTED QUESTION
  const handleEdit = async (): Promise<void> => {
    console.log('Edit Coming Soon!');
  };

  // DELETE SELECTED QUESTION
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3030/api/questions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete question');

      // TRIGGER PARENT STATE UPDATE
      onDelete();
    } catch (err) {
      console.error(err);
    }
  };

  // RENDER COMPONENT
  return (
    // QUESTION LISTING CARD
    <div className='mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-md'>
      {/* QUESTION HEADER */}
      <div className='mb-2 flex justify-between'>
        <span className='font-semibold'>
          Q{index + 1}: {question}
        </span>
        <div className='flex gap-2'>
          <Pencil className='cursor-pointer text-blue-500' onClick={handleEdit} />
          <Trash2 className='cursor-pointer text-red-500' onClick={handleDelete} />
        </div>
      </div>

      {/* OPTIONS DISPLAY */}
      {/*<ul className='list-disc pl-5 text-gray-700'>*/}
      {/*  {options.map((option, idx) => {*/}
      {/*    const isCorrect = idx === correct;*/}
      {/*    return (*/}
      {/*      <li key={idx} className={isCorrect ? 'font-bold text-green-600' : ''}>*/}
      {/*        {option}*/}
      {/*      </li>*/}
      {/*    );*/}
      {/*  })}*/}
      {/*</ul>*/}
    </div>
  );
}
