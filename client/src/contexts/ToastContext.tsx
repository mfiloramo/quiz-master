'use client';

import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { ToastContextType, Toast, AddToastInput } from '@/types/contexts/ToastContext.type';
import { ToastStatus } from '@/enums/ToastStatus.enum';

// ACTION TYPES
type Action =
  | { type: 'ADD'; payload: Toast }
  | { type: 'DISMISS'; payload: { id: string } }
  | { type: 'CLEAR' };

// SIMPLE REDUCER
function reducer(state: Toast[], action: Action): Toast[] {
  switch (action.type) {
    case 'ADD': {
      // OPTIONAL: DEDUPE LOGIC COULD GO HERE
      return [action.payload, ...state];
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
  const [toasts, dispatch] = useReducer(reducer, []);

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
  const success = (message: string, duration?: number) =>
    addToast({ message, status: ToastStatus.Success, duration });
  const warning = (message: string, duration?: number) =>
    addToast({ message, status: ToastStatus.Warning, duration });
  const error = (message: string, duration?: number) =>
    addToast({ message, status: ToastStatus.Error, duration });
  const info = (message: string, duration?: number) =>
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
      success,
      warning,
      error,
      info,
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
