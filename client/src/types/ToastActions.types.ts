// TOAST ACTION TYPES
import { Toast } from '@/types/contexts/ToastContext.type';

export type ToastAction =
  | { type: 'ADD'; payload: Toast }
  | { type: 'DISMISS'; payload: { id: string } }
  | { type: 'CLEAR' };
