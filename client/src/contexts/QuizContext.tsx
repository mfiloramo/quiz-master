'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Quiz, QuizContextType } from '@/types/Quiz.types';

// CREATE QUIZ CONTEXT
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// QUIZ CONTEXT PROVIDER
export function QuizProvider({ children }: { children: ReactNode }) {
  // SELECTED QUIZ OBJECT (NO LONGER STORED IN LOCAL STORAGE)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  // CURRENT QUESTION INDEX
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // RESET ALL QUIZ STATE
  const resetQuiz = (): void => {
    setSelectedQuiz(null);
    setCurrentIndex(0);
  };

  // RENDER PROVIDER
  return (
    <QuizContext.Provider
      value={{ selectedQuiz, setSelectedQuiz, currentIndex, setCurrentIndex, resetQuiz }}
    >
      {children}
    </QuizContext.Provider>
  );
}

// CUSTOM HOOK TO ACCESS QUIZ CONTEXT
export function useQuiz(): QuizContextType {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
