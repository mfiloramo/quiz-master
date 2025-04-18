'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType } from '@/types/AuthContext.type';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // PROVIDER STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // CHECK TOKEN IN LOCAL STORAGE
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // HANDLE LOGIN
  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  // HANDLE LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  // RENDER PROVIDER
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
