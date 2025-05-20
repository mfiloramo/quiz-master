'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Quiz, QuizContextType } from '@/types/Quiz.types';

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  // PROVIDER STATE
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lockedIn, setLockedIn] = useState<boolean>(false);

  // PROVIDER HANDLER FUNCTIONS
  const setQuiz = (quiz: Quiz | null): void => {
    setSelectedQuiz(quiz);
  };

  const resetQuiz = (): void => {
    setSelectedQuiz(null); // RESET SELECTED QUIZ
    setCurrentIndex(0); // RESET QUESTION INDEX
  };

  return (
    <QuizContext.Provider
      value={{
        selectedQuiz,
        setSelectedQuiz: setQuiz,
        currentIndex,
        setCurrentIndex,
        resetQuiz,
        lockedIn,
        setLockedIn,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextType {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
}
