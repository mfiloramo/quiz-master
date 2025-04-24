'use client';

import React, { ReactElement, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Create(): ReactElement {
  // STATE HOOKS
  const [form, setForm] = useState<any>({ title: '', description: '' });
  // const [title, setTitle] = useState<string>('');
  // const [description, setDescription] = useState<string>('');

  // ROUTER INSTANCE FOR REDIRECTION
  const router = useRouter();

  // AUTH CONTEXT HOOK
  const { user } = useAuth();

  // HANDLE FORM SUBMISSION
  const handleSubmit: (e: React.FormEvent) => Promise<void> = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // SEND QUIZ TO SERVER
      const response = await fetch(`http://localhost:3030/api/quizzes/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user!.id,
          username: user!.username,
          title: form.title,
          description: form.description,
        }),
      });

      const data: any = await response.json();

      // HANDLE INVALID RESPONSE
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      router.push('/dashboard/edit');
    } catch (error: any) {
      console.error(error);
    }
  };

  // HANDLE FORM CHANGES
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    // MAIN CONTAINER
    <div className={'m-3 flex flex-col'}>
      {/* PAGE TITLE */}
      <div className={'flex flex-row text-5xl font-bold md:flex-col'}>Quiz Creator</div>

      {/* CONTENT CONTAINER */}
      <div className={'my-3 flex flex-row rounded-xl'}>
        {/* COVER IMAGE DROPBOX */}
        <div
          className={
            'h-[30vh] w-[35vw] max-w-xl content-center rounded-lg bg-white text-center text-4xl'
          }
        >
          Cover Image Module
        </div>

        {/* VERBIAGE CONTAINER */}
        <div className={'mx-4 flex w-full flex-col items-start rounded-lg bg-slate-300 p-3'}>
          {/* TITLE SECTION */}
          <div className={'w-full text-2xl font-bold'}>
            <form className={'my-2'} onSubmit={handleSubmit}>
              {/* TITLE INPUT */}
              <div className={'w-full text-2xl font-bold'}>
                Title (required)
                <input
                  name={'title'}
                  type={'text'}
                  placeholder={'Give your quiz a cool title...'}
                  value={form.title}
                  onChange={handleChange}
                  className={'w-full rounded p-3'}
                  required
                />
              </div>

              {/* DESCRIPTION INPUT */}
              <div className={'mt-5 w-full text-2xl font-bold'}>
                Description
                <input
                  name={'description'}
                  type={'text'}
                  placeholder={'Tell us what your quiz will be about...'}
                  value={form.description}
                  onChange={handleChange}
                  className={'h-[8vh] w-full rounded p-3'}
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type='submit'
                className={
                  'mt-3 h-12 w-24 cursor-pointer rounded-lg bg-cyan-600 text-xl font-medium text-cyan-200 shadow transition hover:bg-cyan-500 active:bg-cyan-400'
                }
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
