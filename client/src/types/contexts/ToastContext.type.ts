import { ToastStatus } from '@/enums/ToastStatus.enum';

// TOAST ENTITY
export type Toast = {
  id: string;
  message: string;
  status: ToastStatus;
  duration: number; // MS
  createdAt: number; // EPOCH MS
};

// INPUT SHAPE FOR ADDING A TOAST
export type AddToastInput = {
  message: string;
  status: ToastStatus;
  duration?: number;
};

// PUBLIC CONTEXT API
export type ToastContextType = {
  // STORE
  toasts: Toast[];

  // CORE API
  addToast: (input: AddToastInput) => string; // RETURNS ID
  dismiss: (id: string) => void;
  clear: () => void;

  // SHORTHANDS
  success: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
};
