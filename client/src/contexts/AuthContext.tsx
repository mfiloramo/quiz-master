'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import {
  AuthContextType,
  DecodedUser,
} from '@/types/contexts/AuthContext.types';

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
  useEffect(() => {
    const token = localStorage.getItem('token');

    // FIRST, CHECK IF TOKEN EXISTS
    if (!token) {
      console.log('No token found');
      logout();
      return;
    }

    try {
      const decoded: DecodedUser = jwtDecode(token);

      // CHECK IF TOKEN IS EXPIRED — `exp` IS IN SECONDS, CONVERT TO MILLISECONDS
      const isExpired = Date.now() > decoded.exp * 1000;

      if (isExpired) {
        console.log('Token has expired');
        logout();
        return;
      }

      // CHECK IF ACCOUNT IS ACTIVE
      if (!decoded.isActive) {
        alert('Account is inactive');
        logout(); // ENSURE CONSISTENT LOGOUT BEHAVIOR ON INACTIVE ACCOUNT
        return;
      }

      // SET USER CONTEXT IF ALL CHECKS PASS
      setUser(decoded);
      setIsLoggedIn(true);
    } catch (err) {
      // HANDLE MALFORMED OR TAMPERED TOKEN
      console.error('Invalid or malformed token:', err);
      localStorage.removeItem('token');
      logout(); // CLEAN UP CLIENT STATE ON ERROR
    }
  }, []);

  // LOGIN HANDLER
  const login = (token: string): boolean => {
    try {
      localStorage.setItem('token', token);
      const decodedUser = jwtDecode<DecodedUser>(token);

      if (!decodedUser.isActive) {
        alert('Account is inactive');
        localStorage.removeItem('token');
        return false;
      }

      setUser(decodedUser);
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
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  // RENDER PROVIDER
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, isHost, setIsHost, login, logout }}
    >
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
