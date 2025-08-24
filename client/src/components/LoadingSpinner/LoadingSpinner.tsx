import React, { ReactElement } from 'react';
import { ClipLoader } from 'react-spinners';

export default function LoadingSpinner({ loadingMessage }): ReactElement {
  return (
    <div className={'flex flex-col items-center'}>
      <div className='p-6 text-xl text-sky-100'>{loadingMessage}</div>
      <ClipLoader
        color={'oklch(95.1% 0.026 236.824)'}
        loading={true}
        size={50}
        aria-label='Loading Spinner'
        data-testid='loader'
        speedMultiplier={2}
      />
    </div>
  );
}
