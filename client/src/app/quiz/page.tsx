'use client';
import { ReactElement, useState } from "react";
import { QuizQuestion } from "@/interfaces/QuizQuestion";
import { motion } from 'framer-motion'
import QuizModule from "@/components/quiz-module/quiz-module";


export default function QuizTest(): ReactElement {
  // COMPONENT STATE
  const [ quizNumber, setQuizNumber ] = useState<any>(1);
  const [ questionData, setQuestionData ] = useState<QuizQuestion | null>(null);
  const [ questionNumber, setQuestionNumber ] = useState<number>(0);
  const [ answer, setAnswer ] = useState<any>(null)
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<string | null>(null);

  const simulateLoad = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // FETCH QUIZ QUESTION
  const fetchQuizQuestion = async () => {
    setLoading(true);
    setError(null);

    // DELAY 1 SECOND BEFORE STARTING THE FETCH
    await simulateLoad(1000);

    try {
      const response: Response = await fetch(`http://localhost:3030/api/questions/${ quizNumber }/${ questionNumber }`);
      const data = await response.json();

      const formattedData = {
        ...data[questionNumber],
        options: JSON.parse(data[questionNumber].options)
      };

      setQuestionData(formattedData);
      setQuestionNumber(questionNumber + 1);
      setAnswer(formattedData.correct);

      if (questionNumber > 0) setQuestionNumber(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // SUBMIT QUESTION
  const submitQuestion = async (selectedOption: string): Promise<any> => {
    if (selectedOption === answer) {
      console.log(questionData);
      console.log('The answer is correct!');
      await fetchQuizQuestion();
    } else {
      console.log(selectedOption, answer);
      console.log('Incorrect option. Please try again.');
    }
  }

  // RENDER COMPONENT
  return (
    <div
      className='min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-black bg-gradient-to-b from-blue-300 to-blue-800 p-6 caret-transparent'>

      {/* FETCH QUESTIONS BUTTON */}
      <button
        onClick={ fetchQuizQuestion }
        className='px-6 py-3 mb-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-600 transition disabled:opacity-50'
        disabled={ loading }
      >
        { loading ? 'Loading...' : 'Start Quiz' }
      </button>

      {/* DISPLAY ERROR MESSAGE */ }
      { error && <p className='text-red-500'>{ error }</p> }

      {/* TODO: MAKE THIS INTO A COMPONENT */}
      {/* DISPLAY QUESTION AND OPTIONS */ }
      { questionData && (
        <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-xl'>
          <h2 className='text-xl font-bold mb-4'>{ questionData.question }</h2>
          <motion.ul
            className='space-y-3'>
            { questionData.options.map((option, index) => (
              <motion.li
                key={ index }
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.001 }}
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
