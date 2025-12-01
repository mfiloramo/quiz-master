'use client';

import React, { ReactElement, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { MenuPhase } from '@/enums/MenuPhase.enum';
import { motion } from 'framer-motion';

export default function Settings(): ReactElement {
  // PAGE STATE
  const [menuPhase, setMenuPhase] = useState<MenuPhase>(MenuPhase.InitialScreen);

  // CONTEXT HOOKS/CUSTOM HOOKS
  const router = useRouter();
  const {} = useAuth();
  const {} = useToast();

  // HANDLER FUNCTIONS
  const nextMenuPhase = () => {
    if (menuPhase === MenuPhase.InitialScreen) {
      setMenuPhase(MenuPhase.ConfirmationScreen);
      return;
    } else {
      setMenuPhase(MenuPhase.InitialScreen);
      return;
    }
  };

  // RENDER PAGE
  return (
    <div className={'flex flex-col items-start'}>
      {/* INITIAL ACCOUNT DELETION SCREEN */}
      {menuPhase === 'INITIAL-SCREEN' && (
        <motion.div
          className={
            'mb-4 w-[85vw] max-w-[650px] cursor-pointer rounded-lg bg-red-700 p-4 text-white shadow-md transition hover:bg-red-600 md:w-[65vw]'
          }
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.001 }}
          onClick={nextMenuPhase}
        >
          Delete Account
        </motion.div>
      )}

      {/* CONFIRMATION ACCOUNT DELETION SCREEN */}
      {menuPhase === 'CONFIRMATION-SCREEN' && (
        <>
          <div className={'mb-4 max-w-[625px] text-lg md:w-[65vw]'}>
            Are you sure you want to delete your account? Please type your username and password to
            confirm. This action cannot be undone.
          </div>
          <motion.div
            className={
              'mb-4 w-[85vw] max-w-[650px] cursor-pointer rounded-lg bg-red-700 p-4 text-white shadow-md transition hover:bg-red-600 md:w-[65vw]'
            }
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.001 }}
            onClick={nextMenuPhase}
          >
            Confirm Delete Account
          </motion.div>
        </>
      )}
    </div>
  );
}
