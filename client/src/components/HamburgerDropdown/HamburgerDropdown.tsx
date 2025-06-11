'use client';
import { ReactElement, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Hamburger from 'hamburger-react';
import Link from 'next/link';
import { NavLinkType } from '@/types/NavLink.type';

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

export default function HamburgerDropdown({ navLinks }: any): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = (): void => {
    setIsOpen(false);
    return;
  };

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      className='relative h-16 w-full'
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className='absolute -top-11 right-0 z-50 text-blue-100'
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
        className='z-30 -mr-7 flex min-w-[100vw] list-none flex-col gap-5 rounded-bl-xl rounded-br-xl bg-sky-100 p-3.5'
      >
        {navLinks.map(
          (link: NavLinkType, index: number): ReactElement => (
            <motion.li
              key={link.label}
              className='block cursor-pointer text-xl text-sky-950'
              variants={itemVariants}
            >
              <Link href={link.path} onClick={handleClose}>
                {link.label}
              </Link>
            </motion.li>
          )
        )}
      </motion.ul>
    </motion.nav>
  );
}
