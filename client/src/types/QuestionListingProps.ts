import { QuizQuestion } from '@/types/Quiz.types';

export type QuestionListingProps = {
  id: number | string;
  question?: string;
  options?: string[];
  correct?: string;
  index?: number;
  onEditAction?: () => void;
  onDeleteAction?: (id: number | string) => void;
};

export type EditModalProps = {
  quizId?: number;
  question?: QuizQuestion;
  onCloseAction: () => void;
  onSaveAction: (updatedQuestion: QuizQuestion) => void;
  mode: string;
};
