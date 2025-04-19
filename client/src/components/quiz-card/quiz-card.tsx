import { ReactElement } from 'react';
import { QuizCardProps } from '@/types/Quiz.types';

export default function MainQuizCard({ quiz, selected, onSelect }: QuizCardProps): ReactElement {
  return (
    // MAIN CARD CONTAINER
    <div
      onClick={() => onSelect(quiz)}
      className={`m-1 flex h-20 w-[90%] max-w-xl cursor-pointer flex-row rounded-md shadow-md transition ${selected ? 'bg-blue-500 text-white' : 'bg-cyan-100 hover:bg-cyan-300 active:bg-cyan-400'}`}
    >
      {/* TITLE PIC */}
      <div className='ml-1 mt-1 h-[90%] w-24 bg-cyan-300'></div>

      {/* QUIZ INFORMATION */}
      <div className='ml-2 flex flex-col items-start justify-center'>
        <div className='font-bold'>{quiz.title}</div>
        <div>{quiz.description}</div>
        <div className='flex flex-row items-start text-sm'>
          <div>{quiz.author} </div>
          <div className='ml-1'>{quiz.created_date}</div>
        </div>
      </div>
    </div>
  );
}
