'use client';

import React, { ReactElement, useState } from 'react';
import { EditModalProps } from '@/types/QuestionListing.type';

export default function EditModalQuestion({
  quizId,
  question,
  onClose,
  onSave,
  mode,
}: EditModalProps): ReactElement {
  // LOCAL STATE FOR QUESTION EDITING
  const [editedQuestion, setEditedQuestion] = useState<string>(question.question);
  const [editedOptions, setEditedOptions] = useState<string[]>([...question.options]);
  const [correctAnswer, setCorrectAnswer] = useState<any>(question.correct);

  // HANDLE SAVE
  const handleSave = async () => {
    try {
      const payload = {
        questionId: question.id,
        question: editedQuestion,
        options: JSON.stringify(editedOptions),
        correct: correctAnswer,
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

      // UPDATE PARENT LISTING
      onSave({
        ...question,
        question: editedQuestion,
        options: editedOptions,
        correct: correctAnswer,
      });

      onClose();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const payload = {
        quizId: quizId,
        question: editedQuestion,
        options: JSON.stringify(editedOptions),
        correct: correctAnswer,
      };

      const response = await fetch(`http://localhost:3030/api/questions/${quizId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to add question');
      }

      const newQuestion = await response.json();

      // PASS UP TO PARENT
      onSave({
        id: newQuestion.id,
        question: newQuestion.question,
        options: JSON.parse(newQuestion.options),
        correct: newQuestion.correct,
      });

      onClose();
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  // RENDER MODAL
  return (
    // MAIN CONTAINER
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black'>
      {/* INNER CONTENT CONTAINER */}
      <div className='w-full max-w-lg rounded-lg bg-white p-6 shadow-lg'>
        {/* TITLE */}
        <h2 className='mb-4 text-2xl font-bold'>Edit Question</h2>

        {/* QUESTION INPUT */}
        <input
          type='text'
          value={editedQuestion}
          onChange={(e) => setEditedQuestion(e.target.value)}
          className='mb-6 w-full rounded border p-3 text-black placeholder-zinc-700'
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
            value={correctAnswer}
            onChange={(e) => {
              setCorrectAnswer(e.target.value);
            }}
            className='w-full rounded border p-2'
          >
            {editedOptions.map((option, idx) => (
              <option key={idx} value={option}>
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
          {mode === 'edit' && (
            <button onClick={handleSave} className='rounded bg-blue-600 px-4 py-2 text-white'>
              Save
            </button>
          )}
          {mode === 'add' && (
            <button onClick={handleAdd} className='rounded bg-cyan-600 px-4 py-2 text-white'>
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
