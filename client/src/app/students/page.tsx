import { ReactElement } from 'react';
import StaticSection from '@/components/StaticSection/StaticSection';
import studentsPageContent from '@/data/students-data.json';
import teachersPageContent from '@/data/teachers-data.json';
import { StaticSectionType } from '@/types/StaticSection.type';

export default function StudentsPage(): ReactElement {
  // RENDER PAGE
  return (
    // MAIN CONTAINER
    <div className={'flex flex-col items-center bg-stub-background-lobby bg-cover text-black'}>
      {/* PAGE TITLE HEADER */}
      <p className={'mx-auto px-5 py-14 text-center text-6xl font-bold sm:px-12 md:text-7xl'}>
        <span className={'text-yellow-300 drop-shadow-strong'}>Play Hard.</span>{' '}
        <span className={'text-lime-300 drop-shadow-strong'}>Learn Easy.</span>
      </p>

      <div className={'last:pb-8'}>
        {studentsPageContent.sections.map((section: StaticSectionType, index: number) => (
          <StaticSection key={index} section={section} listNum={index} />
        ))}
      </div>
    </div>
  );
}
