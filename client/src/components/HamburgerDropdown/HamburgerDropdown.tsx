'use client';
import { ReactElement, useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Hamburger from 'hamburger-react';
import Link from 'next/link';
import { NavLinkType } from '@/types/NavLink.type';
import { useAuth } from '@/contexts/AuthContext';

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

export default function HamburgerDropdown({ navLinks }: any): ReactElement {
  // LOCAL STATE
  const [isOpen, setIsOpen] = useState(false);

  // CUSTOM HOOKS
  const { logout } = useAuth();

  // HANDLER FUNCTIONS
  const handleClose = (): void => {
    setIsOpen(false);
    return;
  };

  // RENDER COMPONENT
  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className='relative h-16 w-full'
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className='absolute -top-14 right-0 z-50 text-blue-100'
      >
        <Hamburger toggled={isOpen} toggle={setIsOpen} />
        <motion.div
          variants={{
            open: { rotate: 90 },
            closed: { rotate: 0 },
          }}
          transition={{ duration: 0.2 }}
          style={{ originY: 0.55 }}
        ></motion.div>
      </motion.button>

      <motion.ul
        variants={{
          open: {
            clipPath: 'inset(0% 0% 0% 0%)',
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.7,
              delayChildren: 0.3,
              staggerChildren: 0.05,
            },
          },
          closed: {
            clipPath: 'inset(10% 50% 90% 50%)',
            transition: {
              type: 'spring',
              bounce: 0,
              duration: 0.3,
            },
          },
        }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        className='z-30 mt-3 flex min-w-[90vw] list-none flex-col gap-5 rounded-bl-xl rounded-br-xl bg-sky-100 p-3.5'
      >
        {navLinks.map(
          (link: NavLinkType): ReactElement => (
            <motion.li
              key={link.label}
              className='block cursor-pointer text-xl text-sky-950'
              variants={itemVariants}
            >
              <Link
                href={link.path}
                onClick={() => {
                  handleClose();
                  link.onClick?.();
                }}
              >
                {link.label}
              </Link>
            </motion.li>
          )
        )}
      </motion.ul>
    </motion.nav>
  );
}
