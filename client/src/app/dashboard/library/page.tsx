'use client';

import { ReactElement, useEffect, useState } from 'react';
import { Quiz } from '@/types/Quiz.types';

export default function LibraryPage(): ReactElement {
  // COMPONENT STATE
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizTitle, setQuizTitle] = useState<string>('');

  // SET / UNSET QUIZ METADATA
  const setQuiz = (quiz: Quiz): any => {
    if (!selectedQuiz || selectedQuiz !== quiz.id) {
      setSelectedQuiz(quiz.id);
      setQuizTitle(quiz.title);
    } else {
      setSelectedQuiz(null);
      setQuizTitle('');
    }
  };

  // FETCH USER'S QUIZZES
  useEffect(() => {
    const fetchQuizzes: any = async () => {
      const response: Response = await fetch('http://localhost:3030/api/quizzes');
      const json = await response.json();
      setQuizzes(json);
    };

    fetchQuizzes();
  }, []);

  // RENDER PAGE
  return (
    // MAIN CONTAINER
    <div className={'text-center'}>
      {/* QUIZ SELECTION BUTTONS */}
      {quizzes && (
        <>
          {quizzes.map((quiz: Quiz, index: number) => (
            <button
              key={index}
              className={
                'm-4 h-24 w-48 cursor-pointer rounded-lg bg-amber-300 px-4 shadow-xl transition hover:bg-amber-200 active:bg-amber-400'
              }
              onClick={(): void => setQuiz(quiz)}
            >
              {quiz.title}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
