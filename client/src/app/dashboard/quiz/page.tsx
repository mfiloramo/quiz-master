'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import QuizModule from '@/components/quiz-module/quiz-module';
import { QuizQuestion } from '@/types/Quiz.types';

export default function QuizPage(): ReactElement {
  // COMPONENT UTILITIES
  const { selectedQuiz, currentIndex, setCurrentIndex, resetQuiz } = useQuiz();
  const { socket } = useWebSocket();
  const router = useRouter();

  // COMPONENT STATE
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // EFFECT HOOKS
  useEffect(() => {
    if (!selectedQuiz) {
      router.push('/dashboard/library');
    }
  }, [selectedQuiz, router]);

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

    fetchQuestions();
  }, [selectedQuiz]);

  useEffect(() => {
    socket.on('answer-received', (data) => {
      // Handle real-time answer updates here
      console.log('Answer received:', data);
    });

    socket.on('session-ended', () => {
      alert('Session has ended.');
      resetQuiz();
      router.push('/dashboard/library');
    });

    return () => {
      socket.off('answer-received');
      socket.off('session-ended');
    };
  }, [socket, resetQuiz, router]);

  // HANDLER FUNCTIONS
  const submitAnswer = async (selectedOption: string) => {
    await simulateLoad(750);
    const current = questions[currentIndex];
    if (!current) return;

    const isCorrect = selectedOption === current.correct;

    socket.emit('submit-answer', {
      sessionId: 'your-session-id',
      playerId: socket.id,
      isCorrect,
    });

    if (isCorrect) {
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

  const simulateLoad = async (ms: number): Promise<void> => {
    setLoading(true);
    await new Promise((resolve: any) => setTimeout(resolve, ms));
    setLoading(false);
  };

  // RENDER PAGE
  return (
    <div className='flex flex-col items-center justify-center'>
      {selectedQuiz && (
        <div className='mb-4 text-2xl font-bold text-white'>{selectedQuiz.title}</div>
      )}

      {/* DISPLAY QUIZ MODULE */}
      {quizStarted && questions[currentIndex] && (
        <QuizModule
          question={questions[currentIndex]}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onSubmit={submitAnswer}
        />
      )}

      {/* DISPLAY LOADING STATE */}
      {loading && <p className='mt-4 text-white'>Loading...</p>}

      {/* DISPLAY ERROR */}
      {error && <p className='mt-4 text-red-200'>{error}</p>}
    </div>
  );
}
