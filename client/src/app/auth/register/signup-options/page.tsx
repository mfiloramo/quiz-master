'use client';

import React, { ReactElement, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/contexts/RegisterContext';
import axiosInstance from '@/utils/axios';
import { useToast } from '@/contexts/ToastContext';

export default function RegisterSignupOptionsPage(): ReactElement {
  // CONTEXT AND ROUTER
  const {
    accountType,
    username,
    email,
    password,
    confirmPassword,
    setEmail,
    setPassword,
    setConfirmPassword,
  } = useRegister();
  const router = useRouter();
  const { toastSuccess, toastError } = useToast();

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // VALIDATE INPUT
    if (!email.trim()) {
      toastError('Email is required');
      return;
    }

    if (!password) {
      toastError('Password is required');
      return;
    }

    if (!confirmPassword) {
      toastError('Confirm Password is required');
      return;
    }

    if (password !== confirmPassword) {
      toastError('Password and Confirm Password must match');
      return;
    }

    if (password.length < 8) {
      toastError('Password must be at least 8 characters');
      return;
    }

    try {
      // SEND POST REQUEST TO BACKEND
      await axiosInstance
        .post('/auth/register', { accountType, username, email, password })
        .then((response: any) => {
          toastSuccess(response.data);

          // NAVIGATE TO HOMEPAGE ON SUCCESS
          router.push('/');
        })
        .catch((response: any) => {
          toastError(response.message);
          return;
        });
    } catch (error: any) {
      toastError('Registration Error:', error.response?.data?.message || error.message);
    }
  };

  // RENDER COMPONENT
  return (
    // MAIN CONTAINER
    <div className='flex flex-col items-center px-5 pt-8'>
      {/* CARD TITLE */}
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
          name='new-password'
          placeholder='Enter password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete='new-password'
          className='w-full rounded-xl border border-gray-300 p-3 text-black placeholder-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <input
          type='password'
          name='confirm-password'
          placeholder='Confirm password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
