import React from 'react';
import { ClipLoader } from 'react-spinners';
import { LoadingSpinnerProps } from '@/types/LoadingSpinner.type';
import { motion } from 'framer-motion';

export default function LoadingSpinner({
  color = '#000000',
  loadingMessage = 'Loading…',
  size = 60,
  speedMultiplier = 1.5,
  className = '',
}: LoadingSpinnerProps) {
  // RENDER COMPONENT
  return (
    // MAIN CONTAINER
    <div
      className={`flex flex-col items-center text-center font-bold ${className}`}
    >
      {/* LOADING MESSAGE */}
      <motion.p
        className='p-6 text-2xl'
        style={{ color }}
        animate={{ rotate: [-1, 1, -1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {loadingMessage}
      </motion.p>

      {/* LOADER SPINNER */}
      <ClipLoader
        color={color}
        loading
        size={size}
        aria-label='Loading spinner'
        data-testid='loader'
        speedMultiplier={speedMultiplier}
      />
    </div>
  );
}
