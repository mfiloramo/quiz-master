export interface PlayerAnswerAttributes {
  id: number;
  session_id: number;
  player_id: number;
  question_id: number;
  answer: number;
  is_correct: boolean;
  score: number;
}
