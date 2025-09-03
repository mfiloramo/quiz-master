'use client';

import React from 'react';
import { Trash2, Pencil } from 'lucide-react';

// REQUIRE STRONGLY-TYPED PROPS FOR THIS UI ROW (AVOID OPTIONALS HERE)
type QuestionListingStrongProps = {
  id: number | string;
  question: string;
  options: string[];
  correct: string;
  index?: number;
  onEditAction: () => void;
  onDeleteAction: (id: number | string) => void;
};

export default function QuestionListing({
  id,
  question,
  options,
  correct,
  index,
  onDeleteAction,
  onEditAction,
}: QuestionListingStrongProps) {
  // RENDER COMPONENT
  return (
    <div className='mb-4 max-w-3xl rounded-lg border border-gray-300 bg-white p-4 shadow-md'>
      <div className='mb-2 flex justify-between'>
        <span className='font-semibold'>
          Q{(index ?? 0) + 1}: {question}
        </span>
        <div className='flex gap-2'>
          <Pencil className='cursor-pointer text-blue-500' onClick={onEditAction} />
          {/* PASS ID DIRECTLY */}
          <Trash2 className='cursor-pointer text-red-500' onClick={() => onDeleteAction(id)} />
        </div>
      </div>

      <ul className='list-disc pl-5 text-gray-700'>
        {options.map((option, idx) => (
          <li key={idx} className={option === correct ? 'font-bold text-green-600' : ''}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
