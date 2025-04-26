'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import { QuestionListingType } from '@/types/QuestionListing.type';
import QuestionListing from '@/components/question-listing/question-listing';
import { useQuiz } from '@/contexts/QuizContext';
import EditModalQuestion from '@/components/edit-modal-question/edit-modal-question';

export default function EditQuiz(): ReactElement {
  // STATE: ALL QUESTIONS
  const [questions, setQuestions] = useState<QuestionListingType[]>([]);

  // STATE: WHICH QUESTION IS BEING EDITED
  const [editingQuestion, setEditingQuestion] = useState<QuestionListingType | null>(null);

  const { selectedQuiz } = useQuiz();

  // FETCH ALL QUESTIONS FOR QUIZ
  const fetchQuestions = async (): Promise<void> => {
    if (!selectedQuiz?.id) return;
    try {
      const response = await fetch(`http://localhost:3030/api/questions/quiz/${selectedQuiz.id}`);
      const data = await response.json();

      // CLEAN EACH QUESTION'S OPTIONS
      const cleanedData = data.map((question: any) => ({
        ...question,
        options:
          typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
      }));

      setQuestions(cleanedData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // LOAD ONCE QUIZ SELECTED
  useEffect(() => {
    fetchQuestions();
  }, [selectedQuiz]);

  return (
    <div className='flex flex-col'>
      {/* MODAL */}
      {editingQuestion && (
        <EditModalQuestion
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={(updatedQuestion) => {
            setQuestions((prev) =>
              prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
            );
            setEditingQuestion(null);
          }}
        />
      )}

      {/* LIST QUESTIONS */}
      {questions.map((question, index) => (
        <QuestionListing
          key={question.id}
          id={question.id}
          question={question.question}
          options={question.options}
          correct={question.correct}
          index={index}
          onEdit={() => setEditingQuestion(question)}
          onDelete={() => {
            setQuestions((prev) => prev.filter((q) => q.id !== question.id));
          }}
        />
      ))}
    </div>
  );
}
