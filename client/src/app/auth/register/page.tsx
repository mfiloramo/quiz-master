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
    <div className={'flex flex-col items-center pt-6 text-black'}>
      <div
        className={
          'flex h-fit w-fit flex-col items-center gap-4 rounded-xl bg-cyan-100 p-4 pt-6 shadow-xl'
        }
      >
        <h1 className={'mb-4 text-2xl font-bold'}>Choose Account Type</h1>
        <button
          className={
            'mb-1 w-fit rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-xl transition hover:bg-emerald-500 active:bg-emerald-700'
          }
          onClick={() => chooseType('student')}
        >
          I'm a Student
        </button>
        <button
          className={
            'mb-4 w-fit rounded-xl bg-cyan-600 px-4 py-2 text-white shadow-xl transition hover:bg-cyan-500 active:bg-cyan-700'
          }
          onClick={() => chooseType('teacher')}
        >
          I'm a Teacher
        </button>
      </div>
    </div>
  );
}
