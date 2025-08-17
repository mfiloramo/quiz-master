import React, { ReactElement } from 'react';
import Image from 'next/image';

export default function Settings(): ReactElement {
  return (
    <div className={'flex flex-col items-center'}>
      <Image
        src={'/images/under-construction.jpg'}
        width={612}
        height={320}
        alt={'under-construction'}
      />
    </div>
  );
}
