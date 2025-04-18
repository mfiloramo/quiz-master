'use client';

import { useRouter } from 'next/navigation';
import { useRegister } from '@/contexts/RegisterContext';

export default function RegisterStart() {
  const { setAccountType } = useRegister();
  const router = useRouter();

  const chooseType = (type: 'student' | 'teacher') => {
    setAccountType(type);
    router.push('/auth/register/username');
  };

  return (
    <div className='flex flex-col items-center text-black'>
      <h1 className='mb-4 text-2xl font-bold'>Choose Account Type</h1>
      <button onClick={() => chooseType('student')}>I'm a Student</button>
      <button onClick={() => chooseType('teacher')}>I'm a Teacher</button>
    </div>
  );
}
