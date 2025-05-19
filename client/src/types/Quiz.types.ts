// TYPE FOR A SINGLE QUIZ
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
  question: string;
  description: string;
  options: string[];
  correct: string;
};

// TYPE FOR DISPLAYING A QUIZ CARD IN LIBRARY
export type QuizCardProps = {
  quiz: Quiz;
  selected: boolean;
  onSelect: (quiz: Quiz) => void;
  onDelete: (quizId: number) => void;
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
};
