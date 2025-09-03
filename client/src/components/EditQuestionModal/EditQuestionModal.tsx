'use client';

import React, { ReactElement, useState } from 'react';
import { EditModalProps } from '@/types/QuestionListingProps';
import { QuizQuestion } from '@/types/Quiz.types';
import axiosInstance from '@/utils/axios';
import { useQuiz } from '@/contexts/QuizContext';

// MAKE QUESTION REQUIRED FOR THIS COMPONENT (DO NOT CHANGE GLOBAL TYPE)
type Props = Omit<EditModalProps, 'question'> & { question: QuizQuestion };

export default function EditQuestionModal({
  quizId,
  question,
  onCloseAction,
  onSaveAction,
  mode,
}: Props): ReactElement {
  // STATE HOOKS FOR QUESTION EDITING
  // QUESTION IS REQUIRED HERE; SAFE TO READ FIELDS
  const [editedQuestion, setEditedQuestion] = useState<string>(question.question);
  const [editedOptions, setEditedOptions] = useState<string[]>([...question.options]);

  // CONTEXT HOOKS/CUSTOM HOOKS
  const { selectedQuiz } = useQuiz();

  // TRACK QUESTIONS
  const initialIndex = question.options.findIndex((opt) => opt === question.correct);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(
    initialIndex !== -1 ? initialIndex : 0
  );

  // VALIDATE FORM
  const isFormValid =
    editedQuestion.trim() !== '' && editedOptions.every((opt) => opt.trim() !== '');

  // HANDLE SAVE (EDIT)
  const handleSave = async () => {
    try {
      const payload = {
        quizId: selectedQuiz?.id,
        questionId: question.id,
        question: editedQuestion,
        options: JSON.stringify(editedOptions),
        correct: editedOptions[correctAnswerIndex],
      };

      // SEND REQUEST TO UPDATE QUESTION
      await axiosInstance.put(`/questions/${question.id}`, payload);

      // UPDATE PARENT LISTING
      onSaveAction({
        ...question,
        question: editedQuestion,
        options: editedOptions,
        correct: editedOptions[correctAnswerIndex],
      });

      onCloseAction();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  // HANDLE ADD
  const handleAdd = async () => {
    try {
      const payload = {
        quizId: quizId,
        question: editedQuestion,
        options: JSON.stringify(editedOptions),
        correct: editedOptions[correctAnswerIndex],
      };

      const { data } = await axiosInstance.post(`questions/${quizId}`, payload);

      // PASS UP TO PARENT
      onSaveAction({
        id: data.id,
        question: data.question,
        options: JSON.parse(data.options),
        correct: data.correct,
      });

      onCloseAction();
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  // RENDER MODAL
  return (
    // MAIN CONTAINER BACKGROUND
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black'>
      {/* INNER CONTAINER */}
      <div className='mx-3 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg'>
        {/* TITLE */}
        <h2 className='mb-4 text-2xl font-bold'>
          {mode.charAt(0).toUpperCase() + mode.slice(1)} Question
        </h2>

        {/* QUESTION INPUT */}
        <input
          type='text'
          value={editedQuestion}
          onChange={(e) => setEditedQuestion(e.target.value)}
          className='mb-6 w-full rounded border p-3 text-black placeholder-zinc-700'
          placeholder='Enter your question'
        />

        {/* OPTIONS INPUTS */}
        <div className='mb-6 grid grid-cols-2 gap-4 text-white'>
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
              className={`rounded p-3 placeholder-slate-200 ${
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
            onChange={(e) => setCorrectAnswerIndex(parseInt(e.target.value))}
            className='w-full rounded border p-2'
          >
            {editedOptions.map((option, idx) => (
              <option key={idx} value={idx}>
                {option || `Option ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>

        {/* ACTION BUTTONS */}
        <div className='flex justify-end gap-2'>
          <button
            onClick={onCloseAction}
            className='rounded bg-slate-500 px-4 py-2 text-white transition ease-in-out hover:bg-slate-400 active:bg-slate-500'
          >
            Cancel
          </button>
          {mode === 'edit' && (
            <button
              onClick={handleSave}
              disabled={!isFormValid}
              className={`rounded px-4 py-2 text-white transition ease-in-out ${
                isFormValid
                  ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-600'
                  : 'cursor-not-allowed bg-blue-300'
              }`}
            >
              Save
            </button>
          )}
          {mode === 'add' && (
            <button
              onClick={handleAdd}
              disabled={!isFormValid}
              className={`rounded px-4 py-2 text-white transition ease-in-out ${
                isFormValid
                  ? 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-600'
                  : 'cursor-not-allowed bg-cyan-300'
              }`}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
