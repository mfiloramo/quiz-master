import React, { ReactElement } from 'react';
import Image from 'next/image';

export default function StaticSection({ section, listNum }: any): ReactElement {
  // COMPONENT VARIABLES
  const { subtitle, paragraphs, photo } = section;

  // RENDER COMPONENT
  return (
    // MAIN CONTAINER
    <div
      className={`my-3 flex max-w-[90vw] flex-col items-center gap-4 rounded-lg bg-white bg-opacity-20 px-7 py-8 lg:max-w-[70vw]`}
    >
      {/* SUBTITLE*/}
      <p className={`pb-3 text-3xl font-bold`}>{subtitle}</p>

      {/* TEXT & IMAGE CONTAINER */}
      <div className='flex flex-col items-center justify-around gap-10 lg:flex-row'>
        {/* IMAGE (LEFT ALIGNMENT) */}
        {photo && listNum % 2 === 0 && (
          <Image
            src={photo.src}
            width={275}
            height={275}
            alt={photo.alt}
            className='max-w-full rounded-xl shadow-xl lg:visible'
          />
        )}

        {/* BODY PARAGRAPH TEXT */}
        <div className='flex flex-col gap-2'>
          {paragraphs.map((paragraph: string, index: number): any => (
            <p key={index} className='text-justify text-lg'>
              {paragraph}
            </p>
          ))}
        </div>

        {/* IMAGE (RIGHT ALIGNMENT) */}
        {photo && listNum % 2 !== 0 && (
          <Image
            src={photo.src}
            width={275}
            height={275}
            alt={photo.alt}
            className='max-w-full rounded-xl shadow-xl'
          />
        )}
      </div>
    </div>
  );
}
