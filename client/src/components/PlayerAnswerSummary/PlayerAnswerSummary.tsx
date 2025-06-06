import React, { ReactElement } from 'react';

type PlayerAnswerSummary = {
  userAnswer: string;
  correctAnswer: string;
};

export default function PlayerAnswerSummary({
  userAnswer,
  correctAnswer,
}: PlayerAnswerSummary): ReactElement {
  // COMPONENT VARIABLES
  const correct = userAnswer === correctAnswer;

  // RENDER COMPONENT
  return (
    <>
      <p>Your answer:</p>
      <div
        className={`mb-4 mt-2 inline-block rounded-full px-4 py-2 font-bold text-white ${
          correct ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {userAnswer}
      </div>
      {correct ? (
        <p className='text-green-700'>CORRECT!</p>
      ) : (
        <p className='text-red-700'>
          Incorrect -- the correct answer is: <span className='font-bold'>{correctAnswer}</span>.
        </p>
      )}
    </>
  );
}
