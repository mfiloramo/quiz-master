import { ReactElement } from 'react';
import StaticSection from '@/components/StaticSection/StaticSection';
import studentsPageContent from '@/data/students/students-data.json';

export default function StudentsPage(): ReactElement {
  // RENDER PAGE
  return (
    // MAIN CONTAINER
    <div
      className={'flex h-full flex-col items-center bg-stub-background-lobby bg-cover text-black'}
    >
      {/* PAGE TITLE HEADER */}
      <p
        className={
          'mx-auto px-5 py-14 text-center text-6xl font-bold sm:px-12 md:text-7xl lg:px-24'
        }
      >
        <span className={'drop-shadow-strong text-yellow-300'}>Play Hard.</span>{' '}
        <span className={'drop-shadow-strong text-lime-300'}>Learn Easy.</span>
      </p>

      {/* PAGE SECTIONS*/}
      {studentsPageContent.sections.map((section: any, index: number) => (
        <StaticSection key={index} section={section} listNum={index} />
      ))}
    </div>
  );
}
