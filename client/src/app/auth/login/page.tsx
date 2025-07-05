'use client';
import React, { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { Icon } from 'react-icons-kit';
import { eye } from 'react-icons-kit/feather/eye';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';

import axiosInstance from '@/utils/axios';

export default function LoginPage(): ReactElement {
  // STATE HOOKS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState<any>(eyeOff);
  const [error, setError] = useState<string | null>(null);

  // ROUTER INSTANCE FOR REDIRECTION
  const router = useRouter();

  // AUTH CONTEXT HOOK
  const { login } = useAuth();

  // EFFECT HOOK TO CLEAR INPUT FIELDS ON UNMOUNT
  useEffect(() => {
    return () => {
      setEmail('');
      setPassword('');
    };
  }, []);

  // HANDLE LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // VALIDATE INPUT
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    try {
      // API CALL TO LOGIN ENDPOINT
      const { data } = await axiosInstance.post('/auth/login', { email, password });

      // CALL AUTH CONTEXT LOGIN FUNCTION
      const success = login(data.token);

      // REDIRECT ON SUCCESS
      if (success) {
        router.push('/dashboard');
      }
    } catch (error: any) {
      // DISPLAY ERROR MESSAGE
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  // HANDLE PASSWORD VISIBILITY TOGGLE
  const handlePasswordToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text');
    } else {
      setIcon(eyeOff);
      setType('password');
    }
  };

  // RENDER PAGE
  return (
    // MAIN CONTAINER
    <div className='flex h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-300 to-sky-400'>
      {/* APP LOGO */}
      <Image
        src='/logos/logo-main.png'
        alt='app-logo'
        width={762}
        height={634}
        className='w-48 max-w-full sm:-mt-20 sm:w-48 md:w-64 lg:w-72'
      />

      {/* LOGIN CARD */}
      <div className='relative mt-8 w-[90%] max-w-md content-center rounded-xl bg-sky-50 p-8 shadow-2xl'>
        {/* TITLE */}
        <h2 className='mb-6 text-center text-2xl font-bold text-sky-800'>Log In</h2>

        {/* DISPLAY ERROR */}
        {error && <p className='mb-4 text-sm text-red-500'>{error}</p>}

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className='flex flex-col gap-4'>
          {/* EMAIL INPUT */}
          <input
            type='text'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='rounded-lg border border-gray-300 p-3 text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500'
          />

          {/* PASSWORD INPUT + ICON */}
          <div className='relative'>
            <input
              type={type}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full rounded-lg border border-gray-300 p-3 pr-10 text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500'
            />
            {/* ICON FOR TOGGLING PASSWORD VISIBILITY */}
            <span className='absolute right-3 top-3 cursor-pointer' onClick={handlePasswordToggle}>
              <div
                className={
                  'h-fit w-fit cursor-pointer rounded-xl bg-red-600 px-2 hover:bg-red-700 active:bg-red-800'
                }
              >
                S
              </div>
            </span>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type='submit'
            className='rounded-lg bg-sky-600 py-3 text-white transition hover:bg-sky-700'
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
