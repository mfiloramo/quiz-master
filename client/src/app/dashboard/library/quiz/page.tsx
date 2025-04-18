'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizQuestion } from '@/types/Quiz.types';
import QuizModule from '@/components/quiz-module/quiz-module';

export default function QuizPage(): ReactElement {
  // QUIZ CONTEXT
  const { selectedQuiz, currentIndex, setCurrentIndex, resetQuiz } = useQuiz();

  // ROUTER INSTANCE
  const router = useRouter();

  // COMPONENT STATE
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // REDIRECT IF QUIZ NOT SELECTED
  useEffect(() => {
    if (!selectedQuiz) {
      router.push('/dashboard/library');
    }
  }, [selectedQuiz, router]);

  // FETCH QUESTIONS FOR SELECTED QUIZ
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedQuiz) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3030/api/questions/quiz/${selectedQuiz.id}`);
        const data = await response.json();

        const formatted = data.map((q: any) => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        }));

        setQuestions(formatted);
        setQuizStarted(true);
      } catch (err) {
        setError('Failed to load quiz questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions().then((r) => r);
  }, [selectedQuiz]);

  // HANDLE ANSWER SUBMISSION
  const submitAnswer = async (selectedOption: string) => {
    await simulateLoad(750);
    const current = questions[currentIndex];
    if (!current) return;

    if (selectedOption === current.correct) {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert('Quiz completed!');
        resetQuiz();
        router.push('/dashboard/library');
      }
    } else {
      setError('Incorrect answer, try again.');
      setTimeout(() => setError(null), 2000);
    }
  };

  // SIMULATE LOAD / RATE LIMIT
  const simulateLoad = async (ms: number): Promise<void> => {
    setLoading(true);
    await new Promise((resolve: any) => setTimeout(resolve, ms));
    return setLoading(false);
  };

  // RENDER PAGE
  return (
    <div className={'flex flex-col items-center justify-center'}>
      {/* DISPLAY QUIZ TITLE */}
      {selectedQuiz && (
        <div className='mb-4 text-2xl font-bold text-white'>{selectedQuiz.title}</div>
      )}

      {/* DISPLAY LOADING STATE */}
      {loading && <p className='text-white'>Loading...</p>}

      {/* DISPLAY ERROR */}
      {error && <p className='mb-4 text-red-200'>{error}</p>}

      {/* DISPLAY QUESTION */}
      {quizStarted && questions[currentIndex] && (
        <QuizModule
          question={questions[currentIndex]}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onSubmit={submitAnswer}
        />
      )}
    </div>
  );
}
