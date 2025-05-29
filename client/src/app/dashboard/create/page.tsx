'use client';

import React, { ReactElement, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import { motion } from 'framer-motion';

export default function CreateQuiz(): ReactElement {
  // FORM STATE
  const [form, setForm] = useState({ title: '', description: '', visibility: 'public' });
  const [checked, setChecked] = useState<boolean>(false);

  // ROUTER INSTANCE
  const router = useRouter();

  // CONTEXT HOOKS
  const { user } = useAuth();
  const { setSelectedQuiz } = useQuiz();

  // HANDLE FORM SUBMISSION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3030/api/quizzes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user!.id,
          username: user!.username,
          title: form.title,
          description: form.description,
          visibility: checked ? 'private' : 'public',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      // IMMEDIATELY FETCH FULL QUIZ DATA
      const quizResponse = await fetch(`http://localhost:3030/api/quizzes/${data.newQuizId}`);
      const newQuiz = await quizResponse.json();

      if (!quizResponse.ok) {
        throw new Error('Failed to fetch new quiz');
      }

      // SAVE FULL QUIZ INTO CONTEXT
      setSelectedQuiz(newQuiz);

      // REDIRECT TO EDIT PAGE
      router.push('/dashboard/edit');
    } catch (error: any) {
      console.error('Quiz creation failed:', error);
    }
  };

  // HANDLE INPUT CHANGES
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    setForm({ ...form, visibility: isChecked ? 'public' : 'private' });
  };

  // RENDER PAGE
  return (
    // MAIN CONTAINER
    <div className='m-3 flex flex-col items-start'>
      {/* PAGE TITLE */}
      <div className='mb-4 flex flex-row text-4xl font-bold'>Create Your Own Quiz</div>

      {/* FORM AND IMAGE MODULE CONTAINER */}
      <div className='my-3 flex w-[70vw] max-w-6xl flex-col justify-items-start rounded-xl md:flex-row'>
        {/* IMAGE UPLOAD STUB */}
        <div className='mx-auto mb-3 h-[50vh] w-full content-center rounded-lg bg-white p-3 text-center text-4xl sm:max-w-sm md:mb-0'>
          Cover Image Module
        </div>

        {/* TODO: EXTRACT FORM SECTION TO COMPONENT (???) */}
        {/* FORM SECTION */}
        <div className='min-w-5xl flex h-[50vh] w-full max-w-5xl flex-col items-start rounded-lg bg-slate-300 p-3 md:mx-4'>
          <form className='my-2 w-full' onSubmit={handleSubmit}>
            {/* TITLE INPUT */}
            <div className='w-full text-2xl'>
              Title (required)
              <input
                name='title'
                type='text'
                placeholder='Give your quiz a cool title...'
                value={form.title}
                onChange={handleChange}
                className='w-full rounded p-3'
                required
              />
            </div>

            {/* DESCRIPTION INPUT */}
            <div className='mt-5 w-full text-2xl'>
              Description
              <input
                name='description'
                type='text'
                placeholder='Tell us what your quiz will be about...'
                value={form.description}
                onChange={handleChange}
                className='h-[8vh] w-full rounded p-3'
              />
            </div>

            {/* QUIZ VISIBILITY TOGGLE */}
            <div className={'mt-5 text-lg'}>
              <input
                name={'visibility'}
                type={'checkbox'}
                value={form.visibility}
                checked={checked}
                onChange={handleCheckboxChange}
                className={'mr-1.5'}
              />
              <label>Private Visibility</label>
            </div>

            {/* SUBMIT BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.001 }}
              type='submit'
              className='mt-3 h-12 w-24 cursor-pointer rounded-lg bg-cyan-600 text-xl font-medium text-cyan-50 shadow transition hover:bg-cyan-500 active:bg-cyan-600'
            >
              Submit
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
