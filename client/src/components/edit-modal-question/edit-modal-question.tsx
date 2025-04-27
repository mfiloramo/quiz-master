'use client';

import React, { ReactElement, useState } from 'react';
import { QuestionListingType } from '@/types/QuestionListing.type';

type EditModalProps = {
  question: QuestionListingType;
  onClose: () => void;
  onSave: (updatedQuestion: QuestionListingType) => void;
};

export default function EditModalQuestion({
  question,
  onClose,
  onSave,
}: EditModalProps): ReactElement {
  // LOCAL STATE FOR QUESTION EDITING
  const [editedQuestion, setEditedQuestion] = useState<string>(question.question);
  const [editedOptions, setEditedOptions] = useState<string[]>([...question.options]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(question.correct);

  // HANDLE SAVE
  const handleSave = async () => {
    try {
      const payload = {
        questionId: question.id, // CORRECT ID
        question: editedQuestion, // FROM LOCAL STATE
        options: JSON.stringify(editedOptions), // STRINGIFY ARRAY
        correct: editedOptions[correctAnswerIndex], // CORRECT ANSWER AS TEXT, not index
      };

      const response = await fetch(`http://localhost:3030/api/questions/${question.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      console.log(`Question ${question.id} updated successfully`);

      // UPDATE PARENT LIST AFTER SAVE
      onSave({
        ...question,
        question: editedQuestion,
        options: editedOptions,
        correct: correctAnswerIndex,
      });

      onClose(); // CLOSE MODAL
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  // RENDER MODAL
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='w-full max-w-lg rounded-lg bg-white p-6 shadow-lg'>
        {/* TITLE */}
        <h2 className='mb-4 text-2xl font-bold'>Edit Question</h2>

        {/* QUESTION INPUT */}
        <input
          type='text'
          value={editedQuestion}
          onChange={(e) => setEditedQuestion(e.target.value)}
          className='mb-6 w-full rounded border p-3 text-black'
          placeholder='Enter your question'
        />

        {/* OPTIONS INPUTS */}
        <div className='mb-6 grid grid-cols-2 gap-4'>
          {editedOptions.map((option, idx) => (
            <input
              key={idx}
              type='text'
              value={option}
              onChange={(e) => {
                const updatedOptions = [...editedOptions];
                updatedOptions[idx] = e.target.value;
                setEditedOptions(updatedOptions);
              }}
              className={`rounded p-3 ${
                idx === 0
                  ? 'bg-red-500'
                  : idx === 1
                    ? 'bg-blue-500'
                    : idx === 2
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
              }`}
              placeholder={`Option ${idx + 1}`}
            />
          ))}
        </div>

        {/* CORRECT ANSWER SELECT */}
        <div className='mb-6'>
          <label className='mb-2 block font-bold'>Correct Answer</label>
          <select
            value={correctAnswerIndex}
            onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
            className='w-full rounded border p-2'
          >
            {editedOptions.map((option, idx) => (
              <option key={idx} value={idx}>
                {option ? option : `Option ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>

        {/* ACTION BUTTONS */}
        <div className='flex justify-end gap-2'>
          <button onClick={onClose} className='rounded bg-gray-500 px-4 py-2 text-white'>
            Cancel
          </button>
          <button onClick={handleSave} className='rounded bg-blue-600 px-4 py-2 text-white'>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
