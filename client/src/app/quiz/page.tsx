'use client';
import { ReactElement, useState } from "react";
import { QuizQuestion } from "@/interfaces/QuizQuestion";


export default function QuizTest(): ReactElement {
  // COMPONENT STATE
  const [ questionData, setQuestionData ] = useState<QuizQuestion | null>(null);
  const [ answer, setAnswer ] = useState<any>(null)
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<string | null>(null);
  const [ questionNumber, setQuestionNumber ] = useState(1);

  // FETCH QUIZ QUESTION
  const fetchQuizQuestion = async () => {
    setLoading(true);
    setError(null);

    try {
      const response: Response = await fetch(`http://localhost:3030/api/questions/${ questionNumber }`);
      const data = await response.json();

      // ENSURE OPTIONS ARE PROPERLY FORMATTED
      const formattedData: QuizQuestion = {
        question: data.question,
        options: Array.isArray(data.options) ? data.options : JSON.parse(data.options),
      };

      setQuestionData(formattedData);
      setQuestionNumber(questionNumber + 1);

      if (questionNumber > 5) setQuestionNumber(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SUBMIT QUESTION
  const submitQuestion = async (question: any): Promise<any> => {
    console.log(question);
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
        { loading ? 'Loading...' : 'Get Quiz Question' }
      </button>

      {/* DISPLAY ERROR MESSAGE */ }
      { error && <p className='text-red-500'>{ error }</p> }

      {/* DISPLAY QUESTION AND OPTIONS */ }
      { questionData && (
        <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-xl'>
          <h2 className='text-xl font-bold mb-4'>{ questionData.question }</h2>
          <ul className='space-y-3'>
            { questionData.options.map((option, index) => (
              <li key={ index } onClick={ submitQuestion } className='p-3 bg-gray-200 rounded-lg hover:bg-gray-300 active:bg-gray-400 cursor-pointer'>
                { option }
              </li>
            )) }
          </ul>
        </div>
      ) }
    </div>
  );
}
