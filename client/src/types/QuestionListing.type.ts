export type QuestionListingType = {
  id: number;
  question: string;
  options: string[];
  correct?: string;
  index?: number;
  onDelete?: () => void;
  onEdit?: () => void;
};

export type EditModalProps = {
  quizId: number;
  question: QuestionListingType;
  onClose: () => void;
  onSave: (updatedQuestion: QuestionListingType) => void;
  mode: string;
};
