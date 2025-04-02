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
