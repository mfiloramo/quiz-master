'use client';

import React, { ReactElement, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/contexts/RegisterContext';

export default function RegisterUsernamePage(): ReactElement {
  // CONTEXT AND ROUTER
  const { setUsername } = useRegister();
  const router = useRouter();

  // LOCAL STATE FOR INPUT
  const [usernameInput, setUsernameInput] = useState('');

  // HANDLE FORM SUBMIT
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    if (usernameInput) {
      e.preventDefault();
      setUsername(usernameInput);
      router.push('/auth/register/signup-options');
    } else {
      alert('Please input username to continue');
    }
  };

  // RENDER PAGE
  return (
    <div className={'flex flex-col items-center pt-8'}>
      <h1 className={'mb-4 text-2xl font-bold text-black'}>Enter Username</h1>
      <form
        onSubmit={handleSubmit}
        className='flex w-full max-w-md flex-col items-center gap-4 rounded-xl bg-cyan-100 p-6 shadow-xl'
      >
        <input
          type='text'
          name='username'
          placeholder='Enter username'
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          className='w-full max-w-md rounded-xl border border-gray-300 p-3 text-black placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          type='submit'
          className='rounded-xl bg-cyan-600 px-4 py-2 text-white shadow transition hover:bg-cyan-500'
        >
          Continue
        </button>
      </form>
    </div>
  );
}
