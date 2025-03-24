'use client';
import { ReactElement, useState } from "react";
import { QuizQuestion } from "@/interfaces/QuizQuestion";
import { motion } from 'framer-motion'


export default function QuizTest(): ReactElement {
  // COMPONENT STATE
  const [ quizQuestions, setQuizQuestions ] = useState<QuizQuestion[]>([]);
  const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState<number>(0);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<string | null>(null);
  const [ quizStarted, setQuizStarted ] = useState<boolean>(false);

  // SIMULATE LOAD (ALSO RATE LIMIT)
  const simulateLoad = (ms: number) => {
    setLoading(true);
    return new Promise((resolve) => setTimeout(resolve, ms)).then(() => setLoading(false));
  }

  // FETCH ALL QUIZ QUESTIONS ONCE
  const fetchQuizQuestion = async () => {
    setLoading(true);
    setError(null);
    setQuizStarted(false);

    try {

      // DELAY BEFORE STARTING THE FETCH
      await simulateLoad(1000);

      const response: Response = await fetch(`http://localhost:3030/api/questions/1/1`);
      const data: QuizQuestion[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      // FORMAT QUESTION DATA
      const formattedQuestions = data.map((q: any) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      }));

      // UPDATE STATE WITH QUIZ DATA
      setQuizQuestions(formattedQuestions);
      setCurrentQuestionIndex(0);
      setQuizStarted(true);

    } catch (err: any) {
      setError(err.message);
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
      await simulateLoad(1000);

      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex((prev: number) => prev + 1);
      } else {
        console.log('Quiz finished!');
        setQuizStarted(false);
      }
    } else {
      console.log('Incorrect option. Please try again.');
    }

  }

  const currentQuestion: QuizQuestion = quizQuestions[currentQuestionIndex];

  // RENDER COMPONENT
  return (
    // MAIN CONTAINER
    <div
      className='min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-black bg-gradient-to-b from-blue-300 to-blue-800 p-6 caret-transparent'>

      {/* START / RESTART BUTTON */}
      <button
        onClick={ fetchQuizQuestion }
        disabled={ loading }
        className='px-6 py-3 mb-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-600 transition disabled:opacity-50'
      >
        { loading ? 'Loading...' : 'Start Quiz' }
      </button>

      {/* DISPLAY ERROR MESSAGE */ }
      { error && <p className='text-red-500'>{ error }</p> }

      {/* TODO: MAKE THIS INTO A COMPONENT */ }
      {/* DISPLAY QUESTION AND OPTIONS */ }
      { quizStarted && currentQuestion && (
        <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-xl'>
          <h2 className='text-xl font-bold mb-4'>
            Question { currentQuestionIndex + 1 } of { quizQuestions.length }
          </h2>
          <p className={ 'mb-6 text=lg' }>{ currentQuestion.question }</p>
          <motion.ul
            className='space-y-3'>
            { currentQuestion.options.map((option, index) => (
              <motion.li
                key={ index }
                whileHover={ { scale: 1.03 } }
                whileTap={ { scale: 0.99 } }
                transition={ { duration: 0.001 } }
                onClick={ () => submitQuestion(option) }
                className='p-3 bg-gray-200 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition cursor-pointer'
              >
                { option }
              </motion.li>
            )) }
          </motion.ul>
        </div>
      ) }
    </div>
  );
}
