'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import { QuestionListingType } from '@/types/QuestionListing.type';
import QuestionListing from '@/components/question-listing/question-listing';
import { useQuiz } from '@/contexts/QuizContext';

export default function EditQuiz(): ReactElement {
  // STATE HOOKS
  const [questions, setQuestions] = useState<QuestionListingType[]>([]);

  // QUIZ CONTEXT (CONTAINS SELECTED QUIZ)
  const { selectedQuiz } = useQuiz();

  // FETCH QUESTIONS FOR THE CURRENT QUIZ
  const fetchQuestions = async (): Promise<void> => {
    if (!selectedQuiz?.id) return;

    try {
      const response = await fetch(`http://localhost:3030/api/questions/quiz/${selectedQuiz.id}`);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // EFFECT: TRIGGER FETCH ONCE SELECTED QUIZ IS AVAILABLE
  useEffect(() => {
    fetchQuestions();
  }, [selectedQuiz]);

  // RENDER COMPONENT
  return (
    // MAIN CONTAINER
    <div className='flex flex-col'>
      {questions.map((question, index) => (
        <QuestionListing
          key={question.id}
          id={question.id}
          question={question.question}
          options={question.options}
          correct={question.correct}
          index={index}
          onDelete={() => {
            setQuestions((prev) => prev.filter((q) => q.id !== question.id));
          }}
        />
      ))}
    </div>
  );
}
