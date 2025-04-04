'use client';
import { ReactElement, useEffect, useState } from "react";
import { Quiz, QuizQuestion } from "@/types/Quiz.types";
import QuizModule from "@/components/quiz-module/quiz-module";


export default function QuizTest(): ReactElement {
  // COMPONENT STATE
  const [ quizQuestions, setQuizQuestions ] = useState<QuizQuestion[]>([]);
  const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState<number>(0);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<string | null>(null);
  const [ quizStarted, setQuizStarted ] = useState<boolean>(false);
  const [ selectedQuiz, setSelectedQuiz ] = useState<number | null>(null);
  const [ quizzes, setQuizzes ] = useState([]);
  const [ quizTitle, setQuizTitle ] = useState<string>('');

  // SET CURRENT QUIZ QUESTION
  const currentQuestion: QuizQuestion = quizQuestions[currentQuestionIndex];

  // FETCH QUIZ DATA
  useEffect(() => {
    const fetchQuizzes: any = async () => {
      const response: Response = await fetch(`http://localhost:3030/api/quizzes`);
      const json = await response.json();
      setQuizzes(json);
    }
    fetchQuizzes();
  }, []);

  // SIMULATE LOAD / RATE LIMIT
  const simulateLoad = async (ms: number): Promise<void> => {
    setLoading(true);
    await new Promise((resolve: any) => setTimeout(resolve, ms));
    return setLoading(false);
  }

  // FETCH ALL QUIZ QUESTIONS ONCE
  const fetchQuizQuestions = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setQuizStarted(false);

    try {
      // DELAY BEFORE STARTING THE FETCH
      await simulateLoad(750);

      const response: Response = await fetch(`http://localhost:3030/api/questions/${ selectedQuiz }/1`);
      const data: QuizQuestion[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      // FORMAT QUESTION DATA
      const formattedQuestions = data.map((question: any) => ({
        ...question,
        options: typeof question.options === 'string'
          ? JSON.parse(question.options)
          : question.options,
      }));

      // UPDATE STATE WITH QUIZ DATA
      setQuizQuestions(formattedQuestions);
      setCurrentQuestionIndex(0);
      setQuizStarted(true);

    } catch (error: unknown) {
      displayError('There was an issue with your request. Please try again.', 5000);
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  // SUBMIT ANSWER
  const submitQuestion = async (selectedOption: string): Promise<any> => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (!currentQuestion) return;

    if (selectedOption === currentQuestion.correct) {
      console.log('The answer is correct!');
      await simulateLoad(750);

      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex((prev: number) => prev + 1);
      } else {
        console.log('Quiz finished!');
        setQuizStarted(false);
      }
    } else {
      console.log('Incorrect option. Please try again.');
      displayError('Incorrect option. Please try again.', 2000);
    }
  }

  // SET / UNSET QUIZ METADATA
  const setQuiz = (quiz: Quiz): any => {
    if (!selectedQuiz || selectedQuiz !== quiz.id) {
      setSelectedQuiz(quiz.id);
      setQuizTitle(quiz.title);
    } else {
      setSelectedQuiz(null);
      setQuizTitle('');
    }
  }

  // TEMPORARILY DISPLAY ERROR MESSAGE
  const displayError = (message: string, duration: number): any => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, duration);
  };

  // RENDER COMPONENT
  return (
    // MAIN CONTAINER
    <div
      className='min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-black bg-gradient-to-b from-blue-300 to-blue-800 p-6 caret-transparent'>

      {/* SELECTED QUIZ INDICATOR */ }
      { quizTitle && (
        <div className={ 'w-fit p-2 h-fit text-2xl font-bold' }>
          { quizTitle }
        </div>
      ) }

      {/* QUIZ SELECTION BUTTONS */ }
      { quizzes && (
        <div>
          { quizzes.map((quiz: Quiz, index: number) => (
            <button
              key={ index }
              className={ 'h-12 m-4 px-4 w-fit bg-amber-300 hover:bg-amber-200 active:bg-amber-400 rounded-lg shadow-xl transition cursor-pointer' }
              onClick={ () => setQuiz(quiz) }
            >
              { quiz.title }
            </button>
          )) }
        </div>
      ) }

      {/* START / RESTART BUTTON */ }
      <button
        onClick={ fetchQuizQuestions }
        disabled={ loading }
        className='px-6 py-3 mb-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-600 transition disabled:opacity-50'
      >
        { loading ? 'Loading...' : 'Start Quiz' }
      </button>

      {/* DISPLAY ERROR MESSAGE */ }
      { error && (
        <p className='text-red-300 text-center font-bold'>{ error }</p>
      )}

      {/* DISPLAY QUESTION AND OPTIONS */ }
      { quizStarted && currentQuestion && (
        <QuizModule
          question={ currentQuestion }
          questionNumber={ currentQuestionIndex + 1 }
          totalQuestions={ quizQuestions.length }
          onSubmit={ submitQuestion }
        />
      ) }
    </div>
  );
}
