import { ReactElement } from 'react';
import { Quiz } from '@/types/Quiz.types';

type Props = {
  quiz: Quiz;
  selected: boolean;
  onSelect: (quiz: Quiz) => void;
};

export default function MainQuizCard({ quiz, selected, onSelect }: Props): ReactElement {
  return (
    <div
      onClick={() => onSelect(quiz)}
      className={`m-2 flex h-20 w-[90%] max-w-xl cursor-pointer flex-row rounded-md p-3 text-black shadow-md transition ${selected ? 'bg-blue-300' : 'bg-cyan-100 hover:bg-cyan-300 active:bg-cyan-400'}`}
    >
      <div className='flex flex-col items-start justify-center'>
        <div className='font-bold'>{quiz.title}</div>
        <div className='text-sm text-slate-800'>{quiz.description}</div>
        <div className='text-xs text-slate-700'>{quiz.author}</div>
      </div>
    </div>
  );
}
