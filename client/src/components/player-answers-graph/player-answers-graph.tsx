import React, { ReactElement } from 'react';

export default function PlayerAnswersGraph({ playerAnswers }: any): ReactElement {
  // RENDER COMPONENT
  return (
    <>
      <h2>Player Answers</h2>
      <ul>
        {playerAnswers.map((answer: string, index: number) => (
          <li key={index}>{answer}</li>
        ))}
      </ul>
    </>
  );
}
