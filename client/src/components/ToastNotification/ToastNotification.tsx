'use client';

import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastStatus } from '@/enums/ToastStatus.enum';
import { useToast } from '@/contexts/ToastContext';
import { Toast } from '@/types/contexts/ToastContext.type';

// STATIC STYLE MAP TO KEEP TAILWIND PURGE-SAFE (NO DYNAMIC CLASS STRINGS)
const STATUS_STYLES: Record<ToastStatus, string> = {
  [ToastStatus.Success]: 'bg-green-500 text-white border-green-600',
  [ToastStatus.Warning]: 'bg-amber-500 text-white border-amber-600',
  [ToastStatus.Error]: 'bg-red-500 text-white border-red-600',
  [ToastStatus.Info]: 'bg-blue-500 text-white border-blue-600',
};

// TOAST ITEM WITH ITS OWN TIMER (APPEAR FOR DURATION THEN DISAPPEAR)
function ToastItem({ id, message, status, duration, onDismiss }: Toast) {
  // COMPONENT STATE
  const [hovered, setHovered] = useState(false);

  // TIMER REFS
  const remainingRef = useRef<number>(duration);
  const startRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // START TIMER
  const startTimer = () => {
    // DO NOT START IF ALREADY RUNNING
    if (timerRef.current !== null) return;
    startRef.current = performance.now();
    timerRef.current = window.setTimeout(
      () => onDismiss!(id),
      remainingRef.current
    );
  };

  // CLEAR TIMER
  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (startRef.current != null) {
      const elapsed = performance.now() - startRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      startRef.current = null;
    }
  };

  // HOVER PAUSES THE TIMER
  const onMouseEnter = () => {
    setHovered(true);
    clearTimer();
  };

  // UN-HOVERING RESETS/RESUMES TIMER
  const onMouseLeave = () => {
    setHovered(false);
    // ONLY RESTART IF STILL HAVE TIME LEFT
    if (remainingRef.current > 0) startTimer();
  };

  // START TIMER ON MOUNT; CLEAN UP ON UNMOUNT
  useEffect(() => {
    startTimer();
    return () => clearTimer();
    // INTENTIONALLY EMPTY DEP ARRAY SO IT RUNS ONLY ONCE PER ITEM
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // REDUCED MOTION RESPECT
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      layout
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto mb-3 flex max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl ${STATUS_STYLES[status]}`}
      role='status'
      aria-live='polite'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* MESSAGE CONTENT */}
      <div className='flex-1 break-words text-base'>
        {message}
        {/* OPTIONAL: SHOW REMAINING WHEN HOVERED (DEBUGGING/UX) */}
        {/* {hovered && <div className="mt-1 text-xs opacity-80">closing in {Math.ceil(remainingRef.current / 100) / 10}s</div>} */}
      </div>

      {/* MANUAL DISMISS BUTTON */}
      <button
        type='button'
        aria-label='Dismiss notification'
        className='rounded-md/50 ml-2 inline-flex h-6 w-6 items-center justify-center bg-black/20 text-white hover:bg-black/30 focus:outline-none focus:ring-2 focus:ring-white/60'
        onClick={() => onDismiss!(id)}
      >
        ×
      </button>
    </motion.div>
  );
}

// VIEWPORT LIVES AT ROOT; USES A PORTAL TO AVOID Z-INDEX CLASHES AND STACKING CONTEXT ISSUES
export default function ToastNotification(): ReactElement | null {
  // CONTEXT HOOKS
  const { toasts, dismiss } = useToast();

  // MOUNT GUARD TO AVOID SSR/CSR MISMATCH
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  // PORTAL TARGET (DEFENSIVE CHECKS FOR SSR)
  const portalTarget = typeof document === 'undefined' ? null : document.body;
  if (!portalTarget) return null;

  return createPortal(
    <div
      // FIXED CONTAINER, BOTTOM-CENTER; SET POINTER-EVENTS TO NONE SO CLICKS PASS THROUGH, THEN ENABLE ON TOASTS
      className='pointer-events-none fixed inset-x-0 bottom-4 z-[1000] mx-auto flex w-full max-w-2xl flex-col items-center px-4'
      // LIVE REGION CONTAINER (INDIVIDUAL ITEMS CARRY role/status AS WELL)
      aria-live='polite'
    >
      <AnimatePresence>
        {toasts.map((toast: Toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            message={toast.message}
            status={toast.status}
            duration={toast.duration}
            onDismiss={dismiss}
          />
        ))}
      </AnimatePresence>
    </div>,
    portalTarget
  );
}
