import { ReactElement } from 'react';
import StaticSection from '@/components/StaticSection/StaticSection';
import teachersPageContent from '@/data/teachers/teachers-data.json';
import { StaticSectionType } from '@/types/StaticSection.type';

export default function TeachersPage(): ReactElement {
  // RENDER PAGE
  return (
    // MAIN CONTAINER
    <div className={'flex flex-col items-center bg-stub-background-dashboard bg-cover text-black'}>
      {/* PAGE TITLE HEADER */}
      <p
        className={
          'mx-auto px-5 py-14 text-center text-6xl font-bold sm:px-12 md:text-7xl lg:px-24'
        }
      >
        <span className={'drop-shadow-strong text-orange-300'}>Fuel Their Curiosity.</span>
        <br />
        <span className={'drop-shadow-strong text-cyan-300'}>Track Their Growth.</span>
      </p>

      {/* PAGE SECTIONS*/}
      {teachersPageContent.sections.map((section: StaticSectionType, index: number) => (
        <StaticSection key={index} section={section} listNum={index} />
      ))}
    </div>
  );
}
