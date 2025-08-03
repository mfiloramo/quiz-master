'use client';

import { JSX, ReactElement } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import { NavLinkType } from '@/types/NavLink.type';
import BurgerDropdown from '@/components/BurgerDropdown/BurgerDropdown';

export default function Navbar(): JSX.Element {
  // USE AUTH CONTEXT FOR LOGIN STATE AND LOGOUT ACTION
  const { isLoggedIn, logout, user } = useAuth();

  // NAVBAR LINKS (STANDARD VIEWPORTS)
  const navLinksLeft: NavLinkType[] = [
    { path: '/', label: 'Home' },
    isLoggedIn && { path: '/dashboard', label: 'Dashboard' },
    { path: '/students', label: 'Students' },
    { path: '/teachers', label: 'Teachers' },
  ].filter(Boolean) as NavLinkType[];

  // HAMBURGER MENU LINKS (MOBILE VIEWPORTS)
  const navLinksForHamburger: NavLinkType[] = isLoggedIn
    ? [
        ...navLinksLeft,
        {
          path: '/',
          label: 'Logout',
          onClick: logout,
        },
      ]
    : [
        ...navLinksLeft,
        {
          path: '/auth/login',
          label: 'Login',
        },
      ];

  // RENDER COMPONENT
  return (
    <>
      {/* NAVBAR MAIN CONTAINER */}
      <div className='fixed left-0 top-0 z-50 flow-root h-16 w-full bg-gradient-to-b from-sky-800 to-sky-600 shadow-2xl'>
        {/* LEFT LOGO + BUTTONS CONTAINER */}
        <div className='float-left ml-4 mt-2 flex items-center'>
          {/* APP LOGO (ALWAYS VISIBLE) */}
          <Link href={'/'}>
            <Image
              className='shadow-lg'
              src={'/logos/logo-mini.png'}
              width={160}
              height={45}
              alt={'QuizMaster logo'}
            />
          </Link>

          {/* LEFT BUTTONS (ONLY SHOW ON LARGE SCREENS) */}
          <div className='hidden items-center sm:flex'>
            {navLinksLeft
              .filter((button) => button.label !== 'Dashboard' || isLoggedIn)
              .map(
                (button: NavLinkType): ReactElement => (
                  <Link
                    className='ml-5 text-sky-100 transition hover:text-amber-300 active:text-amber-200'
                    href={button.path}
                    key={button.label}
                  >
                    {button.label}
                  </Link>
                )
              )}
          </div>
        </div>

        {/* RIGHT BUTTONS CONTAINER */}
        <div className='float-right mr-7 mt-4 flex items-center'>
          <div className={'hidden lg:flex'}>
            {/* JOIN GAME BUTTON */}
            {!isLoggedIn && (
              <Link
                className='ml-4 rounded-lg bg-amber-500 px-3 py-1 font-bold text-white shadow-lg transition hover:bg-amber-400 active:bg-amber-500 active:text-white'
                href={'/dashboard/join'}
                key={'join'}
              >
                {'Join Game'}
              </Link>
            )}

            {/* SIGN UP OR PROFILE INDICATOR */}
            {isLoggedIn ? (
              // PROFILE INDICATOR + LOGOUT BUTTON
              <div className='text-md flex items-center font-bold text-sky-200'>
                <FaUserCircle className='mr-2' size={28} />
                <span className='mr-4'>{`Welcome, ${user?.username}`}</span>
                <button
                  onClick={logout}
                  className='text-sky-100 transition hover:text-white active:text-sky-100'
                >
                  Log Out
                </button>
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
          </div>

          {/* LOGIN / LOGOUT BUTTON */}
          <div className={'hidden md:flex'}>
            {isLoggedIn ? (
              <button
                onClick={logout}
                className='ml-4 mt-1 text-sky-100 transition hover:text-white active:text-sky-100 md:hidden'
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

          {/* HAMBURGER MENU (ONLY ON SMALL SCREENS) */}
          <div className='-mt-4 md:hidden'>
            <BurgerDropdown navLinks={navLinksForHamburger} />
          </div>
        </div>
      </div>
    </>
  );
}
