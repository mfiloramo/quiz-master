'use client';
import React, { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function LoginPage(): ReactElement {
  // STATE HOOKS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // ROUTER INSTANCE FOR REDIRECTION
  const router = useRouter();

  // AUTH CONTEXT HOOK
  const { login, user } = useAuth();

  // EFFECT HOOKS
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

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:3030/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid email or password');

      const data = await response.json();
      const success = login(data.token);

      if (success) {
        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
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
        className='h-auto w-48 max-w-full sm:w-48 md:w-64 lg:w-72'
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

          {/* PASSWORD INPUT */}
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='rounded-lg border border-gray-300 p-3 text-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500'
          />

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
