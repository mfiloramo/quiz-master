'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RegisterContextType } from '@/types/RegisterContext.type';

// CREATE CONTEXT
const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

// PROVIDER WRAPPER
export function RegisterProvider({ children }: { children: ReactNode }) {
  const [accountType, setAccountType] = useState<'student' | 'teacher' | null>(null);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // RESET FORM INPUT
  const reset = () => {
    setAccountType(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <RegisterContext.Provider
      value={{
        accountType,
        username,
        email,
        password,
        confirmPassword,
        setAccountType,
        setUsername,
        setEmail,
        setPassword,
        setConfirmPassword,
        reset,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
}

// CONTEXT HOOK
export function useRegister(): RegisterContextType {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error('useRegister must be used within a RegisterProvider');
  }
  return context;
}
