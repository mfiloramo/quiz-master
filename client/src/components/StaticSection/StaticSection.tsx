import React, { ReactElement } from 'react';
import { StaticSection } from '@/types/StaticSection.type';

export default function StaticSection({ section }: StaticSection): ReactElement {
  // COMPONENT VARIABLES
  const { subtitle, paragraphs, photo } = section;

  // RENDER COMPONENT
  return (
    // MAIN CONTAINER
    <div className='m-3 flex w-full flex-col items-center gap-3 p-3'>
      {/* SUBTITLE*/}
      <p className='text-lg font-bold text-black'>{subtitle}</p>

      {/* TEXT & IMAGE CONTAINER */}
      <div className='flex flex-row items-center justify-around gap-4'>
        {/* IMAGE */}
        {photo && <img src={photo.src} alt={photo.alt} className='max-w-full' />}
        {/* TEXT */}
        <div className='flex flex-col gap-2'>
          {paragraphs.map((paragraph: string, index: number): any => (
            <p key={index} className='text-md text-justify text-black'>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
