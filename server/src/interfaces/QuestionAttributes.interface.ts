export interface QuestionAttributes {
  id: number;
  quiz_id: number;
  question: string;
  options: string; // JSON-like format
  correct: number;
}
