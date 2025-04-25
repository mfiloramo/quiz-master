'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import { QuestionListingType } from '@/types/QuestionListing.type';
import QuestionListing from '@/components/question-listing/question-listing';
import { useQuiz } from '@/contexts/QuizContext';

export default function EditQuiz(): ReactElement {
  // STATE TO STORE QUESTIONS FOR THE SELECTED QUIZ
  const [questions, setQuestions] = useState<QuestionListingType[]>([]);
  const { selectedQuiz } = useQuiz();

  // FETCH QUESTIONS ON PAGE LOAD
  useEffect(() => {
    if (!selectedQuiz) return;

    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:3030/api/questions/quiz/${selectedQuiz.id}`);
        const data = await response.json();
        console.log(data);
        setQuestions(data);
      } catch (error: any) {
        console.error('Failed to fetch quiz questions:', error);
      }
    };

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
        />
      ))}
    </div>
  );
}
