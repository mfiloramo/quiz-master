export type Quiz = {
  id: number;
  title: string;
  questions: QuizQuestion[];
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correct: string;
};

export type QuizModuleProps = {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (option: string) => void;
};

export type QuizContextType = {
  selectedQuiz: Quiz | null;
  setSelectedQuiz: (quiz: any | null) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  resetQuiz: () => void;
};
