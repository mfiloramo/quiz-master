export type QuizQuestion = {
  question: string;
  options: string[];
  correct: string;
};

export type Quiz = {
  id: number;
  title: string;
  questions: QuizQuestion[];
};
