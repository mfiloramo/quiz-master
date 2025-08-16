import { ToastStatus } from '@/enums/ToastStatus.enum';

// TOAST ENTITY
export type Toast = {
  id: string;
  message: string;
  status: ToastStatus;
  duration: number; // MS
  createdAt?: number; // EPOCH MS
  onDismiss?: (id: string) => void;
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
  toastSuccess: (message: string, duration?: number) => string;
  toastWarning: (message: string, duration?: number) => string;
  toastError: (message: string, duration?: number) => string;
  toastInfo: (message: string, duration?: number) => string;
};
