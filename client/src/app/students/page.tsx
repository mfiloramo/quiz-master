import { ReactElement } from 'react';
import studentsPageContent from '@/data/students/students-data.json';
import StaticSection from '@/components/StaticSection/StaticSection';

export default function StudentsPage(): ReactElement {
  // RENDER PAGE
  return (
    // MAIN CONTAINER
    <div className={'m-3 flex flex-col items-center gap-2 p-2'}>
      {studentsPageContent.sections.map((section: any, index: number) => (
        <StaticSection key={index} section={section} />
      ))}
    </div>
  );
}
