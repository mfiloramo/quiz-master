'use client';

import React, { createContext, ReactNode, useContext, useState, useMemo } from 'react';
import { Quiz, QuizContextType } from '@/types/Quiz.types';

// CREATE CONTEXT
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// QUIZ PROVIDER COMPONENT
export function QuizProvider({ children }: { children: ReactNode }) {
  // PROVIDER STATE
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lockedIn, setLockedIn] = useState<boolean>(false);

  // PROVIDER HANDLER FUNCTIONS
  const resetQuiz = (): void => {
    setSelectedQuiz(null); // RESET SELECTED QUIZ
    setCurrentIndex(0); // RESET QUESTION INDEX
  };

  // MEMOIZE CONTEXT VALUE TO PREVENT UNNECESSARY RE-RENDERS
  const value = useMemo(
    () => ({
      selectedQuiz,
      setSelectedQuiz,
      currentIndex,
      setCurrentIndex,
      resetQuiz,
      lockedIn,
      setLockedIn,
    }),
    [selectedQuiz, currentIndex, lockedIn]
  );

  // RETURN CONTEXT PROVIDER
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

// CUSTOM HOOK
export function useQuiz(): QuizContextType {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
}
