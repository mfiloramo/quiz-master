'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { AuthContextType, DecodedUser } from '@/types/AuthContext.type';

// CREATE CONTEXT
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AUTH PROVIDER COMPONENT
export function AuthProvider({ children }: { children: ReactNode }) {
  // PROVIDER STATE
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);

  // PROVIDER UTILITIES
  const router = useRouter();

  // ON LOAD, CHECK IF TOKEN EXISTS AND DECODE IT
  useEffect((): void => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded: DecodedUser = jwtDecode(token);

      if (!decoded.isActive) {
        alert('Account is inactive');
        return;
      }

      console.log(decoded);
      setUser(decoded);
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Invalid or malformed token:', err);
      localStorage.removeItem('token');
    }
  }, []);

  // LOGIN HANDLER
  const login = (token: string): boolean => {
    try {
      localStorage.setItem('token', token);
      const decoded = jwtDecode<DecodedUser>(token);

      if (!decoded.isActive) {
        alert('Account is inactive');
        localStorage.removeItem('token');
        return false;
      }

      setUser(decoded);
      setIsLoggedIn(true);
      return true;
    } catch (err) {
      console.error('Failed to decode token:', err);
      return false;
    }
  };

  // LOGOUT HANDLER
  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    router.push('/');
  };

  // RENDER PROVIDER
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isHost, setIsHost, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// CUSTOM HOOK
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
