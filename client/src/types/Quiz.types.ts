// TYPES FOR QUIZ STRUCTURE
export type Quiz = {
  id: number;
  title: string;
  description: string;
  author: string;
  created_date: string;
  questions: QuizQuestion[];
};

// TYPES FOR INDIVIDUAL QUESTIONS
export type QuizQuestion = {
  question: string;
  options: string[];
  correct: string;
};

// TYPES FOR QUIZ CARDS IN USER LIBRARY
export type QuizCardProps = {
  quiz: Quiz;
  selected: boolean;
  onSelect: (quiz: Quiz) => void;
};

// TYPES FOR QUIZ MODULE PROPS (USED IN GAME)
export type QuizModuleProps = {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (option: string) => void;
};

// TYPES FOR GLOBAL QUIZ CONTEXT
export type QuizContextType = {
  selectedQuiz: Quiz | null;
  setSelectedQuiz: (quiz: Quiz | null) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  resetQuiz: () => void;
};
