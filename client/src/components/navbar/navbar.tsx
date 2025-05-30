'use client';

import { JSX, ReactElement } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { NavLinkType } from '@/types/NavLink.type';

export default function Navbar(): JSX.Element {
  // USE AUTH CONTEXT FOR LOGIN STATE AND LOGOUT ACTION
  const { isLoggedIn, logout, user } = useAuth();

  const navLinksLeft: NavLinkType[] = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/students', label: 'Students' },
    { path: '/teachers', label: 'Teachers' },
  ];

  // RENDER COMPONENT
  return (
    <>
      {/** NAVBAR MAIN CONTAINER **/}
      <div className='fixed left-0 top-0 z-50 flow-root h-16 w-full bg-gradient-to-b from-sky-800 to-sky-600 shadow-2xl'>
        {/** LEFT BUTTONS CONTAINER **/}
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

          {/** LEFT BUTTONS **/}
          {navLinksLeft
            .filter((button) => button.label !== 'Dashboard' || isLoggedIn)
            .map(
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

        {/** RIGHT BUTTONS CONTAINER **/}
        <div className='float-right mr-7 mt-4 flex items-center'>
          {/* JOIN GAME BUTTON -- DISABLED FOR SECURITY */}
          {/*{!isLoggedIn && (*/}
          {/*  <Link*/}
          {/*    className='ml-4 rounded-lg bg-amber-500 px-3 py-1 font-bold text-white shadow-lg transition hover:bg-amber-400 active:bg-amber-500 active:text-white'*/}
          {/*    href={'/dashboard/join'}*/}
          {/*    key={'join'}*/}
          {/*  >*/}
          {/*    {'Join Game'}*/}
          {/*  </Link>*/}
          {/*)}*/}

          {/* SIGN UP BUTTON */}
          {isLoggedIn ? (
            // PROFILE INDICATOR
            <div className={'text-md mr-2 mt-1.5 flex flex-row font-bold text-sky-200'}>
              <FaUserCircle className='-mt-0.5 mr-3' size={28} />
              {`Welcome, ${user?.username}`}
            </div>
          ) : (
            // SIGN UP BUTTON
            <Link
              className='ml-4 rounded-lg bg-green-600 px-3 py-1 font-bold text-white shadow-lg transition hover:bg-[#1BB755] active:bg-green-600'
              href={'/auth/register'}
              key={'register'}
            >
              {'Sign Up'}
            </Link>
          )}

          {/* LOGOUT BUTTON */}
          {isLoggedIn ? (
            <button
              onClick={logout}
              className='ml-4 mt-1.5 text-sky-100 transition hover:text-white active:text-sky-100'
            >
              Log Out
            </button>
          ) : (
            // LOGIN BUTTON
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
