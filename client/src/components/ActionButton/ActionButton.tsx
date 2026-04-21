'use client';

import React, { ReactElement } from 'react';
import { ActionButtonProps } from '@/types/ActionButton.type';
import { motion } from 'framer-motion';

export default function ActionButton({ color, text, handlerFn }: ActionButtonProps): ReactElement {
  return (
    // MAIN CONTAINER
    <motion.button
      className={`w-sm sm:w-2xl h-16 rounded-lg bg-${color}-500 px-7 font-bold text-white transition hover:bg-${color}-400 active:bg-${color}-500`}
      onClick={handlerFn}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.005 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {text}
    </motion.button>
  );
}
