'use client';

import { useRouter } from 'next/navigation';
import { useRegister } from '@/contexts/RegisterContext';
import { ReactElement } from 'react';

export default function RegisterStart(): ReactElement {
  const { setAccountType } = useRegister();
  const router = useRouter();

  const chooseType = (type: 'student' | 'teacher') => {
    setAccountType(type);
    router.push('/auth/register/username');
  };

  return (
    // MAIN CONTAINER
    <div className={'flex flex-col items-center px-5 pt-6 text-black'}>
      <h1 className={'mb-4 text-2xl font-bold'}>Choose Account Type</h1>
      <div
        className={
          'flex h-fit w-fit flex-row items-center gap-4 rounded-xl bg-cyan-100 p-4 px-12 pt-6 shadow-xl'
        }
      >
        <button
          className={
            'mx-2 w-fit rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-xl transition hover:bg-emerald-500 active:bg-emerald-700'
          }
          onClick={() => chooseType('student')}
        >
          I&apos;m a Student
        </button>
        <button
          className={
            'mx-2 w-fit rounded-xl bg-cyan-600 px-4 py-2 text-white shadow-xl transition hover:bg-cyan-500 active:bg-cyan-700'
          }
          onClick={() => chooseType('teacher')}
        >
          I&apos;m a Teacher
        </button>
      </div>
    </div>
  );
}
