'use client';

import { JSX, ReactElement } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavLinkType } from '@/types/NavLink.type';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar(): JSX.Element {
  // USE AUTH CONTEXT FOR LOGIN STATE AND LOGOUT ACTION
  const { isLoggedIn, logout } = useAuth();

  const navLinksLeft: NavLinkType[] = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/students', label: 'Students' },
    { path: '/teachers', label: 'Teachers' },
  ];

  // RENDER COMPONENT
  return (
    <>
      {/* NAVBAR MAIN CONTAINER */}
      <div className='fixed left-0 top-0 z-50 flow-root h-16 w-full bg-gradient-to-b from-sky-800 to-sky-600 shadow-2xl'>
        {/* LEFT BUTTONS CONTAINER */}
        <div className='float-left ml-4 mt-2 flex items-center'>
          {/* APP LOGO */}
          <Link href={'/'}>
            <Image
              className='shadow-lg'
              src={'/logos/logo-mini.png'}
              width={160}
              height={45}
              alt={'QuizMaster logo'}
            />
          </Link>

          {/* LEFT BUTTONS */}
          {navLinksLeft.map(
            (button: NavLinkType): ReactElement => (
              <Link
                className='ml-5 text-sky-100 transition hover:text-white active:text-sky-100'
                href={button.path}
                key={button.label}
              >
                {button.label}
              </Link>
            )
          )}
        </div>

        {/* RIGHT BUTTONS CONTAINER */}
        <div className='float-right mr-7 mt-4 flex items-center'>
          {/* RIGHT BUTTONS */}
          <Link
            className='ml-4 rounded-lg bg-green-600 px-3 py-1 font-bold text-white shadow-lg transition hover:bg-[#1BB755] active:bg-green-600'
            href={'/auth/register'}
            key={'register'}
          >
            {'Sign Up'}
          </Link>

          {isLoggedIn ? (
            <button
              onClick={logout}
              className='ml-4 text-sky-100 transition hover:text-white active:text-sky-100'
            >
              Log Out
            </button>
          ) : (
            <Link
              className='ml-4 text-sky-100 transition hover:text-white active:text-sky-100'
              href={'/auth/login'}
              key={'login'}
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
