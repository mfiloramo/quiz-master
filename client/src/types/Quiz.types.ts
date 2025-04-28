// TYPES FOR A SINGLE QUIZ
export type Quiz = {
  id: number;
  quizId: number;
  author: string;
  created_date: string;
  description: string;
  questions: QuizQuestion[];
  title: string;
};

// TYPES FOR AN INDIVIDUAL QUIZ QUESTION
export type QuizQuestion = {
  question: string;
  description: string;
  options: string[];
  correct: string;
};

// TYPES FOR DISPLAYING A QUIZ CARD IN LIBRARY
export type QuizCardProps = {
  onSelect: (quiz: Quiz) => void;
  quiz: Quiz;
  selected: boolean;
};

// TYPES FOR THE QUIZ MODULE (DURING GAMEPLAY)
export type QuizModuleProps = {
  onSubmit: (option: string) => void;
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
};

// TYPES FOR QUIZ CONTEXT STATE
export type QuizContextType = {
  currentIndex: number;
  resetQuiz: () => void;
  selectedQuiz: Quiz | null;
  setCurrentIndex: (index: number) => void;
  setSelectedQuiz: (quiz: Quiz | null) => void;
};
