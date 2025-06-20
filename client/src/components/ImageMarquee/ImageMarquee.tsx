import React, { ReactNode } from 'react';
import Image from 'next/image';

export default function PhotoMarquee(): ReactNode {
  return (
    <>
      <div
        className={
          'mx-auto my-12 h-fit w-full overflow-hidden rounded-lg bg-gradient-to-b from-emerald-600 to-emerald-500 px-4 shadow-xl lg:max-w-[85vw]'
        }
      >
        <div className='flex max-w-6xl animate-marquee items-center whitespace-nowrap py-3'>
          {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4].map((item, index) => (
            <Image
              key={index}
              src={'/images/placeholder-image.png'}
              width={275}
              height={275}
              alt={'placeholder-image'}
              className='max-w-full rounded-xl px-2 shadow-xl lg:visible'
            />
          ))}
        </div>
      </div>
    </>
  );
}
