'use client';

import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { ToastContextType, Toast, AddToastInput } from '@/types/contexts/ToastContext.type';
import { ToastStatus } from '@/enums/ToastStatus.enum';
import { ToastAction } from '@/types/ToastActions.types';

// DO NOT STACK IDENTICAL TOASTS WITHIN THIS WINDOW (MS)
const DEDUPE_WINDOW_MS = 3000;

// SIMPLE REDUCER
function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case 'ADD': {
      const next = action.payload;

      // SIMPLE NORMALIZER TO AVOID TRIVIAL MISMATCHES
      const norm = (s: string) => s.trim().toLowerCase();

      // FIND EXISTING TOAST WITH SAME MESSAGE + STATUS
      const dupeIndex = state.findIndex(
        (t) => t.status === next.status && norm(t.message) === norm(next.message)
      );

      if (dupeIndex !== -1) {
        const existing = state[dupeIndex];

        // IF THE DUPLICATE IS "RECENT", DROP IT
        if (next.createdAt! - existing.createdAt! < DEDUPE_WINDOW_MS) {
          return state;
        }

        // OTHERWISE REPLACE THE OLD ONE (RESET ITS TIMER, MOVE TO TOP)
        const without = state.filter((_, i) => i !== dupeIndex);
        return [next, ...without];
      }

      // NO DUPLICATE FOUND → ADD NORMALLY
      return [next, ...state];
    }
    case 'DISMISS': {
      return state.filter((t) => t.id !== action.payload.id);
    }
    case 'CLEAR': {
      return [];
    }
    default:
      return state;
  }
}

// CREATE CONTEXT
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// PROVIDER LIVES AT ROOT LAYOUT SO IT DOESN'T UNMOUNT ON ROUTE CHANGES
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  // ID GENERATION (LOCAL, COLLISION-RESISTANT FOR CLIENT USE)
  const genId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

  // PUBLIC API
  const addToast = (input: AddToastInput) => {
    const id = genId();
    const toast: Toast = {
      id,
      message: input.message,
      status: input.status,
      duration: input.duration ?? 5000, // DEFAULT 5s
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD', payload: toast });
    return id;
  };

  const dismiss = (id: string) => dispatch({ type: 'DISMISS', payload: { id } });
  const clear = () => dispatch({ type: 'CLEAR' });

  // ERGONOMIC HELPERS
  const toastSuccess = (message: string, duration?: number) =>
    addToast({ message, status: ToastStatus.Success, duration });
  const toastWarning = (message: string, duration?: number) =>
    addToast({ message, status: ToastStatus.Warning, duration });
  const toastError = (message: string, duration?: number) =>
    addToast({ message, status: ToastStatus.Error, duration });
  const toastInfo = (message: string, duration?: number) =>
    addToast({ message, status: ToastStatus.Info, duration });

  const value = useMemo<ToastContextType>(
    () => ({
      // STORE
      toasts,
      // CORE API
      addToast,
      dismiss,
      clear,
      // SHORTHANDS
      toastSuccess,
      toastWarning,
      toastError,
      toastInfo,
    }),
    [toasts]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

// CUSTOM HOOK
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
