// TYPE FOR A SINGLE QUIZ
import { Dispatch, SetStateAction } from 'react';

// TYPE FOR A NEW QUIZ
export type Quiz = {
  id: number;
  user_id: number;
  author: string;
  created_date: string;
  description: string;
  questions: QuizQuestion[];
  visibility: string;
  title: string;
};

// TYPE FOR AN INDIVIDUAL QUIZ QUESTION
export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correct: string;
};

// TYPE FOR DISPLAYING A QUIZ CARD IN LIBRARY
export type QuizCardProps = {
  quiz: Quiz;
  selected: boolean;
  onSelect: (quiz: Quiz) => void;
  onDelete?: (quizId: number) => void;
};

// TYPE FOR THE QUIZ MODULE (DURING GAMEPLAY)
export type QuizModuleProps = {
  onSubmit: (option: string) => void;
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
};

// TYPE FOR QUIZ CONTEXT STATE
export type QuizContextType = {
  currentIndex: number;
  resetQuiz: () => void;
  selectedQuiz: Quiz | null;
  setCurrentIndex: (index: number) => void;
  setSelectedQuiz: (quiz: Quiz | null) => void;
  lockedIn: boolean;
  setLockedIn: Dispatch<SetStateAction<boolean>>;
};

// TYPE FOR QUIZ SESSION
export type QuizSession = {
  index: number;
  question: QuizQuestion;
  total: number;
  roundTimer: number;
};
