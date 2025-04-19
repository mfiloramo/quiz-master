'use client';

import React, { ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/contexts/RegisterContext';

export default function RegisterSignupOptionsPage(): ReactElement {
  // CONTEXT AND ROUTER
  const { accountType, username, email, password, setEmail, setPassword, reset } = useRegister();
  const router = useRouter();

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      // SEND POST REQUEST TO BACKEND
      const response = await fetch('http://localhost:3030/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountType, username, email, password }),
      });

      if (!response.ok) throw new Error('Error with user input. Please try again.');

      // MANUALLY RESET STATE BEFORE REDIRECT
      reset();

      // IMMEDIATELY NAVIGATE TO HOMEPAGE
      router.push('/');
    } catch (error: any) {
      console.error('Registration Error:', error);
    }
  };

  // RENDER COMPONENT
  return (
    // MAIN CONTAINER
    <div className='flex flex-col items-center pt-8'>
      <h1 className='mb-4 text-2xl font-bold text-black'>Enter Account Info</h1>

      {/* SIGNUP FORM CONTAINER */}
      <form
        onSubmit={handleSubmit}
        className='flex w-full max-w-md flex-col items-center gap-4 rounded-xl bg-cyan-100 p-6 shadow-xl'
      >
        {/* EMAIL INPUT */}
        <input
          type='email'
          name='email'
          placeholder='Enter email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full rounded-xl border border-gray-300 p-3 text-black placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        {/* PASSWORD INPUT */}
        <input
          type='password'
          name='password'
          placeholder='Enter password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full rounded-xl border border-gray-300 p-3 text-black placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        {/* SUBMIT BUTTON */}
        <button
          type='submit'
          className='rounded-xl bg-cyan-600 px-4 py-2 text-white shadow transition hover:bg-cyan-500'
        >
          Submit
        </button>
      </form>
    </div>
  );
}
