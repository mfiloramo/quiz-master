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
      {studentsPageContent.sections.map((section: any, index: number) => (
        <StaticSection key={index} section={section} listNum={index} />
      ))}
    </div>
  );
}
